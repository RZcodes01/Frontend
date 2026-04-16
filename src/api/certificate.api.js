import axiosInstance from "./axiosInstance";

// Get the student's computed score for a specific community
export const getScore = (communityId) =>
    axiosInstance.get(`/api/certificates/score/${communityId}`);

// Generate a certificate (requires eligibility — score >= 60)
export const generateCertificate = (communityId, courseName) =>
    axiosInstance.post("/api/certificates/generate", { communityId, courseName });

// Get all certificates belonging to the logged-in user
export const getMyCertificates = () =>
    axiosInstance.get("/api/certificates/my");

// Get a single certificate by MongoDB _id
export const getCertificateById = (id) =>
    axiosInstance.get(`/api/certificates/detail/${id}`);

// Public — verify a certificate by its unique certificateId string
export const verifyCertificate = (certId) =>
    axiosInstance.get(`/api/certificates/verify/${certId}`);
