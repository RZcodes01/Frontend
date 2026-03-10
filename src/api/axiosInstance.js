import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://skillconnect-backend-7ftb.onrender.com",
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Automatically set multipart headers for FormData
    if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
});

export default axiosInstance;
