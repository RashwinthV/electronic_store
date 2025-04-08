const addToCartModel = require("../../models/cartProduct");

exports.countAddToCartProduct = async (req, res) => {
  try {
    const userId = req.userId;

    const count = await addToCartModel.countDocuments({
      userId: userId,
      placed: false
    });

    res.json({
      data: { count: count },
      message: "ok",
      error: false,
      success: true
    });
  } catch (error) {
    res.json({
      message: error.message || error,
      error: false,
      success: false
    });
  }
};