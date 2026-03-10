import axiosInstance from "./axiosInstance";

export const fetchAllCommunities = () => axiosInstance.get(`/community/`);

export const fetchCommunityById = (id) => axiosInstance.get(`/community/${id}`);

export const createCommunity = (formData) => axiosInstance.post("/community/", formData);

export const updateCommunity = (id, data) => axiosInstance.put(`/community/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });