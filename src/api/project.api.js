import axiosInstance from "./axiosInstance";

export const fetchProjectById = (id) => axiosInstance.get(`/projects/${id}`);

// Create project
export const createProject = (communityId, data) =>
    axiosInstance.post(`/projects/${communityId}`, data);

// Update project
export const updateProject = (projectId, data) =>
    axiosInstance.put(`/projects/${projectId}`, data);

// Delete project
export const deleteProject = (projectId) =>
    axiosInstance.delete(`/projects/${projectId}`);