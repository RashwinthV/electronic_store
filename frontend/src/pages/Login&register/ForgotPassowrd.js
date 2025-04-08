import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // for navigation

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!email.trim()) {
      return setStatus({ type: "error", message: "Email is required" });
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_IMAGE_URL}/mail/send-password`,
        { email }
      );
      setStatus({ type: "success", message: res.data.message });
      setShouldRedirect(true); // start countdown
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong. Try again.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldRedirect) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            navigate("/login");
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [shouldRedirect, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Forgot Password
        </h2>

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {status.message && (
            <div
              className={`text-sm ${
                status.type === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {status.message}
              {shouldRedirect && (
                <div className="text-gray-600 mt-1">
                  Redirecting to login in {countdown} second
                  {countdown > 1 ? "s" : ""}...
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            {loading ? "Sending..." : "Send Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
