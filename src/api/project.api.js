import axios from "axios";

const getToken = () => localStorage.getItem("accessToken")

const API = axios.create({
    baseURL: "https://skillconnect-backend-7ftb.onrender.com/projects",
});

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const fetchProjectById = (id) => API.get(`/${id}`)

// Create project
export const createProject = (communityId, data) =>
    API.post(`/${communityId}`, data);

// Update project
export const updateProject = (projectId, data) =>
    API.put(`/${projectId}`, data);

// Delete project
export const deleteProject = (projectId) =>
    API.delete(`/${projectId}`);