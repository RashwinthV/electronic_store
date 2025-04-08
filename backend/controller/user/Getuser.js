const axios = require("axios");
const userModel = require("../../models/userModel");

const handleCallback = async (req, res) => {
  try {
    // Get Access Token from Keycloak
    const tokenResponse = await axios.post(
      process.env.REACT_APP_TOKEN_URL,
      new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenResponse.data.access_token;

    // Fetch user info from Keycloak
    const userInfoResponse = await axios.get(process.env.REACT_APP_KEYCLOAK_USERS_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const users = userInfoResponse.data;
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found in Keycloak." });
    }
    let newUsers = []; 

    for (const userData of users) {
      if (!userData.email) {
        console.warn(`Skipping user ${userData.username} due to missing email.`);
        continue; 
      }

      const existingUser = await userModel.findOne({ email: userData.email });
      if (!existingUser) {
        const payload = {
          name: userData.username || "Unknown",
          email: userData.email,
          role: "GENERAL",
          keycloak_id: userData.id,
        };

        const newUser = new userModel(payload);
        await newUser.save();
        newUsers.push(userData.email);
      }
    }

    res.json({
      success: true,
      message: `User data processed successfully. Added ${newUsers.length} new users.`,
      newUsers,
    });
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    res.status(error.response?.status || 500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports=handleCallback