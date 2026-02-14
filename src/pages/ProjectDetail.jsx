import React from 'react';
import { 
  ArrowLeft, ExternalLink, Github, Calendar, 
  MessageSquare, Heart, Share2, Shield, Eye, Code2
} from 'lucide-react';

const ProjectDetail = ({ project, onBack }) => {
  // Use data passed from the leaderboard or fallback to defaults
  const details = {
    title: project?.name || "Project Title",
    author: project?.author || "Creative Developer",
    rank: project?.rank || "-",
    score: project?.score || "0",
    description: "This project showcases advanced implementation of modern web standards and user-centric design principles.",
    techStack: project?.tags || ["React", "Tailwind", "Firebase"],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Leaderboard
          </button>
          <div className="flex gap-3">
             <button className="hidden md:flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                <Share2 size={18} /> Share
             </button>
             <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                <ExternalLink size={18} /> Live Demo
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Media & Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-indigo-900 rounded-3xl overflow-hidden shadow-2xl relative group border-8 border-white">
               <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                  <Code2 size={80} className="text-white/20" />
               </div>
               {/* Image would go here: <img src={project.image} /> */}
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h1 className="text-4xl font-black text-slate-900 mb-4">{details.title}</h1>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {details.description}
              </p>
              
              <h3 className="text-xl font-bold mb-4">Core Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Real-time Data Sync", "Responsive Design", "Auth Integration", "Custom API"].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-slate-700 font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
               <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-50">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {details.author[0]}
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Developer</p>
                    <p className="text-xl font-black text-slate-900">{details.author}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                    <p className="text-orange-600 text-xs font-bold uppercase">Rank</p>
                    <p className="text-2xl font-black text-orange-700">#{details.rank}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                    <p className="text-blue-600 text-xs font-bold uppercase">Score</p>
                    <p className="text-2xl font-black text-blue-700">{details.score}</p>
                  </div>
               </div>

               <h4 className="font-bold text-slate-900 mb-3">Technologies</h4>
               <div className="flex flex-wrap gap-2">
                  {details.techStack.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold">
                      {tag}
                    </span>
                  ))}
               </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 p-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">
               <Github size={20} /> View Source Code
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;