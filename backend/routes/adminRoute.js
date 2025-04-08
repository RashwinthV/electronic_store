const express = require("express");
const { uploadImage, upload } = require("../controller/Admin/Uploadimage");
const { useruploadImage } = require("../controller/Admin/userprofilepic");
const router = express.Router();

router.post("/", upload, uploadImage);
router.post("/user",upload,useruploadImage)

module.exports = router;
