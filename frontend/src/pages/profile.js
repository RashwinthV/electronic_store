import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice"; // Ensure correct path
import SummaryApi from "../common"; // Ensure correct import
import { toast } from "react-toastify";

function Profile() {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); 
  const fileInputRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePic: "",
    password: "",
    confirmPassword: "",
    changePassword: false,
  });

  const userId = localStorage.getItem("email"); // Ensure this is valid

  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      try {
        const apiUrl = `${
          SummaryApi.current_user.url
        }?email=${encodeURIComponent(userId)}`;
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
          setUser(dataApi); // State updates asynchronously
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserDetails(); // Call the function inside useEffect
  }, [userId, dispatch]);

  // 🛠 Fix: Sync `formData` with `user` using useEffect
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        profilePic: user.profilePic || "",
        password: "",
        confirmPassword: "",
        changePassword: false,
      });
    }
  }, [user]); // Runs only when `user` is updated

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.info("Name and email are required!");
      return;
    }

    if (
      formData.changePassword &&
      formData.password !== formData.confirmPassword
    ) {
toast.error("Passwords do not match!")  
    return;
    }

    try {
      const apiUrl = `${SummaryApi.current_user.url}?email=${encodeURIComponent(
        userId
      )}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditMode(false);
        toast.success("Profille updated successfully");
      } else {
        toast.error("Update failed please try again!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file); // Update the selected file
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click if ref is set
    }
  };
  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 text-center">
      <label htmlFor="uploadImageInput">
        <div
          className="p-2 bg-slate-100  rounded h-32 w-full flex justify-center items-center cursor-pointer"
          onClick={handleUploadClick} // Click to open file input
        >
          {editMode ? (
            <div className="p-2 bg-slate-200 border rounded h-32 w-full flex justify-center items-center cursor-pointer gap-2">
              <span className="text-4xl">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 640 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M537.6 226.6c4.1-10.7 6.4-22.4 6.4-34.6 0-53-43-96-96-96-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32c-88.4 0-160 71.6-160 160 0 2.7.1 5.4.2 8.1C40.2 219.8 0 273.2 0 336c0 79.5 64.5 144 144 144h368c70.7 0 128-57.3 128-128 0-61.9-44-113.6-102.4-125.4zM393.4 288H328v112c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V288h-65.4c-14.3 0-21.4-17.2-11.3-27.3l105.4-105.4c6.2-6.2 16.4-6.2 22.6 0l105.4 105.4c10.1 10.1 2.9 27.3-11.3 27.3z"></path>
                </svg>
              </span>
              <p className="text-sm">Upload Profile Picture</p>
              {/* Hidden file input */}
              <input
                type="file"
                id="uploadImageInput"
                className="hidden"
                accept="image/*"
                ref={fileInputRef} // Reference to file input
                onChange={handleFileInputChange} // File change handler
              />
            </div>
          ) : (
            // When not in edit mode, show the uploaded image or default image
            <div>
              {selectedFile ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Profile"
                  width="100"
                  height="100"
                  className="rounded-full mx-auto mt-4"
                />
              ) : (
                <img
                  width="48"
                  height="48"
                  src="https://img.icons8.com/color/48/test-account.png"
                  alt="test-account"
                  className="mx-auto mt-4"
                />
              )}
            </div>
          )}
        </div>
      </label>
    </div>


  
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Name:</label>
        {editMode ? (
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        ) : (
          <p className="text-gray-700">{user.name}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Email:</label>
        {editMode ? (
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        ) : (
          <p className="text-gray-700">{user.email}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Login</label>
        <p className="text-gray-700">{user.login || "Admin"}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Role</label>
        <p className="text-gray-700">{user.role}</p>
      </div>
  
      {editMode && (
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            <input
              type="checkbox"
              onChange={() =>
                setFormData({
                  ...formData,
                  changePassword: !formData.changePassword,
                })
              }
              className="mr-2"
            />
            Change Password?
          </label>
          {formData.changePassword && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Confirm Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </>
          )}
        </div>
      )}
  
      {editMode ? (
        <button
          onClick={handleUpdate}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Changes
        </button>
      ) : (
        <button
          onClick={() => setEditMode(true)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
  
  
}

export default Profile;
