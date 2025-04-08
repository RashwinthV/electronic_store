const mongoose = require('mongoose')

const addToCart = mongoose.Schema({
   items: [{
       productId: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'product',
       },
       quantity: {
           type: Number,
           required: true,
          
       }
   }],
   Totalquantity: {
       type: Number,
       required: true,
       
   },
   userId: {
       type: String,
       required: true
   },
   placed: {
       type: Boolean,
       default: false
   }
},{
    timestamps: true
})

const addToCartModel = mongoose.model("addToCart", addToCart)

module.exports = addToCartModel;
