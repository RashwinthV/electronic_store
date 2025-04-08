const userModel = require("../models/userModel")

const uploadProductPermission = async(email) => {
    const userid=email
    const user = await userModel.findById(userid)

    if(user.role === 'ADMIN'){
        return true
    }

    return false
}


module.exports = uploadProductPermission