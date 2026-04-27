import axiosInstance from "./axiosInstance";

export const loginUser = (data) => axiosInstance.post(`/auth/login`, data);

export const registerUser = (data) => axiosInstance.post(`/auth/register`, data);

export const verifyOTP = (data) => axiosInstance.post("/auth/verify-otp", data);

export const resendOTP = (data) => axiosInstance.post("/auth/resend-otp", data);

export const applyForMentor = (data) => axiosInstance.post("/auth/mentor-register", data);

export const applyForCompany = (data) => axiosInstance.post("/auth/company-register", data);

// Password reset flow
export const forgotPassword = (data) => axiosInstance.post("/auth/forgot-password", data);

export const verifyResetOtp = (data) => axiosInstance.post("/auth/verify-reset-otp", data);

export const resetPassword = (data) => axiosInstance.post("/auth/reset-password", data);