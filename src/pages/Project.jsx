import React, { useState } from 'react';
import { LayoutGrid, Users, Code, Paintbrush, Database, ArrowRight, Search, Trophy, Star, TrendingUp, Award, Smartphone, Zap, ChevronRight, ArrowLeft, Flame } from 'lucide-react';
import Leaderboard from './Leaderboard'; 
import ProjectDetail from './ProjectDetail'; // Make sure this file exists in the same folder

const Project = () => {
  // State Management
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  // Mock data for communities
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

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalProjects = communities.reduce((sum, c) => sum + c.projectCount, 0);
  const totalMembers = communities.reduce((sum, c) => sum + c.totalMembers, 0);
  const totalMentors = communities.reduce((sum, c) => sum + c.activeMentors, 0);

  // VIEW 3: Project Detail View
  // We check this first so it overlays everything else
  if (selectedProject) {
    return (
      <ProjectDetail 
        project={selectedProject} 
        onBack={() => setSelectedProject(null)} 
      />
    );
  }

  // VIEW 2: Leaderboard View
  if (selectedCommunity) {
    return (
      <div className="relative min-h-screen bg-slate-50">
        <button 
          onClick={() => setSelectedCommunity(null)}
          className="fixed bottom-8 right-8 z-[100] bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 hover:scale-105 hover:shadow-xl transition-all border-2 border-white"
        >
          <ArrowLeft size={18} /> 
          Back to Communities
        </button>
        
        <Leaderboard 
          communityName={selectedCommunity} 
          onViewProject={(project) => setSelectedProject(project)} 
        />
      </div>
    );
  }

  // VIEW 1: Community Grid View
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
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">Projects</h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
              Join talented creators, compete on leaderboards, and showcase your best work to the world.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-lg"><Trophy className="text-yellow-300" size={24} /></div>
                <div>
                  <p className="text-white/80 text-sm font-medium">Total Projects</p>
                  <p className="text-3xl font-bold">{totalProjects}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-lg"><Users className="text-blue-300" size={24} /></div>
                <div>
                  <p className="text-white/80 text-sm font-medium">Active Members</p>
                  <p className="text-3xl font-bold">{totalMembers.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-lg"><Award className="text-green-300" size={24} /></div>
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
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search communities..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 font-medium">View:</span>
            <div className="bg-white border border-slate-200 rounded-lg p-1 flex gap-1">
              <button 
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "grid" ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
              >
                <LayoutGrid size={16} className="inline mr-1" /> Grid
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "list" ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Community Rendering (Grid/List) */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredCommunities.map((community) => (
              <div 
                key={community.id}
                onClick={() => setSelectedCommunity(community.name)}
                className={`group bg-white rounded-2xl border-2 border-slate-200 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden ${community.color}`}
              >
                <div className={`bg-gradient-to-r ${community.bgGradient} p-6 border-b border-slate-100`}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-md">{community.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{community.name}</h3>
                        <p className="text-xs text-slate-500">{community.totalMembers.toLocaleString()} members</p>
                      </div>
                    </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 text-sm mb-4">{community.description}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {community.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100">{tag}</span>
                    ))}
                  </div>
                  <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                    View Leaderboard <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCommunities.map((community) => (
              <div 
                key={community.id}
                onClick={() => setSelectedCommunity(community.name)}
                className="group bg-white rounded-xl border border-slate-200 p-6 cursor-pointer hover:border-indigo-300 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-gradient-to-r ${community.bgGradient} rounded-xl shadow-md`}>{community.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{community.name}</h3>
                      <p className="text-xs text-slate-500">{community.totalMembers.toLocaleString()} members</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-slate-400 group-hover:text-indigo-600 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to showcase your work?</h2>
          <button className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all">
            Submit Your First Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default Project;