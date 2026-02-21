import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Layers, Clock, Code2, User } from "lucide-react";
import { fetchProjectById } from "../api/project.api";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await fetchProjectById(projectId);
        // Your backend returns { success: true, data: project }
        setProject(res.data.data);
      } catch (err) {
        console.error("Failed to fetch project", err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white font-medium">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          Loading Project...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-cyan-400 hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isClosed = new Date(project.dueDate) < new Date();

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Navbar */}
      <nav className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-neutral-400 hover:text-cyan-400 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner Image */}
          <div className="aspect-video bg-neutral-900 rounded-3xl border border-neutral-800 relative overflow-hidden">
            {project.bannerImage ? (
              <img
                src={project.bannerImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
                <Code2 size={80} className="text-white/10" />
              </div>
            )}
          </div>

          {/* Project Header & Description */}
          <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-black text-white">
                {project.title}
              </h1>
              <span
                className={`px-4 py-1 rounded-full text-xs font-semibold border ${isClosed
                    ? "bg-red-400/10 text-red-400 border-red-400/20"
                    : "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                  }`}
              >
                {isClosed ? "Closed" : "Open"}
              </span>
            </div>

            <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
              {project.description}
            </p>

            <div className="flex items-center gap-3 text-neutral-400 text-sm border-t border-neutral-800 pt-6">
              <Calendar size={18} className="text-cyan-500" />
              <span className="font-medium">Due Date:</span>
              {new Date(project.dueDate).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 sticky top-24">
            <h2 className="text-white font-bold text-xl mb-6 border-b border-neutral-800 pb-4">
              Project Details
            </h2>

            <div className="space-y-5">
              {/* Community Info */}
              <div className="flex items-start gap-4">
                <div className="p-2 bg-neutral-800 rounded-lg">
                  <Layers size={20} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Community</p>
                  <p className="text-neutral-200 font-medium">{project.communityId?.name || "No Community"}</p>
                </div>
              </div>

              {/* Batch Info */}
              {project.batchId && (
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-neutral-800 rounded-lg">
                    <Clock size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Batch</p>
                    <p className="text-neutral-200 font-medium">{project.batchId?.name}</p>
                  </div>
                </div>
              )}

              {/* Mentor Info */}
              <div className="flex items-start gap-4">
                <div className="p-2 bg-neutral-800 rounded-lg">
                  <User size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Mentor</p>
                  <p className="text-neutral-200 font-medium">{project.mentorId?.name || "Assigned Mentor"}</p>
                </div>
              </div>
            </div>

            {/* Placeholder for future "Submit Project" Button */}
            <button className="w-full mt-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-cyan-900/20">
              Submit Project
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}