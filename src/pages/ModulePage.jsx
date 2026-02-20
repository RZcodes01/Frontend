import {
  BookOpen,
  ArrowLeft,
  PlayCircle,
  FileText,
  CheckCircle2
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCommunityById } from "../api/community.api";

export default function ModulePage() {
  const { id, moduleId } = useParams(); // must match route
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
        console.log("Selected Module:", foundModule);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id, moduleId]);

  if (!selectedModule || !community) return null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors font-medium group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Course Overview
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">

              <div className="aspect-video bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
                {selectedModule.youtubeUrl ? (
                  <iframe
                    src={selectedModule.youtubeUrl}
                    title="Module Video"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-neutral-500">
                    No video available
                  </div>
                )}
              </div>

              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8 shadow-sm">
                <h1 className="text-3xl font-bold mb-4 text-white">
                  {selectedModule.title}
                </h1>

                <p className="text-neutral-400 text-lg mb-6 leading-relaxed">
                  {selectedModule.description}
                </p>

                <div className="h-px bg-neutral-800 my-8" />

                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  Lesson Overview
                </h3>

                <div className="prose prose-invert max-w-none text-neutral-400 space-y-4">
                  <p>
                    Welcome to the deep-dive session of{" "}
                    <strong>{selectedModule.title}</strong>.
                    In this lesson, we will cover the fundamental architectures
                    and best practices required to master these concepts.
                  </p>

                  <div className="bg-neutral-950 p-6 rounded-xl border border-neutral-800">
                    <h4 className="text-cyan-400 font-bold mb-2 uppercase text-xs tracking-widest">
                      Key Learning Points
                    </h4>

                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedModule.topics?.map((topic, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Topics of Current Module (Original UI) */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 px-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Curriculum
              </h3>

              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden sticky top-8">
                {selectedModule.topics?.map((topic, index) => (
                  <div
                    key={index}
                    className="p-4 border-b border-neutral-800 last:border-0 hover:bg-neutral-800/50 cursor-pointer transition-all flex items-center gap-4 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-xs font-mono text-neutral-500 group-hover:border-cyan-500/50 group-hover:text-cyan-400">
                      {index + 1}
                    </div>

                    <span className="text-sm font-medium text-neutral-300 group-hover:text-white">
                      {topic}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}