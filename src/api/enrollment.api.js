import axios from "axios";

const getToken = () => localStorage.getItem("accessToken")

const API = axios.create({
    baseURL: "https://skillconnect-backend-7ftb.onrender.com/enrollments",
});

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const fetchMyEnrollments = () =>
    API.get("/my");

export const enrollCommunity = (communityId) =>
    API.post(`/community/${communityId}/student`);