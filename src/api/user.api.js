import axiosInstance from "./axiosInstance";

export const fetchMe = () => axiosInstance.get(`/users/me`);