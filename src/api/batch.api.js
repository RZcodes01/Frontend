import axios from "axios";

const getToken = () => localStorage.getItem("accessToken");

const API = axios.create({
    baseURL: "https://skillconnect-backend-7ftb.onrender.com/batches",
});

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Automatically handle Multi-part headers if sending FormData (the banner)
    if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
});

export const fetchAllBatches = () => API.get('/');

// FIXED: Removed "/community" to match backend route: router.post("/:communityId")
export const createBatch = (communityId, data) => API.post(`/${communityId}`, data);

export const updateBatch = (batchId, data) => API.put(`/${batchId}`, data);

export const deleteBatch = (batchId) => API.delete(`/${batchId}`);