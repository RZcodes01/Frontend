import axios from "axios";

const getToken = () => localStorage.getItem("accessToken")

const API = axios.create({
    baseURL: "https://skillconnect-backend-7ftb.onrender.com/admin",
});

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})


export const allStudents = (search = "") => API.get(`/all-students${search ? `?search=${encodeURIComponent(search)}` : ""}`);
export const toggleBanStudent = (enrollmentId) => API.patch(`/students/${enrollmentId}/toggle-ban`);