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
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading communities...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <section
      id="community"
      className="relative py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-pink-500/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-sm rounded-full bg-cyan-500/20 backdrop-blur border border-cyan-400/30 text-cyan-300">
            👥 Join Active Communities
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Community
            </span>
          </h2>
          <p className="text-slate-200 max-w-2xl mx-auto">
            Connect with mentors and peers, learn together, build real projects,
            and showcase your work to top companies
          </p>
        </div>

        {/* Communities Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {communities.map((community, index) => {
            const gradients = [
              "from-cyan-400 to-blue-500",
              "from-purple-400 to-pink-500",
              "from-green-400 to-cyan-500",
              "from-orange-400 to-red-500",
              "from-blue-400 to-purple-500",
              "from-yellow-400 to-orange-500",
            ];

            const borderColors = [
              "border-cyan-400/30",
              "border-purple-400/30",
              "border-green-400/30",
              "border-orange-400/30",
              "border-blue-400/30",
              "border-yellow-400/30",
            ];

            const color = gradients[index % gradients.length];
            const borderColor = borderColors[index % borderColors.length];

            return (
              <div onClick={()=> navigate(`/community/${community._id}`)}
                key={community._id}
                className={`group relative bg-white/5 backdrop-blur-xl border ${borderColor} rounded-3xl p-6 hover:bg-white/10 transition duration-300 transform hover:-translate-y-2`}
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition`}
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
                    <span className="text-slate-400">Members</span>
                    <span className="text-cyan-400 font-semibold">
                      {community.members || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Mentors</span>
                    <span className="text-purple-400 font-semibold">
                      {community.mentors || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Projects</span>
                    <span className="text-pink-400 font-semibold">
                      {community.projects || 0}
                    </span>
                  </div>
                </div>

                {/* Live Badge */}
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-xs">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Live sessions weekly
                </div>

                {/* Join Button */}
                <button
                  className={`w-full py-3 rounded-xl font-semibold bg-gradient-to-r ${color} text-white hover:scale-105 transition shadow-lg`}
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
