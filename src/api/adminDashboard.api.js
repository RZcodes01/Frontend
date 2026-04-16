import axiosInstance from "./axiosInstance";

export const fetchAllBatchesOfACommunity = (communityId) => axiosInstance.get(`/admindashboards/batches/${communityId}`);

export const allEnrollmentsForACommunity = (communityId) =>
    axiosInstance.get(`/admindashboards/enrollments/${communityId}`);

// Mentor management
export const fetchActiveMentors = () => axiosInstance.get('/admindashboards/active-mentor');
export const fetchPendingMentors = () => axiosInstance.get('/admindashboards/pending-mentors-list');
export const approveMentor = (userId) => axiosInstance.get(`/admindashboards/approve-mentor/${userId}`);
export const rejectMentor = (userId, data) => axiosInstance.post(`/admindashboards/reject-mentor/${userId}`, data);

// Company management
export const fetchPendingCompanies = () => axiosInstance.get('/admindashboards/pending-companies-list');
export const approveCompany = (userId) => axiosInstance.get(`/admindashboards/approve-company/${userId}`);
export const rejectCompany = (userId, data) => axiosInstance.post(`/admindashboards/reject-company/${userId}`, data);
export const fetchActiveCompanies = () => axiosInstance.get('/admindashboards/active-companies');
