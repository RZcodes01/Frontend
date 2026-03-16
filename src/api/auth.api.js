import axiosInstance from "./axiosInstance";

export const loginUser = (data) => axiosInstance.post(`/auth/login`, data);

export const registerUser = (data) => axiosInstance.post(`/auth/register`, data);

export const verifyOTP = (data) => axiosInstance.post("/auth/verify-otp", data);