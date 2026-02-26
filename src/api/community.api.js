import axios from "axios";

const getToken = () => localStorage.getItem("accessToken")

const API = axios.create({
    baseURL: "https://skillconnect-backend-7ftb.onrender.com/community",
});

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const fetchAllCommunities = () => API.get(`/`)

export const fetchCommunityById = (id) => API.get(`/${id}`)

export const createCommunity = (formData) => API.post("/", formData);

export const updateCommunity = (id, data) => API.put(`/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });