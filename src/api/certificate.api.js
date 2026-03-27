import axiosInstance from "./axiosInstance";

// Get the student's score for a specific community
export const getScore = (communityId) =>
    axiosInstance.get(`/certificate/score/${communityId}`);

// Generate a certificate (requires eligibility)
export const generateCertificate = (communityId, courseName) =>
    axiosInstance.post("/certificate/generate", { communityId, courseName });

// Get all certificates belonging to the logged-in user
export const getMyCertificates = () =>
    axiosInstance.get("/certificate/my");

// Get a single certificate by MongoDB _id
export const getCertificateById = (id) =>
    axiosInstance.get(`/certificate/detail/${id}`);

// Public — verify a certificate by its unique certificateId string
export const verifyCertificate = (certId) =>
    axiosInstance.get(`/certificate/verify/${certId}`);
