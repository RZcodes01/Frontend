import React, { useState } from 'react';
import { LayoutGrid, Users, Code, Paintbrush, Database, ArrowRight, Search, Trophy, Star, TrendingUp, Award, Smartphone, Zap, ChevronRight, ArrowLeft, Flame } from 'lucide-react';
import Leaderboard from './Leaderboard'; 
import ProjectDetail from './ProjectDetail'; 

const Project = () => {

  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");


  const communities = [
    { 
      id: 1, 
      name: "Full Stack Development", 
      icon: <Code className="text-cyan-400" size={28} />, 
      projectCount: 145, 
      activeMentors: 8,
      totalMembers: 1247,
      color: "hover:border-cyan-400",
      bgGradient: "from-cyan-950 to-slate-900",
      accentColor: "cyan",
      description: "Build end-to-end web applications with MERN stack, Next.js, and modern API architecture.",
      tags: ["React", "Node.js", "Next.js", "MongoDB"],
      topProject: "SaaS Dashboard Platform",
      trending: true,
      weeklyGrowth: "+12%"
    },
    { 
      id: 2, 
      name: "UI/UX Design", 
      icon: <Paintbrush className="text-cyan-400" size={28} />, 
      projectCount: 89, 
      activeMentors: 5,
      totalMembers: 892,
      color: "hover:border-cyan-400",
      bgGradient: "from-cyan-950 to-slate-900",
      accentColor: "cyan",
      description: "Create stunning user experiences with modern design principles and prototyping tools.",
      tags: ["Figma", "Adobe XD", "Prototyping", "Mobile"],
      topProject: "Banking App Redesign",
      trending: true,
      weeklyGrowth: "+8%"
    },
    { 
      id: 3, 
      name: "Data Science", 
      icon: <Database className="text-cyan-400" size={28} />, 
      projectCount: 62, 
      activeMentors: 4,
      totalMembers: 634,
      color: "hover:border-cyan-400",
      bgGradient: "from-cyan-950 to-slate-900",
      accentColor: "cyan",
      description: "Dive into machine learning, data analysis, and predictive modeling with Python.",
      tags: ["Python", "TensorFlow", "ML", "Analytics"],
      topProject: "Predictive Analytics Engine",
      trending: false,
      weeklyGrowth: "+5%"
    },
    { 
      id: 4, 
      name: "Mobile Development", 
      icon: <Smartphone className="text-cyan-400" size={28} />, 
      projectCount: 78, 
      activeMentors: 6,
      totalMembers: 956,
      color: "hover:border-cyan-400",
      bgGradient: "from-cyan-950 to-slate-900",
      accentColor: "cyan",
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

  if (selectedProject) {
    return (
      <ProjectDetail 
        project={selectedProject} 
        onBack={() => setSelectedProject(null)} 
      />
    );
  }

  if (selectedCommunity) {
    return (
      <div className="relative min-h-screen bg-neutral-950">
        <button 
          onClick={() => setSelectedCommunity(null)}
          className="fixed bottom-8 right-8 z-[100] bg-cyan-400 text-black px-6 py-3 rounded-full font-bold shadow-2xl shadow-cyan-500/20 flex items-center gap-2 hover:scale-105 hover:bg-cyan-300 transition-all"
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

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="bg-neutral-950 border-b border-neutral-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/30 px-4 py-2 rounded-full mb-4">
              <Zap size={16} className="text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-400">Live Project Showcase</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 text-white">Projects</h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Join talented creators, compete on leaderboards, and showcase your best work to the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-cyan-400/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-cyan-400/10 p-2 rounded-lg"><Trophy className="text-cyan-400" size={24} /></div>
                <div>
                  <p className="text-neutral-400 text-sm font-medium">Total Projects</p>
                  <p className="text-3xl font-bold text-white">{totalProjects}</p>
                </div>
              </div>
            </div>
            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-cyan-400/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-cyan-400/10 p-2 rounded-lg"><Users className="text-cyan-400" size={24} /></div>
                <div>
                  <p className="text-neutral-400 text-sm font-medium">Active Members</p>
                  <p className="text-3xl font-bold text-white">{totalMembers.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-cyan-400/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-cyan-400/10 p-2 rounded-lg"><Award className="text-cyan-400" size={24} /></div>
                <div>
                  <p className="text-neutral-400 text-sm font-medium">Expert Mentors</p>
                  <p className="text-3xl font-bold text-white">{totalMentors}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
            <input 
              type="text"
              placeholder="Search communities..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-neutral-700 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-neutral-900 text-white placeholder-neutral-500"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-400 font-medium">View:</span>
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-1 flex gap-1">
              <button 
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "grid" ? 'bg-cyan-400 text-black' : 'text-neutral-400 hover:text-white'}`}
              >
                <LayoutGrid size={16} className="inline mr-1" /> Grid
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "list" ? 'bg-cyan-400 text-black' : 'text-neutral-400 hover:text-white'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredCommunities.map((community) => (
              <div 
                key={community.id}
                onClick={() => setSelectedCommunity(community.name)}
                className={`group bg-neutral-900 rounded-2xl border-2 border-neutral-800 cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-2 overflow-hidden ${community.color}`}
              >
                <div className={`bg-gradient-to-r ${community.bgGradient} p-6 border-b border-neutral-800`}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-neutral-900 rounded-xl shadow-md border border-neutral-700">{community.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{community.name}</h3>
                        <p className="text-xs text-neutral-400">{community.totalMembers.toLocaleString()} members</p>
                      </div>
                    </div>
                </div>
                <div className="p-6">
                  <p className="text-neutral-400 text-sm mb-4">{community.description}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {community.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg text-xs font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">{tag}</span>
                    ))}
                  </div>
                  <button className="w-full bg-cyan-400 hover:bg-cyan-300 text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
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
                className="group bg-neutral-900 rounded-xl border border-neutral-800 p-6 cursor-pointer hover:border-cyan-400/60 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-gradient-to-r ${community.bgGradient} rounded-xl shadow-md border border-neutral-700`}>{community.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{community.name}</h3>
                      <p className="text-xs text-neutral-400">{community.totalMembers.toLocaleString()} members</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-neutral-600 group-hover:text-cyan-400 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 pointer-events-none" />
          <h2 className="text-3xl font-bold mb-3 relative z-10">Ready to showcase your work?</h2>
          <button className="relative z-10 bg-cyan-400 hover:bg-cyan-300 text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all">
            Submit Your First Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default Project;