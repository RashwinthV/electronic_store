const nodemailer = require("nodemailer");
const cron = require("node-cron");
const Product = require("../../models/productModel"); // your existing model path

// ✅ Setup nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Group & sort logic
const groupAndSortProducts = (products) => {
  const grouped = {};

  products.forEach((p) => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  for (let category in grouped) {
    grouped[category].sort((a, b) => a.stock - b.stock);
  }

  return grouped;
};

// ✅ Email HTML generator
const generateEmailHTML = (groupedProducts) => {
  let html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #ccc; padding-bottom: 5px;">📦 Daily Stock Report</h2>
  `;

  for (const [category, items] of Object.entries(groupedProducts)) {
    html += `
      <div style="margin-top: 30px;">
        <h3 style="color: #444; margin-bottom: 12px;">📁 ${category}</h3>
        <div style="gap: 12px;">
    `;

    items.forEach((p) => {
      const color = p.stock < 5 ? "#e74c3c" : "#2ecc71"; // red / green

      html += `
        <div style="
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 10px 15px;
          margin-top:10px;
          background-color: #fafafa;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        ">
          <p style="margin: 0; font-size: 16px;"><b>${p.productName}</b></p>
          <p style="margin: 4px 0 0; color: ${color}; font-weight: bold;">
            Stock: ${p.stock}
          </p>
        </div>
      `;
    });

    html += `
        </div>
        <hr style="margin-top: 24px; border: none; border-top: 1px solid #ddd;" />
      </div>
    `;
  }

  html += `</div>`;
  return html;
};

// Reusable function for cron & route
const sendStockReport = async () => {
  const products = await Product.find({});
  const grouped = groupAndSortProducts(products);
  const emailHTML = generateEmailHTML(grouped);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: [
      'kirithiksaranselvaraj247@gmail.com',
      'tharun66777@gmail.com',
      'sparvatha04@gmail.com',
      'priyamdharshini0085@gmail.com'
    ].join(','),
    // to: ["tharun66777@gmail.com"].join(","),
    subject: "📬 E-Store Daily Stock Report",
    html: emailHTML,
  });

  console.log("✅ Email Sent!");
};

// 🕒 Schedule: every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  // cron.schedule("*/1 * * * *", async () => {
  console.log("⏰ Running daily report...");
  await sendStockReport(); 
});

module.exports = sendStockReport;
