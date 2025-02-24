import { jwtDecode } from "jwt-decode";
import { jwtVerify } from "jose"; // JWT validation

async function login(username, password) {
  try {
    const response = await fetch(process.env.REACT_APP_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "password",
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        username: username,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      const publicKeyResponse = await fetch(process.env.REACT_APP_CERTS_URL);

      const publicKeyData = await publicKeyResponse.json();

      // Validate the token with the public key
      const isValid = await validateTokenWithPublicKey(
        data.access_token,
        publicKeyData
      );
      if (isValid) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

// Function to validate token using public key
async function validateTokenWithPublicKey(token, publicKeyData) {
  try {
    const { keys } = publicKeyData;
    const decodedHeader = jwtDecode(token, { header: true });

    const key = keys.find((k) => k.kid === decodedHeader.kid);
    if (key) {
      const { payload } = await jwtVerify(token, key);
      return !!payload;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

export default login;
