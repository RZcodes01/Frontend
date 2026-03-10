import axiosInstance from "./axiosInstance";

export const allStudents = (search = "") => axiosInstance.get(`/admin/all-students${search ? `?search=${encodeURIComponent(search)}` : ""}`);
export const toggleBanStudent = (enrollmentId) => axiosInstance.patch(`/admin/students/${enrollmentId}/toggle-ban`);