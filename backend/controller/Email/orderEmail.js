const nodemailer = require("nodemailer");
const Product = require("../../models/productModel");

// ✅ Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * 📨 Send Order Email
 * @param {string} toEmail - Customer's email
 * @param {object} order - Order details
 * @param {"placed" | "delivered" | "cancelled"} type - Email type
 */
const sendOrderEmail = async (toEmail, order, type = "placed") => {
  const subjectMap = {
    placed: "🛒 Order Placed Successfully!",
    delivered: "📦 Your Order Has Been Delivered!",
    cancelled: "❌ Order Cancelled",
  };

  const subject = subjectMap[type];
  const emailHTML = await generateOrderEmailHTML(order, type); 

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject,
    html: emailHTML,
  });
};


const generateOrderEmailHTML = async (order, type) => {
  const messageMap = {
    placed: {
      title: "🎉 Order Placed Successfully!",
      intro: "Thanks for shopping with us! Your order has been placed successfully.",
    },
    delivered: {
      title: "✅ Order Delivered!",
      intro: "Your order has been delivered. We hope you enjoy your purchase!",
    },
    cancelled: {
      title: "❌ Order Cancelled",
      intro: "Your order has been cancelled. If this was unexpected, please contact support.",
    },
  };

  const { title, intro } = messageMap[type];

  let html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #333;">${title}</h2>
      <p style="color: #555;">${intro}</p>
      <hr style="margin: 20px 0;" />
      <h3 style="margin-bottom: 10px;">🧾 Order Summary</h3>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Status:</strong> ${order.orderStatus}</p>
      <p><strong>Total:</strong> ₹${order.totalPrice}</p>
      <p><strong>Items:</strong></p>
      <ul style="padding-left: 20px;">
  `;

  const itemHtmls = await Promise.all(
    order.cartItems.map(async (item) => {
      try {
        const product = await Product.findById(item.productId);
        return `
          <li style="margin-bottom: 8px;">
            <strong>${product?.productName || "Product"}</strong> — Qty: ${item.quantity} — ₹${item.price}
          </li>
        `;
      } catch (err) {
        return `
          <li style="margin-bottom: 8px;">
            <strong>Unknown Product</strong> — Qty: ${item.quantity} — ₹${item.price}
          </li>
        `;
      }
    })
  );

  html += itemHtmls.join("");

  html += `
      </ul>
      <p style="margin-top: 20px; color: #777;">
        Shipping to: ${order.shippingAddress?.fullName}, ${order.shippingAddress?.address}, ${order.shippingAddress?.city}
      </p>
      <p style="margin-top: 20px; font-size: 14px; color: #aaa;">E-Store Team</p>
    </div>
  `;

  return html;
};

module.exports = {
  sendOrderEmail,
};
