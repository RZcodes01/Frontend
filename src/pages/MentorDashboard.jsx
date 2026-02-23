import { useState, useMemo } from "react";
import {
  Users, Video, Clock, CheckCircle, ChevronRight, BookOpen, Star, 
  Calendar, Play, Award, FileText, Eye, X, Send, GraduationCap,
  Download, ShieldCheck
} from "lucide-react";

// --- Mock Data ---
const mentor = { name: "Sarah Lee", avatar: "SL", title: "Senior Full-Stack Mentor", rating: 4.9, totalStudents: 120 };

const INITIAL_COMMUNITIES = [
  { id: 1, name: "React Developers", students: 26, projects: [
    { id: 1, student: "Alice Johnson", avatar: "AJ", title: "E-Commerce Cart with Redux", submitted: "Feb 18, 2026", status: "pending", grade: null },
    { id: 2, student: "Bob Smith", avatar: "BS", title: "Custom Hooks Library", submitted: "Feb 17, 2026", status: "reviewed", grade: "A" },
  ]},
  { id: 2, name: "Python Enthusiasts", students: 30, projects: [
    { id: 5, student: "Eva Martinez", avatar: "EM", title: "ML Sentiment Analyzer", submitted: "Feb 19, 2026", status: "pending", grade: null },
    { id: 6, student: "Frank Chen", avatar: "FC", title: "Web Scraper Dashboard", submitted: "Feb 17, 2026", status: "reviewed", grade: "A+" },
  ]},
];

const liveSessions = {
  conducted: [
    { id: 1, title: "React State Management Deep Dive", community: "React Developers", date: "Feb 15, 2026", duration: "1h 45m", attendees: 54 },
    { id: 2, title: "Python OOP Masterclass", community: "Python Enthusiasts", date: "Feb 12, 2026", duration: "2h 00m", attendees: 43 },
  ],
  upcoming: [
    { id: 6, title: "Advanced React Patterns", community: "React Developers", date: "Feb 24, 2026", time: "6:00 PM", duration: "2h" },
  ],
};

// --- Reusable UI Components ---
const StatCard = ({ label, value, icon: Icon, colorClass }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-10 h-10 rounded-xl ${colorClass} bg-opacity-10 flex items-center justify-center mb-4`}>
      <Icon size={18} className={colorClass.replace('bg-', 'text-')} />
    </div>
    <p className="text-3xl font-black syne text-slate-900">{value}</p>
    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{label}</p>
  </div>
);

export default function MentorDashboard() {
  const [activeTab, setActiveTab] = useState("communities");
  const [allCommunities, setAllCommunities] = useState(INITIAL_COMMUNITIES);
  const [evaluating, setEvaluating] = useState(null);
  const [selectedForCert, setSelectedForCert] = useState(null);

  const stats = useMemo(() => {
    const projects = allCommunities.flatMap(c => c.projects);
    return {
      pendingCount: projects.filter(p => p.status === "pending").length,
      reviewed: projects.filter(p => p.status === "reviewed"),
    };
  }, [allCommunities]);

  const handleGrade = (projectId, grade) => {
    setAllCommunities(prev => prev.map(c => ({
      ...c, projects: c.projects.map(p => p.id === projectId ? { ...p, status: "reviewed", grade } : p)
    })));
    setEvaluating(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap'); .syne { font-family: 'Syne', sans-serif; }`}</style>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-black text-white">S</div>
          <span className="font-black text-lg syne">Skill<span className="text-orange-500">Connect</span></span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">{mentor.name}</p>
            <p className="text-[10px] text-orange-600 font-bold uppercase tracking-tighter italic">Senior Mentor</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black border border-slate-300">{mentor.avatar}</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black syne text-slate-900">Mentor Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back, Sarah. You have {stats.pendingCount} reviews to complete.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Communities" value={allCommunities.length} icon={Users} colorClass="bg-blue-500" />
          <StatCard label="Pending" value={stats.pendingCount} icon={Clock} colorClass="bg-amber-500" />
          <StatCard label="Completed" value={stats.reviewed.length} icon={CheckCircle} colorClass="bg-emerald-500" />
          <StatCard label="Total Reach" value={mentor.totalStudents} icon={Star} colorClass="bg-purple-500" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 bg-white border border-slate-200 rounded-xl p-1.5 mb-8 w-fit shadow-sm">
          {[
            { id: "communities", label: "Review Center", icon: Users },
            { id: "sessions", label: "Live Sessions", icon: Video },
            { id: "certs", label: "Issue Certificates", icon: GraduationCap },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id ? "bg-orange-500 text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>

        {/* --- TAB 1: REVIEW CENTER --- */}
        {activeTab === "communities" && (
          <div className="space-y-6">
            {allCommunities.map(c => (
              <div key={c.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800"><BookOpen size={18} className="text-orange-500"/> {c.name}</h3>
                  <div className="grid gap-2">
                    {c.projects.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-orange-200 transition-all">
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-none">{p.title}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{p.student} • {p.submitted}</p>
                        </div>
                        {p.status === "pending" ? (
                          <button onClick={() => setEvaluating(p)} className="text-[10px] font-black px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 uppercase tracking-tight">Evaluate</button>
                        ) : (
                          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">GRADE: {p.grade}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- TAB 2: LIVE SESSIONS --- */}
        {activeTab === "sessions" && (
          <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Play size={16} className="text-orange-500"/> Upcoming Sessions</h2>
              {liveSessions.upcoming.map(s => (
                <div key={s.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-sm text-slate-900">{s.title}</p>
                        <p className="text-[10px] text-orange-600 font-bold uppercase mt-1">{s.community}</p>
                    </div>
                    <span className="text-[10px] bg-white px-2 py-1 rounded border border-slate-200 font-bold">{s.duration}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-slate-500">
                    <div className="flex items-center gap-1 text-[10px] font-bold"><Calendar size={12}/> {s.date}</div>
                    <div className="flex items-center gap-1 text-[10px] font-bold"><Clock size={12}/> {s.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><CheckCircle size={16} className="text-emerald-500"/> Session History</h2>
              {liveSessions.conducted.map(s => (
                <div key={s.id} className="p-4 border border-slate-100 rounded-xl bg-white mb-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm text-slate-900">{s.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">{s.attendees} Students Attended</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-900">{s.duration}</p>
                    <p className="text-[9px] text-slate-400 font-bold">{s.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 3: ISSUE CERTIFICATES --- */}
        {activeTab === "certs" && (
          <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Sidebar List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-black syne">Graded Students</h2>
              <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm max-h-[600px] overflow-y-auto">
                {stats.reviewed.length > 0 ? (
                    stats.reviewed.map(p => (
                    <button 
                        key={p.id} 
                        onClick={() => setSelectedForCert(p)}
                        className={`w-full text-left p-4 rounded-xl transition-all mb-1 flex justify-between items-center ${selectedForCert?.id === p.id ? 'bg-orange-500 text-white shadow-lg' : 'hover:bg-slate-50 border border-transparent'}`}
                    >
                        <div>
                            <p className={`font-bold text-sm ${selectedForCert?.id === p.id ? 'text-white' : 'text-slate-900'}`}>{p.student}</p>
                            <p className={`text-[10px] uppercase font-black tracking-tight ${selectedForCert?.id === p.id ? 'text-orange-100' : 'text-slate-400'}`}>Grade: {p.grade}</p>
                        </div>
                        <ChevronRight size={14} opacity={selectedForCert?.id === p.id ? 1 : 0.3} />
                    </button>
                    ))
                ) : (
                    <div className="p-8 text-center text-slate-400 text-sm italic font-medium">Evaluate projects first to generate certificates.</div>
                )}
              </div>
            </div>

            {/* Certificate Preview Pane */}
            <div className="lg:col-span-2">
              {selectedForCert ? (
                <div className="space-y-6">
                   <div className="relative aspect-[1.414/1] bg-white border-[14px] border-slate-900 p-12 flex flex-col items-center justify-center text-center shadow-2xl rounded-sm">
                      {/* Decorative elements */}
                      <div className="absolute top-4 right-4"><ShieldCheck size={40} className="text-slate-100" /></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-full"></div>
                      
                      <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-orange-500/20">
                        <GraduationCap size={28} />
                      </div>
                      
                      <h4 className="syne font-black text-2xl mb-1 text-slate-900 tracking-tighter">CERTIFICATE OF COMPLETION</h4>
                      <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em] mb-10">SkillConnect Professional Mentorship</p>
                      
                      <p className="text-slate-500 font-medium text-xs mb-2">This certifies that</p>
                      <h2 className="syne font-black text-5xl text-slate-900 mb-6 italic">
                        {selectedForCert.student}
                      </h2>
                      
                      <p className="max-w-md text-slate-600 text-sm leading-relaxed mb-10">
                        Has successfully demonstrated mastery in <span className="font-bold text-slate-900">Advanced Development Patterns</span> by delivering the project <span className="italic text-orange-600">"{selectedForCert.title}"</span> with an exceptional grade of <span className="font-black text-slate-900">{selectedForCert.grade}</span>.
                      </p>
                      
                      <div className="flex justify-between w-full mt-auto pt-8 border-t border-slate-100 px-4">
                        <div className="text-left">
                            <p className="font-black text-slate-900 text-sm">{mentor.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{mentor.title}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-900 font-black mb-1">VERIFIED CREDENTIAL</p>
                            <p className="text-[9px] text-slate-400 font-bold font-mono">ID: SC-REF-{selectedForCert.id}X99</p>
                        </div>
                      </div>
                   </div>

                   <div className="flex flex-col sm:flex-row gap-3">
                      <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black syne hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group">
                         <Download size={18} className="group-hover:-translate-y-1 transition-transform" /> DOWNLOAD PDF
                      </button>
                      <button className="flex-1 bg-orange-500 text-white py-4 rounded-2xl font-black syne hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                         <Send size={18} /> ISSUE TO STUDENT
                      </button>
                   </div>
                </div>
              ) : (
                <div className="h-full border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center bg-white/50">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Award size={32} className="text-slate-300" />
                    </div>
                    <h3 className="font-bold text-slate-400 syne">Certificate Designer</h3>
                    <p className="text-slate-400 text-xs mt-1">Select a student from the list to preview <br/> and issue their official certificate.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Evaluate Modal */}
      {evaluating && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest mb-1">Grading Student</p>
                <h3 className="text-xl font-black syne">{evaluating.student}</h3>
              </div>
              <button onClick={() => setEvaluating(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {["A+", "A", "A-", "B+", "B", "C"].map(g => (
                <button 
                  key={g} 
                  onClick={() => handleGrade(evaluating.id, g)} 
                  className="py-4 rounded-xl border border-slate-200 hover:bg-slate-900 hover:text-white font-black text-sm transition-all"
                >
                  {g}
                </button>
              ))}
            </div>
            <button onClick={() => setEvaluating(null)} className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}