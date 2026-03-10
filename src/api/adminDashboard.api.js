import axiosInstance from "./axiosInstance";

export const fetchAllBatchesOfACommunity = (communityId) => axiosInstance.get(`/admindashboards/batches/${communityId}`);

export const allEnrollmentsForACommunity = (communityId) =>
    axiosInstance.get(`/admindashboards/enrollments/${communityId}`);

export const fetchActiveMentors = () => axiosInstance.get('/admindashboards/active-mentor');
export const fetchPendingMentors = () => axiosInstance.get('/admindashboards/pending-mentors-list');
export const approveMentor = (userId) => axiosInstance.get(`/admindashboards/approve-mentor/${userId}`);
export const rejectMentor = (userId, data) => axiosInstance.post(`/admindashboards/reject-mentor/${userId}`, data);
