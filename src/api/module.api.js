import axiosInstance from "./axiosInstance";

export const addModule = (communityId, data) => axiosInstance.post(`/modules/${communityId}`, data);
export const updateModule = (communityId, moduleId, data) => axiosInstance.put(`/modules/${communityId}/${moduleId}`, data);
export const deleteModule = (communityId, moduleId) => axiosInstance.delete(`/modules/${communityId}/${moduleId}`);