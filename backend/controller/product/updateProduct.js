const uploadProductPermission = require('../../helpers/permission')
const productModel = require('../../models/productModel');

async function updateProductController(req,res){

    try{

       
 
        const { _id, ...resBody} = req.body
        
        const updateProduct = await productModel.findByIdAndUpdate(_id,resBody)
        const product=await productModel.findById(_id)
        res.json({
            message : "Product update successfully",
            data : product,
            success : true,
            error : false 
        }) 

    }catch(err){ 
        
         res.status(400).json({
           message : "failed",
            error : true,
            success : false
        })
    }
}


module.exports = updateProductController