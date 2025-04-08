const addToCartModel = require("../../models/cartProduct");
const productModel = require("../../models/productModel");

exports.addToCartController = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        success: false,
        error: true,
      });
    }

    let cart = await addToCartModel.findOne({ userId, placed: false });

    if (!cart) {
      cart = new addToCartModel({
        userId,
        items: [],
        Totalquantity: 0,
      });
    }

    const existingProduct = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingProduct) {
      return res.json({
        message: "Product already in cart",
        success: false,
        error: true,
      });
    }
    const product = await productModel.findById(productId, "stock");
    if (product.stock > 0) {
      cart.items.push({ productId, quantity: 1 });

      cart.Totalquantity = cart.items.reduce(
        (total, item) => total + item.quantity,
        0
      );

      await cart.save();

      return res.json({
        message: "Product added to cart",
        success: true,
        error: false,
        data: cart,
      });
    } else {
      return res.json({
        message: "Product out of stock",
        success: false,
        error: true,
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err?.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

