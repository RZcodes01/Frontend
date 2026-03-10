import axiosInstance from "./axiosInstance";

export const fetchDashboardStats = (communityId) =>
    axiosInstance.get("/companydashboard/stats", {
        params: communityId ? { communityId } : {},
    });

export const fetchLeaderboard = (communityId, page = 1, limit = 10, sort = "desc") =>
    axiosInstance.get("/companydashboard/leaderboard", {
        params: {
            ...(communityId ? { communityId } : {}),
            page,
            limit,
            sort,
        },
    });

export const fetchTopPerformers = (communityId) =>
    axiosInstance.get("/companydashboard/top-performers", {
        params: communityId ? { communityId } : {},
    });

export const searchStudentsAPI = (query) =>
    axiosInstance.get("/companydashboard/search", {
        params: { q: query },
    });

export const fetchStudentProfile = (studentId) =>
    axiosInstance.get(`/companydashboard/student/${studentId}`);
