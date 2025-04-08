import SummaryApi from "../common";
import { toast } from "react-toastify";

/**
 * Fetch user details and store user ID in localStorage.
 */
const fetchUserDetails = async () => {
  try {
    const email = localStorage.getItem("email"); // Get user email from localStorage
    if (!email) {
      console.error("No email found in localStorage. User must log in.");
      return null;
    }

    const apiUrl = `${SummaryApi.current_user.url}?email=${encodeURIComponent(email)}`;
    const response = await fetch(apiUrl, {
      method: SummaryApi.current_user.method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const dataApi = await response.json();
    if (dataApi && dataApi._id) {
      localStorage.setItem("userId", dataApi._id);
      return dataApi._id; 
    } else {
      console.error("User ID not found in API response");
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    return null;
  }
};

/**
 * Add a product to the cart with userId.
 */
const addToCart = async (e, productId) => {
  e?.stopPropagation();
  e?.preventDefault();

  let userId = localStorage.getItem("userId"); 
  if (!userId) {
    userId = await fetchUserDetails(); 
  }

  if (!userId) {
    toast.error("Please log in first");
    return { error: true, message: "Please login first" };
  }

  const response = await fetch(SummaryApi.addToCartProduct.url, {
    method: SummaryApi.addToCartProduct.method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId: productId,
      userId: userId,
    }),
  });

  const responseData = await response.json();

  if (responseData.success) {
    toast.success(responseData.message);
  } else {
    toast.error(responseData.message);
  }

  return responseData;
};

export default addToCart;
