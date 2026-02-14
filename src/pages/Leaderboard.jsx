import React, { useState } from 'react';
import { Trophy, Medal, Search, ArrowLeft, Users, Zap, Star, TrendingUp, Award } from 'lucide-react';

const Leaderboard = ({ communityName = "Full Stack Development", onViewProject, onBack }) => {
  // Comprehensive mock data with multiple communities
  const [communities] = useState({
    "Full Stack Development": [
      { id: 1, rank: 1, student: "Arjun Mehta", title: "SaaS Dashboard", score: 98, stack: ["Next.js", "Prisma", "Tailwind"], reviews: 45, trending: true },
      { id: 2, rank: 2, student: "Li Wei", title: "E-commerce Engine", score: 96, stack: ["Node.js", "MongoDB", "React"], reviews: 42, trending: false },
      { id: 3, rank: 3, student: "Sarah Jensen", title: "Real-time Task Manager", score: 94, stack: ["React", "Firebase", "WebSocket"], reviews: 38, trending: true },
      { id: 4, rank: 4, student: "Mike Ross", title: "Social Media API", score: 91, stack: ["Express", "PostgreSQL"], reviews: 35, trending: false },
      { id: 5, rank: 5, student: "Priya Sharma", title: "Video Streaming Platform", score: 89, stack: ["Next.js", "AWS"], reviews: 32, trending: false },
      { id: 6, rank: 6, student: "Carlos Rodriguez", title: "Analytics Dashboard", score: 87, stack: ["Vue.js", "Node.js"], reviews: 30, trending: true },
      { id: 7, rank: 7, student: "Yuki Tanaka", title: "Collaborative Whiteboard", score: 85, stack: ["React", "Socket.io"], reviews: 28, trending: false },
      { id: 8, rank: 8, student: "Aisha Mohammed", title: "Learning Management System", score: 83, stack: ["Django", "PostgreSQL"], reviews: 26, trending: false },
      { id: 9, rank: 9, student: "James Wilson", title: "Project Management Tool", score: 81, stack: ["Angular", "MongoDB"], reviews: 24, trending: false },
      { id: 10, rank: 10, student: "Sofia Martinez", title: "Booking System", score: 79, stack: ["React", "Express"], reviews: 22, trending: false },
    ],
    "UI/UX Design": [
      { id: 101, rank: 1, student: "Emma Florence", title: "Travel App Design System", score: 99, stack: ["Figma", "Prototyping"], reviews: 52, trending: true },
      { id: 102, rank: 2, student: "David Kim", title: "Banking App Redesign", score: 97, stack: ["Figma", "Adobe XD"], reviews: 48, trending: true },
      { id: 103, rank: 3, student: "Nina Patel", title: "Healthcare Portal UI", score: 95, stack: ["Sketch", "InVision"], reviews: 44, trending: false },
      { id: 104, rank: 4, student: "Alex Turner", title: "E-learning Platform", score: 92, stack: ["Figma"], reviews: 40, trending: false },
      { id: 105, rank: 5, student: "Zara Ali", title: "Food Delivery App", score: 90, stack: ["Figma", "Protopie"], reviews: 36, trending: false },
    ],
    "Data Science": [
      { id: 201, rank: 1, student: "Robert Chen", title: "Predictive Analytics Engine", score: 97, stack: ["Python", "TensorFlow"], reviews: 50, trending: true },
      { id: 202, rank: 2, student: "Maya Johnson", title: "NLP Sentiment Analyzer", score: 95, stack: ["Python", "NLTK"], reviews: 46, trending: false },
      { id: 203, rank: 3, student: "Omar Hassan", title: "Image Classification Model", score: 93, stack: ["PyTorch", "OpenCV"], reviews: 42, trending: true },
      { id: 204, rank: 4, student: "Lisa Anderson", title: "Customer Churn Prediction", score: 90, stack: ["Scikit-learn", "Pandas"], reviews: 38, trending: false },
      { id: 205, rank: 5, student: "Raj Malhotra", title: "Time Series Forecasting", score: 88, stack: ["Python", "Prophet"], reviews: 34, trending: false },
    ],
    "Mobile Development": [
      { id: 301, rank: 1, student: "Kevin Park", title: "Fitness Tracking App", score: 96, stack: ["React Native", "Firebase"], reviews: 48, trending: true },
      { id: 302, rank: 2, student: "Isabella Costa", title: "Recipe Sharing Platform", score: 94, stack: ["Flutter", "Supabase"], reviews: 44, trending: false },
      { id: 303, rank: 3, student: "Ahmed Said", title: "Expense Manager", score: 92, stack: ["Swift", "CoreData"], reviews: 40, trending: true },
      { id: 304, rank: 4, student: "Grace Liu", title: "Language Learning App", score: 89, stack: ["Kotlin", "Room"], reviews: 36, trending: false },
      { id: 305, rank: 5, student: "Marcus Brown", title: "Event Ticketing App", score: 87, stack: ["React Native"], reviews: 32, trending: false },
    ]
  });

  const [selectedCommunity, setSelectedCommunity] = useState(communityName);
  const [searchTerm, setSearchTerm] = useState("");

  // Get current community projects
  const currentProjects = communities[selectedCommunity] || [];
  
  // Filter by search term
  const filteredProjects = currentProjects.filter(project =>
    project.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const avgScore = currentProjects.length > 0 
    ? (currentProjects.reduce((sum, p) => sum + p.score, 0) / currentProjects.length).toFixed(1)
    : 0;
  
  const totalProjects = currentProjects.length;
  const trendingCount = currentProjects.filter(p => p.trending).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      {/* Top Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h2 className="font-bold text-slate-900 text-lg">{selectedCommunity}</h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <Users size={12} />
                <span>{(currentProjects.length * 120).toLocaleString()} Members</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-orange-600 font-medium">
                <Star size={12} />
                <span>{totalProjects} Projects</span>
              </span>
            </div>
          </div>
        </div>
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all">
          Submit Project
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Community Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {Object.keys(communities).map((community) => (
            <button
              key={community}
              onClick={() => setSelectedCommunity(community)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                selectedCommunity === community
                  ? 'bg-white text-indigo-600 shadow-md border-2 border-indigo-200'
                  : 'bg-white/60 text-slate-600 hover:bg-white hover:shadow-sm border border-slate-200'
              }`}
            >
              {community}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                selectedCommunity === community
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {communities[community].length}
              </span>
            </button>
          ))}
        </div>

        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={20} className="text-indigo-200" />
              <p className="text-indigo-100 text-sm font-medium">Season Ends In</p>
            </div>
            <p className="text-2xl font-bold">04d : 12h : 34m</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <p className="text-slate-500 text-sm font-medium">Community Avg</p>
              <div className="bg-orange-100 p-2 rounded-lg">
                <Zap size={18} className="text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{avgScore}%</p>
            <p className="text-xs text-green-600 font-medium mt-1">↑ 2.3% from last week</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <p className="text-slate-500 text-sm font-medium">Total Projects</p>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Award size={18} className="text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{totalProjects}</p>
            <p className="text-xs text-slate-500 mt-1">Ranked submissions</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <p className="text-slate-500 text-sm font-medium">Trending Now</p>
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp size={18} className="text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{trendingCount}</p>
            <p className="text-xs text-slate-500 mt-1">Hot projects this week</p>
          </div>
        </div>

        {/* Podium for Top 3 */}
        {currentProjects.length >= 3 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Top Performers</h3>
            <div className="flex flex-col md:flex-row items-end justify-center gap-4">
              {/* 2nd Place */}
              <div className="w-full md:w-72 bg-white border-2 border-slate-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all order-2 md:order-1 h-72 flex flex-col justify-center relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                  2
                </div>
                <Medal className="mx-auto text-slate-400 mb-3 group-hover:scale-110 transition-transform" size={48} />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Silver Medal</p>
                <h3 className="font-bold text-xl text-slate-800 mb-1">{currentProjects[1]?.student}</h3>
                <p className="text-indigo-600 font-semibold text-sm mb-3">{currentProjects[1]?.title}</p>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {currentProjects[1]?.stack.slice(0, 2).map((tech, i) => (
                    <span key={i} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="bg-slate-100 text-slate-700 py-2 px-4 rounded-xl text-base font-bold inline-block mx-auto">
                  {currentProjects[1]?.score} PTS
                </div>
              </div>

              {/* 1st Place */}
              <div className="w-full md:w-80 bg-gradient-to-br from-yellow-50 to-amber-50 border-4 border-yellow-400 rounded-2xl p-8 text-center shadow-2xl order-1 md:order-2 h-80 flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900 px-4 py-1.5 font-bold text-[10px] uppercase tracking-wider rounded-bl-xl shadow-md">
                  🏆 Champion
                </div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900 w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-lg">
                  1
                </div>
                <Trophy className="mx-auto text-yellow-500 mb-3 group-hover:scale-110 transition-transform animate-pulse" size={64} />
                <p className="text-yellow-600 font-bold text-sm uppercase tracking-wider mb-1">Gold Medal</p>
                <h3 className="font-black text-2xl text-slate-900 mb-1">{currentProjects[0]?.student}</h3>
                <p className="text-indigo-600 font-bold text-base mb-4">{currentProjects[0]?.title}</p>
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {currentProjects[0]?.stack.slice(0, 3).map((tech, i) => (
                    <span key={i} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900 py-2 px-5 rounded-xl text-lg font-black inline-block mx-auto shadow-md">
                  {currentProjects[0]?.score} PTS
                </div>
              </div>

              {/* 3rd Place */}
              <div className="w-full md:w-72 bg-white border-2 border-orange-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all order-3 h-64 flex flex-col justify-center relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                  3
                </div>
                <Medal className="mx-auto text-orange-400 mb-3 group-hover:scale-110 transition-transform" size={44} />
                <p className="text-orange-400 font-bold text-xs uppercase tracking-wider mb-1">Bronze Medal</p>
                <h3 className="font-bold text-lg text-slate-800 mb-1">{currentProjects[2]?.student}</h3>
                <p className="text-indigo-600 font-semibold text-sm mb-3">{currentProjects[2]?.title}</p>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {currentProjects[2]?.stack.slice(0, 2).map((tech, i) => (
                    <span key={i} className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="bg-orange-100 text-orange-700 py-2 px-4 rounded-xl text-base font-bold inline-block mx-auto">
                  {currentProjects[2]?.score} PTS
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search students or projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Complete Rankings Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Community Rankings</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Showing {filteredProjects.length} of {totalProjects} projects
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md font-medium">Live Updates</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Student & Project</th>
                  <th className="px-6 py-4">Tech Stack</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Reviews</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {project.rank <= 3 ? (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            project.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900' :
                            project.rank === 2 ? 'bg-slate-300 text-slate-700' :
                            'bg-orange-300 text-orange-900'
                          }`}>
                            {project.rank}
                          </div>
                        ) : (
                          <span className="font-bold text-slate-400 w-8 text-center text-lg">#{project.rank}</span>
                        )}
                        {project.trending && (
                          <TrendingUp size={16} className="text-green-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-base">
                          {project.student}
                        </p>
                        <p className="text-sm text-slate-500 mt-0.5">{project.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1">
                        {project.stack.map((tech, i) => (
                          <span key={i} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 w-24">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all" 
                            style={{ width: `${project.score}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-700 text-sm min-w-[3rem]">{project.score} pts</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-600 font-medium">{project.reviews}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                    <button onClick={() => onViewProject(project)} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-bold hover:bg-indigo-600 hover:text-white transition-all">
                    View Details
                  </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Search className="mx-auto text-slate-300 mb-3" size={48} />
              <p className="text-slate-500 font-medium">No projects found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;