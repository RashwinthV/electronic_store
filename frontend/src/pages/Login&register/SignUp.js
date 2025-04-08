import React, { useState } from "react";
import loginIcons from "../../assest/signin.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../../common";
import { toast } from "react-toastify";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [data, setData] = useState({
    name: "",
    login: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    keycloak_id: "",
    phoneNo: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadPic = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      let profilePicUrl = "";

      if (selectedFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", selectedFile);

        const res = await fetch(`${process.env.REACT_APP_IMAGE_URL}/uploadimage/user`, {
          method: "POST",
          body: formDataUpload,
        });

        const imgRes = await res.json();
        if (imgRes.success) {
          profilePicUrl = imgRes.url;
        } else {
          toast.error("Profile picture upload failed");
          return;
        }
      }

      const payload = {
        name: data.name,
        login: data.login,
        email: data.email,
        password: data.password,
        profilePic: profilePicUrl,
        role: data.role,
        keycloak_id: data.keycloak_id,
        phoneNo: data.phoneNo,
        addresses: {
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        },
      };

      const response = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        navigate("/login");
      } else {
        toast.error(result.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <section id="signup">
      <div className="mx-auto container p-4">
        <div className="bg-white p-5 w-full max-w-md mx-auto">
          {/* Profile Pic */}
          <div className="w-20 h-20 mx-auto relative overflow-hidden rounded-full">
           
            <label>
              <div className="text-xs bg-slate-200 text-center cursor-pointer absolute bottom-0 w-full">
                 <img
              src={selectedFile ? URL.createObjectURL(selectedFile) : loginIcons}
              alt="profile"
              className="w-full h-full object-cover"
            />
              </div>
              <input type="file" className="hidden" onChange={handleUploadPic} />
            </label>
          </div>

          {/* Form */}
          <form className="pt-6 flex flex-col gap-3" onSubmit={handleSubmit}>
            <Input label="Full Name" name="name" value={data.name} onChange={handleOnChange} />
            <Input label="Email" type="email" name="email" value={data.email} onChange={handleOnChange} required />
            <Input label="Phone Number" type="tel" name="phoneNo" value={data.phoneNo} onChange={handleOnChange} />

            {/* Address Fields */}
            <div className="grid grid-cols-1 gap-2">
              <Input label="Address" name="address" value={data.address} onChange={handleOnChange} />
              <Input label="City" name="city" value={data.city} onChange={handleOnChange} />
              <Input label="Postal Code" name="postalCode" value={data.postalCode} onChange={handleOnChange} />
              <Input label="Country" name="country" value={data.country} onChange={handleOnChange} />
            </div>

            {/* Auth Fields */}
            <PasswordInput
              label="Password"
              name="password"
              value={data.password}
              onChange={handleOnChange}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleOnChange}
              show={showConfirmPassword}
              toggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />
            <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 mt-4 rounded-full mx-auto block hover:scale-105 transition-all">
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-red-600 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

const Input = ({ label, type = "text", name, value, onChange, required = true }) => (
  <div className="grid">
    <label>{label}:</label>
    <div className="bg-slate-100 p-2">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full h-full outline-none bg-transparent"
      />
    </div>
  </div>
);

const PasswordInput = ({ label, name, value, onChange, show, toggle }) => (
  <div>
    <label>{label}:</label>
    <div className="bg-slate-100 p-2 flex">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full h-full outline-none bg-transparent"
      />
      <div className="cursor-pointer text-xl ml-2" onClick={toggle}>
        {show ? <FaEyeSlash /> : <FaEye />}
      </div>
    </div>
  </div>
);

export default SignUp;
