const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    login: { type: String, default: "" },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    profilePic: String,
    role: String,
    keycloak_id: String,
    addresses: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    phoneNo: { type: Number, minlength: 10 },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
