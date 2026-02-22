import axios from "axios";

const API = axios.create({ baseURL: "https://skillconnect-backend-7ftb.onrender.com/modules" });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const addModule = (communityId, data) => API.post(`/${communityId}`, data);
export const updateModule = (communityId, moduleId, data) => API.put(`/${communityId}/${moduleId}`, data);
export const deleteModule = (communityId, moduleId) => API.delete(`/${communityId}/${moduleId}`);