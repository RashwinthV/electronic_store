const Order = require("../../models/orders");
const productModel = require("../../models/productModel");
const userModel = require("../../models/userModel");

exports.Dashboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const [totalProducts, totalOrders, totalUsers] = await Promise.all([
      productModel.countDocuments(),
      Order.countDocuments(),
      userModel.countDocuments()
    ]);

    const orders = await Order.find({ paymentStatus: "paid" });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    const totalLowStock = await productModel.countDocuments({ stock: { $lte: 5 } });

    const lowStockProducts = await productModel
      .find({ stock: { $lte: 5 } })
      .select("productName stock")
      .skip(skip)
      .limit(limit)
      .lean();

    const revenueByCategory = {};

    for (const order of orders) {
      for (const item of order.cartItems) {
        const product = await productModel.findById(item.productId).select("category").lean();
        const category = product?.category || "Unknown";
        revenueByCategory[category] =
          (revenueByCategory[category] || 0) + item.price * item.quantity;
      }
    }

    const revenueChartData = Object.entries(revenueByCategory).map(([category, value]) => ({
      name: category,
      value
    }));

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      inventoryAlerts: lowStockProducts,
      totalInventoryAlerts: totalLowStock, 
      revenueChartData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};
