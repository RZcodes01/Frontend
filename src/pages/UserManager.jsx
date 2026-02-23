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
    return <img src={image} alt={name} className="w-9 h-9 rounded-xl object-cover shrink-0 border border-gray-700" />;
  }
  return (
    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 text-xs shrink-0">
      {initials}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    banned: "bg-red-500/10 text-red-400 border-red-500/20"
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${map[status] || map.active}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status === "active" ? "bg-emerald-400" : status === "banned" ? "bg-red-400" : "bg-gray-400"}`} />
      {status}
    </span>
  );
};

const ProBadge = () => (
  <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
    <Crown size={8} /> Pro
  </span>
);

const BanButton = ({ isBanned, toggling, onClick }) => (
  <button
    onClick={onClick}
    disabled={toggling}
    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap
      ${isBanned
        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
        : "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
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
    <div className="h-screen flex flex-col bg-gray-950 font-sans overflow-hidden">

      {/* ── Header ── */}
      <header className="shrink-0 bg-gray-900 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft size={16} className="text-gray-300" />
            </button>
            <div className="flex items-center gap-2">
              <GraduationCap size={15} className="text-cyan-400 shrink-0" />
              <span className="text-sm font-bold text-white">Students</span>
            </div>
          </div>

          {/* Stats inline on mobile header */}
          {!loading && (
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-gray-500 hidden sm:block">
                <span className="text-gray-300 font-bold">{visible.length}</span> result{visible.length !== 1 ? 's' : ''}
              </span>
              {/* Mobile stat pills */}
              <div className="flex sm:hidden items-center gap-1.5 text-[10px] font-bold">
                <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{totalActive} active</span>
                {totalBanned > 0 && (
                  <span className="px-2 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">{totalBanned} banned</span>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Search + Stats ── */}
      <div className="shrink-0 bg-gray-900/50 border-b border-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full bg-gray-800 border border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl pl-9 pr-9 py-2.5 text-sm text-white outline-none transition-all placeholder:text-gray-600"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Stats — hidden on mobile (shown in header instead) */}
          <div className="hidden sm:flex gap-2 shrink-0">
            <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">Total</span>
              <span className="text-sm font-bold text-gray-300">{students.length}</span>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">Active</span>
              <span className="text-sm font-bold text-emerald-400">{totalActive}</span>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">Banned</span>
              <span className="text-sm font-bold text-red-400">{totalBanned}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <Loader2 className="animate-spin text-cyan-400" size={30} />
              <p className="text-sm text-gray-500">Loading students…</p>
            </div>

          ) : visible.length === 0 ? (
            <EmptyState search={search} onClear={() => setSearch("")} />

          ) : (
            <div className="space-y-2">

              {/* Column headers — desktop only */}
              <div className="hidden md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.5fr)_auto_auto] gap-4 px-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-600">
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
    <div className={`bg-gray-900 border rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 transition-all
      ${isBanned
        ? "border-red-500/20 opacity-70"
        : "border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-black/20"
      }`}
    >

      {/* ── Mobile: stacked card ── */}
      <div className="flex items-start gap-3 md:hidden">
        <Avatar name={student.name} image={student.profileImage} />

        <div className="flex-1 min-w-0">
          {/* Name + plan */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-bold text-white leading-tight">{student.name}</span>
            {student.plan === "pro" && <ProBadge />}
          </div>

          {/* Email */}
          <div className="flex items-center gap-1 mt-1">
            <Mail size={10} className="text-gray-600 shrink-0" />
            <span className="text-xs text-gray-500 truncate">{student.email}</span>
          </div>

          {/* Community */}
          <div className="flex items-center gap-1 mt-0.5">
            <Building2 size={10} className="text-gray-600 shrink-0" />
            <span className="text-xs text-gray-400 font-medium truncate">{community.name}</span>
          </div>

          {/* Status + action row */}
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
              <span className="text-sm font-semibold text-white truncate">{student.name}</span>
              {student.plan === "pro" && <ProBadge />}
            </div>
            <span className="text-[10px] text-gray-600">{joined}</span>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Mail size={11} className="text-gray-600 shrink-0" />
          <span className="text-xs text-gray-500 truncate">{student.email}</span>
        </div>

        {/* Community */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Building2 size={11} className="text-gray-600 shrink-0" />
          <span className="text-xs font-semibold text-gray-400 truncate">{community.name}</span>
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
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900">
    <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
      <Users size={24} className="text-gray-600" />
    </div>
    <h3 className="text-sm font-bold text-gray-300">
      {search ? `No results for "${search}"` : "No students yet"}
    </h3>
    <p className="text-xs text-gray-500 mt-1 max-w-xs">
      {search ? "Try a different name or email." : "Students will appear here once they enroll."}
    </p>
    {search && (
      <button
        onClick={onClear}
        className="mt-4 inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
      >
        <X size={12} /> Clear search
      </button>
    )}
  </div>
);

export default UserManager;