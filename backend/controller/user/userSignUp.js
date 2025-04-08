const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");

// Function to register user in Keycloak
async function RegisterAuth(firstName, lastName, email, password) {
  try {
    const tokenResponse = await fetch(process.env.REACT_APP_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: "users",
        client_secret: "PhNTTIh0jCTp0efvcOoelWcCSPFSXdDW",
        grant_type: "client_credentials",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(`Error obtaining access token: ${tokenData.error_description || tokenData.error}`);
    }

    const accessToken = tokenData.access_token;

    const userResponse = await fetch(process.env.REACT_APP_KEYCLOAK_USERS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        username: email,
        email: email,
        firstName: firstName,
        lastName: lastName,
        enabled: true,
        credentials: [
          {
            type: "password",
            value: password,
            temporary: false,
          },
        ],
      }),
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      throw new Error(`Error creating user in Keycloak: ${errorData.error || "Unknown error"}`);
    }

    console.log("✅ User created successfully in Keycloak!");
    return true;
  } catch (err) {
    console.error("❌ Error during Keycloak registration:", err.message);
    return false;
  }
}

// Main Signup Controller
async function userSignUpController(req, res) {
  try {
    const {
      name,
      login,
      email,
      password,
      role,
      keycloak_id,
      phoneNo,
      profilePic,
      addresses = {},
    } = req.body;

    if (!name || !email || !password || !addresses.address || !addresses.city || !addresses.postalCode || !addresses.country || !phoneNo) {
      throw new Error("Please provide all required fields.");
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists.");
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    if (!hashPassword) throw new Error("Failed to hash password.");

    // Split full name into first and last names for Keycloak
    const [firstName, ...lastParts] = name.split(" ");
    const lastName = lastParts.join(" ") || "";

    const newUser = new userModel({
      name,
      login: login || "Manual registration",
      email,
      password: hashPassword,
      profilePic: profilePic || "",
      role: role || "GENERAL",
      keycloak_id: keycloak_id || "",
      phoneNo,
      addresses: {
        address: addresses.address,
        city: addresses.city,
        postalCode: addresses.postalCode,
        country: addresses.country,
      },
    });

    const savedUser = await newUser.save();

    const keycloakSuccess = await RegisterAuth(firstName, lastName, email, password);
    if (!keycloakSuccess) {
      // Optional: Delete user from DB if Keycloak fails
      await userModel.findByIdAndDelete(savedUser._id);
      throw new Error("User registration failed in Keycloak.");
    }

    res.status(201).json({
      success: true,
      error: false,
      data: savedUser,
      message: "User registered successfully!",
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(400).json({
      success: false,
      error: true,
      message: err.message || "Registration failed.",
    });
  }
}

module.exports = userSignUpController;
