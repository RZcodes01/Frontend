import axiosInstance from "./axiosInstance";

export const fetchMyEnrollments = () =>
    axiosInstance.get("/enrollments/my");

export const enrollCommunity = (communityId) =>
    axiosInstance.post(`/enrollments/community/${communityId}/student`);

// Enroll a mentor into a specific community
export const enrollMentorToCommunity = (communityId, userId) =>
    axiosInstance.post(`/enrollments/community/${communityId}/mentor`, { userId });

// Admin: list/update/remove mentor assignments
export const fetchMentorAssignments = () =>
    axiosInstance.get("/enrollments/mentor-assignments");

export const updateMentorAssignment = (enrollmentId, data) =>
    axiosInstance.put(`/enrollments/mentor-assignments/${enrollmentId}`, data);

export const removeMentorAssignment = (enrollmentId) =>
    axiosInstance.delete(`/enrollments/mentor-assignments/${enrollmentId}`);

// Fetch all members of a community (including the mentor)
export const fetchCommunityMembers = (communityId) =>
    axiosInstance.get(`/enrollments/community/${communityId}/members`);

export const upgradeEnrollmentToPro = (communityId) =>
    axiosInstance.patch("/enrollments/upgrade", { communityId });