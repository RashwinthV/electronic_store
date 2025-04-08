const express = require("express");
const sendStockReport = require("../controller/Email/sotckEmail");
const sendPasswordEmail = require("../controller/Email/passwordEmail");
const emailroute = express.Router();

// ✅ API route to send report manually
emailroute.get("/send-stock-report", async (req, res) => {
  try {
    await sendStockReport();
    res.status(200).json({ message: "Stock report email sent successfully!" });
  } catch (err) {
    console.error("❌ Error sending stock report:", err);
    res
      .status(500)
      .json({ message: "Failed to send stock report", error: err.message });
  }
});


emailroute.post("/send-password",sendPasswordEmail)

module.exports = emailroute;
