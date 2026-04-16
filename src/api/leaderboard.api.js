import axiosInstance from "./axiosInstance";

/**
 * Fetch paginated leaderboard for a specific community.
 * Score is computed server-side from reviewed submission grades.
 */
export const fetchLeaderboard = (communityId, page = 1, limit = 10) =>
    axiosInstance.get("/leaderboard", {
        params: { communityId, page, limit }
    });

/**
 * Fetch communities the current user is enrolled in.
 * Used to populate the community selector dropdown.
 */
export const fetchMyLeaderboardCommunities = () =>
    axiosInstance.get("/leaderboard/communities");
