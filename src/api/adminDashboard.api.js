import axios from "axios";

const getToken = () => localStorage.getItem("accessToken")

const API = axios.create({
    // Fixed the typo: dashboards (added the 'h')
    baseURL: "https://skillconnect-backend-7ftb.onrender.com/admindashboards",
});

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Removed the leading slash to ensure clean URL concatenation
export const fetchAllBatchesOfACommunity = (communityId) => API.get(`batches/${communityId}`)

// export const allEnrollmentsForACommunity = (communityId) => API.get(`/enrollments/${communityId}`)
// adminDashboard.api.js
export const allEnrollmentsForACommunity = (communityId) =>
    API.get(`enrollments/${communityId}`); // Use the path defined in your router

// adminDashboard.api.js
export const fetchActiveMentors = () => API.get('/active-mentor');
export const fetchPendingMentors = () => API.get('/pending-mentors-list');
export const approveMentor = (userId) => API.get(`/approve-mentor/${userId}`);
// adminDashboard
export const rejectMentor = (userId, data) => API.post(`/reject-mentor/${userId}`, data);