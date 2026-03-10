import axiosInstance from "./axiosInstance";

export const fetchAllBatches = () => axiosInstance.get('/batches/');

// FIXED: Removed "/community" to match backend route: router.post("/:communityId")
export const createBatch = (communityId, data) => axiosInstance.post(`/batches/${communityId}`, data);

export const updateBatch = (batchId, data) => axiosInstance.put(`/batches/${batchId}`, data);

export const deleteBatch = (batchId) => axiosInstance.delete(`/batches/${batchId}`);

export const fetchMentorAssignedBatches = () => axiosInstance.get("/batches/mentor-batches");