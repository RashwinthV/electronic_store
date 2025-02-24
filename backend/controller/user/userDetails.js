const userModel = require("../../models/userModel");
const bcrypt=require('bcryptjs')

exports.userDetailsController = async (req, res) => {
    try {
      const email = req.params.email || req.query.email;  // Accept both route and query params
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
  
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

exports.updateuser=async(req,res)=>{
    try {
        const { name, email, profilePic, password } = req.body;

        const updatedUser = {};
        if (name) updatedUser.name = name;
        if (email) updatedUser.email = email;
        if (profilePic) updatedUser.profilePic = profilePic;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
            updatedUser.password = hashedPassword;
        }
        const user = await userModel.findOneAndUpdate({email:email}, updatedUser, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}