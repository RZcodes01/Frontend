import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, Users, Loader2,
  GraduationCap, Mail, Building2, X,
  Crown, ShieldOff, Shield
} from 'lucide-react';
import { allStudents, toggleBanStudent } from '../api/admin.api';

/* ─────────────────────────────────────────────
   Reusable components
───────────────────────────────────────────── */
const Avatar = ({ name, image }) => {
  const initials = name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  if (image) {
    return <img src={image} alt={name} className="w-9 h-9 rounded-xl object-cover shrink-0 border border-blue-200" />;
  }
  return (
    <div className="w-9 h-9 rounded-xl bg-[#1e3a5f] border border-blue-200 flex items-center justify-center font-bold text-amber-400 text-xs shrink-0">
      {initials}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    active: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-blue-50 text-blue-400 border-blue-200",
    banned: "bg-red-50 text-red-500 border-red-200"
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${map[status] || map.active}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status === "active" ? "bg-green-500" : status === "banned" ? "bg-red-400" : "bg-blue-400"}`} />
      {status}
    </span>
  );
};

const ProBadge = () => (
  <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
    <Crown size={8} /> Pro
  </span>
);

const BanButton = ({ isBanned, toggling, onClick }) => (
  <button
    onClick={onClick}
    disabled={toggling}
    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap
      ${isBanned
        ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
        : "bg-red-50 text-red-500 hover:bg-red-100 border border-red-200"
      }`}
  >
    {toggling
      ? <Loader2 size={11} className="animate-spin" />
      : isBanned
        ? <><Shield size={11} /> Unban</>
        : <><ShieldOff size={11} /> Ban</>
    }
  </button>
);

/* ─────────────────────────────────────────────
   Map raw enrollment → UI shape
───────────────────────────────────────────── */
const mapEnrollment = (e) => {
  const u = Array.isArray(e.user) ? e.user[0] : e.userId;
  const c = Array.isArray(e.community) ? e.community[0] : e.communityId;
  return {
    enrollmentId: e._id,
    status: e.status,
    plan: e.plan,
    joinedAt: e.createdAt,
    student: {
      _id: u?._id,
      name: u?.name || "Unknown",
      email: u?.email || "—",
      profileImage: u?.profileImage || null,
      plan: u?.plan || "free",
    },
    community: {
      _id: c?._id,
      name: c?.name || "Unknown Community",
    }
  };
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const UserManager = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebounced] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await allStudents(debouncedSearch);
        const raw = res.data.students || [];
        setStudents(raw.filter(e => e.userId && e.communityId).map(mapEnrollment));
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [debouncedSearch]);

  const handleToggleBan = async (enrollmentId) => {
    setTogglingId(enrollmentId);
    setStudents(prev => prev.map(s =>
      s.enrollmentId === enrollmentId
        ? { ...s, status: s.status === "banned" ? "active" : "banned" }
        : s
    ));
    try {
      await toggleBanStudent(enrollmentId);
    } catch {
      setStudents(prev => prev.map(s =>
        s.enrollmentId === enrollmentId
          ? { ...s, status: s.status === "banned" ? "active" : "banned" }
          : s
      ));
    } finally {
      setTogglingId(null);
    }
  };

  const visible = debouncedSearch
    ? students.filter(s =>
      s.student.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      s.student.email.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
    : students;

  const totalActive = students.filter(s => s.status === "active").length;
  const totalBanned = students.filter(s => s.status === "banned").length;

  return (
    <div className="h-screen flex flex-col bg-blue-50 font-sans overflow-hidden">

      {/* ── Header ── */}
      <header className="shrink-0 bg-[#1e3a5f] border-b border-blue-900 relative">
        {/* Amber accent bar */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 ml-1.5">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={16} className="text-white" />
            </button>
            <div className="flex items-center gap-2">
              <GraduationCap size={15} className="text-amber-400 shrink-0" />
              <span className="text-sm font-bold text-white">Students</span>
            </div>
          </div>

          {/* Stats inline on mobile header */}
          {!loading && (
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-blue-300 hidden sm:block">
                <span className="text-white font-bold">{visible.length}</span> result{visible.length !== 1 ? 's' : ''}
              </span>
              <div className="flex sm:hidden items-center gap-1.5 text-[10px] font-bold">
                <span className="px-2 py-1 rounded-lg bg-green-50 text-green-700 border border-green-200">{totalActive} active</span>
                {totalBanned > 0 && (
                  <span className="px-2 py-1 rounded-lg bg-red-50 text-red-500 border border-red-200">{totalBanned} banned</span>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Search + Stats ── */}
      <div className="shrink-0 bg-white border-b border-blue-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full bg-blue-50 border border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl pl-9 pr-9 py-2.5 text-sm text-[#1e3a5f] outline-none transition-all placeholder:text-blue-300"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-[#1e3a5f]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Stats — hidden on mobile */}
          <div className="hidden sm:flex gap-2 shrink-0">
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-xs text-blue-300">Total</span>
              <span className="text-sm font-bold text-[#1e3a5f]">{students.length}</span>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-xs text-blue-300">Active</span>
              <span className="text-sm font-bold text-green-600">{totalActive}</span>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-xs text-blue-300">Banned</span>
              <span className="text-sm font-bold text-red-500">{totalBanned}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <Loader2 className="animate-spin text-blue-600" size={30} />
              <p className="text-sm text-blue-400">Loading students…</p>
            </div>

          ) : visible.length === 0 ? (
            <EmptyState search={search} onClear={() => setSearch("")} />

          ) : (
            <div className="space-y-2">

              {/* Column headers — desktop only */}
              <div className="hidden md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.5fr)_auto_auto] gap-4 px-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-blue-300">
                <span>Student</span>
                <span>Email</span>
                <span>Community</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              {visible.map(item => (
                <StudentRow
                  key={item.enrollmentId}
                  item={item}
                  toggling={togglingId === item.enrollmentId}
                  onToggleBan={() => handleToggleBan(item.enrollmentId)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Student Row — mobile card / desktop grid
───────────────────────────────────────────── */
const StudentRow = ({ item, toggling, onToggleBan }) => {
  const { student, community, status, joinedAt } = item;
  const isBanned = status === "banned";

  const joined = joinedAt
    ? new Date(joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

  return (
    <div className={`bg-white border rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 transition-all
      ${isBanned
        ? "border-red-200 opacity-70"
        : "border-blue-100 hover:border-blue-200 hover:shadow-md hover:shadow-blue-100/50"
      }`}
    >

      {/* ── Mobile: stacked card ── */}
      <div className="flex items-start gap-3 md:hidden">
        <Avatar name={student.name} image={student.profileImage} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-bold text-[#1e3a5f] leading-tight">{student.name}</span>
            {student.plan === "pro" && <ProBadge />}
          </div>

          <div className="flex items-center gap-1 mt-1">
            <Mail size={10} className="text-blue-300 shrink-0" />
            <span className="text-xs text-blue-400 truncate">{student.email}</span>
          </div>

          <div className="flex items-center gap-1 mt-0.5">
            <Building2 size={10} className="text-blue-300 shrink-0" />
            <span className="text-xs text-[#1e3a5f] font-medium truncate">{community.name}</span>
          </div>

          <div className="flex items-center justify-between mt-2.5 gap-2">
            <StatusBadge status={status} />
            <BanButton isBanned={isBanned} toggling={toggling} onClick={onToggleBan} />
          </div>
        </div>
      </div>

      {/* ── Desktop: grid row ── */}
      <div className="hidden md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.5fr)_auto_auto] gap-4 items-center">

        {/* Student */}
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={student.name} image={student.profileImage} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-semibold text-[#1e3a5f] truncate">{student.name}</span>
              {student.plan === "pro" && <ProBadge />}
            </div>
            <span className="text-[10px] text-blue-300">{joined}</span>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Mail size={11} className="text-blue-300 shrink-0" />
          <span className="text-xs text-blue-400 truncate">{student.email}</span>
        </div>

        {/* Community */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Building2 size={11} className="text-blue-300 shrink-0" />
          <span className="text-xs font-semibold text-[#1e3a5f] truncate">{community.name}</span>
        </div>

        {/* Status */}
        <StatusBadge status={status} />

        {/* Action */}
        <BanButton isBanned={isBanned} toggling={toggling} onClick={onToggleBan} />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Empty State
───────────────────────────────────────────── */
const EmptyState = ({ search, onClear }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center border-2 border-dashed border-blue-100 rounded-2xl bg-white">
    <div className="w-14 h-14 rounded-2xl bg-[#1e3a5f] flex items-center justify-center mb-4">
      <Users size={24} className="text-amber-400" />
    </div>
    <h3 className="text-sm font-bold text-[#1e3a5f]">
      {search ? `No results for "${search}"` : "No students yet"}
    </h3>
    <p className="text-xs text-blue-400 mt-1 max-w-xs">
      {search ? "Try a different name or email." : "Students will appear here once they enroll."}
    </p>
    {search && (
      <button
        onClick={onClear}
        className="mt-4 inline-flex items-center gap-2 bg-[#1e3a5f] hover:bg-blue-800 text-amber-400 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
      >
        <X size={12} /> Clear search
      </button>
    )}
  </div>
);

export default UserManager;