import { useState, useEffect } from "react";
import {
  Mail, AtSign, Calendar, Code, Target,
  Trophy, Send, CheckCircle, Clock, BarChart3,
  Zap, Award, TrendingUp, Loader2, AlertCircle,
} from "lucide-react";
import { fetchDetailedProfile } from "../api/user.api";

function avatarUrl(name, profileImage) {
  if (profileImage) return profileImage;
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || "U")}&backgroundColor=0369a1,0e7490,0891b2&fontSize=40`;
}

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchDetailedProfile()
      .then((res) => setStudent(res.data.user))
      .catch((err) => setError(err.response?.data?.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fadeIn">
        <Loader2 size={40} className="text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-semibold">Loading student profile...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle size={32} className="text-red-500" />
        </div>
        <p className="text-gray-900 font-bold text-lg">{error || "Student not found"}</p>
        <p className="text-gray-400 text-sm mt-1">Please try again later.</p>
      </div>
    );
  }

  const s = student;
  const maxProgress = Math.max(...(s.progressData || []).map((d) => d.problemsSolved), 1);

  const difficultyData = [
    { label: "Easy", value: s.problemsSolved?.easy || 0, color: "#22c55e", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600" },
    { label: "Medium", value: s.problemsSolved?.medium || 0, color: "#f59e0b", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600" },
    { label: "Hard", value: s.problemsSolved?.hard || 0, color: "#ef4444", bg: "bg-red-50", border: "border-red-200", text: "text-red-600" },
  ];

  const statusIcon = {
    Accepted: <CheckCircle size={14} className="text-emerald-500" />,
    Pending: <Clock size={14} className="text-amber-500" />,
  };

  const statusColor = {
    Accepted: "text-emerald-700 bg-emerald-50 border-emerald-200",
    Pending: "text-amber-700 bg-amber-50 border-amber-200",
  };

  const totalProblems = (s.problemsSolved?.total) || 1;
  const joinedDate = s.joinedDate ? new Date(s.joinedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Unknown";

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20 animate-fadeIn pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Profile Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-sm">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-100/50 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-100/50 rounded-full blur-2xl" />

          <div className="relative flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg flex-shrink-0">
              <img src={avatarUrl(s.name, s.profileImage)} alt={s.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{s.name}</h1>
                {s.communityRank && (
                  <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-xs font-bold uppercase tracking-wider">
                    Rank #{s.communityRank}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-gray-500">
                {s.username && (
                  <span className="flex items-center gap-1.5">
                    <AtSign size={14} className="text-gray-400" /> {s.username}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Mail size={14} className="text-gray-400" /> {s.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-gray-400" /> Joined {joinedDate}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(s.communities || []).map((c) => (
                  <span key={c._id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs font-semibold">
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
            { label: "Problems Solved", value: s.problemsSolved?.total || 0, icon: Target, color: "text-blue-600", iconBg: "bg-blue-50" },
            { label: "Community Rank", value: s.communityRank ? `#${s.communityRank}` : "—", icon: Trophy, color: "text-amber-600", iconBg: "bg-amber-50" },
            { label: "Total Score", value: s.score || 0, icon: Award, color: "text-purple-600", iconBg: "bg-purple-50" },
            { label: "Submissions", value: s.submissions || 0, icon: Send, color: "text-emerald-600", iconBg: "bg-emerald-50" },
            // { label: "Acceptance Rate", value: `${s.acceptanceRate || 0}%`, icon: CheckCircle, color: "text-cyan-600", iconBg: "bg-cyan-50" },
            // { label: "In Community", value: s.totalInCommunity ? `of ${s.totalInCommunity}` : "—", icon: Zap, color: "text-orange-600", iconBg: "bg-orange-50" },
          ].map(({ label, value, icon: Icon, color, iconBg }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all group">
              <div className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center mb-2`}>
                <Icon size={16} className={color} />
              </div>
              <p className={`text-xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Difficulty Breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <h3 className="text-gray-900 font-black text-lg mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-blue-500" /> Problem Difficulty Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {difficultyData.map((d) => (
              <div key={d.label} className={`${d.bg} border ${d.border} rounded-xl p-4 text-center`}>
                <p className={`text-3xl font-black ${d.text}`}>{d.value}</p>
                <p className="text-gray-500 text-sm font-semibold mt-1">{d.label}</p>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                  <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${(d.value / totalProblems) * 100}%`, backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 border border-gray-200 rounded-xl p-1.5 mb-8 w-fit">
          {["overview", "submissions", "progress"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-gray-900 font-black mb-4 flex items-center gap-2">
                <Send size={16} className="text-blue-500" /> Recent Submissions
              </h3>
              {(s.recentSubmissions || []).length === 0 ? (
                <p className="text-gray-400 text-sm py-4 text-center">No submissions yet.</p>
              ) : (
                <div className="space-y-2">
                  {s.recentSubmissions.slice(0, 5).map((sub) => (
                    <div key={sub._id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        {statusIcon[sub.status] || <Clock size={14} className="text-gray-400" />}
                        <div className="min-w-0">
                          <p className="text-gray-900 text-sm font-semibold truncate">{sub.project}</p>
                          <p className="text-gray-400 text-xs">{sub.grade != null ? `Grade: ${sub.grade}` : "Pending"} · {new Date(sub.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${statusColor[sub.status] || "text-gray-600 bg-gray-50 border-gray-200"} whitespace-nowrap ml-2`}>
                        {sub.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-gray-900 font-black mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-500" /> Accepted Submissions
              </h3>
              {(() => {
                const accepted = (s.recentSubmissions || []).filter((sub) => sub.status === "Accepted");
                if (accepted.length === 0) return <p className="text-gray-400 text-sm py-4 text-center">No accepted submissions yet.</p>;
                return (
                  <div className="space-y-2">
                    {accepted.slice(0, 6).map((sub, i) => (
                      <div key={`prob-${i}`} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 bg-emerald-50 border border-emerald-200 rounded-md flex items-center justify-center">
                            <CheckCircle size={14} className="text-emerald-500" />
                          </div>
                          <span className="text-gray-900 text-sm font-semibold">{sub.project}</span>
                        </div>
                        <span className="text-gray-400 text-xs">{new Date(sub.date).toLocaleDateString()}</span>
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
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {(s.recentSubmissions || []).length === 0 ? (
              <p className="text-gray-400 text-sm py-12 text-center">No submissions found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="text-left text-xs font-black text-gray-400 uppercase tracking-wider border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Grade</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {s.recentSubmissions.map((sub) => (
                      <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-900 text-sm font-semibold">{sub.project}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md border ${statusColor[sub.status] || "text-gray-600 bg-gray-50 border-gray-200"}`}>
                            {statusIcon[sub.status]} {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-sm font-medium">{sub.grade != null ? sub.grade : "—"}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{new Date(sub.date).toLocaleDateString()}</td>
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
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-gray-900 font-black mb-6 flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-500" /> Monthly Progress
            </h3>

            {(s.progressData || []).length === 0 ? (
              <p className="text-gray-400 text-sm py-8 text-center">No progress data available.</p>
            ) : (
              <>
                <div className="w-full overflow-x-auto">
                  <svg viewBox="0 0 560 220" className="w-full min-w-[400px]" style={{ maxHeight: "260px" }}>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line key={`grid-${i}`} x1="50" y1={30 + i * 40} x2="540" y2={30 + i * 40} stroke="rgba(229, 231, 235, 0.8)" strokeDasharray="4,4" />
                    ))}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <text key={`ylabel-${i}`} x="40" y={35 + i * 40} textAnchor="end" className="fill-gray-400 text-[10px]">
                        {Math.round(maxProgress - (maxProgress / 4) * i)}
                      </text>
                    ))}
                    {s.progressData.map((d, i) => {
                      const barHeight = maxProgress > 0 ? (d.problemsSolved / maxProgress) * 160 : 0;
                      const x = 70 + i * 70;
                      const y = 190 - barHeight;
                      return (
                        <g key={d.month}>
                          <rect x={x} y={30} width={36} height={160} rx={6} fill="rgba(243, 244, 246, 0.8)" />
                          <rect x={x} y={y} width={36} height={barHeight} rx={6} fill="url(#barGradientLight)" className="transition-all duration-500">
                            <animate attributeName="height" from="0" to={barHeight} dur="0.8s" fill="freeze" />
                            <animate attributeName="y" from="190" to={y} dur="0.8s" fill="freeze" />
                          </rect>
                          <text x={x + 18} y={y - 6} textAnchor="middle" className="fill-blue-600 text-[11px] font-bold">{d.problemsSolved}</text>
                          <text x={x + 18} y={208} textAnchor="middle" className="fill-gray-500 text-[11px]">{d.month}</text>
                        </g>
                      );
                    })}
                    <defs>
                      <linearGradient id="barGradientLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-black text-blue-600">{s.progressData.reduce((sum, d) => sum + d.problemsSolved, 0)}</p>
                    <p className="text-xs text-gray-400 font-medium">Total (7 months)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-gray-700">{Math.round(s.progressData.reduce((sum, d) => sum + d.problemsSolved, 0) / s.progressData.length)}</p>
                    <p className="text-xs text-gray-400 font-medium">Avg / Month</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-emerald-600">{Math.max(...s.progressData.map((d) => d.problemsSolved))}</p>
                    <p className="text-xs text-gray-400 font-medium">Best Month</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-purple-600">{s.progressData[s.progressData.length - 1]?.problemsSolved || 0}</p>
                    <p className="text-xs text-gray-400 font-medium">This Month</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}