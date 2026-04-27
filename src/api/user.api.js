import axiosInstance from "./axiosInstance";

export const fetchMe = () => axiosInstance.get(`/users/me`);
export const fetchDetailedProfile = () => axiosInstance.get(`/users/me/profile`);