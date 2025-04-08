const Order = require("../../models/orders");
const userModel = require("../../models/userModel");
const { sendOrderEmail } = require("../Email/orderEmail");


exports.getallorders=async (req, res) => {
    try {
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate("userId", "name email")
        .populate("cartItems.productId", "productName productImage").sort({createdAt:-1})
  
      const formatted = orders.map((order) => ({
        _id: order._id,
        createdAt: order.createdAt,
        totalPrice: order.totalPrice,
        totalQty: order.totalQty,
        orderStatus: order.orderStatus,
        user: order.userId, 
        items: order.cartItems.map((item) => ({
          productName: item.productId?.productName || "Unknown",
          quantity: item.quantity,
          price: item.price,
          productimage:item.productId?.productImage
        })),
      }));
  
      res.json({ orders: formatted });
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  }

  exports.updateOrderstatus = async (req, res) => {
    try {
      const { status } = req.body;
  
      const allowedStatuses = ["Ordered", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid order status" });
      }
  
      const updateData = { orderStatus: status };
  
      if (status === "Delivered") {
        updateData.paymentStatus = "paid";
      }
  
      const updated = await Order.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      // ✅ Get user email
      const user = await userModel.findById(updated.userId);
      if (user && (status === "Delivered" || status === "Cancelled")) {
        const type = status.toLowerCase(); // "delivered" or "cancelled"
        await sendOrderEmail(user.email, updated, type);
      }
  
      res.json({ message: "Order status updated", order: updated });
    } catch (err) {
      console.error("Update status error:", err);
      res.status(500).json({ message: "Failed to update status" });
    }
  };
  
  