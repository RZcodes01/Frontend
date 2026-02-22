import axios from "axios";

const getToken = () => localStorage.getItem("accessToken")

const API = axios.create({
    baseURL: "https://skillconnect-backend-7ftb.onrender.com/admindashboards",
});

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const fetchAllBatchesOfACommunity = (communityId) => API.get(`batches/${communityId}`)

export const allEnrollmentsForACommunity = (communityId) =>
    API.get(`enrollments/${communityId}`);

export const fetchActiveMentors = () => API.get('/active-mentor');
export const fetchPendingMentors = () => API.get('/pending-mentors-list');
export const approveMentor = (userId) => API.get(`/approve-mentor/${userId}`);
export const rejectMentor = (userId, data) => API.post(`/reject-mentor/${userId}`, data);

