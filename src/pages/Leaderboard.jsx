import React, { useState } from 'react';
import { Trophy, Medal, Search, ArrowLeft, Users, Zap, Star, TrendingUp, Award } from 'lucide-react';

const Leaderboard = ({ communityName = "Full Stack Development", onViewProject, onBack }) => {
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

  const currentProjects = communities[selectedCommunity] || [];
  
  const filteredProjects = currentProjects.filter(project =>
    project.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgScore = currentProjects.length > 0 
    ? (currentProjects.reduce((sum, p) => sum + p.score, 0) / currentProjects.length).toFixed(1)
    : 0;
  
  const totalProjects = currentProjects.length;
  const trendingCount = currentProjects.filter(p => p.trending).length;

  return (
    <div className="min-h-screen bg-neutral-950 pb-20">
      {/* Top Navigation Bar */}
      <nav className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-neutral-400" />
          </button>
          <div>
            <h2 className="font-bold text-white text-lg">{selectedCommunity}</h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-cyan-400 font-medium">
                <Users size={12} />
                <span>{(currentProjects.length * 120).toLocaleString()} Members</span>
              </span>
              <span className="text-neutral-700">•</span>
              <span className="flex items-center gap-1 text-cyan-300 font-medium">
                <Star size={12} />
                <span>{totalProjects} Projects</span>
              </span>
            </div>
          </div>
        </div>
        <button className="bg-cyan-400 hover:bg-cyan-300 text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 transition-all">
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
                  ? 'bg-cyan-400 text-black shadow-md shadow-cyan-500/20'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800'
              }`}
            >
              {community}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                selectedCommunity === community
                  ? 'bg-black/20 text-black'
                  : 'bg-neutral-800 text-neutral-500'
              }`}>
                {communities[community].length}
              </span>
            </button>
          ))}
        </div>

        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-cyan-400 p-6 rounded-2xl text-black shadow-lg shadow-cyan-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={20} className="text-black/60" />
              <p className="text-black/70 text-sm font-medium">Season Ends In</p>
            </div>
            <p className="text-2xl font-bold">04d : 12h : 34m</p>
          </div>
          
          <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 hover:border-cyan-400/40 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <p className="text-neutral-500 text-sm font-medium">Community Avg</p>
              <div className="bg-cyan-400/10 p-2 rounded-lg">
                <Zap size={18} className="text-cyan-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{avgScore}%</p>
            <p className="text-xs text-cyan-400 font-medium mt-1">↑ 2.3% from last week</p>
          </div>

          <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 hover:border-cyan-400/40 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <p className="text-neutral-500 text-sm font-medium">Total Projects</p>
              <div className="bg-cyan-400/10 p-2 rounded-lg">
                <Award size={18} className="text-cyan-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{totalProjects}</p>
            <p className="text-xs text-neutral-500 mt-1">Ranked submissions</p>
          </div>

          <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 hover:border-cyan-400/40 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <p className="text-neutral-500 text-sm font-medium">Trending Now</p>
              <div className="bg-cyan-400/10 p-2 rounded-lg">
                <TrendingUp size={18} className="text-cyan-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{trendingCount}</p>
            <p className="text-xs text-neutral-500 mt-1">Hot projects this week</p>
          </div>
        </div>

        {/* Podium for Top 3 */}
        {currentProjects.length >= 3 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Top Performers</h3>
            <div className="flex flex-col md:flex-row items-end justify-center gap-4">
              {/* 2nd Place */}
              <div className="w-full md:w-72 bg-neutral-900 border-2 border-neutral-700 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl hover:border-neutral-600 transition-all order-2 md:order-1 h-72 flex flex-col justify-center relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neutral-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                  2
                </div>
                <Medal className="mx-auto text-neutral-500 mb-3 group-hover:scale-110 transition-transform" size={48} />
                <p className="text-neutral-500 font-bold text-xs uppercase tracking-wider mb-1">Silver Medal</p>
                <h3 className="font-bold text-xl text-white mb-1">{currentProjects[1]?.student}</h3>
                <p className="text-cyan-400 font-semibold text-sm mb-3">{currentProjects[1]?.title}</p>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {currentProjects[1]?.stack.slice(0, 2).map((tech, i) => (
                    <span key={i} className="bg-neutral-800 text-neutral-400 px-2 py-1 rounded-md text-xs font-medium border border-neutral-700">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="bg-neutral-800 text-neutral-300 border border-neutral-700 py-2 px-4 rounded-xl text-base font-bold inline-block mx-auto">
                  {currentProjects[1]?.score} PTS
                </div>
              </div>

              {/* 1st Place */}
              <div className="w-full md:w-80 bg-neutral-900 border-4 border-yellow-500/60 rounded-2xl p-8 text-center shadow-2xl shadow-yellow-500/10 order-1 md:order-2 h-80 flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-yellow-500/20 border-l border-b border-yellow-500/40 text-yellow-400 px-4 py-1.5 font-bold text-[10px] uppercase tracking-wider rounded-bl-xl">
                  🏆 Champion
                </div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-lg shadow-yellow-500/30">
                  1
                </div>
                <Trophy className="mx-auto text-yellow-500 mb-3 group-hover:scale-110 transition-transform animate-pulse" size={64} />
                <p className="text-yellow-500 font-bold text-sm uppercase tracking-wider mb-1">Gold Medal</p>
                <h3 className="font-black text-2xl text-white mb-1">{currentProjects[0]?.student}</h3>
                <p className="text-cyan-400 font-bold text-base mb-4">{currentProjects[0]?.title}</p>
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {currentProjects[0]?.stack.slice(0, 3).map((tech, i) => (
                    <span key={i} className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded-md text-xs font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="bg-yellow-500 text-black py-2 px-5 rounded-xl text-lg font-black inline-block mx-auto shadow-md shadow-yellow-500/20">
                  {currentProjects[0]?.score} PTS
                </div>
              </div>

              {/* 3rd Place */}
              <div className="w-full md:w-72 bg-neutral-900 border-2 border-orange-500/30 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl hover:border-orange-500/50 transition-all order-3 h-64 flex flex-col justify-center relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                  3
                </div>
                <Medal className="mx-auto text-orange-500 mb-3 group-hover:scale-110 transition-transform" size={44} />
                <p className="text-orange-500 font-bold text-xs uppercase tracking-wider mb-1">Bronze Medal</p>
                <h3 className="font-bold text-lg text-white mb-1">{currentProjects[2]?.student}</h3>
                <p className="text-cyan-400 font-semibold text-sm mb-3">{currentProjects[2]?.title}</p>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {currentProjects[2]?.stack.slice(0, 2).map((tech, i) => (
                    <span key={i} className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-1 rounded-md text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="bg-orange-500/10 text-orange-400 border border-orange-500/20 py-2 px-4 rounded-xl text-base font-bold inline-block mx-auto">
                  {currentProjects[2]?.score} PTS
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
            <input
              type="text"
              placeholder="Search students or projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-neutral-900 text-white placeholder-neutral-500"
            />
          </div>
        </div>

        {/* Complete Rankings Table */}
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-800 bg-neutral-900">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-lg">Community Rankings</h3>
                <p className="text-sm text-neutral-500 mt-0.5">
                  Showing {filteredProjects.length} of {totalProjects} projects
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 px-2 py-1 rounded-md font-medium">Live Updates</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-800 bg-neutral-950">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Student & Project</th>
                  <th className="px-6 py-4">Tech Stack</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Reviews</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-neutral-800/60 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {project.rank <= 3 ? (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            project.rank === 1 ? 'bg-yellow-500 text-black' :
                            project.rank === 2 ? 'bg-neutral-600 text-white' :
                            'bg-orange-500 text-white'
                          }`}>
                            {project.rank}
                          </div>
                        ) : (
                          <span className="font-bold text-neutral-600 w-8 text-center text-lg">#{project.rank}</span>
                        )}
                        {project.trending && (
                          <TrendingUp size={16} className="text-cyan-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-bold text-white group-hover:text-cyan-400 transition-colors text-base">
                          {project.student}
                        </p>
                        <p className="text-sm text-neutral-500 mt-0.5">{project.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1">
                        {project.stack.map((tech, i) => (
                          <span key={i} className="bg-neutral-800 text-neutral-400 border border-neutral-700 px-2 py-1 rounded-md text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-neutral-800 rounded-full h-2 w-24">
                          <div 
                            className="bg-cyan-400 h-2 rounded-full transition-all" 
                            style={{ width: `${project.score}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-neutral-300 text-sm min-w-[3rem]">{project.score} pts</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-neutral-400 font-medium">{project.reviews}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => onViewProject(project)} className="px-4 py-2 bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 rounded-lg font-bold hover:bg-cyan-400 hover:text-black transition-all">
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
              <Search className="mx-auto text-neutral-700 mb-3" size={48} />
              <p className="text-neutral-500 font-medium">No projects found</p>
              <p className="text-neutral-600 text-sm mt-1">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;