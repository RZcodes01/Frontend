import axiosInstance from "./axiosInstance";

export const myAssignedCommunities = () => axiosInstance.get("/mentordashboards/assigned-communities");
export const myAllStudents = () => axiosInstance.get("/mentordashboards/all-students");
export const allBatches = () => axiosInstance.get("/mentordashboards/all-batches");

export const allProjectSubmissions = (projectId) => axiosInstance.get(`/mentordashboards/all-submissions/${projectId}`);

export const getMentorProjects = () => axiosInstance.get("/mentordashboards/all-projects");

export const gradeSubmission = (submissionId, data) => axiosInstance.put(`/mentordashboards/grade-submission/${submissionId}`, data);
