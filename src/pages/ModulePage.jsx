import {
  BookOpen,
  ArrowLeft,
  PlayCircle,
  FileText,
  CheckCircle2,
  Share2,
  Bookmark,
  ChevronRight,
  Info
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCommunityById } from "../api/community.api";

export default function ModulePage() {
  const { id, moduleId } = useParams();
  const navigate = useNavigate();

  const [community, setCommunity] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchCommunityById(id);
        const comm = res.data.community;
        setCommunity(comm);
        const foundModule = comm.modules.find(
          (m) => m._id.toString() === moduleId
        );
        setSelectedModule(foundModule);
      } catch (error) {
        console.error("Error fetching module data:", error);
      }
    };
    fetchData();
  }, [id, moduleId]);

  if (!selectedModule || !community) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-500 font-mono text-xs tracking-widest uppercase">Loading Module...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      {/* Sticky Module Header 
          Note: This now handles the transition from your global Navbar seamlessly 
      */}
      <nav className="sticky top-0 z-[60] bg-black/80 backdrop-blur-xl border-b border-white/5 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(`/community/${id}`)}
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-all font-bold group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Exit to Community</span>
            </button>
            <div className="hidden lg:flex items-center gap-3 h-6 w-px bg-white/10" />
            <div className="hidden lg:block">
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-0.5">Community Project</p>
              <h2 className="text-xs font-bold text-neutral-400 truncate max-w-[200px]">{community.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-tighter text-neutral-300">Class in session</span>
            </div>
            <button className="p-2 text-neutral-400 hover:text-white transition-colors hidden sm:block">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Video & Content Area */}
          <div className="lg:col-span-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Video Player - Cinema Styling */}
            <div className="relative aspect-video bg-neutral-900 rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(34,211,238,0.15)] group">
              {selectedModule.youtubeUrl ? (
                <iframe
                  src={`${selectedModule.youtubeUrl}?modestbranding=1&rel=0&autoplay=0`}
                  title="Module Video"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <PlayCircle size={64} className="text-neutral-800" />
                  <p className="text-neutral-500 font-medium">Class recording is being processed...</p>
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="space-y-8">
              <div className="flex flex-col gap-4">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                  {selectedModule.title}
                </h1>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold bg-cyan-400/10 px-3 py-1 rounded-lg">
                    <BookOpen size={16} /> Module Reference
                  </div>
                  <span className="text-neutral-600 text-sm">•</span>
                  <span className="text-neutral-400 text-sm font-medium">{selectedModule.topics?.length || 0} Key Concepts</span>
                </div>
              </div>

              <p className="text-neutral-400 text-xl leading-relaxed max-w-4xl">
                {selectedModule.description || "In this deep-dive session, we analyze the core implementations and advanced workflows required for this stage of the project."}
              </p>

              <div className="grid md:grid-cols-2 gap-6 pt-6">
                <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-8">
                  <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-cyan-500" />
                    Mastery Checklist
                  </h3>
                  <div className="space-y-3">
                    {selectedModule.topics?.map((topic, i) => (
                      <div key={i} className="flex items-center gap-3 text-neutral-400 group cursor-default">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 group-hover:bg-cyan-400 transition-colors" />
                        <span className="text-sm font-medium group-hover:text-neutral-200 transition-colors">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-neutral-900/60 to-transparent border border-white/5 rounded-3xl p-8 flex flex-col">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                    <Info size={20} className="text-neutral-400" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Pre-requisite Info</h4>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    Ensure you have completed the previous module's assignment before moving forward. Success in this section depends on a strong grasp of the fundamental architecture.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Dynamic Curriculum */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  <FileText className="text-cyan-500" size={24} /> Syllabus
                </h3>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Ongoing Curriculum</p>
              </div>

              <div className="bg-neutral-900/40 border border-white/5 rounded-[40px] p-3 overflow-hidden shadow-2xl">
                <div className="space-y-2">
                  {selectedModule.topics?.map((topic, index) => (
                    <div
                      key={index}
                      className={`group p-4 rounded-[28px] transition-all flex items-center gap-4 cursor-pointer
                        ${index === 0 ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5 border border-transparent'}`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-mono font-black transition-all
                        ${index === 0 ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'bg-black border border-white/5 text-neutral-600 group-hover:text-white'}`}>
                        {(index + 1).toString().padStart(2, '0')}
                      </div>

                      <div className="flex flex-col overflow-hidden">
                        <span className={`text-sm font-bold truncate transition-colors ${index === 0 ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`}>
                          {topic}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <PlayCircle size={10} className={index === 0 ? 'text-cyan-400' : 'text-neutral-600'} />
                          <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-tighter">Core Concept</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Step Callout */}
              <div className="p-8 rounded-[40px] bg-cyan-500 text-black shadow-2xl shadow-cyan-500/20 group cursor-pointer active:scale-[0.98] transition-all">
                <div className="flex justify-between items-start mb-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Ready to level up?</p>
                  <ChevronRight size={20} />
                </div>
                <h4 className="text-xl font-black leading-tight mb-2">Start the Module Assignment</h4>
                <p className="text-xs font-bold opacity-70">Submit your work to get peer feedback.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}