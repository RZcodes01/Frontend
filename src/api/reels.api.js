import axiosInstance from "./axiosInstance";

export const fetchReels = async () => {
    const res = await axiosInstance.get("/reelr/reels/all");
    return res.data.allReels;
};

export const uploadReel = async (formData) => {
    const res = await axiosInstance.post("/reelr/reels/upload", formData);
    return res.data;
};

export const softDeleteReel = (id) =>
    axiosInstance.delete(`/reelr/reels/delete/${id}`);

export const toggleDeleteReel = (id) =>
    axiosInstance.patch(`/reelr/reels/${id}/toggle-delete`);

export const fetchReelsAdmin = async () => {
    const res = await axiosInstance.get("/reelr/reels/all?includeDeleted=true");
    return res.data.allReels;
};
