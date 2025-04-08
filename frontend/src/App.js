import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import SummaryApi from "./common";
import Context from "./context";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./store/userSlice";

const App = () => {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);

  /** Fetch user details */
  const fetchUserDetails = async () => {
    try {
      const email = localStorage.getItem("email");
      if (!email) {
        console.error("No email found in localStorage");
        return;
      }

      // Append email as a query parameter
      const apiUrl = `${SummaryApi.current_user.url}?email=${encodeURIComponent(email)}`;

      const response = await fetch(apiUrl, {
        method: SummaryApi.current_user.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const dataApi = await response.json();
      if (dataApi.success) {
        dispatch(setUserDetails(dataApi.data));
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  /** Fetch user cart count */
  const fetchUserAddToCart = async () => {
    try {
      const response = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart data");
      }

      const dataApi = await response.json();
      setCartProductCount(dataApi?.data?.count || 0);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  /** Fetch user and cart details on mount */
  useEffect(() => {
    // Fetch user details and cart product count in parallel
    fetchUserDetails();
    fetchUserAddToCart();
  }); // Runs once on mount

  return (
    <>
      <Context.Provider
        value={{
          fetchUserDetails, // user detail fetch
          cartProductCount, // current user add to cart product count
          fetchUserAddToCart,
        }}
      >
        <ToastContainer position="top-center" />
        <Header />
        <main className="min-h-[calc(100vh-120px)] pt-16">
          <Outlet />
        </main>
        <Footer />
      </Context.Provider>
      
    </>
  );
};

export default App;
