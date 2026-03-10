import axiosInstance from "./axiosInstance";

export const fetchReels = async () => {
    const res = await axiosInstance.get("/reelr/reels/all");
    return res.data.allReels;
};

export const uploadReel = async (formData) => {
    const res = await axiosInstance.post("/reelr/reels/upload", formData);
    return res.data;
};
