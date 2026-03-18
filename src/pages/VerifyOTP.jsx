import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyOTP, resendOTP } from "../api/auth.api";

const COOLDOWN_SECONDS = 60;

const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const timerRef = useRef(null);

    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.error("Email not found. Please sign up again.");
            navigate("/register");
        }
    }, [email, navigate]);

    // Start cooldown on mount (OTP was just sent)
    useEffect(() => {
        startCooldown(COOLDOWN_SECONDS);
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

    const handleVerify = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);
        try {
            await toast.promise(
                verifyOTP({ email, otp }),
                {
                    loading: "Verifying OTP...",
                    success: "Account verified successfully!",
                    error: (err) =>
                        err?.response?.data?.message || "OTP verification failed",
                }
            );
            navigate("/login");
        } catch (error) {
            // Error already shown by toast.promise
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0 || resending) return;

        setResending(true);
        try {
            await resendOTP({ email });
            toast.success("OTP resent to your email");
            startCooldown(COOLDOWN_SECONDS);
            setOtp("");
        } catch (error) {
            const data = error?.response?.data;
            if (data?.retryAfterSeconds) {
                startCooldown(data.retryAfterSeconds);
                toast.error(data.message);
            } else {
                toast.error(data?.message || "Failed to resend OTP");
            }
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-zinc-800 px-4">
            <form
                onSubmit={handleVerify}
                className="w-full max-w-md px-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl py-8 shadow-2xl"
            >
                <h1 className="text-3xl text-center mb-2 text-white font-bold">
                    Verify OTP
                </h1>
                <p className="text-gray-300 mb-6 text-center">
                    Enter the OTP sent to <span className="text-blue-400">{email}</span>
                </p>

                <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 6) setOtp(val);
                    }}
                    maxLength={6}
                    required
                    className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition text-center text-xl tracking-widest"
                />

                <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-300 mb-1">
                        Didn't receive the code?
                    </p>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={cooldown > 0 || resending}
                        className="text-blue-400 hover:underline text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {resending
                            ? "Sending..."
                            : cooldown > 0
                                ? `Resend OTP in ${cooldown}s`
                                : "Resend OTP"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VerifyOTP;