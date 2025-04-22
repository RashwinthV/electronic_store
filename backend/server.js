const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/db");
const router = require("./routes");
const { loginProvider } = require("./controller/user/socialLogin");
const Adminroute = require("./routes/adminRoute");
const axios = require("axios");
const sendStockReport = require("./controller/Email/sotckEmail");
const emailroute = require("./routes/EmailRoute");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", router);
app.use("/login/:provider", loginProvider);
app.use("/uploadimage", Adminroute);
app.use("/mail",emailroute)
app.use('/admin',Adminroute)
app.get("/proxy-image", async (req, res) => {
  const fileId = req.query.fileId;

  if (!fileId) {
    return res.status(400).send("File ID is required");
  }

  const googleDriveUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

  try {
    const response = await axios.get(googleDriveUrl, {
      responseType: "arraybuffer",
    });

    const contentType = response.headers["content-type"] || "image/jpeg";
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Content-Type", contentType);
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Error fetching image from Google Drive");
  }
});
 
  
// sendStockReport();
 


const PORT = 8000 || process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("connnect to DB");
    console.log("Server is running " + PORT);
  });
});
