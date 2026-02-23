// ModulePage.jsx
import {
  ArrowLeft,
  PlayCircle,
  BookOpen,
  FileText,
  CheckCircle2
} from "lucide-react";

export default function ModulePage({ module, onBack }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors font-medium group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Course Overview
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-neutral-900 rounded-2xl border border-neutral-800 flex flex-col items-center justify-center relative group">
            <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <PlayCircle className="w-20 h-20 text-cyan-400 opacity-80 group-hover:scale-110 transition-all cursor-pointer" />
            <p className="mt-4 text-neutral-500 font-medium">
              Click to play Module Video
            </p>
          </div>

          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8">
            <h1 className="text-3xl font-bold mb-4 text-white">
              {module.title}
            </h1>

            <p className="text-neutral-400 text-lg mb-6 leading-relaxed">
              {module.description}
            </p>

            <div className="h-px bg-neutral-800 my-8" />

            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Lesson Overview
            </h3>

            <div className="bg-neutral-950 p-6 rounded-xl border border-neutral-800">
              <h4 className="text-cyan-400 font-bold mb-4 uppercase text-xs tracking-widest">
                Key Learning Points
              </h4>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {module.topics?.map((topic, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-cyan-400" />
            Curriculum
          </h3>

          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden sticky top-8">
            {module.topics?.map((topic, index) => (
              <div
                key={index}
                className="p-4 border-b border-neutral-800 last:border-0 hover:bg-neutral-800/50 cursor-pointer flex items-center gap-4 group"
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
  );
}