
import { useState } from 'react';
import {
  BookOpen, Award, Github, Linkedin, Globe, Mail,
  Phone, MapPin, Edit2, CheckCircle, Clock, Star,
  TrendingUp, Code, FileText, ExternalLink
} from 'lucide-react';

const mockStudent = {
  name: 'Alice Johnson',
  email: 'alice@example.com',
  phone: '+91 98765 43210',
  location: 'Pune, Maharashtra',
  bio: 'Passionate frontend developer learning React and building real-world projects. Currently enrolled in the React Developers community at SkillConnect.',
  avatar: 'AJ',
  coverImage: null,
  role: 'student',
  github: 'github.com/alicejohnson',
  linkedin: 'linkedin.com/in/alicejohnson',
  skills: ['React', 'JavaScript', 'Tailwind CSS', 'HTML/CSS', 'Git', 'Node.js'],
  communities: [
    { name: 'React Developers', mentor: 'Dr. Sarah Lee', joined: 'Jan 2026', color: 'from-orange-400 to-amber-500' },
    { name: 'UI/UX Designers', mentor: 'Ms. Priya Nair', joined: 'Feb 2026', color: 'from-rose-400 to-orange-400' },
  ],
  projects: [
    { title: 'E-Commerce Cart with Redux', status: 'reviewed', grade: 'A', community: 'React Developers', date: 'Feb 18, 2026' },
    { title: 'Portfolio with Animations', status: 'reviewed', grade: 'B+', community: 'React Developers', date: 'Feb 10, 2026' },
    { title: 'Real-time Chat App', status: 'pending', grade: null, community: 'React Developers', date: 'Feb 20, 2026' },
  ],
  certificates: [
    { course: 'React Fundamentals', mentor: 'Dr. Sarah Lee', date: 'Jan 2026' },
  ],
  stats: { projects: 3, certificates: 1, communities: 2,  },
};

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState('overview');
  const s = mockStudent;

  const tabs = ['overview', 'projects', 'certificates'];

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800 pt-20" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');.syne{font-family:'Syne',sans-serif;}`}</style>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Cover + Avatar */}
        <div className="relative mb-6">
          <div className="h-48 rounded-3xl bg-gradient-to-br from-orange-300/60 via-amber-200/60 to-rose-200 border border-orange-200 overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #fb923c 0%, transparent 60%), radial-gradient(circle at 80% 20%, #f59e0b 0%, transparent 50%)' }} />
          </div>
          <div className="absolute -bottom-10 left-8 flex items-end gap-5">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 border-4 border-amber-50 flex items-center justify-center text-2xl font-black text-white shadow-2xl">
              {s.avatar}
            </div>
          </div>
          <button className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-orange-200 rounded-xl text-sm font-bold text-stone-600 hover:border-orange-400 hover:text-orange-500 transition-all">
            <Edit2 size={14} /> Edit Profile
          </button>
        </div>

        {/* Name + Meta */}
        <div className="mt-14 mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black text-stone-800 syne">{s.name}</h1>
              <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-orange-100 border border-orange-300 rounded-full text-orange-600 text-xs font-bold uppercase tracking-widest">
                <BookOpen size={11} /> Student
              </span>
            </div>
            <div className="flex gap-3">
              {s.github && <a href={`https://${s.github}`} target="_blank" rel="noreferrer" className="p-2.5 bg-white border border-orange-200 rounded-xl hover:border-orange-400 hover:text-orange-500 text-stone-400 transition-all"><Github size={16} /></a>}
              {s.linkedin && <a href={`https://${s.linkedin}`} target="_blank" rel="noreferrer" className="p-2.5 bg-white border border-orange-200 rounded-xl hover:border-orange-400 hover:text-orange-500 text-stone-400 transition-all"><Linkedin size={16} /></a>}
              
            </div>
          </div>

          <p className="text-stone-500 text-sm mt-3 max-w-2xl leading-relaxed">{s.bio}</p>

          <div className="flex flex-wrap gap-4 mt-4 text-xs text-stone-400">
            <span className="flex items-center gap-1.5"><Mail size={12} />{s.email}</span>
            <span className="flex items-center gap-1.5"><Phone size={12} />{s.phone}</span>
            <span className="flex items-center gap-1.5"><MapPin size={12} />{s.location}</span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Projects', value: s.stats.projects, icon: Code, color: 'text-orange-500', bg: 'bg-orange-100' },
            { label: 'Certificates', value: s.stats.certificates, icon: Award, color: 'text-amber-600', bg: 'bg-amber-100' },
            { label: 'Communities', value: s.stats.communities, icon: BookOpen, color: 'text-rose-500', bg: 'bg-rose-100' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white border border-orange-100 rounded-2xl p-5 hover:border-orange-300 transition-colors shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={16} className={color} />
              </div>
              <p className={`text-2xl font-black syne ${color}`}>{value}</p>
              <p className="text-stone-400 text-xs font-semibold mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-orange-200 rounded-xl p-1.5 mb-8 w-fit shadow-sm">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-orange-400 text-white' : 'text-stone-400 hover:text-stone-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
            

              {/* Recent Projects */}
              <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-stone-800 font-black syne mb-4 flex items-center gap-2"><FileText size={16} className="text-orange-400" /> Recent Projects</h3>
                <div className="space-y-3">
                  {s.projects.map(p => (
                    <div key={p.title} className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                      <div>
                        <p className="text-stone-700 text-sm font-semibold">{p.title}</p>
                        <p className="text-stone-400 text-xs mt-0.5">{p.community} · {p.date}</p>
                      </div>
                      {p.status === 'reviewed'
                        ? <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl border border-emerald-200"><CheckCircle size={11} /> {p.grade}</span>
                        : <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-xl border border-amber-200"><Clock size={11} /> Pending</span>
                      }
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Communities Sidebar */}
            <div className="space-y-4">
              <h3 className="text-stone-800 font-black syne flex items-center gap-2"><BookOpen size={16} className="text-orange-400" /> Communities</h3>
              {s.communities.map(c => (
                <div key={c.name} className="bg-white border border-orange-100 rounded-2xl overflow-hidden hover:border-orange-300 transition-colors shadow-sm">
                  <div className={`h-1 bg-gradient-to-r ${c.color}`} />
                  <div className="p-4">
                    <p className="text-stone-700 font-bold text-sm">{c.name}</p>
                    <p className="text-stone-400 text-xs mt-1">Mentor: {c.mentor}</p>
                    <p className="text-stone-300 text-xs mt-0.5">Joined {c.joined}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {s.projects.map(p => (
              <div key={p.title} className="bg-white border border-orange-100 rounded-2xl p-5 hover:border-orange-300 transition-colors flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Code size={18} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-stone-700 font-bold">{p.title}</p>
                    <p className="text-stone-400 text-xs mt-0.5">{p.community} · Submitted {p.date}</p>
                  </div>
                </div>
                {p.status === 'reviewed'
                  ? <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 text-sm font-black rounded-xl border border-emerald-200"><CheckCircle size={13} /> Grade: {p.grade}</span>
                  : <span className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 text-amber-600 text-sm font-bold rounded-xl border border-amber-200"><Clock size={13} /> Under Review</span>
                }
              </div>
            ))}
          </div>
        )}

        {/* CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {s.certificates.map(cert => (
              <div key={cert.course} className="bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-200/40 rounded-full blur-xl" />
                <Award size={28} className="text-orange-400 mb-3" />
                <p className="text-stone-800 font-black syne text-lg">{cert.course}</p>
                <p className="text-stone-500 text-xs mt-1">Mentor: {cert.mentor}</p>
                <p className="text-stone-400 text-xs mt-0.5">Issued {cert.date}</p>
                <button className="mt-4 flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:underline">
                  <ExternalLink size={12} /> Download Certificate
                </button>
              </div>
            ))}
            {s.certificates.length === 0 && (
              <p className="text-stone-400 text-sm col-span-2 text-center py-10">No certificates yet. Complete a course to earn one!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}