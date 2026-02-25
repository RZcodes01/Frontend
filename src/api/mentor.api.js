import axios from "axios";

const getToken = () => localStorage.getItem("accessToken")

const API = axios.create({
    baseURL: "https://skillconnect-backend-7ftb.onrender.com/mentordashboards",
});

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const myAssignedCommunities = () => API.get("/assigned-communities")
export const myAllStudents = () => API.get("/all-students")
export const allBatches = () => API.get("/all-batches")

export const allProjectSubmissions = (projectId) => API.get(`/all-submissions/${projectId}`)

export const getMentorProjects = () => API.get("/all-projects");

export const gradeSubmission = (submissionId, data) => API.put(`/grade-submission/${submissionId}`, data);


