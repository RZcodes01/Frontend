import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  BookOpen,
  Building2,
  Code2,
  Globe,
  Github,
  Clock,
  Star,
  Award,
  MessageSquareQuote,
  CalendarCheck,
  Layers,
  GraduationCap,
  BadgeCheck,
} from "lucide-react";

const Badge = ({ children, color = "blue" }) => {
  const colors = {  
    blue: "bg-blue-100 text-blue-800",
    amber: "bg-amber-100 text-amber-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 p-1.5 bg-blue-50 rounded-lg">
      <Icon size={15} className="text-blue-600" />
    </div>
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const ScoreRing = ({ score }) => {
  const pct = score;
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;
  const color = score >= 90 ? "#f59e0b" : score >= 75 ? "#3b82f6" : "#6366f1";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={radius} strokeWidth="8" fill="none" stroke="#e2e8f0" />
        <circle
          cx="48"
          cy="48"
          r={radius}
          strokeWidth="8"
          fill="none"
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-black text-gray-800">{score}</span>
        <span className="text-[10px] text-gray-400 font-medium">/ 100</span>
      </div>
    </div>
  );
};

const ProjectView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <p className="text-blue-900 font-bold text-xl mb-4">No project data found.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { project, community } = state;
  const { mentor } = project;

  const scoreColor =
    project.points >= 90
      ? "text-amber-500"
      : project.points >= 75
      ? "text-blue-600"
      : "text-indigo-500";

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-700 hover:text-amber-500 font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Leaderboard
        </button>

        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 rounded-2xl p-6 sm:p-10 mb-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400 opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge color="amber">{community}</Badge>
                <Badge color="blue">{project.batch}</Badge>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black mb-2 leading-tight">
                {project.projectName}
              </h1>
              <p className="text-blue-200 text-sm sm:text-base font-medium">
                by {project.studentName} · {project.studentId}
              </p>
            </div>

            {/* Score Ring */}
            <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
              <svg width="96" height="96" className="-rotate-90 absolute">
                <circle cx="48" cy="48" r="36" strokeWidth="8" fill="none" stroke="rgba(255,255,255,0.15)" />
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  strokeWidth="8"
                  fill="none"
                  stroke={project.points >= 90 ? "#f59e0b" : "#60a5fa"}
                  strokeDasharray={2 * Math.PI * 36}
                  strokeDashoffset={2 * Math.PI * 36 - (project.points / 100) * 2 * Math.PI * 36}
                  strokeLinecap="round"
                />
              </svg>
              <div className="relative text-center">
                <p className={`text-3xl font-black ${scoreColor}`}>{project.points}</p>
                <p className="text-[10px] text-blue-300 font-medium">pts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — Project Info (spans 2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Project Description */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Layers size={18} className="text-amber-500" />
                <h2 className="text-lg font-black text-blue-900">Project Overview</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {project.description}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Code2 size={18} className="text-amber-500" />
                <h2 className="text-lg font-black text-blue-900">Tech Stack</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-xs font-bold tracking-wide"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe size={18} className="text-amber-500" />
                <h2 className="text-lg font-black text-blue-900">Project Links</h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors"
                >
                  <Github size={16} />
                  View on GitHub
                </a>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 text-gray-900 rounded-xl text-sm font-semibold hover:bg-amber-300 transition-colors"
                >
                  <Globe size={16} />
                  Live Demo
                </a>
              </div>
            </div>

            {/* Mentor Feedback */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquareQuote size={18} className="text-amber-600" />
                <h2 className="text-lg font-black text-amber-900">Mentor Feedback</h2>
              </div>
              <blockquote className="text-gray-700 italic leading-relaxed text-sm sm:text-base border-l-4 border-amber-400 pl-4">
                "{project.feedback}"
              </blockquote>
              <div className="mt-3 flex items-center gap-2">
                <CalendarCheck size={14} className="text-amber-600" />
                <span className="text-xs text-amber-700 font-semibold">
                  Evaluated on {project.evaluationDate}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — Student & Mentor Cards */}
          <div className="flex flex-col gap-6">

            {/* Student Card */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-5">
                <User size={18} className="text-amber-500" />
                <h2 className="text-lg font-black text-blue-900">Student Details</h2>
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center mb-5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl font-black mb-2 shadow-lg">
                  {project.studentName.split(" ").map((n) => n[0]).join("")}
                </div>
                <p className="font-black text-blue-900 text-base">{project.studentName}</p>
                <p className="text-xs text-gray-400 font-medium">{project.studentId}</p>
              </div>

              <div className="flex flex-col gap-3.5">
                <InfoRow icon={Mail} label="Email" value={project.email} />
                <InfoRow icon={BookOpen} label="Batch" value={project.batch} />
                <InfoRow icon={Building2} label="College" value={project.college} />
                <InfoRow icon={Layers} label="Community" value={community} />
                <InfoRow icon={Clock} label="Project Duration" value={project.duration} />
              </div>
            </div>

            {/* Mentor Card */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-5">
                <GraduationCap size={18} className="text-amber-500" />
                <h2 className="text-lg font-black text-blue-900">Mentor Details</h2>
              </div>

              {/* Mentor Avatar */}
              <div className="flex flex-col items-center mb-5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center text-white text-xl font-black mb-2 shadow-lg">
                  {mentor.avatar}
                </div>
                <p className="font-black text-blue-900 text-base">{mentor.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <BadgeCheck size={13} className="text-green-500" />
                  <span className="text-xs text-green-600 font-semibold">Verified Mentor</span>
                </div>
              </div>

              <div className="flex flex-col gap-3.5">
                <InfoRow icon={Star} label="Expertise" value={mentor.expertise} />
                <InfoRow icon={Award} label="Experience" value={mentor.experience} />
                <InfoRow icon={CalendarCheck} label="Evaluation Date" value={project.evaluationDate} />
              </div>
            </div>

            {/* Score Summary */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-2xl p-6 text-white text-center">
              <p className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-2">
                Final Score
              </p>
              <p className={`text-6xl font-black mb-1 ${project.points >= 90 ? "text-amber-400" : "text-white"}`}>
                {project.points}
              </p>
              <p className="text-blue-400 text-sm">out of 100</p>
              <div className="mt-4 w-full bg-blue-800 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-300"
                  style={{ width: `${project.points}%`, transition: "width 1s ease" }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;