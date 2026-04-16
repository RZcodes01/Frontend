import { useState, useEffect, useRef, useCallback } from "react";
import {
  Users, Globe, Search, ChevronDown,
  Trophy, ArrowUpDown, ChevronLeft, ChevronRight,
  Crown, Loader2, Building2, ArrowLeft, Hash, Award,
} from "lucide-react";
import { fetchAllCommunities } from "../api/community.api";
import {
  fetchDashboardStats,
  fetchLeaderboard,
  fetchTopPerformers,
  searchStudentsAPI,
} from "../api/companyDashboard.api";
import CompanyStudentProfile from "./CompanyStudentProfile";

// ─── Avatar Helper ──────────────────────────────────────────────────
function avatarUrl(name, profileImage) {
  if (profileImage) return profileImage;
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || "U")}&backgroundColor=0369a1,0e7490,0891b2&fontSize=40`;
}

// ─── Skeleton Row ───────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 w-8 bg-blue-100 rounded" /></td>
      <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 bg-blue-100 rounded-lg" /><div className="space-y-1.5"><div className="h-4 w-28 bg-blue-100 rounded" /><div className="h-3 w-20 bg-blue-100 rounded" /></div></div></td>
      <td className="px-6 py-4"><div className="h-4 w-16 bg-blue-100 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-16 bg-blue-100 rounded" /></td>
      <td className="px-6 py-4 text-right"><div className="h-8 w-24 bg-blue-100 rounded-lg ml-auto" /></td>
    </tr>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
export default function CompanyDashboardPage() {
  // ─── State ─────────────────────────────────────────────────────────
  const [communities, setCommunities] = useState([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  const [stats, setStats] = useState({ totalStudents: 0, totalCommunities: 0, totalProblemsSolved: 0, activeUsers: 0 });
  const [statsLoading, setStatsLoading] = useState(false);

  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardTotal, setLeaderboardTotal] = useState(0);
  const [leaderboardPages, setLeaderboardPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const searchRef = useRef(null);
  const ITEMS_PER_PAGE = 10;

  // ─── Load Communities ──────────────────────────────────────────────
  useEffect(() => {
    setCommunitiesLoading(true);
    fetchAllCommunities()
      .then((res) => {
        const comms = res.data?.communities || res.data || [];
        setCommunities(comms);
      })
      .catch(() => {})
      .finally(() => setCommunitiesLoading(false));
  }, []);

  // ─── Close search dropdown on outside click ─────────────────────
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearchDropdown(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ─── Load stats + leaderboard when community selected ──────────
  useEffect(() => {
    if (!selectedCommunity) return;
    setStatsLoading(true);
    fetchDashboardStats(selectedCommunity._id)
      .then((res) => setStats(res.data.stats))
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, [selectedCommunity]);

  useEffect(() => {
    if (!selectedCommunity) return;
    setLeaderboardLoading(true);
    fetchLeaderboard(selectedCommunity._id, currentPage, ITEMS_PER_PAGE, sortOrder)
      .then((res) => {
        setLeaderboard(res.data.leaderboard || []);
        setLeaderboardTotal(res.data.total || 0);
        setLeaderboardPages(res.data.pages || 0);
      })
      .catch(() => setLeaderboard([]))
      .finally(() => setLeaderboardLoading(false));
  }, [selectedCommunity, currentPage, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCommunity]);

  // ─── Search ────────────────────────────────────────────────────────
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

  const handleSelectCommunity = (community) => {
    setSelectedCommunity(community);
    setLeaderboard([]);
  };

  const handleBackToCommunities = () => {
    setSelectedCommunity(null);
    setLeaderboard([]);
    setStats({ totalStudents: 0, totalCommunities: 0, totalProblemsSolved: 0, activeUsers: 0 });
  };

  // ─── Student Profile View ──────────────────────────────────────────
  if (selectedStudentId) {
    return (
      <div className="min-h-screen bg-blue-50 font-sans">
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          <CompanyStudentProfile
            studentId={selectedStudentId}
            onBack={() => setSelectedStudentId(null)}
          />
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // COMMUNITY SELECTION VIEW
  // ═══════════════════════════════════════════════════════════════════
  if (!selectedCommunity) {
    return (
      <div className="min-h-screen bg-blue-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center">
                <Building2 size={22} className="text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-blue-900">Company Dashboard</h1>
                <p className="text-blue-500 font-medium text-sm">Select a community to view student performance</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8 relative" ref={searchRef}>
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
              <input
                type="text"
                placeholder="Search students by name, username, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-blue-200 rounded-xl text-blue-900 text-sm font-medium placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all shadow-sm"
              />
            </div>

            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute z-50 mt-2 w-full max-w-lg bg-white border border-blue-200 rounded-xl shadow-xl overflow-hidden">
                {searchResults.map((s) => (
                  <button
                    key={s._id}
                    onClick={() => handleViewProfile(s._id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-blue-50 last:border-b-0"
                  >
                    <img src={avatarUrl(s.name, s.profileImage)} alt={s.name} className="w-9 h-9 rounded-lg object-cover border border-blue-100" />
                    <div className="min-w-0 flex-1">
                      <p className="text-blue-900 text-sm font-bold truncate">{s.name}</p>
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

          {/* Communities Grid */}
          <h2 className="text-xl font-black text-blue-900 mb-4 flex items-center gap-2">
            <Globe size={20} className="text-blue-500" /> All Communities
          </h2>

          {communitiesLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={32} className="text-amber-400 animate-spin" />
            </div>
          ) : communities.length === 0 ? (
            <div className="text-center py-20 text-blue-400">No communities found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {communities.map((community) => (
                <button
                  key={community._id}
                  onClick={() => handleSelectCommunity(community)}
                  className="group bg-white border-2 border-blue-100 hover:border-amber-400 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/10 relative overflow-hidden"
                >
                  {/* Banner strip */}
                  <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-amber-400 rounded-full mb-5 group-hover:h-3 transition-all" />

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-900 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-400 transition-colors">
                      {community.bannerImage ? (
                        <img src={community.bannerImage} alt={community.name} className="w-full h-full rounded-xl object-cover" />
                      ) : (
                        <Globe size={24} className="text-amber-400 group-hover:text-blue-900 transition-colors" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-black text-blue-900 group-hover:text-amber-600 transition-colors truncate">
                        {community.name}
                      </h3>
                      <p className="text-sm text-blue-500 line-clamp-2 mt-1 leading-relaxed">
                        {community.description || "Explore this community"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-5 text-xs text-blue-400">
                    <span className="flex items-center gap-1">
                      <Users size={14} /> {community.membersCount || 0} members
                    </span>
                    <span className="flex items-center gap-1">
                      <Hash size={14} /> {community.modules?.length || 0} modules
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={20} className="text-amber-400" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // LEADERBOARD VIEW (Community Selected)
  // ═══════════════════════════════════════════════════════════════════
  const maxScore = leaderboard.length > 0 ? leaderboard[0]?.score || 1 : 1;

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back + Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToCommunities}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-900 font-bold text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={18} /> Back to Communities
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-900 flex items-center justify-center flex-shrink-0">
                {selectedCommunity.bannerImage ? (
                  <img src={selectedCommunity.bannerImage} alt={selectedCommunity.name} className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <Trophy size={24} className="text-amber-400" />
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-blue-900">{selectedCommunity.name}</h1>
                <p className="text-blue-500 text-sm font-medium">Community Leaderboard & Analytics</p>
              </div>
            </div>

            {/* Search in leaderboard view */}
            <div className="relative w-full sm:w-auto" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" size={16} />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                  className="w-full sm:w-72 pl-10 pr-4 py-2.5 bg-white border border-blue-200 rounded-xl text-blue-900 text-sm font-medium placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50 shadow-sm"
                />
              </div>
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-blue-200 rounded-xl shadow-xl overflow-hidden">
                  {searchResults.map((s) => (
                    <button
                      key={s._id}
                      onClick={() => handleViewProfile(s._id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-blue-50 last:border-b-0"
                    >
                      <img src={avatarUrl(s.name, s.profileImage)} alt={s.name} className="w-8 h-8 rounded-lg object-cover border border-blue-100" />
                      <div className="min-w-0 flex-1">
                        <p className="text-blue-900 text-sm font-bold truncate">{s.name}</p>
                        <p className="text-blue-400 text-xs truncate">{s.username ? `@${s.username}` : s.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Students", value: stats.totalStudents, icon: Users, color: "text-blue-900", bg: "bg-blue-100" },
            { label: "Submissions", value: stats.totalProblemsSolved, icon: Award, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Active (7d)", value: stats.activeUsers, icon: Trophy, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Community", value: 1, icon: Globe, color: "text-blue-500", bg: "bg-blue-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white border border-blue-100 rounded-2xl p-5 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}>
                  <Icon size={18} className={color} />
                </div>
                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">{label}</span>
              </div>
              {statsLoading ? (
                <div className="h-8 w-16 bg-blue-100 rounded animate-pulse" />
              ) : (
                <p className={`text-3xl font-black ${color}`}>{value.toLocaleString()}</p>
              )}
            </div>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="px-6 py-5 border-b border-blue-100 bg-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Trophy size={20} className="text-amber-400" />
              <div>
                <h3 className="font-black text-white text-lg">Student Rankings</h3>
                <p className="text-sm text-blue-300 font-medium">
                  {leaderboardLoading ? "Loading..." : `${leaderboardTotal} students ranked by score`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSortOrder((s) => (s === "desc" ? "asc" : "desc"))}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs font-bold hover:bg-white/20 transition-colors"
            >
              <ArrowUpDown size={14} />
              Score: {sortOrder === "asc" ? "Low → High" : "High → Low"}
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-left text-xs font-black text-blue-400 uppercase tracking-wider border-b border-blue-100 bg-blue-50">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Submissions</th>
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
                    return (
                      <tr key={student.userId} className="hover:bg-blue-50/60 transition-colors group">
                        <td className="px-6 py-4">
                          {isTop3 ? (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                              student.rank === 1 ? "bg-amber-400 text-blue-900" :
                              student.rank === 2 ? "bg-gray-300 text-blue-900" :
                              "bg-orange-400 text-white"
                            }`}>
                              {student.rank === 1 && <Crown size={14} />}
                              {student.rank !== 1 && student.rank}
                            </div>
                          ) : (
                            <span className="text-blue-400 font-black text-base">#{student.rank}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={avatarUrl(student.name, student.profileImage)} alt={student.name} className="w-9 h-9 rounded-lg object-cover border border-blue-100" />
                            <div className="min-w-0">
                              <p className="text-blue-900 font-bold text-sm truncate group-hover:text-amber-500 transition-colors">{student.name}</p>
                              <p className="text-blue-300 text-xs truncate">{student.username ? `@${student.username}` : student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-blue-900 text-sm font-bold">{student.problemsSolved}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-blue-100 rounded-full h-1.5 w-20">
                              <div className="bg-amber-400 h-1.5 rounded-full transition-all" style={{ width: `${Math.min((student.score / maxScore) * 100, 100)}%` }} />
                            </div>
                            <span className="text-blue-900 text-sm font-black min-w-[3rem]">{student.score}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleViewProfile(student.userId)}
                            className="px-4 py-2 bg-blue-900 text-amber-400 rounded-lg text-xs font-bold hover:bg-blue-800 transition-all"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-16">
                      <Users className="mx-auto text-blue-200 mb-3" size={48} />
                      <p className="text-blue-900 font-bold text-lg">No students with scores yet</p>
                      <p className="text-blue-400 text-sm mt-1">Students will appear once their submissions are graded.</p>
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
                  className="p-2 rounded-lg border border-blue-100 text-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(leaderboardPages, 5) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      currentPage === page ? "bg-blue-900 text-amber-400" : "text-blue-400 hover:bg-blue-50 border border-blue-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(leaderboardPages, p + 1))}
                  disabled={currentPage === leaderboardPages}
                  className="p-2 rounded-lg border border-blue-100 text-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}