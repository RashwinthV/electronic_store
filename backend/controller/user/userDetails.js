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
  


  exports.updateuser = async (req, res) => {
    try {
      const { email } = req.query;
            const { name, profilePic, password, addresses } = req.body;
    
      if (!email) {
        console.log("🔴 Error: Email is missing in request.");
        return res.status(400).json({ message: "Email is required for updating user details." });
      }
  
      let updateFields = {};
  
      if (name) updateFields.name = name;
      if (profilePic) updateFields.profilePic = profilePic;
  
      if (addresses) {
        updateFields["addresses.address"] = addresses.address;
        updateFields["addresses.city"] = addresses.city;
        updateFields["addresses.postalCode"] = addresses.postalCode;
        updateFields["addresses.country"] = addresses.country;
      }
  
      if (password && password.trim() !== "") {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        updateFields.password = hashedPassword;
      }
  
  
      const updatedUser = await userModel.findOneAndUpdate(
        { email: email },
        { $set: updateFields },
        { new: true, runValidators: true } 
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error("❌ Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  