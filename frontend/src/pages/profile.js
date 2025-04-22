import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Profile() {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePic: "",
    password: "",
    confirmPassword: "",
    addresses: {
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
    phoneNo:""
  });

  const userId = localStorage.getItem("email");

  const fetchUserDetails = useCallback(async () => {
    if (!userId) return;

    try {
      const apiUrl = `${SummaryApi.current_user.url}?email=${encodeURIComponent(
        userId
      )}`;
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
    }
  }, [userId, dispatch]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);
  

  useEffect(() => {
    if (user && user.profilePic?.length > 0) {
      try {
        const imageUrl = user.profilePic;
        if (imageUrl) {
          const url = new URL(imageUrl);
          const fileId = url.searchParams.get("id");
          setActiveImage(
            fileId
              ? `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`
              : imageUrl
          );
        }
      } catch (error) {
        console.error("Invalid image URL:", error);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        profilePic: user.profilePic || "",
        password: "",
        confirmPassword: "",
        addresses: user.addresses || {
          address: "",
          city: "",
          postalCode: "",
          country: "",
        },
        phoneNo: user.phoneNo || ""  
      });
    }
  }, [user]);
  

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setFormData({
      ...formData,
      addresses: {
        ...formData.addresses,
        [e.target.name]: e.target.value,
      },
    });
  };
  let userid = localStorage.getItem("email");
  const handleUpdate = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.info("Name and Email are required!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const apiUrl = `${
        process.env.REACT_APP_BACKEND_URL
      }/user/?email=${encodeURIComponent(userid)}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditMode(false);
        fetchUserDetails();
        toast.success("Profile updated successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Update failed, please try again!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first!");
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append("file", selectedFile);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_IMAGE_URL}/uploadimage/user`,
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      const data = await response.json();

      if (data.success) {
        setFormData({ ...formData, profilePic: data.url });
        toast.success("Profile picture uploaded successfully!");
      } else {
        toast.error("Image upload failed. Please try again!");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Image upload error!");
    }
  };
  

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-5 mb-5 p-6 max-w-lg bg-white shadow-lg rounded-lg">
      {/* Profile Picture Upload */}
      <div className="mb-6 text-center">
        <label htmlFor="uploadImageInput">
          <div className="relative p-3 bg-gray-200 rounded-full h-32 w-32 mx-auto flex justify-center items-center cursor-pointer hover:bg-gray-300 transition duration-300">
            {editMode ? (
              <div className="flex flex-col justify-center items-center gap-2">
                <span className="text-5xl">📷</span>
                <p className="text-xs text-gray-600">Upload Profile Picture</p>
                <input
                  type="file"
                  id="uploadImageInput"
                  className="hidden"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>
            ) : (
              user.profilePic && (
                <img
                  src={activeImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full border-4 border-gray-300"
                />
              )
            )}
          </div>
        </label>
        {editMode && selectedFile && (
          <button
            onClick={handleFileUpload}
            className="mt-3 bg-indigo-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
          >
            Upload Image
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-1">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`border rounded-lg w-full py-2 px-4 text-gray-700 shadow-sm ${
            editMode
              ? "border-blue-400 focus:ring-2 focus:ring-blue-300"
              : "bg-gray-100"
          }`}
          disabled={!editMode}
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-1">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          className="border rounded-lg w-full py-2 px-4 bg-gray-100 shadow-sm text-gray-500"
          disabled
        />
      </div>

      {/* Address Fields */}
      {Object.keys(formData.addresses).map((key) => (
        <div key={key} className="mb-5">
          <label className="block text-gray-700 font-semibold mb-1">
            {key.charAt(0).toUpperCase() + key.slice(1)}:
          </label>
          <input
            type="text"
            name={key}
            value={formData.addresses[key]}
            onChange={handleAddressChange}
            className={`border rounded-lg w-full py-2 px-4 shadow-sm ${
              editMode
                ? "border-blue-400 focus:ring-2 focus:ring-blue-300"
                : "bg-gray-100"
            }`}
            disabled={!editMode}
          />
        </div>
      ))}
       <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-1">Phone no:</label>
        <input
          type="text"
          name="phoneNo"
          value={formData.phoneNo}
          onChange={handleInputChange}
          className={`border rounded-lg w-full py-2 px-4 text-gray-700 shadow-sm ${
            editMode
              ? "border-blue-400 focus:ring-2 focus:ring-blue-300"
              : "bg-gray-100"
          }`}
          disabled={!editMode}
        />
      </div>


      {/* Change Password */}
      {editMode && (
        <>
          {/* Password Field */}
          <div className="relative mt-3">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              className="border rounded-lg w-full py-2 px-4 shadow-sm focus:ring-2 focus:ring-blue-300"
              onChange={handleInputChange}
              value={formData.password}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
            </span>
          </div>

          {/* Confirm Password Field */}
          <div className="relative mt-3">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="border rounded-lg w-full py-2 px-4 shadow-sm focus:ring-2 focus:ring-blue-300"
              onChange={handleInputChange}
              value={formData.confirmPassword}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-5">
        {editMode ? (
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-green-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
