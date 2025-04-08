const Order = require("../../models/orders");

exports.getorders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id }).populate(
      "cartItems.productId"
    );
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};


exports.getorderDetails = async (req, res) => {
 try {
     const order = await Order.findById(req.params.id).populate(
       "cartItems.productId"
     );
     if (!order) return res.status(404).json({ msg: "Order not found" });
     res.json(order);
 } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
 }
};
