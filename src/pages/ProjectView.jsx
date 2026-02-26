import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Github, ExternalLink } from "lucide-react";

export default function ProjectView() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const project = state?.project;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="bg-white p-8 rounded-2xl shadow text-center">
          <p className="text-gray-500 font-semibold">No project data found.</p>
          <button
            onClick={() => navigate("/leaderboard")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Leaderboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-300 hover:text-white mb-4 text-sm"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="flex items-center gap-3 mb-3">
            <Trophy size={26} className="text-amber-400" />
            <h1 className="text-3xl font-black">{project.projectName}</h1>
          </div>

          <p className="text-blue-300 text-sm">
            {project.studentName} · {project.community} · {project.batch}
          </p>

          <div className="mt-4 inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-bold text-sm">
            {project.points} Points
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">

          {/* Description */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Student Info */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Student Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
              <p><strong>Email:</strong> {project.email}</p>
              <p><strong>College:</strong> {project.college}</p>
              <p><strong>Duration:</strong> {project.duration}</p>
              <p><strong>Evaluation Date:</strong> {project.evaluationDate}</p>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack?.map((tech, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                <Github size={16} /> GitHub
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                <ExternalLink size={16} /> Live Demo
              </a>
            )}
          </div>

          {/* Feedback */}
          {project.feedback && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Mentor Feedback</h2>
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-gray-700">
                {project.feedback}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}