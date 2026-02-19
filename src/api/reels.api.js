import axios from "axios";

const getToken = () => localStorage.getItem("accessToken");

const API = axios.create({
    baseURL: "https://skillconnect-backend-7ftb.onrender.com",
});

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchReels = async () => {
    const res = await API.get("/reelr/reels/all");
    return res.data.allReels;
};

export const uploadReel = async (formData) => {
    const res = await API.post("/reelr/reels/upload", formData);
    return res.data;
};
