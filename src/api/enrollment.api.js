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

// adminDashboard.api.js

// Enroll a mentor into a specific community
export const enrollMentorToCommunity = (communityId, userId) =>
    API.post(`/community/${communityId}/mentor`, { userId });

// Fetch all members of a community (including the mentor)
export const fetchCommunityMembers = (communityId) =>
    API.get(`/community/${communityId}/members`);