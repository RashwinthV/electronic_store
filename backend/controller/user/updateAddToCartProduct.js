const addToCartModel = require("../../models/cartProduct");
const productModel = require('../../models/productModel');

const updateAddToCartProduct = async (req, res) => {
  try {
    const currentUserId = req.userId || req.body.userId;
    const addToCartProductId = req?.body?._id;
    const qty = req.body.quantity;
    const productIdToUpdate = req.body.productId;

    if (!currentUserId) {
      return res.json({
        message: "User ID not found",
        error: true,
        success: false
      });
    }

    const cart = await addToCartModel.findOne({ _id: addToCartProductId, userId: currentUserId });
    if (!cart) {
      console.log("Cart not found for this user.");
      return res.json({
        message: "Cart not found for this user",
        error: true,
        success: false
      });
    }

    const product = await productModel.findById(productIdToUpdate, "stock");
    if (!product) {
      return res.json({
        message: "Product not found",
        error: true,
        success: false
      });
    }

    if (qty > product.stock) {
      return res.json({
        message: `Only ${product.stock} items are available.`,
        error: true,
        success: false
      });
    }

    const productExistsInCart = cart.items.some(item => item.productId.toString() === productIdToUpdate);
    if (!productExistsInCart) {
      return res.json({
        message: "Product not found in the cart",
        error: true,
        success: false
      });
    }

    const updateProduct = await addToCartModel.findOneAndUpdate(
      { _id: addToCartProductId, userId: currentUserId },
      { $set: { "items.$[elem].quantity": qty } },
      { new: true, arrayFilters: [{ "elem.productId": productIdToUpdate }] }
    );

    if (updateProduct) {
      const totalQuantity = updateProduct.items.reduce((total, item) => total + item.quantity, 0);

      const updatedCart = await addToCartModel.findOneAndUpdate(
        { _id: updateProduct._id },
        { $set: { Totalquantity: totalQuantity } },
        { new: true }
      ).sort({ createdAt: -1 });

      res.json({
        message: "Product Updated",
        data: updatedCart,
        error: false,
        success: true
      });
    } else {
      res.json({
        message: "Product not found or update failed",
        error: true,
        success: false
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      message: err?.message || err,
      error: true,
      success: false
    });
  }
};

module.exports = updateAddToCartProduct;
