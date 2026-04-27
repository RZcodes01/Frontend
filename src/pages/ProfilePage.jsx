import { useState, useEffect } from 'react';
import {
  BookOpen, Award, Github, Linkedin, Mail,
  Phone, MapPin, CheckCircle, Clock,
  Code, FileText, User, Loader2, Shield
} from 'lucide-react';
import { fetchMe } from '../api/user.api';
import { fetchMyEnrollments } from '../api/enrollment.api';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userRes, enrollRes] = await Promise.all([
          fetchMe(),
          fetchMyEnrollments().catch(() => ({ data: { enrollments: [] } }))
        ]);
        setUser(userRes.data.user);
        setEnrollments(enrollRes.data.enrollments || enrollRes.data || []);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-orange-400" size={36} />
          <p className="text-sm font-medium text-stone-400">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-stone-400">Could not load profile.</p>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const communityCount = enrollments.length;

  const roleBadgeColor = {
    student: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    mentor: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    admin: { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    company: { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  };

  const badge = roleBadgeColor[user.role] || roleBadgeColor.student;

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800 pt-20" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');.syne{font-family:'Syne',sans-serif;}`}</style>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Cover + Avatar */}
        <div className="relative mb-6">
          <div className="h-48 rounded-3xl bg-gradient-to-br from-orange-300/60 via-amber-200/60 to-rose-200 border border-orange-200 overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #fb923c 0%, transparent 60%), radial-gradient(circle at 80% 20%, #f59e0b 0%, transparent 50%)' }} />
          </div>
          <div className="absolute -bottom-10 left-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 border-4 border-amber-50 flex items-center justify-center text-2xl font-black text-white shadow-2xl overflow-hidden">
              {user.profileImage ? (
                <img src={user.profileImage} alt="profile" className="w-full h-full object-cover" />
              ) : (
                getInitials(user.name)
              )}
            </div>
          </div>
        </div>

        {/* Name + Meta */}
        <div className="mt-14 mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black text-stone-800 syne capitalize">{user.name}</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${badge.bg} border ${badge.border} rounded-full ${badge.text} text-xs font-bold uppercase tracking-widest`}>
                  <Shield size={11} /> {user.role}
                </span>
                {user.plan && (
                  <span className="px-3 py-1 bg-white border border-orange-200 rounded-full text-stone-500 text-xs font-semibold capitalize shadow-sm">
                    {user.plan} Plan
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              {user.github && <a href={`https://${user.github}`} target="_blank" rel="noreferrer" className="p-2.5 bg-white border border-orange-200 rounded-xl hover:border-orange-400 hover:text-orange-500 text-stone-400 transition-all shadow-sm"><Github size={16} /></a>}
              {user.linkedin && <a href={`https://${user.linkedin}`} target="_blank" rel="noreferrer" className="p-2.5 bg-white border border-orange-200 rounded-xl hover:border-orange-400 hover:text-orange-500 text-stone-400 transition-all shadow-sm"><Linkedin size={16} /></a>}
            </div>
          </div>

          {user.bio && (
            <p className="text-stone-500 text-sm mt-3 max-w-2xl leading-relaxed">{user.bio}</p>
          )}

          <div className="flex flex-wrap gap-4 mt-4 text-xs text-stone-400">
            {user.email && <span className="flex items-center gap-1.5"><Mail size={12} />{user.email}</span>}
            {user.phone && <span className="flex items-center gap-1.5"><Phone size={12} />{user.phone}</span>}
            {user.location && <span className="flex items-center gap-1.5"><MapPin size={12} />{user.location}</span>}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Communities', value: communityCount, icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-100' },
            { label: 'Friends', value: user.friends?.length || 0, icon: User, color: 'text-rose-500', bg: 'bg-rose-100' },
            { label: 'Role', value: user.role?.toUpperCase(), icon: Shield, color: 'text-amber-600', bg: 'bg-amber-100', isText: true },
            { label: 'Plan', value: (user.plan || 'free').toUpperCase(), icon: Award, color: 'text-cyan-600', bg: 'bg-cyan-100', isText: true },
          ].map(({ label, value, icon: Icon, color, bg, isText }) => (
            <div key={label} className="bg-white border border-orange-100 rounded-2xl p-5 hover:border-orange-300 transition-colors shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={16} className={color} />
              </div>
              <p className={`${isText ? 'text-sm' : 'text-2xl'} font-black syne ${color}`}>{value}</p>
              <p className="text-stone-400 text-xs font-semibold mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Basic Info */}
            <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-stone-800 font-black syne mb-3 flex items-center gap-2"><User size={16} className="text-orange-400" /> About</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: 'Full Name', value: user.name },
                  { label: 'Email', value: user.email },
                  { label: 'Role', value: user.role?.charAt(0).toUpperCase() + user.role?.slice(1) },
                  { label: 'Plan', value: user.plan?.charAt(0).toUpperCase() + user.plan?.slice(1) || 'Free' },
                  ...(user.phone ? [{ label: 'Phone', value: user.phone }] : []),
                  ...(user.location ? [{ label: 'Location', value: user.location }] : []),
                  ...(user.experience_years ? [{ label: 'Experience', value: `${user.experience_years} years` }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                    <p className="text-stone-400 text-xs mb-1">{label}</p>
                    <p className="text-stone-700 font-semibold capitalize truncate">{value || '—'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Enrolled Communities */}
            {enrollments.length > 0 && (
              <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-stone-800 font-black syne mb-4 flex items-center gap-2"><BookOpen size={16} className="text-orange-400" /> Enrolled Communities</h3>
                <div className="space-y-3">
                  {enrollments.map((enrollment, i) => (
                    <div key={enrollment._id || i} className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-xs font-black">
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <div>
                          <p className="text-stone-700 text-sm font-semibold">{enrollment.communityId?.name || 'Community'}</p>
                          <p className="text-stone-400 text-xs mt-0.5">{enrollment.plan || 'free'} plan</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl border ${enrollment.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                        {enrollment.status === 'active' ? <><CheckCircle size={11} /> Active</> : <><Clock size={11} /> {enrollment.status}</>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Quick Links */}
            <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-stone-800 font-black syne mb-4 flex items-center gap-2"><Award size={16} className="text-orange-400" /> Quick Links</h3>
              <div className="space-y-2">
                {user.role === 'student' && (
                  <>
                    <button onClick={() => navigate('/dashboard')} className="w-full text-left flex items-center gap-2.5 px-4 py-3 bg-orange-50 rounded-xl text-sm font-semibold text-stone-600 hover:border-orange-400 hover:text-orange-500 border border-orange-100 transition-all">
                      <BookOpen size={14} /> Student Dashboard
                    </button>
                    <button onClick={() => navigate('/community')} className="w-full text-left flex items-center gap-2.5 px-4 py-3 bg-orange-50 rounded-xl text-sm font-semibold text-stone-600 hover:border-orange-400 hover:text-orange-500 border border-orange-100 transition-all">
                      <User size={14} /> Browse Communities
                    </button>
                    <button onClick={() => navigate('/certificates')} className="w-full text-left flex items-center gap-2.5 px-4 py-3 bg-orange-50 rounded-xl text-sm font-semibold text-stone-600 hover:border-orange-400 hover:text-orange-500 border border-orange-100 transition-all">
                      <Award size={14} /> My Certificates
                    </button>
                  </>
                )}
                {user.role === 'mentor' && (
                  <button onClick={() => navigate('/mentor')} className="w-full text-left flex items-center gap-2.5 px-4 py-3 bg-orange-50 rounded-xl text-sm font-semibold text-stone-600 hover:border-orange-400 hover:text-orange-500 border border-orange-100 transition-all">
                    <BookOpen size={14} /> Mentor Dashboard
                  </button>
                )}
                {user.role === 'admin' && (
                  <button onClick={() => navigate('/admin')} className="w-full text-left flex items-center gap-2.5 px-4 py-3 bg-orange-50 rounded-xl text-sm font-semibold text-stone-600 hover:border-orange-400 hover:text-orange-500 border border-orange-100 transition-all">
                    <Shield size={14} /> Admin Dashboard
                  </button>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-stone-800 font-black syne mb-4 flex items-center gap-2"><FileText size={16} className="text-orange-400" /> Account</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-stone-500 text-sm">Email verified</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-stone-500 text-sm">Account active</span>
                </li>
                {user.createdAt && (
                  <li className="flex items-start gap-2.5">
                    <Clock size={14} className="text-stone-300 flex-shrink-0 mt-0.5" />
                    <span className="text-stone-400 text-sm">Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}