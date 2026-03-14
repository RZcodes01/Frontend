import { useState, useEffect, useRef, useCallback } from "react";
import {
  Users, Globe, Code, Zap, Search, ChevronDown,
  Trophy, ArrowUpDown, ChevronLeft, ChevronRight,
  Crown, Loader2,
} from "lucide-react";
import { fetchAllCommunities } from "../api/community.api";
import {
  fetchDashboardStats,
  fetchLeaderboard,
  fetchTopPerformers,
  searchStudentsAPI,
} from "../api/companyDashboard.api";
import CompanyStudentProfile from "./CompanyStudentProfile";

// ─── Animated Counter ───────────────────────────────────────────────
function AnimatedCounter({ target, duration = 1200 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count.toLocaleString()}</>;
}

// ─── Stat Card ──────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, iconBg, delay = 0, loading }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={`bg-white border border-blue-100 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-500 group cursor-default ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon size={20} className={color} />
        </div>
      </div>
      {loading ? (
        <div className="h-10 w-20 bg-blue-100 rounded-lg animate-pulse" />
      ) : (
        <p className={`text-3xl sm:text-4xl font-black ${color}`}>
          <AnimatedCounter target={value} />
        </p>
      )}
      <p className="text-blue-400 text-sm font-semibold mt-1">{label}</p>
    </div>
  );
}

// ─── Skeleton Row ───────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 w-8 bg-blue-100 rounded" /></td>
      <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 bg-blue-100 rounded-lg" /><div className="space-y-1.5"><div className="h-4 w-28 bg-blue-100 rounded" /><div className="h-3 w-20 bg-blue-100 rounded" /></div></div></td>
      <td className="px-6 py-4"><div className="h-4 w-24 bg-blue-100 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-12 bg-blue-100 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-16 bg-blue-100 rounded" /></td>
      <td className="px-6 py-4 text-right"><div className="h-8 w-24 bg-blue-100 rounded-lg ml-auto" /></td>
    </tr>
  );
}

// ─── Avatar Helper ──────────────────────────────────────────────────
function avatarUrl(name, profileImage) {
  if (profileImage) return profileImage;
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || "U")}&backgroundColor=0369a1,0e7490,0891b2&fontSize=40`;
}

// ─── Main Dashboard ─────────────────────────────────────────────────
export default function CompanyDashboardPage() {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState("");
  const [selectedCommunityName, setSelectedCommunityName] = useState("All Communities");
  const [stats, setStats] = useState({ totalStudents: 0, totalCommunities: 0, totalProblemsSolved: 0, activeUsers: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [top3, setTop3] = useState([]);
  const [top3Loading, setTop3Loading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardTotal, setLeaderboardTotal] = useState(0);
  const [leaderboardPages, setLeaderboardPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState(null);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchAllCommunities()
      .then((res) => setCommunities(res.data?.communities || res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearchDropdown(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setStatsLoading(true);
    setError(null);
    fetchDashboardStats(selectedCommunityId || undefined)
      .then((res) => setStats(res.data.stats))
      .catch((err) => setError(err.response?.data?.message || "Failed to load stats"))
      .finally(() => setStatsLoading(false));
  }, [selectedCommunityId]);

  useEffect(() => {
    setTop3Loading(true);
    fetchTopPerformers(selectedCommunityId || undefined)
      .then((res) => setTop3(res.data.topPerformers || []))
      .catch(() => setTop3([]))
      .finally(() => setTop3Loading(false));
  }, [selectedCommunityId]);

  useEffect(() => {
    setLeaderboardLoading(true);
    fetchLeaderboard(selectedCommunityId || undefined, currentPage, ITEMS_PER_PAGE, sortOrder)
      .then((res) => {
        setLeaderboard(res.data.leaderboard || []);
        setLeaderboardTotal(res.data.total || 0);
        setLeaderboardPages(res.data.pages || 0);
      })
      .catch(() => setLeaderboard([]))
      .finally(() => setLeaderboardLoading(false));
  }, [selectedCommunityId, currentPage, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCommunityId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        searchStudentsAPI(searchQuery)
          .then((res) => {
            setSearchResults(res.data.users || []);
            setShowSearchDropdown(true);
          })
          .catch(() => setSearchResults([]));
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleViewProfile = useCallback((studentId) => {
    setSelectedStudentId(studentId);
    setSearchQuery("");
    setShowSearchDropdown(false);
  }, []);

  const handleCommunitySelect = useCallback((id, name) => {
    setSelectedCommunityId(id);
    setSelectedCommunityName(name);
    setDropdownOpen(false);
  }, []);

  // ─── Student Profile View ──────────────────
  if (selectedStudentId) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <CompanyStudentProfile
          studentId={selectedStudentId}
          onBack={() => setSelectedStudentId(null)}
        />
      </div>
    );
  }

  // ─── Podium Medal Configs ──────────────────
  const podiumConfig = [
    { index: 1, order: "order-2 md:order-1", height: "sm:h-72", width: "sm:w-72", border: "border-blue-200", hoverBorder: "hover:border-blue-400", rankBg: "bg-gradient-to-br from-gray-300 to-gray-400", rankText: "text-[#1e3a5f]", label: "2nd Place", labelColor: "text-blue-400", scoreBg: "bg-blue-50 text-[#1e3a5f] border-blue-200", glow: "" },
    { index: 0, order: "order-1 md:order-2", height: "sm:h-80", width: "sm:w-80", border: "border-amber-300", hoverBorder: "hover:border-amber-400", rankBg: "bg-gradient-to-br from-yellow-400 to-amber-500", rankText: "text-[#1e3a5f]", label: "1st Place", labelColor: "text-amber-500", scoreBg: "bg-amber-400 text-[#1e3a5f] border-amber-300", glow: "shadow-2xl shadow-amber-400/20", champion: true },
    { index: 2, order: "order-3", height: "sm:h-64", width: "sm:w-68", border: "border-orange-200", hoverBorder: "hover:border-orange-300", rankBg: "bg-gradient-to-br from-orange-400 to-orange-600", rankText: "text-white", label: "3rd Place", labelColor: "text-orange-500", scoreBg: "bg-orange-50 text-orange-700 border-orange-200", glow: "" },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">

      {/* ══════════ HEADER ══════════ */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-[#1e3a5f]">Company Dashboard</h1>
        <p className="text-blue-400 font-medium mt-1">Analyze student performance across communities</p>
      </div>

      {/* ══════════ ERROR ══════════ */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm font-semibold">
          {error}
        </div>
      )}

      {/* ══════════ STAT CARDS ══════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Users} label="Total Students" value={stats.totalStudents} color="text-[#1e3a5f]" iconBg="bg-[#1e3a5f]" delay={0} loading={statsLoading} />
        <StatCard icon={Globe} label="Communities" value={stats.totalCommunities} color="text-blue-500" iconBg="bg-blue-100" delay={100} loading={statsLoading} />
        <StatCard icon={Code} label="Problems Solved" value={stats.totalProblemsSolved} color="text-green-600" iconBg="bg-green-50" delay={200} loading={statsLoading} />
        <StatCard icon={Zap} label="Active (7 days)" value={stats.activeUsers} color="text-amber-500" iconBg="bg-amber-50" delay={300} loading={statsLoading} />
      </div>

      {/* ══════════ SEARCH BAR ══════════ */}
      <div className="mb-10 relative" ref={searchRef}>
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
          <input
            type="text"
            placeholder="Search students by name, username, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-blue-100 rounded-xl text-[#1e3a5f] text-sm font-medium placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
          />
        </div>

        {showSearchDropdown && searchResults.length > 0 && (
          <div className="absolute z-50 mt-2 w-full max-w-lg bg-white border border-blue-100 rounded-xl shadow-xl shadow-blue-100/50 overflow-hidden">
            {searchResults.map((s) => (
              <button
                key={s._id}
                onClick={() => handleViewProfile(s._id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-blue-50 last:border-b-0"
              >
                <img src={avatarUrl(s.name, s.profileImage)} alt={s.name} className="w-9 h-9 rounded-lg object-cover border border-blue-100" />
                <div className="min-w-0 flex-1">
                  <p className="text-[#1e3a5f] text-sm font-bold truncate">{s.name}</p>
                  <p className="text-blue-400 text-xs truncate">
                    {s.username ? `@${s.username}` : s.email}
                    {s.communities?.length > 0 && ` · ${s.communities[0]}`}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ══════════ COMMUNITY SELECTOR + SECTION HEADER ══════════ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-[#1e3a5f] flex items-center gap-2">
            <Trophy size={22} className="text-amber-400" /> Leaderboard
          </h2>
          <p className="text-blue-400 text-sm font-medium mt-0.5">Rankings based on score</p>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-blue-100 rounded-xl text-[#1e3a5f] text-sm font-semibold hover:border-blue-300 transition-colors min-w-[220px] justify-between"
          >
            <span>{selectedCommunityName}</span>
            <ChevronDown size={16} className={`text-blue-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 z-50 mt-2 w-full bg-white border border-blue-100 rounded-xl shadow-xl shadow-blue-100/50 overflow-hidden">
              <button
                onClick={() => handleCommunitySelect("", "All Communities")}
                className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors border-b border-blue-50 ${
                  !selectedCommunityId ? "bg-amber-50 text-amber-600" : "text-[#1e3a5f] hover:bg-blue-50"
                }`}
              >
                All Communities
              </button>
              {communities.map((c) => (
                <button
                  key={c._id}
                  onClick={() => handleCommunitySelect(c._id, c.name)}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors border-b border-blue-50 last:border-b-0 ${
                    selectedCommunityId === c._id ? "bg-amber-50 text-amber-600" : "text-[#1e3a5f] hover:bg-blue-50"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══════════ TOP 3 PERFORMERS ══════════ */}
      {top3Loading ? (
        <div className="flex justify-center items-center py-16 mb-12">
          <Loader2 size={32} className="text-amber-400 animate-spin" />
        </div>
      ) : top3.length >= 3 ? (
        <div className="mb-12">
          <h3 className="text-xl font-black text-[#1e3a5f] mb-6 text-center">Top Performers</h3>
          <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 md:gap-4">
            {podiumConfig.map((cfg) => {
              const student = top3[cfg.index];
              if (!student) return null;
              return (
                <div
                  key={student.userId}
                  className={`w-full ${cfg.width} bg-white border-2 ${cfg.border} ${cfg.hoverBorder} rounded-2xl p-6 text-center shadow-sm transition-all duration-300 hover:scale-[1.03] ${cfg.order} h-auto ${cfg.height} flex flex-col justify-center relative overflow-hidden group cursor-pointer ${cfg.glow}`}
                  onClick={() => handleViewProfile(student.userId)}
                >
                  {cfg.champion && (
                    <div className="absolute top-0 right-0 bg-amber-50 border-l border-b border-amber-200 text-amber-600 px-4 py-1.5 font-black text-[10px] uppercase tracking-wider rounded-bl-xl hidden sm:block">
                      <Crown size={12} className="inline mr-1 -mt-0.5" /> Champion
                    </div>
                  )}
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${cfg.rankBg} ${cfg.rankText} w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-lg`}>
                    {cfg.index + 1}
                  </div>
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-blue-100 mx-auto mb-3 mt-2">
                    <img src={avatarUrl(student.name, student.profileImage)} alt={student.name} className="w-full h-full object-cover" />
                  </div>
                  <p className={`${cfg.labelColor} font-bold text-xs uppercase tracking-wider mb-1`}>{cfg.label}</p>
                  <h3 className="font-black text-lg text-[#1e3a5f] mb-0.5 group-hover:text-amber-500 transition-colors">{student.name}</h3>
                  <p className="text-blue-400 text-xs font-medium mb-3">{student.community}</p>
                  <div className="flex items-center justify-center gap-4 mb-3 text-xs text-blue-400">
                    <span><strong className="text-[#1e3a5f]">{student.problemsSolved}</strong> solved</span>
                  </div>
                  <div className={`${cfg.scoreBg} border py-2 px-4 rounded-xl text-sm font-black inline-block mx-auto`}>
                    {student.score} PTS
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : top3.length > 0 ? (
        <div className="mb-12 text-center text-blue-400 text-sm py-8">Not enough students for podium display.</div>
      ) : null}

      {/* ══════════ LEADERBOARD TABLE ══════════ */}
      <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-blue-100 bg-[#1e3a5f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative overflow-hidden">
          {/* Amber accent bar */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400" />
          <div className="ml-4">
            <h3 className="font-black text-white text-lg">Student Rankings</h3>
            <p className="text-sm text-blue-300 font-medium mt-0.5">
              {leaderboardLoading ? "Loading..." : `Showing ${leaderboard.length} of ${leaderboardTotal} students`}
            </p>
          </div>
          <button
            onClick={() => setSortOrder((s) => (s === "desc" ? "asc" : "desc"))}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs font-bold hover:bg-white/20 transition-colors"
          >
            <ArrowUpDown size={14} />
            Score: {sortOrder === "asc" ? "Low → High" : "High → Low"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-left text-xs font-black text-blue-400 uppercase tracking-wider border-b border-blue-100 bg-blue-50">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Community</th>
                <th className="px-6 py-4">Problems</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {leaderboardLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : leaderboard.length > 0 ? (
                leaderboard.map((student) => {
                  const isTop3 = student.rank <= 3;
                  const maxScore = leaderboard[0]?.score || 1;
                  return (
                    <tr key={student.userId} className="hover:bg-blue-50/60 transition-colors group">
                      <td className="px-6 py-4">
                        {isTop3 ? (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                            student.rank === 1 ? "bg-amber-400 text-[#1e3a5f]" :
                            student.rank === 2 ? "bg-gray-300 text-[#1e3a5f]" :
                            "bg-orange-400 text-white"
                          }`}>{student.rank}</div>
                        ) : (
                          <span className="text-blue-400 font-black text-base">#{student.rank}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={avatarUrl(student.name, student.profileImage)} alt={student.name} className="w-9 h-9 rounded-lg object-cover border border-blue-100" />
                          <div className="min-w-0">
                            <p className="text-[#1e3a5f] font-bold text-sm truncate group-hover:text-amber-500 transition-colors">{student.name}</p>
                            <p className="text-blue-300 text-xs truncate">{student.username ? `@${student.username}` : student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-blue-400 text-sm font-medium">{student.community}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#1e3a5f] text-sm font-bold">{student.problemsSolved}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-blue-100 rounded-full h-1.5 w-20">
                            <div className="bg-amber-400 h-1.5 rounded-full transition-all" style={{ width: `${Math.min((student.score / maxScore) * 100, 100)}%` }} />
                          </div>
                          <span className="text-[#1e3a5f] text-sm font-black min-w-[3rem]">{student.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewProfile(student.userId)}
                          className="px-4 py-2 bg-[#1e3a5f] text-amber-400 border border-[#1e3a5f] rounded-lg text-xs font-bold hover:bg-blue-800 transition-all"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <Users className="mx-auto text-blue-200 mb-3" size={48} />
                    <p className="text-[#1e3a5f] font-bold text-lg">No students found</p>
                    <p className="text-blue-400 text-sm mt-1">Try selecting a different community</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {leaderboardPages > 1 && (
          <div className="px-6 py-4 border-t border-blue-100 flex items-center justify-between">
            <p className="text-blue-400 text-xs font-medium">Page {currentPage} of {leaderboardPages}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-blue-100 text-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: leaderboardPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === page ? "bg-[#1e3a5f] text-amber-400" : "text-blue-400 hover:bg-blue-50 border border-blue-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(leaderboardPages, p + 1))}
                disabled={currentPage === leaderboardPages}
                className="p-2 rounded-lg border border-blue-100 text-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
}