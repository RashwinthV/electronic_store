const express = require("express");
const { uploadImage, upload } = require("../controller/Admin/Uploadimage");
const { useruploadImage } = require("../controller/Admin/userprofilepic");
const { SalesData, getTopSellingProduct } = require("../controller/Admin/SalesController");
const { getallorders, updateOrderstatus } = require("../controller/Admin/ordercontroller");
const { Dashboard } = require("../controller/Admin/Dashboard");
const { inventoyproducts, UpdateStock } = require("../controller/Admin/inventory");
const router = express.Router();

router.post("/", upload, uploadImage);
router.post("/user",upload,useruploadImage)

//order route
router.get('/admin-orders',getallorders)
router.put("/admin-orders/:id/status",updateOrderstatus)



//dashboard
router.get('/dashboard-data',Dashboard)

//inventory routes

router.get('/allproducts',inventoyproducts)
router.put('/products/:id',UpdateStock)
router.get('/sales', SalesData)
router.get("/top-selling-product",getTopSellingProduct)

module.exports = router;
