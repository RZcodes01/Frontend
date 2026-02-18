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