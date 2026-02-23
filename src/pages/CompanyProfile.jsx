
import { useState } from 'react';
import {
  Building2, Globe, Mail, MapPin, Edit2, Users,
  Briefcase, TrendingUp, Star, ExternalLink, CheckCircle,
  Linkedin, Twitter, Award
} from 'lucide-react';

const mockCompany = {
  name: 'TechZest Solutions',
  company_id: 'TN-2024-001',
  email: 'hr@techZestsolutions.com',
  website: 'techZestsolutions.com',
  industry: 'Technology',
  location: 'Mumbai, Maharashtra',
  founded: '2018',
  size: '201–500 employees',
  avatar: 'TN',
  description: 'TechZest Solutions is a product-first technology company building SaaS tools for mid-market enterprises. We believe in hiring based on skill, not degrees — which is why we partner with SkillConnect to discover talented, project-ready developers, designers, and data scientists.',
  linkedin: 'linkedin.com/company/techZestsolutions',
  twitter: 'twitter.com/techZestsol',
  openings: [
    { role: 'Frontend Developer (React)', type: 'Full-time', location: 'Remote', skills: ['React', 'TypeScript', 'Tailwind CSS'], posted: 'Feb 18, 2026' },
    { role: 'Data Analyst', type: 'Full-time', location: 'Mumbai (Hybrid)', skills: ['Python', 'SQL', 'Power BI'], posted: 'Feb 15, 2026' },
    { role: 'UI/UX Designer', type: 'Contract', location: 'Remote', skills: ['Figma', 'User Research', 'Prototyping'], posted: 'Feb 12, 2026' },
  ],
  hiredFrom: [
    { name: 'Rahul Sharma', role: 'Frontend Developer', avatar: 'RS', community: 'React Developers' },
    { name: 'Priya Mehta', role: 'Data Analyst', avatar: 'PM', community: 'Python Enthusiasts' },
    { name: 'Arjun Nair', role: 'UI/UX Designer', avatar: 'AN', community: 'UI/UX Designers' },
  ],
  perks: [
    'Flexible remote work policy',
    'Learning & development budget ₹50,000/year',
    'Health insurance for family',
    'ESOPs for all full-time employees',
    'Annual team retreats',
    'Mentorship from senior engineers',
  ],
  stats: { openings: 3, hired: 12, communities: 3, rating: 4.6 },
};

export default function CompanyProfile() {
  const [activeTab, setActiveTab] = useState('overview');
  const c = mockCompany;
  const tabs = ['overview', 'hired'];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');.syne{font-family:'Syne',sans-serif;}`}</style>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Cover */}
        <div className="relative mb-6">
          <div className="h-48 rounded-3xl bg-gradient-to-br from-orange-500/20 via-amber-600/10 to-slate-900 border border-slate-800 overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 25% 60%, #f97316 0%, transparent 55%), radial-gradient(circle at 80% 25%, #f59e0b 0%, transparent 50%)' }} />
          </div>
          <div className="absolute -bottom-10 left-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 border-4 border-slate-950 flex items-center justify-center text-2xl font-black text-white shadow-2xl">
              {c.avatar}
            </div>
          </div>
          <button className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-xl text-sm font-bold text-slate-300 hover:border-orange-500 hover:text-orange-400 transition-all">
            <Edit2 size={14} /> Edit Profile
          </button>
        </div>

        {/* Name + Meta */}
        <div className="mt-14 mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black text-white syne">{c.name}</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-bold uppercase tracking-widest">
                  <Building2 size={11} /> Company
                </span>
                <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300 text-xs font-semibold">{c.industry}</span>
                <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300 text-xs font-semibold">{c.size}</span>
              </div>
            </div>
            <div className="flex gap-3">
              {c.website && <a href={`https://${c.website}`} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-orange-500 hover:text-orange-400 text-slate-400 transition-all"><Globe size={16} /></a>}
              {c.linkedin && <a href={`https://${c.linkedin}`} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-orange-500 hover:text-orange-400 text-slate-400 transition-all"><Linkedin size={16} /></a>}
              {c.twitter && <a href={`https://${c.twitter}`} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-orange-500 hover:text-orange-400 text-slate-400 transition-all"><Twitter size={16} /></a>}
            </div>
          </div>

          <p className="text-slate-400 text-sm mt-3 max-w-2xl leading-relaxed">{c.description}</p>

          <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><Mail size={12} />{c.email}</span>
            <span className="flex items-center gap-1.5"><Globe size={12} />{c.website}</span>
            <span className="flex items-center gap-1.5"><MapPin size={12} />{c.location}</span>
            <span className="text-slate-600">ID: <span className="text-slate-400 font-semibold">{c.company_id}</span></span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Hired via SC', value: c.stats.hired, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Communities', value: c.stats.communities, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
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
              className={`px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}>
              {tab === 'hired' ? 'Hired Alumni' : tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-black syne mb-3 flex items-center gap-2"><Building2 size={16} className="text-orange-400" /> About</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: 'Founded', value: c.founded },
                    { label: 'Industry', value: c.industry },
                    { label: 'Size', value: c.size },
                    { label: 'Location', value: c.location },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-800 rounded-xl p-3">
                      <p className="text-slate-500 text-xs mb-1">{label}</p>
                      <p className="text-white font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Perks Sidebar */}
            <div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-black syne mb-4 flex items-center gap-2"><Award size={16} className="text-orange-400" /> Perks & Benefits</h3>
                <ul className="space-y-3">
                  {c.perks.map(perk => (
                    <li key={perk} className="flex items-start gap-2.5">
                      <CheckCircle size={14} className="text-orange-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* HIRED ALUMNI */}
        {activeTab === 'hired' && (
          <div>
            <p className="text-slate-400 text-sm mb-6">Talent hired by {c.name} through SkillConnect communities.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {c.hiredFrom.map(h => (
                <div key={h.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-lg mx-auto mb-3">
                    {h.avatar}
                  </div>
                  <p className="text-white font-bold">{h.name}</p>
                  <p className="text-orange-400 text-xs font-semibold mt-1">{h.role}</p>
                  <p className="text-slate-500 text-xs mt-1">via {h.community}</p>
                  <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
                    <CheckCircle size={10} /> Hired
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}