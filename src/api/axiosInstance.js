import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:4000",
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Let the browser set Content-Type with proper boundary for FormData
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    }

    return config;
});

export default axiosInstance;
