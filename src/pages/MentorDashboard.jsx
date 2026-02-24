import { useState, useMemo, useEffect } from "react";
import {
  Users, Video, Clock, CheckCircle, ChevronRight, BookOpen, 
  Calendar, Play, Award, X, Send, GraduationCap,
  Download, ShieldCheck, Loader2, MapPin, ExternalLink
} from "lucide-react";
import { allBatches, myAllStudents, myAssignedCommunities } from "../api/mentor.api";


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
  const [allCommunities, setAllCommunities] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [batches, setBatches] = useState([]); // State for Batches
  const [loading, setLoading] = useState(true);

  const [evaluating, setEvaluating] = useState(null);
  const [selectedForCert, setSelectedForCert] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch all data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [commRes, studRes, batchRes] = await Promise.all([
          myAssignedCommunities(),
          myAllStudents(),
          allBatches() // Added batches API call
        ]);
        setAllCommunities(commRes.data.communities || []);
        setAllStudents(studRes.data.students || []);
        setBatches(batchRes.data.batches || []);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const projects = allCommunities.flatMap(c => c.projects || []);
    return {
      pendingCount: projects.filter(p => p.status === "pending").length,
      reviewed: projects.filter(p => p.status === "reviewed"),
      totalStudents: allStudents.length,
      totalCommunities: allCommunities.length,
      upcomingSessions: batches.length
    };
  }, [allCommunities, allStudents, batches]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-orange-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap'); .syne { font-family: 'Syne', sans-serif; }`}</style>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-black text-white">S</div>
          <span className="font-black text-lg syne">Skill<span className="text-orange-500">Connect</span></span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black syne text-slate-900">Mentor Dashboard</h1>
          <p className="text-slate-500 text-sm italic font-medium">Monitoring {stats.totalCommunities} assigned hubs</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="My Communities" value={stats.totalCommunities} icon={MapPin} colorClass="bg-blue-500" />
          <StatCard label="Total Students" value={stats.totalStudents} icon={Users} colorClass="bg-purple-500" />
          <StatCard label="Pending Reviews" value={stats.pendingCount} icon={Clock} colorClass="bg-amber-500" />
          <StatCard label="Live Sessions" value={stats.upcomingSessions} icon={Video} colorClass="bg-orange-500" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 bg-white border border-slate-200 rounded-xl p-1.5 mb-8 w-fit shadow-sm">
          {[
            { id: "communities", label: "Review Center", icon: Users },
            { id: "my-communities", label: "Assigned Hubs", icon: MapPin, count: stats.totalCommunities },
            { id: "sessions", label: "Live Sessions", icon: Video, count: batches.length },
            { id: "certs", label: "Certificates", icon: GraduationCap },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id ? "bg-orange-500 text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-black ${activeTab === tab.id ? 'bg-white text-orange-500' : 'bg-slate-100 text-slate-500'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* --- TAB: LIVE SESSIONS (Batches) --- */}
        {activeTab === "sessions" && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-3">
            {batches.length > 0 ? (
              batches.map(batch => (
                <div key={batch._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col group">
                  <div className="h-32 relative">
                    <img 
                      src={batch.bannerImage || batch.communityId?.bannerImage} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={batch.name} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                      <span className="text-[9px] font-black text-white bg-orange-600 px-2 py-1 rounded uppercase tracking-tighter">
                        {batch.communityId?.name}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-black syne text-slate-900 leading-tight">{batch.name}</h3>
                      <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md uppercase border border-emerald-100">
                        {batch.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mb-6 line-clamp-2">{batch.description}</p>

                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                          <Clock size={14} className="text-orange-500" />
                          {new Date(batch.classAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
                          <Calendar size={12} />
                          {new Date(batch.classAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </div>

                      <a 
                        href={batch.classLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black hover:bg-orange-500 transition-all uppercase"
                      >
                        Join Session <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center">
                <Play size={40} className="text-slate-200 mb-2" />
                <p className="text-slate-400 font-bold syne uppercase text-sm">No scheduled batches found</p>
              </div>
            )}
          </div>
        )}

        {/* --- TAB: MY COMMUNITIES --- */}
        {activeTab === "my-communities" && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-3">
            {allCommunities.map(c => (
              <div key={c._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="h-24 bg-slate-900 relative overflow-hidden">
                  {c.bannerImage ? (
                    <img src={c.bannerImage} className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" alt={c.name} />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 opacity-20" />
                  )}
                  <div className="absolute bottom-3 left-4">
                    <span className="text-[10px] font-black text-white bg-white/20 backdrop-blur-md px-2 py-1 rounded uppercase tracking-widest border border-white/20">
                      {c.visibility}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black syne text-slate-900 mb-2 leading-tight">{c.name}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-6 font-medium leading-relaxed">{c.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-slate-900">{c.membersCount || 0}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Members</span>
                      </div>
                      <div className="w-px h-6 bg-slate-100" />
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-slate-900">{c.modules?.length || 0}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Modules</span>
                      </div>
                    </div>
                    <button className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-orange-500 hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- TAB: REVIEW CENTER --- */}
        {activeTab === "communities" && (
          <div className="space-y-6">
            {allCommunities.map(c => (
              <div key={c._id} className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BookOpen size={18} className="text-orange-500" /> {c.name}</h3>
                <div className="grid gap-2">
                  {c.projects?.length > 0 ? c.projects.map(p => (
                    <div key={p._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-orange-200 transition-all">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{p.title}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{p.student}</p>
                      </div>
                      <button onClick={() => setEvaluating(p)} className="text-[10px] font-black px-4 py-2 bg-slate-900 text-white rounded-lg uppercase tracking-tight">Evaluate</button>
                    </div>
                  )) : <p className="text-xs text-slate-400 italic">No submissions for this hub.</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}