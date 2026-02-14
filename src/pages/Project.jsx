import React, { useState } from 'react';
import { LayoutGrid, Users, Code, Paintbrush, Database, ArrowRight, Search, Trophy, Star, TrendingUp, Award, Smartphone, Zap, ChevronRight, ArrowLeft, Flame } from 'lucide-react';
// Import the Leaderboard component we made earlier
import Leaderboard from './Leaderboard'; 

const Project = () => {
  // State to track if we are looking at the List of Communities or a Specific Leaderboard
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Enhanced mock data for communities
  const communities = [
    { 
      id: 1, 
      name: "Full Stack Development", 
      icon: <Code className="text-blue-500" size={28} />, 
      projectCount: 145, 
      activeMentors: 8,
      totalMembers: 1247,
      color: "hover:border-blue-500",
      bgGradient: "from-blue-50 to-indigo-50",
      accentColor: "blue",
      description: "Build end-to-end web applications with MERN stack, Next.js, and modern API architecture.",
      tags: ["React", "Node.js", "Next.js", "MongoDB"],
      topProject: "SaaS Dashboard Platform",
      trending: true,
      weeklyGrowth: "+12%"
    },
    { 
      id: 2, 
      name: "UI/UX Design", 
      icon: <Paintbrush className="text-pink-500" size={28} />, 
      projectCount: 89, 
      activeMentors: 5,
      totalMembers: 892,
      color: "hover:border-pink-500",
      bgGradient: "from-pink-50 to-rose-50",
      accentColor: "pink",
      description: "Create stunning user experiences with modern design principles and prototyping tools.",
      tags: ["Figma", "Adobe XD", "Prototyping", "Mobile"],
      topProject: "Banking App Redesign",
      trending: true,
      weeklyGrowth: "+8%"
    },
    { 
      id: 3, 
      name: "Data Science", 
      icon: <Database className="text-purple-500" size={28} />, 
      projectCount: 62, 
      activeMentors: 4,
      totalMembers: 634,
      color: "hover:border-purple-500",
      bgGradient: "from-purple-50 to-violet-50",
      accentColor: "purple",
      description: "Dive into machine learning, data analysis, and predictive modeling with Python.",
      tags: ["Python", "TensorFlow", "ML", "Analytics"],
      topProject: "Predictive Analytics Engine",
      trending: false,
      weeklyGrowth: "+5%"
    },
    { 
      id: 4, 
      name: "Mobile Development", 
      icon: <Smartphone className="text-green-500" size={28} />, 
      projectCount: 78, 
      activeMentors: 6,
      totalMembers: 956,
      color: "hover:border-green-500",
      bgGradient: "from-green-50 to-emerald-50",
      accentColor: "green",
      description: "Develop cross-platform mobile apps with React Native, Flutter, and native technologies.",
      tags: ["React Native", "Flutter", "iOS", "Android"],
      topProject: "Fitness Tracking App",
      trending: true,
      weeklyGrowth: "+15%"
    },
  ];

  // Filter communities based on search
  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate total stats
  const totalProjects = communities.reduce((sum, c) => sum + c.projectCount, 0);
  const totalMembers = communities.reduce((sum, c) => sum + c.totalMembers, 0);
  const totalMentors = communities.reduce((sum, c) => sum + c.activeMentors, 0);

  // VIEW 1: The Community Grid (What shows when they click "Projects")
  if (!selectedCommunity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Zap size={16} className="text-yellow-300" />
                <span className="text-sm font-semibold">Live Project Showcase</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                Projects
              </h1>
              <p className="text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
                Join talented creators, compete on leaderboards, and showcase your best work to the world.
              </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Trophy className="text-yellow-300" size={24} />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">Total Projects</p>
                    <p className="text-3xl font-bold">{totalProjects}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Users className="text-blue-300" size={24} />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">Active Members</p>
                    <p className="text-3xl font-bold">{totalMembers.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Award className="text-green-300" size={24} />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">Expert Mentors</p>
                    <p className="text-3xl font-bold">{totalMentors}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Search and Filter Bar */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                placeholder="Search communities, skills, or technologies..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm bg-white"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 font-medium">View:</span>
              <div className="bg-white border border-slate-200 rounded-lg p-1 flex gap-1">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === "grid" 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <LayoutGrid size={16} className="inline mr-1" />
                  Grid
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === "list" 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-slate-600">
              Showing <span className="font-bold text-slate-900">{filteredCommunities.length}</span> {filteredCommunities.length === 1 ? 'community' : 'communities'}
            </p>
          </div>

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredCommunities.map((community, index) => (
                <div 
                  key={community.id}
                  onClick={() => setSelectedCommunity(community.name)}
                  className={`group bg-white rounded-2xl border-2 border-slate-200 shadow-sm cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${community.color} overflow-hidden`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Header with Gradient */}
                  <div className={`bg-gradient-to-r ${community.bgGradient} p-6 border-b border-slate-100 relative`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-md group-hover:scale-110 transition-transform">
                          {community.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{community.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500 font-medium">{community.totalMembers.toLocaleString()} members</span>
                            {community.trending && (
                              <>
                                <span className="text-slate-300">•</span>
                                <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                                  <TrendingUp size={12} />
                                  <span>{community.weeklyGrowth}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {community.trending && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200">
                          <Flame size={14} /> Hot
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                      {community.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {community.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className={`px-3 py-1 rounded-lg text-xs font-semibold bg-${community.accentColor}-50 text-${community.accentColor}-700 border border-${community.accentColor}-100`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Top Project */}
                    <div className="bg-slate-50 rounded-lg p-3 mb-5 border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium mb-1">🏆 Top Project</p>
                      <p className="text-sm font-bold text-slate-800">{community.topProject}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Projects</p>
                        <p className="text-2xl font-bold text-slate-900">{community.projectCount}</p>
                      </div>
                      <div className="text-center bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Mentors</p>
                        <p className="text-2xl font-bold text-slate-900">{community.activeMentors}</p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 group-hover:shadow-lg transition-all">
                      View Leaderboard
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="space-y-4">
              {filteredCommunities.map((community, index) => (
                <div 
                  key={community.id}
                  onClick={() => setSelectedCommunity(community.name)}
                  className="group bg-white rounded-xl border border-slate-200 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-indigo-300 p-6"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Icon and Title */}
                    <div className="flex items-center gap-4 md:w-1/3">
                      <div className={`p-3 bg-gradient-to-r ${community.bgGradient} rounded-xl shadow-md`}>
                        {community.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-slate-900">{community.name}</h3>
                          {community.trending && (
                            <Flame size={16} className="text-orange-500" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{community.totalMembers.toLocaleString()} members</p>
                      </div>
                    </div>

                    {/* Description and Tags */}
                    <div className="md:w-1/2">
                      <p className="text-sm text-slate-600 mb-2">{community.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {community.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats and CTA */}
                    <div className="md:w-1/6 flex md:flex-col items-center justify-between md:justify-center gap-3">
                      <div className="flex gap-4 md:gap-2 md:flex-col text-center">
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Projects</p>
                          <p className="text-xl font-bold text-slate-900">{community.projectCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Mentors</p>
                          <p className="text-xl font-bold text-slate-900">{community.activeMentors}</p>
                        </div>
                      </div>
                      <ChevronRight size={24} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredCommunities.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-400" size={36} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No communities found</h3>
              <p className="text-slate-500 mb-6">Try adjusting your search terms or browse all communities</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Bottom CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-3">Ready to showcase your work?</h2>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Join a community, submit your projects, and compete with talented creators from around the world.
            </p>
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all">
              Submit Your First Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 2: The Specific Leaderboard (When a card is clicked)
  return (
    <div className="relative">
      {/* Enhanced Back Button */}
      <button 
        onClick={() => setSelectedCommunity(null)}
        className="fixed bottom-8 right-8 z-[100] bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 hover:scale-105 hover:shadow-xl transition-all border-2 border-white"
      >
        <ArrowLeft size={18} /> 
        Back to Communities
      </button>
      
      <Leaderboard communityName={selectedCommunity} />
    </div>
  );
};

export default Project;