const userModel = require("../models/userModel")

const uploadProductPermission = async() => {
    const userid=localStorage.getItem('email')
    const user = await userModel.findById(userid)

    if(user.role === 'ADMIN'){
        return true
    }

    return false
}


module.exports = uploadProductPermission