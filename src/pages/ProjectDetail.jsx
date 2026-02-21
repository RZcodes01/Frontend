import React from 'react';
import { 
  ArrowLeft, ExternalLink, Github, Calendar, 
  MessageSquare, Heart, Share2, Shield, Eye, Code2
} from 'lucide-react';

const ProjectDetail = ({ project, onBack }) => {
  const details = {
    title: project?.name || "Project Title",
    author: project?.author || "Creative Developer",
    rank: project?.rank || "-",
    score: project?.score || "0",
    description: "This project showcases advanced implementation of modern web standards and user-centric design principles.",
    techStack: project?.tags || ["React", "Tailwind", "Firebase"],
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Navigation Bar */}
      <nav className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-400 hover:text-cyan-400 transition-colors font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Leaderboard
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Media & Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl relative group border-4 border-neutral-800">
               <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
                  <Code2 size={80} className="text-white/10" />
               </div>
            </div>

            <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800">
              <h1 className="text-4xl font-black text-white mb-4">{details.title}</h1>
              <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                {details.description}
              </p>
              
              <h3 className="text-xl font-bold text-white mb-4">Core Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Real-time Data Sync", "Responsive Design", "Auth Integration", "Custom API"].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-neutral-800 rounded-xl border border-neutral-700">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-neutral-300 font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800">
               <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-800">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-400 flex items-center justify-center text-black font-bold text-xl">
                    {details.author[0]}
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 font-bold uppercase tracking-wider">Developer</p>
                    <p className="text-xl font-black text-white">{details.author}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-neutral-800 rounded-2xl border border-neutral-700 text-center">
                    <p className="text-cyan-400 text-xs font-bold uppercase">Rank</p>
                    <p className="text-2xl font-black text-white">#{details.rank}</p>
                  </div>
                  <div className="p-4 bg-neutral-800 rounded-2xl border border-neutral-700 text-center">
                    <p className="text-cyan-400 text-xs font-bold uppercase">Score</p>
                    <p className="text-2xl font-black text-white">{details.score}</p>
                  </div>
               </div>

               <h4 className="font-bold text-white mb-3">Technologies</h4>
               <div className="flex flex-wrap gap-2">
                  {details.techStack.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-neutral-800 text-neutral-400 border border-neutral-700 rounded-md text-xs font-bold">
                      {tag}
                    </span>
                  ))}
               </div>
            </div>

           
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;