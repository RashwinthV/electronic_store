const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    productName : String,
    brandName : String,
    category : String,
    productImage :{type:[String]},
    description : String,
    price : Number,
    sellingPrice : Number,
    stock : {type:Number, default: 0},
},{
    timestamps : true
})


const productModel = mongoose.model("product",productSchema)

module.exports = productModel