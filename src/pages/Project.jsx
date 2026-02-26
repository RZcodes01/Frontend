import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trophy, Medal, Award, Filter, ChevronRight } from "lucide-react";

const DUMMY_PROJECTS = [
  {
    projectName: "EduTrack AI",
    studentName: "Aarav Mehta",
    studentId: "STU001",
    email: "aarav@example.com",
    batch: "Batch 3",
    college: "IIT Bombay",
    duration: "3 months",
    description: "An AI-powered student performance tracking system with real-time analytics.",
    techStack: ["React", "Python", "TensorFlow", "MongoDB"],
    githubUrl: "https://github.com/example/edutrack",
    liveUrl: "https://edutrack.vercel.app",
    feedback: "Exceptional ML model and clean UI.",
    evaluationDate: "2024-12-15",
    points: 95,
    community: "AI & ML",
  },
  {
    projectName: "GreenCart",
    studentName: "Sneha Iyer",
    studentId: "STU002",
    email: "sneha@example.com",
    batch: "Batch 3",
    college: "NIT Trichy",
    duration: "2 months",
    description: "Sustainable e-commerce platform tracking carbon footprint.",
    techStack: ["Next.js", "Node.js", "PostgreSQL"],
    githubUrl: "https://github.com/example/greencart",
    liveUrl: "https://greencart.vercel.app",
    feedback: "Great sustainability concept.",
    evaluationDate: "2024-12-10",
    points: 91,
    community: "Web Dev",
  },
  {
    projectName: "MediScan",
    studentName: "Rohan Das",
    studentId: "STU003",
    email: "rohan@example.com",
    batch: "Batch 2",
    college: "BITS Pilani",
    duration: "4 months",
    description: "Medical image analysis tool using deep learning.",
    techStack: ["Python", "PyTorch", "React"],
    githubUrl: "https://github.com/example/mediscan",
    liveUrl: "https://mediscan.vercel.app",
    feedback: "Impressive accuracy.",
    evaluationDate: "2024-11-28",
    points: 88,
    community: "AI & ML",
  },
  {
    projectName: "CampusConnect",
    studentName: "Anjali Nair",
    studentId: "STU004",
    email: "anjali@example.com",
    batch: "Batch 2",
    college: "VIT Vellore",
    duration: "2 months",
    description: "Campus networking app.",
    techStack: ["React Native", "Firebase"],
    githubUrl: "https://github.com/example/campusconnect",
    liveUrl: "https://campusconnect.app",
    feedback: "Strong real-time features.",
    evaluationDate: "2024-11-20",
    points: 84,
    community: "Mobile Dev",
  },
  {
    projectName: "DevFlow",
    studentName: "Vikram Singh",
    studentId: "STU005",
    email: "vikram@example.com",
    batch: "Batch 3",
    college: "DTU Delhi",
    duration: "3 months",
    description: "Developer productivity tool.",
    techStack: ["Vue.js", "Go", "Docker"],
    githubUrl: "https://github.com/example/devflow",
    liveUrl: "https://devflow.io",
    feedback: "Smart architecture.",
    evaluationDate: "2024-12-01",
    points: 82,
    community: "Web Dev",
  },
  {
    projectName: "StockSense",
    studentName: "Pooja Kulkarni",
    studentId: "STU006",
    email: "pooja@example.com",
    batch: "Batch 2",
    college: "SRM University",
    duration: "2 months",
    description: "Stock prediction dashboard.",
    techStack: ["Python", "React"],
    githubUrl: "https://github.com/example/stocksense",
    liveUrl: "https://stocksense.vercel.app",
    feedback: "Good NLP usage.",
    evaluationDate: "2024-11-15",
    points: 78,
    community: "AI & ML",
  },
  {
    projectName: "RideEase",
    studentName: "Arjun Pillai",
    studentId: "STU007",
    email: "arjun@example.com",
    batch: "Batch 3",
    college: "Amrita University",
    duration: "3 months",
    description: "Carpooling app with route optimization.",
    techStack: ["React Native", "Node.js"],
    githubUrl: "https://github.com/example/rideease",
    liveUrl: "https://rideease.app",
    feedback: "Efficient routing.",
    evaluationDate: "2024-12-05",
    points: 75,
    community: "Mobile Dev",
  },
  {
    projectName: "BudgetBuddy",
    studentName: "Meera Joshi",
    studentId: "STU008",
    email: "meera@example.com",
    batch: "Batch 2",
    college: "Pune University",
    duration: "2 months",
    description: "Personal finance tracker.",
    techStack: ["React", "Express"],
    githubUrl: "https://github.com/example/budgetbuddy",
    liveUrl: "https://budgetbuddy.vercel.app",
    feedback: "Clean and practical.",
    evaluationDate: "2024-11-10",
    points: 72,
    community: "Web Dev",
  },
  {
    projectName: "FitTrack Pro",
    studentName: "Neha Kapoor",
    studentId: "STU009",
    email: "neha@example.com",
    batch: "Batch 3",
    college: "Manipal University",
    duration: "3 months",
    description: "AI fitness tracking app.",
    techStack: ["Flutter", "Firebase"],
    githubUrl: "https://github.com/example/fittrack",
    liveUrl: "https://fittrack.app",
    feedback: "Strong health insights.",
    evaluationDate: "2024-12-12",
    points: 89,
    community: "Mobile Dev",
  },
  {
    projectName: "CodeCollab",
    studentName: "Harsh Agarwal",
    studentId: "STU010",
    email: "harsh@example.com",
    batch: "Batch 3",
    college: "IIIT Hyderabad",
    duration: "3 months",
    description: "Real-time collaborative coding platform.",
    techStack: ["React", "Socket.io", "Node.js"],
    githubUrl: "https://github.com/example/codecollab",
    liveUrl: "https://codecollab.app",
    feedback: "Smooth collaboration.",
    evaluationDate: "2024-12-08",
    points: 86,
    community: "Web Dev",
  },
  {
    projectName: "AgroSmart",
    studentName: "Tanmay Rao",
    studentId: "STU011",
    email: "tanmay@example.com",
    batch: "Batch 2",
    college: "Anna University",
    duration: "4 months",
    description: "Smart farming solution using IoT.",
    techStack: ["IoT", "Python", "Django"],
    githubUrl: "https://github.com/example/agrosmart",
    liveUrl: "https://agrosmart.app",
    feedback: "Innovative IoT integration.",
    evaluationDate: "2024-11-18",
    points: 83,
    community: "AI & ML",
  },
  {
    projectName: "TravelMate",
    studentName: "Isha Malhotra",
    studentId: "STU012",
    email: "isha@example.com",
    batch: "Batch 3",
    college: "Delhi University",
    duration: "2 months",
    description: "AI travel planner with itinerary optimization.",
    techStack: ["Next.js", "OpenAI API"],
    githubUrl: "https://github.com/example/travelmate",
    liveUrl: "https://travelmate.app",
    feedback: "Creative AI usage.",
    evaluationDate: "2024-12-03",
    points: 80,
    community: "Web Dev",
  },
];

const COMMUNITIES = ["All", "AI & ML", "Web Dev", "Mobile Dev"];
const BATCHES = ["All", "Batch 2", "Batch 3"];

const RankIcon = ({ rank }) => {
  if (rank === 1) return <Trophy size={20} className="text-amber-400" />;
  if (rank === 2) return <Medal size={20} className="text-slate-400" />;
  if (rank === 3) return <Award size={20} className="text-orange-400" />;
  return <span className="text-gray-400 font-bold text-sm w-5 text-center">#{rank}</span>;
};

const getRankBg = (rank) => {
  if (rank === 1) return "bg-amber-50 border-amber-200 hover:bg-amber-100";
  if (rank === 2) return "bg-slate-50 border-slate-200 hover:bg-slate-100";
  if (rank === 3) return "bg-orange-50 border-orange-200 hover:bg-orange-100";
  return "bg-white border-gray-100 hover:bg-blue-50";
};

const getScoreBg = (points) => {
  if (points >= 90) return "bg-amber-100 text-amber-700";
  if (points >= 75) return "bg-blue-100 text-blue-700";
  return "bg-indigo-100 text-indigo-700";
};

export default function Project() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [community, setCommunity] = useState("All");
  const [batch, setBatch] = useState("All");

  const filtered = useMemo(() => {
    return [...DUMMY_PROJECTS]
      .filter((p) => {
        const matchSearch =
          p.projectName.toLowerCase().includes(search.toLowerCase()) ||
          p.studentName.toLowerCase().includes(search.toLowerCase());
        const matchCommunity = community === "All" || p.community === community;
        const matchBatch = batch === "All" || p.batch === batch;
        return matchSearch && matchCommunity && matchBatch;
      })
      .sort((a, b) => b.points - a.points);
  }, [search, community, batch]);

  const handleViewClick = (project) => {
    navigate("/project-view", {
      state: { project },
    });
  };

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 rounded-2xl p-6 sm:p-10 mb-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={28} className="text-amber-400" />
            <h1 className="text-3xl sm:text-4xl font-black">Leaderboard</h1>
          </div>
          <p className="text-blue-300 text-sm sm:text-base">
            Top student projects ranked by mentor evaluation scores
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6 flex flex-col sm:flex-row gap-3">

          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by project or student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              className="pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white"
            >
              {COMMUNITIES.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Communities" : c}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white"
            >
              {BATCHES.map((b) => (
                <option key={b} value={b}>
                  {b === "All" ? "All Batches" : b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Project List */}
        <div className="flex flex-col gap-3">
          {filtered.map((project, index) => {
            const rank = index + 1;

            return (
              <div
                key={project.studentId}
                className={`w-full border rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm ${getRankBg(rank)}`}
              >
                <div className="w-8 flex items-center justify-center">
                  <RankIcon rank={rank} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 text-sm sm:text-base truncate">
                    {project.projectName}
                  </p>
                  <p className="text-xs text-gray-400 font-medium truncate">
                    {project.studentName} · {project.community} · {project.batch}
                  </p>
                </div>

                <div className={`px-3 py-1.5 rounded-xl text-sm font-black ${getScoreBg(project.points)}`}>
                  {project.points} pts
                </div>

                {/* ✅ View Button */}
                <button
                  onClick={() => handleViewClick(project)}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  View
                  <ChevronRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}