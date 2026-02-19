import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { fetchAllCommunities } from "../api/community.api";
import { useNavigate } from "react-router-dom";

export default function Community() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    const getCommunities = async () => {
      try {
        const res = await fetchAllCommunities();
        setCommunities(res.data.communities);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load communities"
        );
      } finally {
        setLoading(false);
      }
    };

    getCommunities();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">
        Loading communities...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <section
      id="community"
      className="relative py-20 bg-neutral-950 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-sm rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400">
            👥 Join Active Communities
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your{" "}
            <span className="text-cyan-400">
              Community
            </span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Connect with mentors and peers, learn together, build real projects,
            and showcase your work to top companies
          </p>
        </div>

        {/* Communities Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {communities.map((community, index) => {
            const gradients = [
              "from-cyan-400 to-blue-500",
              "from-cyan-500 to-cyan-400",
              "from-blue-400 to-cyan-500",
              "from-cyan-400 to-blue-400",
              "from-blue-500 to-cyan-400",
              "from-cyan-300 to-blue-500",
            ];

            const borderColors = [
              "border-cyan-400/30",
              "border-cyan-400/20",
              "border-cyan-400/30",
              "border-cyan-400/20",
              "border-cyan-400/30",
              "border-cyan-400/20",
            ];

            const color = gradients[index % gradients.length];
            const borderColor = borderColors[index % borderColors.length];

            return (
              <div onClick={()=> navigate(`/community/${community._id}`)}
                key={community._id}
                className={`group relative bg-neutral-900 border ${borderColor} rounded-3xl p-6 hover:bg-neutral-800 hover:border-cyan-400/60 transition duration-300 transform hover:-translate-y-2 cursor-pointer`}
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/10 group-hover:scale-110 transition`}
                >
                  {community.icon || "👥"}
                </div>

                {/* Community Name */}
                <h3 className="text-2xl font-bold text-white mb-3">
                  {community.name}
                </h3>

                {/* Stats */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Members</span>
                    <span className="text-cyan-400 font-semibold">
                      {community.members || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Mentors</span>
                    <span className="text-cyan-300 font-semibold">
                      {community.mentors || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Projects</span>
                    <span className="text-blue-400 font-semibold">
                      {community.projects || 0}
                    </span>
                  </div>
                </div>

                {/* Live Badge */}
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  Live sessions weekly
                </div>

                {/* Join Button */}
                <button
                  className="w-full py-3 rounded-xl font-semibold bg-cyan-400 hover:bg-cyan-300 text-black transition shadow-lg shadow-cyan-500/20 hover:scale-105"
                >
                  Join Community
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}