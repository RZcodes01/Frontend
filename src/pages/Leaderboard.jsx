import React, { useState } from 'react';
import { Trophy, Medal, Search, ArrowLeft, Users, Zap, Star, TrendingUp, Award, X, Upload, Link, Github } from 'lucide-react';

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
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

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
    <div className="min-h-screen bg-blue-50 pb-20 relative">

      {/* Project Submission Overlay */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-[100] bg-blue-50 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <button 
              onClick={() => setIsSubmitModalOpen(false)}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors mb-8 group text-base font-semibold"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Leaderboard</span>
            </button>

            <div className="bg-blue-900 border border-blue-700 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="mb-10">
                <h2 className="text-3xl sm:text-4xl font-black text-blue-50 mb-3">Submit Your Project</h2>
                <p className="text-blue-300 text-base sm:text-lg font-medium">Complete the form below to submit your weekly task for mentor review.</p>
              </div>

              <form className="space-y-6 sm:space-y-8" onSubmit={(e) => { e.preventDefault(); setIsSubmitModalOpen(false); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-base font-bold text-blue-200">Project Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Modern E-commerce Dashboard" 
                      className="w-full bg-blue-950 border border-blue-700 rounded-xl px-4 py-3 text-blue-50 text-base focus:ring-2 focus:ring-amber-400 outline-none transition-all placeholder-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-base font-bold text-blue-200">Community</label>
                    <input 
                      type="text" 
                      disabled 
                      value={selectedCommunity}
                      className="w-full bg-blue-800/50 border border-blue-700 rounded-xl px-4 py-3 text-blue-400 text-base cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-base font-bold text-blue-200">Description</label>
                  <textarea 
                    rows="4" 
                    placeholder="Briefly describe your project and the challenges you solved..."
                    className="w-full bg-blue-950 border border-blue-700 rounded-xl px-4 py-3 text-blue-50 text-base focus:ring-2 focus:ring-amber-400 outline-none transition-all placeholder-blue-500"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-base font-bold text-blue-200 flex items-center gap-2">
                      <Link size={16} className="text-amber-400" /> Live Demo URL
                    </label>
                    <input 
                      type="url" 
                      placeholder="https://your-demo.com" 
                      className="w-full bg-blue-950 border border-blue-700 rounded-xl px-4 py-3 text-blue-50 text-base focus:ring-2 focus:ring-amber-400 outline-none transition-all placeholder-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-base font-bold text-blue-200 flex items-center gap-2">
                      <Github size={16} className="text-amber-400" /> Repository Link
                    </label>
                    <input 
                      type="url" 
                      placeholder="https://github.com/your-username/repo" 
                      className="w-full bg-blue-950 border border-blue-700 rounded-xl px-4 py-3 text-blue-50 text-base focus:ring-2 focus:ring-amber-400 outline-none transition-all placeholder-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-base font-bold text-blue-200">Project Screenshot</label>
                  <div className="border-2 border-dashed border-blue-700 rounded-2xl p-6 sm:p-10 text-center hover:border-amber-400/50 transition-colors cursor-pointer group">
                    <Upload className="mx-auto text-blue-500 group-hover:text-amber-400 transition-colors mb-4" size={32} />
                    <p className="text-blue-300 text-base font-medium">Click to upload or drag and drop</p>
                    <p className="text-blue-500 text-sm mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-lg py-4 rounded-xl shadow-lg shadow-amber-400/10 transition-all hover:scale-[1.02]"
                  >
                    Submit Project
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-8 py-4 sm:py-0 border border-blue-700 text-blue-300 text-base font-semibold hover:bg-blue-800 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <nav className="bg-blue-900 border-b border-blue-700 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between sticky top-0 z-50 gap-4 sm:gap-0">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button className="p-2 hover:bg-blue-800 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-blue-200" />
          </button>
          <div>
            <h2 className="font-black text-blue-50 text-xl truncate max-w-[200px] sm:max-w-none">{selectedCommunity}</h2>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-amber-400 font-bold whitespace-nowrap">
                <span>{(currentProjects.length * 120).toLocaleString()} Members</span>
              </span>
              <span className="text-blue-500">•</span>
              <span className="flex items-center gap-1 text-blue-200 font-semibold whitespace-nowrap">
                <span>{totalProjects} Projects</span>
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsSubmitModalOpen(true)}
          className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-blue-950 px-5 py-2.5 rounded-xl text-base font-black hover:scale-105 transition-all"
        >
          Submit Project
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-4 mt-8">

        {/* Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-100 p-6 rounded-2xl border border-blue-300 hover:border-amber-400/60 transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-blue-600 text-base font-semibold uppercase tracking-wide">Total Projects</p>
            </div>
            <p className="text-4xl font-black text-blue-950">{totalProjects}</p>
            <p className="text-sm text-blue-500 font-medium mt-1">Ranked submissions</p>
          </div>

          <div className="bg-blue-100 p-6 rounded-2xl border border-blue-300 hover:border-amber-400/60 transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-blue-600 text-base font-semibold uppercase tracking-wide">Trending Now</p>
            </div>
            <p className="text-4xl font-black text-blue-950">{trendingCount}</p>
            <p className="text-sm text-blue-500 font-medium mt-1">Projects of this week</p>
          </div>
        </div>

        {/* Podium for Top 3 */}
        {currentProjects.length >= 3 && (
          <div className="mb-12">
            <h3 className="text-3xl font-black text-blue-900 mb-6 text-center">Top Performers</h3>
            <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-8 md:gap-4">

              {/* 2nd Place */}
              <div className="w-full sm:w-72 bg-blue-900 border-2 border-blue-600 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl hover:border-blue-400 transition-all order-2 md:order-1 h-auto sm:h-72 flex flex-col justify-center relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-blue-50 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-md">
                  2
                </div>
                <p className="text-blue-300 font-bold text-sm uppercase tracking-wider mb-1">Silver Medal</p>
                <h3 className="font-black text-xl text-blue-50 mb-1">{currentProjects[1]?.student}</h3>
                <p className="text-amber-400 font-bold text-base mb-3">{currentProjects[1]?.title}</p>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {currentProjects[1]?.stack.slice(0, 2).map((tech, i) => (
                    <span key={i} className="bg-blue-800 text-blue-200 px-2 py-1 rounded-md text-sm font-semibold border border-blue-600">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="bg-blue-800 text-blue-100 border border-blue-600 py-2 px-4 rounded-xl text-base font-black inline-block mx-auto">
                  {currentProjects[1]?.score} PTS
                </div>
              </div>

              {/* 1st Place */}
              <div className="w-full sm:w-80 bg-blue-900 border-4 border-yellow-500/60 rounded-2xl p-8 text-center shadow-2xl shadow-yellow-500/10 order-1 md:order-2 h-auto sm:h-80 flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-yellow-500/20 border-l border-b border-yellow-500/40 text-yellow-400 px-4 py-1.5 font-black text-xs uppercase tracking-wider rounded-bl-xl hidden sm:block">
                  Champion
                </div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-blue-950 w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-lg shadow-yellow-500/30">
                  1
                </div>
                <p className="text-yellow-400 font-black text-base uppercase tracking-wider mb-1">Gold Medal</p>
                <h3 className="font-black text-2xl text-blue-50 mb-1">{currentProjects[0]?.student}</h3>
                <p className="text-amber-400 font-black text-lg mb-4">{currentProjects[0]?.title}</p>
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {currentProjects[0]?.stack.slice(0, 3).map((tech, i) => (
                    <span key={i} className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded-md text-sm font-bold">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="bg-yellow-500 text-blue-950 py-2 px-5 rounded-xl text-lg font-black inline-block mx-auto shadow-md shadow-yellow-500/20">
                  {currentProjects[0]?.score} PTS
                </div>
              </div>

              {/* 3rd Place */}
              <div className="w-full sm:w-72 bg-blue-900 border-2 border-orange-500/30 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl hover:border-orange-500/50 transition-all order-3 h-auto sm:h-64 flex flex-col justify-center relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-blue-50 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-md">
                  3
                </div>
                <p className="text-orange-400 font-bold text-sm uppercase tracking-wider mb-1">Bronze Medal</p>
                <h3 className="font-black text-xl text-blue-50 mb-1">{currentProjects[2]?.student}</h3>
                <p className="text-amber-400 font-bold text-base mb-3">{currentProjects[2]?.title}</p>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {currentProjects[2]?.stack.slice(0, 2).map((tech, i) => (
                    <span key={i} className="bg-orange-500/10 text-orange-300 border border-orange-500/20 px-2 py-1 rounded-md text-sm font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="bg-orange-500/10 text-orange-300 border border-orange-500/20 py-2 px-4 rounded-xl text-base font-black inline-block mx-auto">
                  {currentProjects[2]?.score} PTS
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
            <input
              type="text"
              placeholder="Search students"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-blue-100 text-blue-950 text-base font-medium placeholder-blue-400"
            />
          </div>
        </div>

        {/* Complete Rankings Table */}
        <div className="bg-blue-900 rounded-2xl border border-blue-700 shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-blue-700 bg-blue-900">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-black text-blue-50 text-xl">Student Rankings</h3>
                <p className="text-base text-blue-300 font-medium mt-0.5">
                  Showing {filteredProjects.length} of {totalProjects} projects
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-300">
                <span className="bg-amber-400/10 text-amber-400 border border-amber-400/30 px-3 py-1 rounded-md font-bold">Live Updates</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-left text-sm font-black text-blue-300 uppercase tracking-wider border-b border-blue-700 bg-blue-950">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Student & Project</th>
                  <th className="px-6 py-4">Tech Stack</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Reviews</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-800">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-blue-800/60 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {project.rank <= 3 ? (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                            project.rank === 1 ? 'bg-yellow-500 text-blue-950' :
                            project.rank === 2 ? 'bg-blue-500 text-blue-50' :
                            'bg-orange-500 text-blue-50'
                          }`}>
                            {project.rank}
                          </div>
                        ) : (
                          <span className="font-black text-blue-400 w-8 text-center text-lg">#{project.rank}</span>
                        )}
                        {project.trending && (
                          <TrendingUp size={16} className="text-amber-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-black text-blue-50 group-hover:text-amber-400 transition-colors text-lg">
                          {project.student}
                        </p>
                        <p className="text-base text-blue-300 font-medium mt-0.5">{project.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1">
                        {project.stack.map((tech, i) => (
                          <span key={i} className="bg-blue-800 text-blue-200 border border-blue-600 px-2 py-1 rounded-md text-sm font-semibold">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-blue-800 rounded-full h-2 w-24">
                          <div 
                            className="bg-amber-400 h-2 rounded-full transition-all" 
                            style={{ width: `${project.score}%` }}
                          ></div>
                        </div>
                        <span className="font-black text-blue-100 text-base min-w-[3rem]">{project.score} pts</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-base text-blue-200 font-semibold">{project.reviews}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => onViewProject(project)} className="px-4 py-2 bg-amber-400/10 text-amber-400 border border-amber-400/30 rounded-lg font-black text-base hover:bg-amber-400 hover:text-blue-950 transition-all">
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
              <Search className="mx-auto text-blue-600 mb-3" size={48} />
              <p className="text-blue-200 font-bold text-lg">No projects found</p>
              <p className="text-blue-400 text-base mt-1">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;