const uploadProductPermission = require("../../helpers/permission")
const productModel = require("../../models/productModel")

async function UploadProductController(req,res){
    try{
        const email = req.params.email || req.query.email; 
        if(!email){
            throw new Error("Email not found")
        }       
        const uploadProduct = new productModel(req.body)        
        const saveProduct = await uploadProduct.save()

        res.status(201).json({
            message : "Product upload successfully",
            error : false,
            success : true,
            data : saveProduct
        })
   
    }catch(err){
        console.log(err);
        
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = UploadProductController