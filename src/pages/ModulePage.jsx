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
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-500 font-mono text-sm tracking-widest uppercase font-bold">Loading Module...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 text-blue-950 selection:bg-amber-400/30">

      {/* Sticky Module Header */}
      <nav className="sticky top-0 z-[60] bg-blue-900/95 backdrop-blur-xl border-b border-blue-700 py-4 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => navigate(`/community/${id}`)}
              className="flex items-center gap-2 text-blue-300 hover:text-blue-50 transition-all font-bold group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline text-sm md:text-base">Exit to Community</span>
              <span className="sm:hidden text-sm">Exit</span>
            </button>
            <div className="hidden lg:flex items-center gap-3 h-6 w-px bg-blue-600" />
            <div className="hidden lg:block">
              <p className="text-xs font-black text-amber-400 uppercase tracking-widest mb-0.5">Community Project</p>
              <h2 className="text-sm font-bold text-blue-300 truncate max-w-[200px]">{community.name}</h2>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Main Video & Content Area */}
          <div className="lg:col-span-8 space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Video Player */}
            <div className="relative aspect-video bg-blue-900 rounded-2xl md:rounded-[40px] overflow-hidden border border-blue-700 shadow-[0_0_50px_-12px_rgba(251,191,36,0.15)] group">
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
                <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
                  <PlayCircle size={48} className="text-blue-700 md:w-16 md:h-16" />
                  <p className="text-blue-400 font-semibold text-sm md:text-base">Class recording is being processed...</p>
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl md:text-5xl font-black text-blue-950 tracking-tighter leading-tight">
                  {selectedModule.title}
                </h1>
                <div className="flex flex-wrap gap-3 md:gap-4 items-center">
                  <div className="flex items-center gap-2 text-amber-600 text-xs md:text-sm font-black bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/20">
                    <BookOpen size={16} /> Module Reference
                  </div>
                  <span className="text-blue-300 text-sm hidden xs:inline">•</span>
                  <span className="text-blue-600 text-sm md:text-base font-semibold">{selectedModule.topics?.length || 0} Key Concepts</span>
                </div>
              </div>

              <p className="text-blue-700 text-lg md:text-xl leading-relaxed max-w-4xl font-medium">
                {selectedModule.description || "In this deep-dive session, we analyze the core implementations and advanced workflows required for this stage of the project."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 md:pt-6">
                <div className="bg-blue-900 border border-blue-700 rounded-2xl md:rounded-3xl p-6 md:p-8">
                  <h3 className="text-lg md:text-xl font-black mb-6 text-blue-50 flex items-center gap-2">
                    <CheckCircle2 size={22} className="text-amber-400" />
                    Mastery Checklist
                  </h3>
                  <div className="space-y-3">
                    {selectedModule.topics?.map((topic, i) => (
                      <div key={i} className="flex items-start gap-3 text-blue-300 group cursor-default">
                        <div className="w-2 h-2 rounded-full bg-amber-400/50 group-hover:bg-amber-400 transition-colors shrink-0 mt-2" />
                        <span className="text-sm md:text-base font-medium group-hover:text-blue-50 transition-colors">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-900 border border-blue-700 rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-blue-800 border border-blue-600 flex items-center justify-center mb-4">
                    <Info size={22} className="text-amber-400" />
                  </div>
                  <h4 className="font-black text-blue-50 text-lg mb-2">Pre-requisite Info</h4>
                  <p className="text-sm md:text-base text-blue-300 font-medium leading-relaxed">
                    Ensure you have completed the previous module's assignment before moving forward. Success in this section depends on a strong grasp of the fundamental architecture.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Dynamic Curriculum */}
          <div className="lg:col-span-4 mt-4 lg:mt-0">
            <div className="lg:sticky lg:top-28 space-y-6 md:space-y-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl md:text-2xl font-black text-blue-950 tracking-tight flex items-center gap-3">
                  <FileText className="text-amber-500" size={24} /> Syllabus
                </h3>
                <p className="text-xs text-blue-500 font-bold uppercase tracking-widest">Ongoing Curriculum</p>
              </div>

              <div className="bg-blue-900 border border-blue-700 rounded-3xl md:rounded-[40px] p-2 md:p-3 overflow-hidden shadow-2xl">
                <div className="space-y-1 md:space-y-2">
                  {selectedModule.topics?.map((topic, index) => (
                    <div
                      key={index}
                      className={`group p-3 md:p-4 rounded-2xl md:rounded-[28px] transition-all flex items-center gap-4 cursor-pointer
                        ${index === 0 ? 'bg-blue-800 border border-blue-600' : 'hover:bg-blue-800/60 border border-transparent'}`}
                    >
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl shrink-0 flex items-center justify-center text-xs md:text-sm font-mono font-black transition-all
                        ${index === 0 ? 'bg-amber-400 text-blue-950 shadow-lg shadow-amber-400/20' : 'bg-blue-950 border border-blue-700 text-blue-500 group-hover:text-blue-200'}`}>
                        {(index + 1).toString().padStart(2, '0')}
                      </div>

                      <div className="flex flex-col overflow-hidden">
                        <span className={`text-sm md:text-base font-bold truncate transition-colors ${index === 0 ? 'text-blue-50' : 'text-blue-400 group-hover:text-blue-100'}`}>
                          {topic}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <PlayCircle size={11} className={index === 0 ? 'text-amber-400' : 'text-blue-600'} />
                          <span className="text-[10px] md:text-xs font-bold text-blue-500 uppercase tracking-tighter">Core Concept</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}