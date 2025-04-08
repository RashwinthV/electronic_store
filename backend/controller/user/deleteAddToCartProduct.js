const addToCartModel = require("../../models/cartProduct");

const deleteAddToCartProduct = async (req, res) => {
  try {
    const addToCartProductId = req.body._id;

    const cart = await addToCartModel.findOne({ "items._id": addToCartProductId });
    
    if (!cart) {
      return res.json({
        message: "Product not found",
        error: true,
        success: false
      });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== addToCartProductId.toString());

    const totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);
    
    cart.Totalquantity = totalQuantity;
    await cart.save();

    res.json({
      message: "Product Deleted From Cart",
      error: false,
      success: true,
      data: cart
    });
  } catch (err) {
    console.log(err);
    
    res.json({
      message: err?.message || err,
      error: true,
      success: false 
    });
  }
};

module.exports = deleteAddToCartProduct;
