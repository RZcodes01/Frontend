import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import bgImage from "../assets/login_bg.png";
import { forgotPassword, verifyResetOtp, resetPassword } from "../api/auth.api";
import { toast } from "sonner";

const COOLDOWN_SECONDS = 60;

const ForgotPassword = () => {
  // Step 1 = email, Step 2 = OTP, Step 3 = new password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const startCooldown = (seconds) => {
    setCooldown(seconds);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Step 1: Send OTP ──────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Please enter your email");

    setLoading(true);
    try {
      await forgotPassword({ email: email.trim() });
      toast.success("If an account exists, a reset code has been sent to your email");
      setStep(2);
      startCooldown(COOLDOWN_SECONDS);
    } catch (err) {
      const data = err?.response?.data;
      if (data?.retryAfterSeconds) {
        startCooldown(data.retryAfterSeconds);
      }
      toast.error(data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────
  const handleResend = async () => {
    if (cooldown > 0 || loading) return;

    setLoading(true);
    try {
      await forgotPassword({ email: email.trim() });
      toast.success("Reset code resent to your email");
      startCooldown(COOLDOWN_SECONDS);
      setOtp("");
    } catch (err) {
      const data = err?.response?.data;
      if (data?.retryAfterSeconds) {
        startCooldown(data.retryAfterSeconds);
      }
      toast.error(data?.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return toast.error("Please enter a valid 6-digit code");

    setLoading(true);
    try {
      const res = await verifyResetOtp({ email: email.trim(), otp });
      setResetToken(res.data.resetToken);
      toast.success("Code verified! Set your new password");
      setStep(3);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      await resetPassword({ resetToken, newPassword });
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Step indicator ────────────────────────────────────────────
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= s
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            {s}
          </div>
          {s < 3 && (
            <div
              className={`w-8 h-0.5 ${
                step > s ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="relative bg-white w-full max-w-[400px] rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-950 flex items-center justify-center shadow-md">
            <svg
              viewBox="0 0 100 100"
              className="w-8 h-8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="50,15 85,35 50,55 15,35" fill="#fbbf24" />
              <rect x="35" y="55" width="30" height="8" rx="4" fill="#fbbf24" />
              <line x1="70" y1="35" x2="78" y2="60" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="78" cy="68" rx="8" ry="6" stroke="#fbbf24" strokeWidth="3" />
            </svg>
          </div>
          <h1 className="font-black text-2xl tracking-tight">
            <span className="text-blue-950">Skill</span>
            <span className="text-amber-400">Connect</span>
          </h1>
        </div>

        <StepIndicator />

        {/* ── STEP 1: Enter Email ────────────────────────────── */}
        {step === 1 && (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <FaEnvelope className="text-blue-600 text-xl" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Forgot Password?</h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter your email and we'll send you a verification code
              </p>
            </div>

            <form onSubmit={handleSendOtp}>
              <div className="mb-5 relative">
                <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          </>
        )}

        {/* ── STEP 2: Verify OTP ─────────────────────────────── */}
        {step === 2 && (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <FaShieldAlt className="text-blue-600 text-xl" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Enter Verification Code</h2>
              <p className="text-sm text-gray-500 mt-1">
                We sent a 6-digit code to <span className="text-blue-600 font-medium">{email}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 6) setOtp(val);
                }}
                maxLength={6}
                required
                className="w-full mb-4 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-center text-xl tracking-[0.4em] font-bold transition-all"
              />

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Didn't receive the code?</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || loading}
                className="text-blue-600 hover:underline text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => { setStep(1); setOtp(""); }}
              className="mt-3 w-full text-center text-sm text-gray-400 hover:text-gray-600 font-medium"
            >
              ← Change email
            </button>
          </>
        )}

        {/* ── STEP 3: New Password ───────────────────────────── */}
        {step === 3 && (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                <FaLock className="text-green-600 text-xl" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Set New Password</h2>
              <p className="text-sm text-gray-500 mt-1">
                Choose a strong password for your account
              </p>
            </div>

            <form onSubmit={handleResetPassword}>
              <div className="mb-4 relative">
                <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="password"
                  placeholder="New Password (min. 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>

              <div className="mb-5 relative">
                <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>

              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-red-500 text-xs mb-3 text-center font-medium">
                  Passwords do not match
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors"
          >
            <FaArrowLeft className="text-xs" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
