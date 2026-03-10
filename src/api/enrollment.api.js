import axiosInstance from "./axiosInstance";

export const fetchMyEnrollments = () =>
    axiosInstance.get("/enrollments/my");

export const enrollCommunity = (communityId) =>
    axiosInstance.post(`/enrollments/community/${communityId}/student`);

// Enroll a mentor into a specific community
export const enrollMentorToCommunity = (communityId, userId) =>
    axiosInstance.post(`/enrollments/community/${communityId}/mentor`, { userId });

// Fetch all members of a community (including the mentor)
export const fetchCommunityMembers = (communityId) =>
    axiosInstance.get(`/enrollments/community/${communityId}/members`);