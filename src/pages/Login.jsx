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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotForm, setForgotForm] = useState({ name: "", email: "" });
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleForgotChange = (e) => {
    setForgotForm({
      ...forgotForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    try {
      setForgotLoading(true);
      // TODO: replace with your actual forgot password API call
      // await forgotPassword(forgotForm);
      setForgotSuccess("Password reset link has been sent to your email.");
    } catch (err) {
      setForgotError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setForgotLoading(false);
    }
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
      <div className="relative bg-white w-[380px] rounded-2xl shadow-xl p-8">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
          <h1 className="text-xl font-semibold text-blue-600">Skillconnect</h1>
        </div>

        {/* ── FORGOT PASSWORD FORM ── */}
        {showForgotPassword ? (
          <>
            <h2 className="text-center text-lg font-semibold mb-2">
              Forgot Password
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Enter your name and email to reset your password.
            </p>

            <form onSubmit={handleForgotSubmit}>
              {/* Name */}
              <div className="mb-4 relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={forgotForm.name}
                  onChange={handleForgotChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Email */}
              <div className="mb-4 relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={forgotForm.email}
                  onChange={handleForgotChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Error */}
              {forgotError && (
                <p className="text-red-500 text-sm mb-3 text-center">
                  {forgotError}
                </p>
              )}

              {/* Success */}
              {forgotSuccess && (
                <p className="text-green-500 text-sm mb-3 text-center">
                  {forgotSuccess}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            {/* Back to Login */}
            <p className="text-sm text-center mt-4 text-gray-500">
              Remembered your password?{" "}
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotForm({ name: "", email: "" });
                  setForgotError("");
                  setForgotSuccess("");
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                Back to Login
              </button>
            </p>
          </>
        ) : (
          /* ── LOGIN FORM ── */
          <>
            <h2 className="text-center text-lg font-semibold mb-6">
              Welcome Back
            </h2>

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
              <div className="mb-4 relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Forgot Password */}
              <div className="mb-4 text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
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

            {/* Sign Up Link */}
            <p className="text-sm text-center mt-4 text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;