import React, { useEffect, useState } from "react";
import { fetchAllCommunities } from "../api/community.api";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Users, ArrowRight, Sparkles } from "lucide-react";

export default function Community() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState(location.state?.search || "");

  useEffect(() => {
    const getCommunities = async () => {
      try {
        const res = await fetchAllCommunities();
        setCommunities(res.data.communities);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load communities");
      } finally {
        setLoading(false);
      }
    };
    getCommunities();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="text-neutral-400 font-medium animate-pulse">Scanning the network...</p>
      </div>
    );
  }

  const filteredCommunities = communities.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="relative min-h-screen py-24 bg-neutral-950 overflow-hidden selection:bg-cyan-500/30">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
  
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Tribe</span>
          </h2>

          <p className="text-neutral-400 text-lg leading-relaxed mb-10">
            Join elite circles of developers, creators, and innovators.
            Build faster, together.
          </p>

          {/* Enhanced Search Bar */}
          <div className="relative max-w-xl mx-auto group">
            <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-5 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by name, tech, or interest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filteredCommunities.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-neutral-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-neutral-800 shadow-inner">
              <Search size={32} className="text-neutral-700" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No matches found</h3>
            <p className="text-neutral-500 mb-8">Try adjusting your keywords or browse everything.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-cyan-400 transition-all active:scale-95"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pb-20">
            {filteredCommunities.map((community) => (
              <div
                key={community._id}
                onClick={() => navigate(`/community/${community._id}`)}
                className="group relative flex flex-col bg-neutral-900/50 border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 hover:bg-neutral-900/80 hover:border-cyan-500/30 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                {/* Banner Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  {community.bannerImage ? (
                    <img
                      src={community.bannerImage}
                      alt={community.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900" />
                  )}
                  {/* Glass Member Badge */}
                  <div className="absolute top-4 left-4 backdrop-blur-md bg-black/40 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <Users size={14} className="text-cyan-400" />
                    <span className="text-[11px] font-black text-white uppercase tracking-wider">
                      {community.membersCount || 0} Members
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                </div>

                {/* Body Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors leading-tight">
                    {community.name}
                  </h3>

                  <p className="text-neutral-400 text-sm line-clamp-2 mb-8 leading-relaxed">
                    {community.description || "A hub for high-growth individuals to share insights and build projects."}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center">
                          <div className="w-full h-full rounded-full bg-gradient-to-tr from-neutral-700 to-neutral-600" />
                        </div>
                      ))}
                      <span className="pl-4 text-[11px] font-bold text-neutral-500 uppercase tracking-tighter">+ Active</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-black text-cyan-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      Enter <ArrowRight size={16} />
                    </div>
                  </div>
                </div>

                {/* Hover Glow Line */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}