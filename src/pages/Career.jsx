// src/pages/Career.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Star, BookOpen, Zap, ArrowRight, CheckCircle,
  Globe, Award, TrendingUp, Heart, Code, Palette,
  BarChart, ChevronDown, ChevronUp, ArrowLeft
} from 'lucide-react';

const stats = [
  { value: '12K+', label: 'Students Enrolled' },
  { value: '340+', label: 'Expert Mentors' },
  { value: '95%', label: 'Placement Rate' },
  { value: '80+', label: 'Partner Companies' },
];

const values = [
  { icon: Heart, title: 'Student First', desc: 'Every decision we make starts with how it benefits our learners.' },
  { icon: Globe, title: 'Learn Anywhere', desc: 'Fully remote, async-friendly platform built for the modern learner.' },
  { icon: Zap, title: 'Real Projects', desc: 'We believe in learning by building — not watching slides.' },
  { icon: Award, title: 'Mentor-Led', desc: 'Industry professionals guide students through their learning journey.' },
];

const perks = [
  'Flexible hours — teach at your own pace',
  'Competitive monthly stipend',
  'Access to SkillConnect community & resources',
  'Opportunity to co-create curriculum',
  'Direct impact on 100s of student careers',
];


const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl px-6 py-5 transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-white font-bold text-sm">{q}</p>
        {open ? <ChevronUp size={16} className="text-cyan-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
      </div>
      {open && <p className="text-slate-400 text-sm mt-3 leading-relaxed">{a}</p>}
    </button>
  );
};

export default function Career() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap'); .syne{font-family:'Syne',sans-serif;}`}</style>

      {/* Back Button */}
              <div className="max-w-5xl mx-auto px-6 pt-10"> 
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-slate-400 hover:text-cyan-400 font-bold text-lg transition-colors group">
            <ArrowLeft 
              size={24} 
              className="group-hover:-translate-x-2 transition-transform duration-200" // Increased movement
            />
            <span>Back</span>
          </button>
        </div>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 px-6">
        {/* background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">

          <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight syne">
            Shape the Future of<br />
            <span className="text-cyan-400">Tech Education</span>
          </h1>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            SkillConnect bridges the gap between industry professionals and aspiring developers, designers, and data scientists. Join us — as a learner, mentor, or partner.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('become-mentor').scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 text-slate-950 font-black rounded-2xl hover:bg-cyan-400 transition-colors text-base"
            >
              Become a Mentor <ArrowRight size={18} />
            </button>
            <button
              onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-colors text-base border border-slate-700"
            >
              About Us
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <section className="border-y border-slate-800 bg-slate-900/50 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-4xl font-black text-cyan-400 mb-1 syne">{value}</p>
              <p className="text-slate-400 text-sm font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3 block">Who We Are</span>
              <h2 className="text-4xl font-black text-white mb-6 syne leading-tight">
                Building the world's most practical learning platform
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                SkillConnect was founded with one mission: make world-class tech education accessible to everyone, everywhere. We're not a passive video platform — we're an active, mentor-driven community where learners build real projects, get real feedback, and land real jobs.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Our platform connects students directly with working professionals who guide them through communities, live sessions, and hands-on project evaluations.
              </p>
            </div>

         
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3 block">Our Values</span>
            <h2 className="text-3xl font-black text-white syne">What we stand for</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-cyan-400" />
                </div>
                <p className="text-white font-bold mb-2">{title}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BECOME A MENTOR ──────────────────────────────────────────── */}
      <section id="become-mentor" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3 block">Mentor Program</span>
            <h2 className="text-4xl font-black text-white syne mb-4">Teach. Inspire. Earn.</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Share your expertise with a community of motivated learners. As a SkillConnect mentor, you lead communities, run live sessions, and evaluate real student projects.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Perks */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-white font-black text-lg mb-6 syne">Why mentor with us?</h3>
              <ul className="space-y-4">
                {perks.map(perk => (
                  <li key={perk} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Card */}
            <div className="relative bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-2xl p-8 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center">
                    <Users size={22} className="text-slate-950" />
                  </div>
                  <div>
                    <p className="text-white font-black text-lg syne">Join as a Mentor</p>
                    <p className="text-slate-400 text-xs">Applications open now</p>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-8">
                  Ready to make an impact? Create your mentor account, set up your profile, and start guiding your first community in days — not weeks.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/register/mentor')}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-cyan-500 text-slate-950 font-black rounded-2xl hover:bg-cyan-400 transition-colors text-base"
                  >
                    Apply as Mentor <ArrowRight size={18} />
                  </button>
                  <p className="text-center text-slate-500 text-xs">
                    Already have an account?{' '}
                    <button onClick={() => navigate('/login')} className="text-cyan-400 font-bold hover:underline">
                      Log in
                    </button>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}