const axios = require("axios");
const userModel = require("../../models/userModel");
const qs = require("qs");

const KEYCLOAK_URL =process.env.KEYCLOAK_URL
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI 
const KEYCLOAK_BASE_URL =process.env.KEYCLOAK_BASE_URL
const REALM = "ecom";

// Keycloak Admin Credentials
const ADMIN_REALM =process.env.ADMIN_REALM
const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD =process.env.ADMIN_PASSWORD
const ADMIN_CLIENT_ID = process.env.ADMIN_CLIENT_ID
const ADMIN_CLIENT_SECRET =process.env.ADMIN_CLIENT_SECRET

exports.loginProvider = (req, res) => {
  const { provider } = req.params;

  const providers = {
    google: "google",
    facebook: "facebook",
    instagram: "instagram",
    "linkedin-openid-connect": "linkedin-openid-connect", // Keycloak alias
  };

  if (!providers[provider]) {
    return res.status(400).json({ error: "Unsupported provider" });
  }

  const loginUrl = `${KEYCLOAK_URL}/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=openid&kc_idp_hint=${providers[provider]}`;

  res.redirect(loginUrl);
};

exports.call = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing" });
    }
    const tokenResponse = await axios.post(
      `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
        code,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenResponse.data.access_token;

    const userInfoResponse = await axios.get(
      `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/userinfo`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const user = userInfoResponse.data;

    const adminResponse = await axios.post(
      `${KEYCLOAK_BASE_URL}/realms/${ADMIN_REALM}/protocol/openid-connect/token`,
      qs.stringify({
        grant_type: "password",
        client_id: ADMIN_CLIENT_ID,
        client_secret: ADMIN_CLIENT_SECRET,
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const adminAccessToken = adminResponse.data.access_token;

    let provider = " ";

    try {
      const idpResponse = await axios.get(
        `${KEYCLOAK_BASE_URL}/admin/realms/${REALM}/users/${user.sub}/federated-identity`,
        { headers: { Authorization: `Bearer ${adminAccessToken}` } }
      );

      if (idpResponse.data.length > 0) {
        provider = idpResponse.data[0].identityProvider;
      }else{
        provider="manual";
      }
    } catch (idpError) {
      console.warn(`No identity provider found for user: ${user.email}`);
    }

    const existingUser = await userModel.findOne({ email: user.email });

    if (!existingUser) {
      const newUser = new userModel({
        name: user.given_name || user.email,
        email: user.email,
        role: "GENERAL",
        keycloak_id: user.sub,
      });

      await newUser.save();
    }
    await userModel.findOneAndUpdate({email:user.email},{login:provider})

   
    const mail = user.email;
    res.redirect(`${process.env.FRONTEND_URL}?email=${encodeURIComponent(mail)}`);    
  } catch (error) {
    console.error("Error handling callback:", error);
    res.status(error.response?.status || 500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
 