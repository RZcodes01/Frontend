import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Users, Code, Paintbrush, Database, ArrowRight, Search, Trophy, Star, TrendingUp, Award, Smartphone, Zap, ChevronRight, ArrowLeft, Flame } from 'lucide-react';
import Leaderboard from './Leaderboard'; 
import ProjectDetail from './ProjectDetail'; 

const Project = () => {
  const navigate = useNavigate();
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const communities = [
    { 
      id: 1, 
      name: "Full Stack Development",  
      projectCount: 145, 
      activeMentors: 1,
      totalMembers: 10,
      color: "hover:border-amber-400",
      bgGradient: "from-blue-950 to-blue-900",
      accentColor: "amber",
      description: "Build end-to-end web applications with MERN stack, Next.js, and modern API architecture.",
      tags: ["React", "Node.js", "Next.js", "MongoDB"],
      topProject: "SaaS Dashboard Platform",
      trending: true,
      weeklyGrowth: "+12%"
    },
    { 
      id: 2, 
      name: "UI/UX Design", 
      projectCount: 89, 
      activeMentors: 1,
      totalMembers: 5,
      color: "hover:border-amber-400",
      bgGradient: "from-blue-950 to-blue-900",
      accentColor: "amber",
      description: "Create stunning user experiences with modern design principles and prototyping tools.",
      tags: ["Figma", "Adobe XD", "Prototyping", "Mobile"],
      topProject: "Banking App Redesign",
      trending: true,
      weeklyGrowth: "+8%"
    },
    { 
      id: 3, 
      name: "Data Science", 
      projectCount: 62, 
      activeMentors: 1,
      totalMembers: 5,
      color: "hover:border-amber-400",
      bgGradient: "from-blue-950 to-blue-900",
      accentColor: "amber",
      description: "Dive into machine learning, data analysis, and predictive modeling with Python.",
      tags: ["Python", "TensorFlow", "ML", "Analytics"],
      topProject: "Predictive Analytics Engine",
      trending: false,
      weeklyGrowth: "+5%"
    },
    { 
      id: 4, 
      name: "Mobile Development", 
      projectCount: 78, 
      activeMentors: 1,
      totalMembers: 5,
      color: "hover:border-amber-400",
      bgGradient: "from-blue-950 to-blue-900",
      accentColor: "amber",
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
      <div className="relative min-h-screen bg-blue-950">
        <button 
          onClick={() => setSelectedCommunity(null)}
          className="fixed bottom-8 right-8 z-[100] bg-amber-400 text-blue-950 px-6 py-3 rounded-full font-bold shadow-2xl shadow-amber-400/20 flex items-center gap-2 hover:scale-105 hover:bg-amber-300 transition-all"
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
    <div className="min-h-screen bg-blue-50">
      <div className="bg-blue-50 border-b border-blue-200 text-blue-900">
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-16">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-700 hover:text-amber-500 font-bold text-lg mb-8 transition-colors group"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform duration-200" />
            Back
          </button>

          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 text-blue-950">Projects</h1>
            <p className="text-xl text-blue-700 max-w-2xl mx-auto leading-relaxed">
              Join talented creators, compete on leaderboards, and showcase your best work to the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <div className="bg-blue-100 rounded-2xl p-6 border border-blue-300 hover:border-amber-400/50 transition-colors shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-amber-400/20 p-2 rounded-lg"></div>
                <div>
                  <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Total Projects</p>
                  <p className="text-4xl font-black text-blue-950">{totalProjects}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-100 rounded-2xl p-6 border border-blue-300 hover:border-amber-400/50 transition-colors shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-amber-400/20 p-2 rounded-lg"></div>
                <div>
                  <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Active Members</p>
                  <p className="text-4xl font-black text-blue-950">{totalMembers.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-100 rounded-2xl p-6 border border-blue-300 hover:border-amber-400/50 transition-colors shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-amber-400/20 p-2 rounded-lg"></div>
                <div>
                  <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Expert Mentors</p>
                  <p className="text-4xl font-black text-blue-950">{totalMentors}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
            <input 
              type="text"
              placeholder="Search communities..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-blue-300 outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-blue-100 text-blue-950 placeholder-blue-400 text-base font-medium"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-700 font-semibold">View:</span>
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-1 flex gap-1">
              <button 
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === "grid" ? 'bg-amber-400 text-blue-950' : 'text-blue-700 hover:text-blue-950'}`}
              >
                <LayoutGrid size={16} className="inline mr-1" /> Grid
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === "list" ? 'bg-amber-400 text-blue-950' : 'text-blue-700 hover:text-blue-950'}`}
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
                className={`group bg-blue-900 rounded-2xl border-2 border-blue-700 cursor-pointer hover:shadow-2xl hover:shadow-amber-400/10 transition-all duration-300 hover:-translate-y-2 overflow-hidden ${community.color}`}
              >
                <div className={`bg-gradient-to-r ${community.bgGradient} p-6 border-b border-blue-700`}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-950 rounded-xl shadow-md border border-blue-600">{community.icon}</div>
                    <div>
                      <h3 className="text-2xl font-black text-blue-50">{community.name}</h3>
                      <p className="text-sm text-blue-300 font-semibold">{community.totalMembers.toLocaleString()} members</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-blue-200 text-base font-medium mb-4 leading-relaxed">{community.description}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {community.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg text-sm font-bold bg-blue-800 text-blue-100 border border-blue-600">{tag}</span>
                    ))}
                  </div>
                  <button className="w-full bg-amber-400 hover:bg-amber-300 text-blue-950 py-3 rounded-xl font-black text-base flex items-center justify-center gap-2 transition-colors">
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
                className="group bg-blue-900 rounded-xl border border-blue-700 p-6 cursor-pointer hover:border-amber-400/60 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-gradient-to-r ${community.bgGradient} rounded-xl shadow-md border border-blue-600`}>{community.icon}</div>
                    <div>
                      <h3 className="text-xl font-black text-blue-50">{community.name}</h3>
                      <p className="text-sm text-blue-300 font-semibold">{community.totalMembers.toLocaleString()} members</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-blue-500 group-hover:text-amber-400 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Project;