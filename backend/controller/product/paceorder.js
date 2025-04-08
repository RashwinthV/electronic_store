const mongoose = require('mongoose');
const Cart = require("../../models/cartProduct.js"); 
const User = require("../../models/userModel.js");
const Order = require("../../models/orders.js");
const Product = require("../../models/productModel.js");
const { sendOrderEmail } = require('../Email/orderEmail.js');

exports.placeOrder = async (req, res) => {
  try {
    const { userId, cartItems, totalPrice, totalQty, paymentMethod, shippingAddress, orderdate } = req.body;
    if (!userId || !cartItems || cartItems.length === 0 || !totalPrice || !totalQty || !paymentMethod || !shippingAddress) {
      return res.status(400).json({ message: "No products in cart to place orders" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newOrder = new Order({
      userId,
      cartItems,
      totalPrice,
      totalQty,
      paymentMethod,
      shippingAddress,
      paymentStatus: paymentMethod === "cod" ? "pending" : "failed",
      orderStatus: "Ordered",
      orderDate: orderdate,
    });

    await newOrder.save();

    // ✅ Send Order Placed Email
    await sendOrderEmail(user.email, newOrder, "placed");

    const productIds = cartItems.map(item => new mongoose.Types.ObjectId(item.productId));

    const cartItemsExist = await Cart.find({ userId: userId, "items.productId": { $in: productIds } });

    if (cartItemsExist.length === 0) {
      return res.status(400).json({ message: "No matching cart items found for the user." });
    }

    const updateCart = await Cart.updateMany(
      { userId: userId, "items.productId": { $in: productIds } },
      { $set: { "placed": true } }
    );

    if (updateCart.modifiedCount > 0) {
      for (const item of cartItems) {
        const product = await Product.findById(item.productId);

        if (product) {
          if (product.stock >= item.quantity) {
            product.stock -= item.quantity;
            await product.save();
          } else {
            return res.status(400).json({ message: `Insufficient stock for ${product.productName}.` });
          }
        } else {
          return res.status(400).json({ message: `Product not found for productId: ${item.productId}` });
        }
      }

      res.status(201).json({
        message: "Order placed successfully!",
        order: newOrder,
      });
    } else {
      res.status(500).json({ message: "Failed to update cart items." });
    }
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
