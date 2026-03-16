import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyOTP } from "../api/auth.api";


const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.error("Email not found. Please sign up again.");
            navigate("/register");
        }
    }, [email, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();

        if (!otp) {
            toast.error("Please enter OTP");
            return;
        }

        try {
            await toast.promise(
                verifyOTP({ email, otp }),
                {
                    loading: "Verifying OTP...",
                    success: "Account verified successfully",
                    error: (err) =>
                        err?.response?.data?.message || "OTP verification failed",
                }
            );

            navigate("/login"); // UNCOMMENTED - Navigate after success
        } catch (error) {
            console.error("OTP verification failed:", error);
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
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition text-center text-xl tracking-widest"
                />

                <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:opacity-90 transition"
                >
                    Verify OTP
                </button>

                <p className="text-sm text-gray-300 text-center mt-6">
                    Didn't receive the code?
                </p>
                <span
                    className="text-blue-400 hover:underline flex justify-center text-sm cursor-pointer"
                    onClick={() => toast("Resend logic not implemented yet")}
                >
                    Resend OTP
                </span>
            </form>
        </div>
    );
};

export default VerifyOTP;