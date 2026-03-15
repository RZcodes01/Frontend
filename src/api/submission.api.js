import axiosInstance from "./axiosInstance";

// Student creates a submission (via submission route)
export const createSubmission = (data) =>
    axiosInstance.post("/submission", data);

// Student views own submissions
export const getMySubmissions = () =>
    axiosInstance.get("/submission/me");

// Mentor/Admin views submissions for a project
export const getProjectSubmissions = (projectId) =>
    axiosInstance.get(`/submission/project/${projectId}`);

// Mentor/Admin reviews a submission
export const reviewSubmission = (id, data) =>
    axiosInstance.put(`/submission/${id}/review`, data);
