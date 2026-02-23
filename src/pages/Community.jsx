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
      <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
        <p className="text-blue-500 font-semibold text-base animate-pulse">Loading</p>
      </div>
    );
  }

  const filteredCommunities = communities.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="relative min-h-screen py-16 md:py-24 bg-blue-50 overflow-hidden selection:bg-amber-400/30">

      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/60 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-200/40 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">

          {/* Adjusted font size for mobile */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-blue-950 mb-4 md:mb-6 tracking-tight px-2">
            Discover Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-amber-500">
              Tribe
            </span>
          </h2>

          <p className="text-blue-600 text-lg md:text-xl leading-relaxed mb-8 md:mb-10 font-medium px-4">
            Join elite circles of developers, creators, and innovators.
            <br className="hidden sm:block" /> Build faster, together.
          </p>

          {/* Enhanced Search Bar */}
          <div className="relative max-w-xl mx-auto group px-2">
            <div className="absolute inset-0 bg-amber-400/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-5 text-blue-400 group-focus-within:text-amber-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by name, tech, or interest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-blue-100/80 backdrop-blur-xl border-2 border-blue-200 rounded-2xl text-blue-950 text-base font-medium placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filteredCommunities.length === 0 ? (
          <div className="text-center py-16 md:py-20">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-200 shadow-inner">
              <Search size={28} className="text-blue-300" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-blue-900 mb-3">No matches found</h3>
            <p className="text-blue-500 text-base md:text-lg font-medium mb-8">Try adjusting your keywords or browse everything.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-8 py-3 bg-blue-900 text-amber-400 font-black text-base rounded-xl hover:bg-blue-800 transition-all active:scale-95"
            >
              Reset Search
            </button>
          </div>
        ) : (
          /* Grid adapts from 1 column to 3 columns based on screen width */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto pb-20">
            {filteredCommunities.map((community) => (
              <div
                key={community._id}
                onClick={() => navigate(`/community/${community._id}`)}
                className="group relative flex flex-col bg-white border-2 border-blue-300 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-amber-400 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(30,58,95,0.2)] cursor-pointer shadow-md"
              >
                {/* Banner Image */}
                <div className="relative h-40 md:h-48 w-full overflow-hidden">
                  {community.bannerImage ? (
                    <img
                      src={community.bannerImage}
                      alt={community.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-800 to-blue-950" />
                  )}
                  {/* Glass Member Badge */}
                  <div className="absolute top-4 left-4 backdrop-blur-md bg-blue-950/60 border border-blue-600/40 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <Users size={14} className="text-amber-400" />
                    <span className="text-[10px] md:text-xs font-black text-blue-50 uppercase tracking-wider">
                      {community.membersCount || 0} Members
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/20 to-transparent" />
                </div>

                {/* Body Content */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 className="text-xl md:text-2xl font-black text-blue-900 mb-3 group-hover:text-amber-500 transition-colors leading-tight">
                    {community.name}
                  </h3>

                  <p className="text-blue-600 text-sm md:text-base font-medium line-clamp-2 mb-6 md:mb-8 leading-relaxed">
                    {community.description || "A hub for high-growth individuals to share insights and build projects."}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-blue-100">
                    <div className="flex items-center -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center">
                          <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-200 to-blue-100" />
                        </div>
                      ))}
                      <span className="pl-3 md:pl-4 text-[10px] md:text-xs font-bold text-blue-400 uppercase tracking-tighter">+ Active</span>
                    </div>

                    {/* Enter button is always visible on mobile, hover-only on desktop */}
                    <div className="flex items-center gap-2 text-xs md:text-sm font-black text-amber-500 uppercase tracking-widest opacity-100 md:opacity-0 group-hover:opacity-100 transition-all md:translate-x-4 group-hover:translate-x-0">
                      Enter <ArrowRight size={16} />
                    </div>
                  </div>
                </div>

                {/* Hover Glow Line */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}