import React, { useContext, useEffect, useState } from "react";
import Logo from "./Logo";
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Context from "../context";
import SummaryApi from "../common";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";

const Header = () => {
  const [search, setSearch] = useState("");
  const context = useContext(Context);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState("");
  const email = localStorage.getItem("email");
  var roll=user.role||"general"
  localStorage.setItem("role",roll)
  const urlParams = new URLSearchParams(window.location.search);
  const encodedEmail = urlParams.get("email");

  if (encodedEmail) {
    const decodedEmail = decodeURIComponent(encodedEmail);
    localStorage.setItem("email", decodedEmail);
  }
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!email) return;

      try {
        const apiUrl = `${
          SummaryApi.current_user.url
        }?email=${encodeURIComponent(email)}`;
        const response = await fetch(apiUrl, {
          method: SummaryApi.current_user.method,
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const dataApi = await response.json();
        if (dataApi) {
          dispatch(setUserDetails(dataApi));
          setUser(dataApi); 
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        toast.error("Error fetching user details.");
      }
    };

    fetchUserDetails();
  }, [email, dispatch]);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    dispatch(setUserDetails(null));
    setUser(null); 
    toast.success("Logout successful!");
    navigate("/");
  };

  return (
    <header className="h-16 shadow-md bg-white fixed w-full z-40">
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        <div>
          <Link to={"/"}>
            <Logo w={90} h={50} />
          </Link>
        </div>

        <div className="hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2">
          <input
            type="text"
            placeholder="search product here..."
            className="w-full outline-none"
            onChange={handleSearch}
            value={search}
          />
          <div className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white">
            <GrSearch />
          </div>
        </div>

        <div className="flex items-center gap-7">
          {/* Profile section */}
          <div
            className="relative flex justify-center"
            onClick={() => navigate("/profile")}
          >
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                className="w-10 h-10 rounded-full"
                alt={user?.name}
              />
            ) : (
              <FaRegCircleUser />
            )}
          
          </div>

          {/* Cart */}
          {user && (
            <Link to={"/cart"} className="text-2xl relative">
              <span>
                <FaShoppingCart />
              </span>
              <div className="bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3">
                <p className="text-sm">{context?.cartProductCount}</p>
              </div>
            </Link>
          )}

          {/* Admin Role */}
          {user?.role === "ADMIN" && (
            <p>
              <Link
                to={"/admin-panel/all-products"}
                className="whitespace-nowrap hidden md:block hover:bg-slate-100 p-2"
              >
                Admin Panel
              </Link>
            </p>
          )}

          {/* Logout or Login button */}
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
      </div>
    </header>
  );
};

export default Header;
