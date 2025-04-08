import React, { useEffect, useState } from "react";
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";

const Header = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [cartCount, setCartCount] = useState(
    localStorage.getItem("cartCount") || 0
  );
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = localStorage.getItem("email");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedEmail = urlParams.get("email");

    if (encodedEmail) {
      const decodedEmail = decodeURIComponent(encodedEmail);
      localStorage.setItem("email", decodedEmail);
    }
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!email) return;

      try {
        const response = await fetch(
          `${SummaryApi.current_user.url}?email=${encodeURIComponent(email)}`,
          {
            method: SummaryApi.current_user.method,
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (data) {
          dispatch(setUserDetails(data));
          setUser(data);
          localStorage.setItem("userId", data._id);
          
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        toast.error("Error fetching user details.");
      }
    };

    fetchUserDetails();
  }, [email, dispatch]);

  useEffect(() => {
    if (user?.profilePic) {
      try {
        const imageUrl = user.profilePic;
        const url = new URL(imageUrl);
        const fileId = url.searchParams.get("id");
        setActiveImage(
          fileId
            ? `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`
            : imageUrl
        );
      } catch (error) {
        console.error("Invalid image URL:", error);
      }
    }
  }, [user]);

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(localStorage.getItem("cartCount") || 0);
    };

    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value.trim());

    if (value.trim()) {
      navigate(`/search?q=${value.trim()}`);
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("cartCount");
    localStorage.removeItem("userId")
    dispatch(setUserDetails(null));
    setUser(null);
    toast.success("Logout successful!");
    navigate("/");
  };

  return (
    <header className="h-16 shadow-md bg-white fixed w-full z-40">
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        {/* Logo */}
        <Link
          to={"/"}
          className="text-2xl font-extrabold tracking-wide text-blue-600"
        >
          MCA<span className="text-gray-700">Electronics</span>
        </Link>

        {/* Search Box */}
        <div className="hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2">
          <input
            type="text"
            placeholder="Search product here..."
            className="w-full outline-none"
            onChange={handleSearch}
            value={search}
          />
          <div className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white">
            <GrSearch />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-7">
          {/* Orders */}

          {/* Profile */}
          <div
            className="relative flex justify-center cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            {user?.profilePic ? (
              <img
                src={activeImage}
                className="w-10 h-10 rounded-full"
                alt={user?.name}
              />
            ) : (
              <FaRegCircleUser className="text-2xl" />
            )}
          </div>

          {/* Cart */}
          {user && (
            <Link to={"/cart"} className="text-2xl relative">
              <FaShoppingCart />
              <div className="bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3">
                <p className="text-sm">{cartCount}</p>
              </div>
            </Link>
          )}
          {user && (
            <Link
              to={"/orders"}
              className="hover:bg-slate-100 p-2 flex items-center gap-1"
            >
              <FaBoxOpen className="text-lg" />
            </Link>
          )}

          {/* Admin Panel Link */}
          {user?.role === "ADMIN" && (
            <Link
              to={"/admin-panel/Dashboard"}
              className="whitespace-nowrap hover:bg-slate-100 p-2"
            >
              Admin Panel
            </Link>
          )}

          {/* Login / Logout */}
          <div>
            {user ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <Link
                to={"/login"}
                className="px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div
          className="lg:hidden cursor-pointer text-2xl"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          &#9776;
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-md absolute top-16 left-0 w-full z-50 flex flex-col gap-4 p-4">
          <Link
            to={"/profile"}
            onClick={() => setMobileMenuOpen(false)}
            className="flex gap-2 items-center"
          >
            {" "}
            <FaRegCircleUser className="text-2xl" />
            Profile
          </Link>
          {user && (
            <Link
              to={"/orders"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex gap-2 items-center"
            >
              {" "}
              <FaBoxOpen />
              Orders
            </Link>
          )}
          {user && (
            <Link
              to={"/cart"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex gap-2 items-center"
            >
              <FaShoppingCart />
              Cart{" "}
              <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-sm">
                {cartCount}
              </span>
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link
              to={"/admin-panel/Dashboard"}
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin Panel
            </Link>
          )}
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="text-left text-red-600"
            >
              Logout
            </button>
          ) : (
            <Link to={"/login"} onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
