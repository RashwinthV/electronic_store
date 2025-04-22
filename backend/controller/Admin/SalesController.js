const Order = require("../../models/orders");
const Product = require("../../models/productModel");

exports.SalesData = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $match: {
          orderDate: { $ne: null },
          orderStatus: "Delivered", // ✅ only include delivered orders
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
            month: { $dateToString: { format: "%Y-%m", date: "$orderDate" } },
            year: { $dateToString: { format: "%Y", date: "$orderDate" } },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { "_id.date": 1 },
      },
    ]);

    const formattedSales = sales.map((item) => ({
      date: item._id.date,
      month: item._id.month,
      year: item._id.year,
      sales: item.totalSales,
    }));

    res.json(formattedSales);
  } catch (err) {
    console.error("Error fetching sales data:", err);
    res.status(500).json({ message: "Server error while fetching sales data" });
  }
};

exports.getTopSellingProduct = async (req, res) => {
  try {
    const topProduct = await Order.aggregate([
      { $unwind: "$cartItems" },
      {
        $group: {
          _id: "$cartItems.productId",
          salesCount: { $sum: "$cartItems.quantity" },
        },
      },
      { $sort: { salesCount: -1 } },
      { $limit: 1 },
    ]);

    if (!topProduct.length) {
      return res.json({ message: "No product sales yet." });
    }

    const topProductId = topProduct[0]._id;
    const salesCount = topProduct[0].salesCount;

    const product = await Product.findById(topProductId).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      productName: product.productName,
      brandName: product.brandName,
      image: product.productImage?.[0] || null,
      price: product.sellingPrice || product.price,
      salesCount,
    });
  } catch (err) {
    console.error("Error getting top-selling product:", err);
    res.status(500).json({ message: "Server error" });
  }
};
