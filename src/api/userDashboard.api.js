import axios from "axios";

const getToken = () => localStorage.getItem("accessToken")

const API = axios.create({
    baseURL: "https://skillconnect-backend-7ftb.onrender.com/userdashboards",
});

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const fetchMyCommunities = () => API.get("/my")

export const fetchMyBatches = () => API.get("/student-batches");

export const fetchMyProjects = () =>
    API.get("/my-projects");