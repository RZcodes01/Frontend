import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { fetchAllCommunities } from "../api/community.api";
import { useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";

export default function Community() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Pick up the search query passed from the Hero search bar
  const [searchQuery, setSearchQuery] = useState(
    location.state?.search || ""
  );

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

  const filteredCommunities = communities.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-sm rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400">
            👥 Join Active Communities
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your{" "}
            <span className="text-cyan-400">Community</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto mb-8">
            Connect with mentors and peers, learn together, build real projects,
            and showcase your work to top companies
          </p>

          {/* Search Bar — also lets user refine search on this page */}
          <div className="relative max-w-md mx-auto">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search communities e.g. Python, Design..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Communities Grid or Not Found */}
        {filteredCommunities.length === 0 && searchQuery ? (
          <div className="text-center py-20 max-w-sm mx-auto">
            <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Search size={26} className="text-neutral-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No community found
            </h3>
            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
              We don't have a{" "}
              <span className="text-cyan-400 font-medium">
                "{searchQuery}"
              </span>{" "}
              community yet — but we're always growing! Check back soon or
              explore what's available.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold rounded-xl transition text-sm"
            >
              Browse all communities
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {filteredCommunities.map((community, index) => {
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
                <div
                  onClick={() => navigate(`/community/${community._id}`)}
                  key={community._id}
                  className={`group relative bg-neutral-900 border ${borderColor} rounded-3xl p-6 hover:bg-neutral-800 hover:border-cyan-400/60 transition duration-300 transform hover:-translate-y-2 cursor-pointer`}
                >
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
                  <button className="w-full py-3 rounded-xl font-semibold bg-cyan-400 hover:bg-cyan-300 text-black transition shadow-lg shadow-cyan-500/20 hover:scale-105">
                    Join Community
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}