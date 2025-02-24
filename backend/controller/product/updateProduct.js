const uploadProductPermission = require('../../helpers/permission')
const productModel = require('../../models/productModel');
const userModel = require('../../models/userModel');

async function updateProductController(req,res){
    try{

        const email = req.params.email || req.query.email;
          // Accept both route and query params
          const role=await userModel.findOne({email:email},'role')
          localStorage.setItem('role',role)
        localStorage.setItem('email',email)
          if(!uploadProductPermission()){
            throw new Error("Permission denied")
        }
        
 
        const { _id, ...resBody} = req.body
        console.log(_id, resBody);
        
        const updateProduct = await productModel.findByIdAndUpdate(_id,resBody)
        
        res.json({
            message : "Product update successfully",
            data : updateProduct,
            success : true,
            error : false 
        }) 

    }catch(err){
        // res.status(400).json({
        //     message : "failed",
        //     error : true,
        //     success : false
        // })
    }
}


module.exports = updateProductController