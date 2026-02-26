import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/login_bg.png";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { loginUser } from "../api/auth.api";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  
  // New states for Forgot Password flow
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotData, setForgotData] = useState({ name: "", email: "" });
  const [forgotMessage, setForgotMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleForgotChange = (e) => {
    setForgotData({
      ...forgotData,
      [e.target.name]: e.target.value,
    });
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    // Simulate API call for password reset
    setForgotMessage("Reset email is sent.");
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotMessage("");
      setForgotData({ name: "", email: "" });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await loginUser(form);

      const { accessToken, user } = res.data;

      // 1. Store data
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);

        // 2. Role-Based Redirection
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "student") {
          navigate("/dashboard");
        } else if (user.role === "mentor") {
          navigate("/mentor");
        } else if (user.role === "company") {
          navigate("/company");
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3 animate-bounce-in">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Login Successful!</h3>
            <p className="text-sm text-gray-500">Redirecting you now...</p>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-[350px] rounded-2xl shadow-2xl p-6 relative">
            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Reset Password</h3>
            <p className="text-sm text-gray-500 mb-6">Enter your details to verify your account.</p>
            
            <form onSubmit={handleForgotSubmit}>
              <div className="mb-4 relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  value={forgotData.name}
                  onChange={handleForgotChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4 relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  value={forgotData.email}
                  onChange={handleForgotChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              {forgotMessage && (
                <p className="text-green-600 text-sm mb-4 text-center font-medium bg-green-50 py-2 rounded">
                  {forgotMessage}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Verify & Send Reset Link
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="relative bg-white w-[380px] rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
          <h1 className="text-xl font-semibold text-blue-600">Skillconnect</h1>
        </div>

        <h2 className="text-center text-lg font-semibold mb-6">Let's Learn</h2>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4 relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div className="mb-2 relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password (min. 8 characters)"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right mb-4">
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Forgot Password?
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* SIGN UP LINK */}
        <p className="text-sm text-center mt-4 text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;