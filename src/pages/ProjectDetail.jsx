import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Layers, Clock, Code2, User, CheckCircle2, Star } from "lucide-react";
import { fetchProjectById } from "../api/project.api";
import { getMySubmissions } from "../api/submission.api";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await fetchProjectById(projectId);
        // Your backend returns { success: true, data: project }
        setProject(res.data.data);

        // Check if current student already submitted this project
        try {
          const subRes = await getMySubmissions();
          const submissions = subRes.data.data || [];
          const match = submissions.find(
            (s) => (s.projectId?._id || s.projectId) === projectId
          );
          if (match) setSubmission(match);
        } catch {
          // Not a student or no submissions — ignore
        }
      } catch (err) {
        console.error("Failed to fetch project", err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-700 font-medium">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          Loading Project...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isClosed = new Date(project.dueDate) < new Date();

  return (
    <div className="min-h-full bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-semibold transition-colors"
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
          <div className="aspect-video bg-white rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
            {project.bannerImage ? (
              <img
                src={project.bannerImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <Code2 size={80} className="text-gray-200" />
              </div>
            )}
          </div>

          {/* Project Header & Description */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-black text-gray-900">
                {project.title}
              </h1>
              <span
                className={`px-4 py-1 rounded-full text-xs font-semibold border ${isClosed
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-emerald-50 text-emerald-600 border-emerald-200"
                  }`}
              >
                {isClosed ? "Closed" : "Open"}
              </span>
            </div>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {project.description}
            </p>

            <div className="flex items-center gap-3 text-gray-500 text-sm border-t border-gray-200 pt-6">
              <Calendar size={18} className="text-blue-500" />
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
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm sticky top-24">
            <h2 className="text-gray-900 font-bold text-xl mb-6 border-b border-gray-200 pb-4">
              Project Details
            </h2>

            <div className="space-y-5">
              {/* Community Info */}
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Layers size={20} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Community</p>
                  <p className="text-gray-800 font-medium">{project.communityId?.name || "No Community"}</p>
                </div>
              </div>

              {/* Batch Info */}
              {project.batchId && (
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <Clock size={20} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Batch</p>
                    <p className="text-gray-800 font-medium">{project.batchId?.name}</p>
                  </div>
                </div>
              )}

              {/* Mentor Info */}
              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <User size={20} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mentor</p>
                  <p className="text-gray-800 font-medium">{project.mentorId?.name || "Assigned Mentor"}</p>
                </div>
              </div>
            </div>

            {/* Submit / Status Button */}
            {submission ? (
              <div className="mt-8 space-y-3">
                {/* Submitted Badge */}
                <div className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm border ${
                  submission.status === "reviewed"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : "bg-amber-50 text-amber-600 border-amber-200"
                }`}>
                  <CheckCircle2 size={18} />
                  {submission.status === "reviewed" ? "Reviewed" : "Submitted"}
                </div>

                {/* Grade & Feedback (if reviewed) */}
                {submission.status === "reviewed" && (
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Grade</span>
                      <div className="flex items-center gap-1.5">
                        <Star size={14} className="text-amber-500" />
                        <span className="text-lg font-black text-gray-900">{submission.grade}</span>
                        <span className="text-gray-400 text-sm">/100</span>
                      </div>
                    </div>
                    {submission.feedback && (
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Feedback</span>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{submission.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : !isClosed ? (
              <button
                onClick={() => navigate(`/projects/${projectId}/submit`)}
                className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200/50"
              >
                Submit Project
              </button>
            ) : null}
          </div>
        </div>

      </main>
    </div>
  );
}