
import { useState } from 'react';
import {
  Users, Star, Video, BookOpen, Github, Linkedin,
  Globe, Mail, Phone, MapPin, Edit2, CheckCircle,
  Award, Clock, TrendingUp, ExternalLink, Briefcase, MessageSquare
} from 'lucide-react';

const mockMentor = {
  name: 'Dr. Sarah Lee',
  email: 'sarah.lee@example.com',
  phone: '+91 99887 76655',
  location: 'Bangalore, Karnataka',
  bio: 'Full-stack engineer with 8 years of industry experience at Google and startups. Passionate about helping the next generation of developers build real, production-grade applications.',
  avatar: 'SL',
  role: 'mentor',
  experience: '8 Years',
  expertise: 'React, Node.js, System Design',
  github: 'github.com/sarahlee',
  linkedin: 'linkedin.com/in/sarahlee',
  website: 'sarahlee.dev',
  communities: [
    { name: 'React Developers', students: 68, color: 'from-cyan-500 to-blue-600', projects: 12 },
    { name: 'Python Enthusiasts', students: 52, color: 'from-emerald-500 to-teal-600', projects: 8 },
  ],
  sessions: [
    { title: 'React State Management Deep Dive', date: 'Feb 15, 2026', attendees: 54, duration: '1h 45m' },
    { title: 'useMemo & useCallback Explained', date: 'Feb 6, 2026', attendees: 61, duration: '1h 15m' },
    { title: 'Building REST APIs with Node.js', date: 'Jan 28, 2026', attendees: 49, duration: '2h 00m' },
  ],
  upcoming: [
    { title: 'Advanced React Patterns', date: 'Feb 24, 2026', time: '6:00 PM' },
    { title: 'System Design for Beginners', date: 'Mar 3, 2026', time: '5:30 PM' },
  ],

  stats: { students: 120, sessions: 14, communities: 2,  },
};

export default function MentorProfile() {
  const [activeTab, setActiveTab] = useState('overview');
  const m = mockMentor;
  const tabs = ['overview', 'sessions', ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');.syne{font-family:'Syne',sans-serif;}`}</style>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Cover */}
        <div className="relative mb-6">
          <div className="h-48 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-teal-600/10 to-slate-900 border border-slate-800 overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #10b981 0%, transparent 60%), radial-gradient(circle at 75% 30%, #14b8a6 0%, transparent 50%)' }} />
          </div>
          <div className="absolute -bottom-10 left-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 border-4 border-slate-950 flex items-center justify-center text-2xl font-black text-white shadow-2xl">
              {m.avatar}
            </div>
          </div>
          <button className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-xl text-sm font-bold text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-all">
            <Edit2 size={14} /> Edit Profile
          </button>
        </div>

        {/* Name + Meta */}
        <div className="mt-14 mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black text-white syne">{m.name}</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest">
                  <Briefcase size={11} /> Mentor
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300 text-xs font-semibold">
                  {m.experience} Experience
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              {m.github && <a href={`https://${m.github}`} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500 hover:text-emerald-400 text-slate-400 transition-all"><Github size={16} /></a>}
              {m.linkedin && <a href={`https://${m.linkedin}`} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500 hover:text-emerald-400 text-slate-400 transition-all"><Linkedin size={16} /></a>}
              {m.website && <a href={`https://${m.website}`} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500 hover:text-emerald-400 text-slate-400 transition-all"><Globe size={16} /></a>}
            </div>
          </div>

          <p className="text-slate-400 text-sm mt-3 max-w-2xl leading-relaxed">{m.bio}</p>
          <p className="text-slate-500 text-xs mt-2 font-semibold">Expertise: <span className="text-slate-300">{m.expertise}</span></p>

          <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><Mail size={12} />{m.email}</span>
            <span className="flex items-center gap-1.5"><Phone size={12} />{m.phone}</span>
            <span className="flex items-center gap-1.5"><MapPin size={12} />{m.location}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Students', value: m.stats.students, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Sessions Done', value: m.stats.sessions, icon: Video, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            { label: 'Communities', value: m.stats.communities, icon: BookOpen, color: 'text-violet-400', bg: 'bg-violet-500/10' },
            
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={16} className={color} />
              </div>
              <p className={`text-2xl font-black syne ${color}`}>{value}</p>
              <p className="text-slate-400 text-xs font-semibold mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1.5 mb-8 w-fit">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-emerald-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-white font-black syne flex items-center gap-2"><BookOpen size={16} className="text-emerald-400" /> Communities</h3>
              {m.communities.map(c => (
                <div key={c.name} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors">
                  <div className={`h-1 bg-gradient-to-r ${c.color}`} />
                  <div className="flex items-center justify-between p-5">
                    <div>
                      <p className="text-white font-bold">{c.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{c.students} students · {c.projects} projects submitted</p>
                    </div>
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl">{c.projects} to review</span>
                  </div>
                </div>
              ))}

              {/* Upcoming */}
              <h3 className="text-white font-black syne flex items-center gap-2 pt-2"><Clock size={16} className="text-emerald-400" /> Upcoming Sessions</h3>
              {m.upcoming.map(s => (
                <div key={s.title} className="bg-slate-900 border border-l-4 border-slate-800 rounded-2xl p-4" style={{ borderLeftColor: '#10b981' }}>
                  <p className="text-white font-bold text-sm">{s.title}</p>
                  <p className="text-slate-400 text-xs mt-1">{s.date} · {s.time}</p>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* SESSIONS */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            {m.sessions.map(s => (
              <div key={s.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Video size={18} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold">{s.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{s.date} · {s.duration}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl">
                  <Users size={11} /> {s.attendees} attended
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}