const addToCartModel = require("../../models/cartProduct")

exports.addToCartViewProduct = async (req, res) => {
  try {
    const currentUser = req.query.userId;

    const allCartItems = await addToCartModel
      .find({ userId: currentUser, placed: false })
      .populate("items.productId") 
      .sort({ createdAt: -1 });
    res.json({
      data: allCartItems,
      success: true,
      error: false,
    });

  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};


exports.Buyagain = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const allProduct = await addToCartModel
        .find({ userId, placed: true })
        .populate("items.productId"); 
  
      res.json({
        data: allProduct,
        success: true,
        error: false,
      });
    } catch (err) {
      res.json({
        message: err.message || err,
        error: true,
        success: false,
      });
    }
  };
  
