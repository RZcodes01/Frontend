import React, { useEffect, useState } from "react";
import { fetchReels } from "../api/reels.api";

const QuickSkills = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReels = async () => {
      try {
        const data = await fetchReels ();
        setReels(data);
      } catch (err) {
        console.error("Error fetching reels:", err);
      } finally {
        setLoading(false);
      }
    };

    loadReels();
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        Loading reels...
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white overflow-y-scroll snap-y snap-mandatory">
      {reels.map((reel) => (
        <div
          key={reel._id}
          className="h-screen w-full flex items-center justify-center snap-start relative"
        >
          {/* Reel Container */}
          <div className="relative h-[90vh] w-[360px] max-w-full rounded-xl overflow-hidden shadow-lg">
            <video
              src={reel.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute bottom-6 left-4">
              <div className="flex items-center gap-3">
                <img
                  src={reel.creator.profileImage}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <span className="font-semibold">
                  @{reel.creator.username}
                </span>
              </div>

              {reel.caption && (
                <p className="mt-2 text-sm text-gray-300">
                  {reel.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickSkills;
