import { useState, useEffect } from "react";
import {
  ArrowLeft, Mail, AtSign, Calendar, Code, Target,
  Trophy, Send, CheckCircle, Clock, BarChart3,
  Zap, Award, TrendingUp, Loader2, AlertCircle,
} from "lucide-react";
import { fetchStudentProfile } from "../api/companyDashboard.api";

function avatarUrl(name, profileImage) {
  if (profileImage) return profileImage;
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || "U")}&backgroundColor=0369a1,0e7490,0891b2&fontSize=40`;
}

export default function CompanyStudentProfile({ studentId, onBack }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    setError(null);
    fetchStudentProfile(studentId)
      .then((res) => setStudent(res.data.user))
      .catch((err) => setError(err.response?.data?.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, [studentId]);

  // ─── Loading State ─────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fadeIn">
        <Loader2 size={40} className="text-amber-400 animate-spin mb-4" />
        <p className="text-blue-400 font-semibold">Loading student profile...</p>
      </div>
    );
  }

  // ─── Error State ───────────────────────────────
  if (error || !student) {
    return (
      <div className="animate-fadeIn">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-300 hover:text-amber-400 transition-colors mb-8 group font-semibold">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle size={48} className="text-red-400 mb-4" />
          <p className="text-red-400 font-bold text-lg">{error || "Student not found"}</p>
          <p className="text-blue-500 text-sm mt-1">Please try again or go back to the dashboard.</p>
        </div>
      </div>
    );
  }

  const s = student;
  const maxProgress = Math.max(...(s.progressData || []).map((d) => d.problemsSolved), 1);

  const difficultyData = [
    { label: "Easy", value: s.problemsSolved?.easy || 0, color: "#22c55e", bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
    { label: "Medium", value: s.problemsSolved?.medium || 0, color: "#f59e0b", bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
    { label: "Hard", value: s.problemsSolved?.hard || 0, color: "#ef4444", bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" },
  ];

  const statusIcon = {
    Accepted: <CheckCircle size={14} className="text-emerald-400" />,
    Pending: <Clock size={14} className="text-amber-400" />,
  };

  const statusColor = {
    Accepted: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    Pending: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };

  const totalProblems = (s.problemsSolved?.total) || 1;
  const primaryCommunity = s.communities?.[0]?.name || "No Community";
  const joinedDate = s.joinedDate ? new Date(s.joinedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Unknown";

  return (
    <div className="min-h-screen pb-20 animate-fadeIn">

      {/* Back Button */}
      <button onClick={onBack} className="flex items-center gap-2 text-blue-300 hover:text-amber-400 transition-colors mb-8 group font-semibold">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </button>

      {/* Profile Header */}
      <div className="bg-gradient-to-br from-blue-900/80 to-blue-950 border border-blue-800/60 rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-400/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />

        <div className="relative flex flex-col sm:flex-row items-start gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-blue-700 shadow-xl flex-shrink-0">
            <img src={avatarUrl(s.name, s.profileImage)} alt={s.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-blue-50">{s.name}</h1>
              {s.communityRank && (
                <span className="px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider">
                  Rank #{s.communityRank}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-blue-300">
              {s.username && (
                <span className="flex items-center gap-1.5">
                  <AtSign size={14} className="text-blue-500" /> {s.username}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-blue-500" /> {s.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-blue-500" /> Joined {joinedDate}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {(s.communities || []).map((c) => (
                <span key={c._id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-800/50 border border-blue-700 rounded-lg text-blue-200 text-xs font-semibold">
                  <Code size={12} /> {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Problems Solved", value: s.problemsSolved?.total || 0, icon: Target, color: "text-blue-400", iconBg: "bg-blue-500/10" },
          { label: "Community Rank", value: s.communityRank ? `#${s.communityRank}` : "—", icon: Trophy, color: "text-amber-400", iconBg: "bg-amber-500/10" },
          { label: "Total Score", value: s.score || 0, icon: Award, color: "text-purple-400", iconBg: "bg-purple-500/10" },
          { label: "Submissions", value: s.submissions || 0, icon: Send, color: "text-emerald-400", iconBg: "bg-emerald-500/10" },
          { label: "Acceptance Rate", value: `${s.acceptanceRate || 0}%`, icon: CheckCircle, color: "text-cyan-400", iconBg: "bg-cyan-500/10" },
          { label: "In Community", value: s.totalInCommunity ? `of ${s.totalInCommunity}` : "—", icon: Zap, color: "text-orange-400", iconBg: "bg-orange-500/10" },
        ].map(({ label, value, icon: Icon, color, iconBg }) => (
          <div key={label} className="bg-blue-950/60 border border-blue-800/50 rounded-xl p-4 hover:border-blue-700 transition-colors group">
            <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center mb-2`}>
              <Icon size={16} className={color} />
            </div>
            <p className={`text-xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-blue-400/70 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Difficulty Breakdown */}
      <div className="bg-blue-950/60 border border-blue-800/50 rounded-xl p-6 mb-8">
        <h3 className="text-blue-50 font-black text-lg mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-blue-400" /> Problem Difficulty Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {difficultyData.map((d) => (
            <div key={d.label} className={`${d.bg} border ${d.border} rounded-xl p-4 text-center`}>
              <p className={`text-3xl font-black ${d.text}`}>{d.value}</p>
              <p className="text-blue-400/70 text-sm font-semibold mt-1">{d.label}</p>
              <div className="w-full bg-blue-900/50 rounded-full h-2 mt-3">
                <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${(d.value / totalProblems) * 100}%`, backgroundColor: d.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-blue-950/60 border border-blue-800/50 rounded-xl p-1.5 mb-8 w-fit">
        {["overview", "submissions", "progress"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${
              activeTab === tab ? "bg-amber-400 text-blue-950" : "text-blue-400 hover:text-blue-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-blue-950/60 border border-blue-800/50 rounded-xl p-6">
            <h3 className="text-blue-50 font-black mb-4 flex items-center gap-2">
              <Send size={16} className="text-amber-400" /> Recent Submissions
            </h3>
            {(s.recentSubmissions || []).length === 0 ? (
              <p className="text-blue-500 text-sm py-4 text-center">No submissions yet.</p>
            ) : (
              <div className="space-y-2">
                {s.recentSubmissions.slice(0, 5).map((sub) => (
                  <div key={sub._id} className="flex items-center justify-between p-3 bg-blue-900/40 border border-blue-800/40 rounded-lg">
                    <div className="flex items-center gap-3 min-w-0">
                      {statusIcon[sub.status] || <Clock size={14} className="text-blue-400" />}
                      <div className="min-w-0">
                        <p className="text-blue-100 text-sm font-semibold truncate">{sub.project}</p>
                        <p className="text-blue-500 text-xs">{sub.grade != null ? `Grade: ${sub.grade}` : "Pending"} · {new Date(sub.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${statusColor[sub.status] || "text-blue-400 bg-blue-500/10 border-blue-500/20"} whitespace-nowrap ml-2`}>
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-950/60 border border-blue-800/50 rounded-xl p-6">
            <h3 className="text-blue-50 font-black mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-amber-400" /> Accepted Submissions
            </h3>
            {(() => {
              const accepted = (s.recentSubmissions || []).filter((sub) => sub.status === "Accepted");
              if (accepted.length === 0) return <p className="text-blue-500 text-sm py-4 text-center">No accepted submissions yet.</p>;
              return (
                <div className="space-y-2">
                  {accepted.slice(0, 6).map((sub, i) => (
                    <div key={`prob-${i}`} className="flex items-center justify-between p-3 bg-blue-900/40 border border-blue-800/40 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/20 rounded-md flex items-center justify-center">
                          <CheckCircle size={14} className="text-emerald-400" />
                        </div>
                        <span className="text-blue-100 text-sm font-semibold">{sub.project}</span>
                      </div>
                      <span className="text-blue-500 text-xs">{new Date(sub.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* SUBMISSIONS */}
      {activeTab === "submissions" && (
        <div className="bg-blue-950/60 border border-blue-800/50 rounded-xl overflow-hidden">
          {(s.recentSubmissions || []).length === 0 ? (
            <p className="text-blue-500 text-sm py-12 text-center">No submissions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="text-left text-xs font-black text-blue-400 uppercase tracking-wider border-b border-blue-800/50 bg-blue-950/80">
                    <th className="px-6 py-4">Project</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Grade</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-800/30">
                  {s.recentSubmissions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-blue-900/30 transition-colors">
                      <td className="px-6 py-4 text-blue-100 text-sm font-semibold">{sub.project}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md border ${statusColor[sub.status] || "text-blue-400 bg-blue-500/10 border-blue-500/20"}`}>
                          {statusIcon[sub.status]} {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-blue-300 text-sm">{sub.grade != null ? sub.grade : "—"}</td>
                      <td className="px-6 py-4 text-blue-400 text-sm">{new Date(sub.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PROGRESS */}
      {activeTab === "progress" && (
        <div className="bg-blue-950/60 border border-blue-800/50 rounded-xl p-6">
          <h3 className="text-blue-50 font-black mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-amber-400" /> Monthly Progress
          </h3>

          {(s.progressData || []).length === 0 ? (
            <p className="text-blue-500 text-sm py-8 text-center">No progress data available.</p>
          ) : (
            <>
              <div className="w-full overflow-x-auto">
                <svg viewBox="0 0 560 220" className="w-full min-w-[400px]" style={{ maxHeight: "260px" }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line key={`grid-${i}`} x1="50" y1={30 + i * 40} x2="540" y2={30 + i * 40} stroke="rgba(96, 165, 250, 0.1)" strokeDasharray="4,4" />
                  ))}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <text key={`ylabel-${i}`} x="40" y={35 + i * 40} textAnchor="end" className="fill-blue-500 text-[10px]">
                      {Math.round(maxProgress - (maxProgress / 4) * i)}
                    </text>
                  ))}
                  {s.progressData.map((d, i) => {
                    const barHeight = maxProgress > 0 ? (d.problemsSolved / maxProgress) * 160 : 0;
                    const x = 70 + i * 70;
                    const y = 190 - barHeight;
                    return (
                      <g key={d.month}>
                        <rect x={x} y={30} width={36} height={160} rx={6} fill="rgba(96, 165, 250, 0.05)" />
                        <rect x={x} y={y} width={36} height={barHeight} rx={6} fill="url(#barGradient)" className="transition-all duration-500">
                          <animate attributeName="height" from="0" to={barHeight} dur="0.8s" fill="freeze" />
                          <animate attributeName="y" from="190" to={y} dur="0.8s" fill="freeze" />
                        </rect>
                        <text x={x + 18} y={y - 6} textAnchor="middle" className="fill-amber-400 text-[11px] font-bold">{d.problemsSolved}</text>
                        <text x={x + 18} y={208} textAnchor="middle" className="fill-blue-400 text-[11px]">{d.month}</text>
                      </g>
                    );
                  })}
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-800/40">
                <div className="text-center">
                  <p className="text-2xl font-black text-amber-400">{s.progressData.reduce((sum, d) => sum + d.problemsSolved, 0)}</p>
                  <p className="text-xs text-blue-400/70 font-medium">Total (7 months)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-blue-300">{Math.round(s.progressData.reduce((sum, d) => sum + d.problemsSolved, 0) / s.progressData.length)}</p>
                  <p className="text-xs text-blue-400/70 font-medium">Avg / Month</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-emerald-400">{Math.max(...s.progressData.map((d) => d.problemsSolved))}</p>
                  <p className="text-xs text-blue-400/70 font-medium">Best Month</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-purple-400">{s.progressData[s.progressData.length - 1]?.problemsSolved || 0}</p>
                  <p className="text-xs text-blue-400/70 font-medium">This Month</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
