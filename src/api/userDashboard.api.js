import axiosInstance from "./axiosInstance";

export const fetchMyCommunities = () => axiosInstance.get("/userdashboards/my");

export const fetchMyBatches = () => axiosInstance.get("/userdashboards/student-batches");

export const fetchMyProjects = () =>
    axiosInstance.get("/userdashboards/my-projects");