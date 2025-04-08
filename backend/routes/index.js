const express = require('express')

const router = express.Router()

const userSignUpController = require("../controller/user/userSignUp")
const userSignInController = require('../controller/user/userSignIn')
const {userDetailsController, updateuser} = require('../controller/user/userDetails')
const userLogout = require('../controller/user/userLogout')
const {allUsers} = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const UploadProductController = require('../controller/product/uploadProduct')
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const {getCategoryProduct} = require('../controller/product/getCategoryProductOne')
const {getCategoryWiseProduct} = require('../controller/product/getCategoryWiseProduct')
const {getProductDetails} = require('../controller/product/getProductDetails')
const {addToCartController} = require('../controller/user/addToCartController')
const {countAddToCartProduct} = require('../controller/user/countAddToCartProduct')
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const {searchProduct} = require('../controller/product/searchProduct')
const filterProductController = require('../controller/product/filterProduct')
const handleCallback  = require('../controller/user/Getuser')
const {  call} = require('../controller/user/socialLogin')
const userModel = require('../models/userModel')
const { placeOrder } = require('../controller/product/paceorder')
const { addToCartViewProduct, Buyagain}=require("../controller/user/addToCartViewProduct")
const { getorders, getorderDetails } = require('../controller/product/getOrders')
const { getallorders, updateOrderstatus } = require('../controller/Admin/ordercontroller')
const { Dashboard } = require('../controller/Admin/Dashboard')
const { inventoyproducts, UpdateStock } = require('../controller/Admin/inventory')



router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.get("/user/:email", userDetailsController);
router.post("/user",updateuser)
router.get("/user", userDetailsController);

router.get("/userLogout",userLogout)

//admin panel 
router.get("/all-user",allUsers)
router.post("/update-user",updateUser)

//product
router.post("/upload-product/:email",UploadProductController)
router.get("/get-product",getProductController)
router.post("/update-product/:email",updateProductController)
router.get("/get-categoryProduct",getCategoryProduct)
router.post("/category-product",getCategoryWiseProduct)
router.post("/product-details",getProductDetails)
router.get("/search",searchProduct)
router.post("/filter-product",filterProductController)

//user add to cart
router.post("/addtocart",addToCartController)
router.get("/countAddToCartProduct",countAddToCartProduct)
router.get("/view-card-product",addToCartViewProduct)
router.post("/update-cart-product",updateAddToCartProduct)
router.post("/delete-cart-product",deleteAddToCartProduct)
router.get('/buyagain/:userId',Buyagain)
router.get('/my-orders/:id',getorders)
router.get("/order/:id",getorderDetails)

//get user data
router.get('/save',handleCallback)
router.get('/callback',call)
router.get('/address/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user); 
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//place order
router.post('/place-order',placeOrder)
router.get('/admin-orders',getallorders)
router.put("/admin-orders/:id/status",updateOrderstatus)

//dashboard
router.get('/dashboard-data',Dashboard)

//inventory routes

router.get('/allproducts',inventoyproducts)
router.put('/products/:id',UpdateStock)

module.exports = router