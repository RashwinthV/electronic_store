const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name : String,
    login:{type:String,default:''},
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {type:String,default:''},
    profilePic : String,
    role : String,
    keycloak_id:String,
},{
    timestamps : true
})


const userModel =  mongoose.model("user",userSchema)


module.exports = userModel