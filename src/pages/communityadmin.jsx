import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Users, Calendar, Ban, ChevronRight,
  User, Clock, Trash2, Edit3, Plus, ShieldAlert, GraduationCap, Mail, Crown
} from 'lucide-react';
import { fetchAllCommunities } from '../api/community.api';
import { allEnrollmentsForACommunity, fetchAllBatchesOfACommunity } from '../api/adminDashboard.api';


const CommunityAdmin = () => {
  const [view, setView] = useState('list');
  const [activeTab, setActiveTab] = useState('batches'); // 'batches' | 'students'
  const [loading, setLoading] = useState(false);

  const [communities, setCommunities] = useState([]);
  const [selectedComm, setSelectedComm] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const response = await fetchAllCommunities();
        setCommunities(response.data.communities || response.data);
      } catch (error) {
        console.error("Failed to fetch communities:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // --- UPDATED: FETCH BATCHES & STUDENTS ---
  const handleCommunityClick = async (comm) => {
    try {
      setLoading(true);
      // Run both API calls in parallel for better performance
      const [batchRes, studentRes] = await Promise.all([
        fetchAllBatchesOfACommunity(comm._id),
        allEnrollmentsForACommunity(comm._id)
      ]);

      setSelectedComm({
        ...comm,
        batches: batchRes.data.batches || [],
        students: studentRes.data.students || []
      });
      setActiveTab('batches'); // Reset to batches tab on entry
      setView('detail');
    } catch (error) {
      console.error("Error fetching community data:", error);
      alert("Could not load community details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && view === 'list' && communities.length === 0) {
    return <div className="flex h-screen items-center justify-center font-bold text-slate-400">Loading Hub...</div>;
  }

  // --- VIEW 1: HUB ---
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">COMMUNITY HUB</h2>
            <p className="text-slate-500 font-medium">Active Communities: <span className="text-blue-600">{communities.length}</span></p>
          </div>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition">
            <Plus size={20} /> Create Community
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map(comm => (
            <div key={comm._id} onClick={() => handleCommunityClick(comm)}
              className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer">
              <div className="mb-4 bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{comm.name}</h3>
              <p className="text-slate-400 text-xs mb-4 uppercase font-bold tracking-widest">Est. {new Date(comm.createdAt).toLocaleDateString()}</p>
              <div className="flex justify-between items-center text-sm font-bold border-t pt-4">
                <span className="text-slate-400 text-[10px] uppercase">{comm.visibility}</span>
                <ChevronRight size={18} className="text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- VIEW 2: DETAILS (WITH STUDENT LIST) ---
  if (view === 'detail') {
    return (
      <div className="animate-in slide-in-from-right duration-300">
        <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 font-bold mb-6 hover:text-slate-800">
          <ArrowLeft size={20} /> Back to Hub
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black text-slate-800 mb-2">{selectedComm.name}</h2>
              <p className="text-slate-500 text-sm mb-6">{selectedComm.description}</p>
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                  <span>Enrolled Students</span>
                  <span className="text-blue-600">{selectedComm.students.length}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                  <span>Active Batches</span>
                  <span className="text-slate-900">{selectedComm.batches.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Tab Switcher */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('batches')}
                className={`flex-1 p-4 font-bold text-xs uppercase tracking-widest transition ${activeTab === 'batches' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                Batches ({selectedComm.batches.length})
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`flex-1 p-4 font-bold text-xs uppercase tracking-widest transition ${activeTab === 'students' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                Enrolled Students ({selectedComm.students.length})
              </button>
            </div>

            {/* BATCHES TABLE */}
            {/* BATCHES TABLE */}
            {activeTab === 'batches' && (
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="p-6">Batch Name</th>
                    <th className="p-6">Mentor</th>
                    <th className="p-6">Class Date</th>
                    <th className="p-6">Status</th> {/* Added Header */}
                    <th className="p-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {selectedComm.batches.map(batch => (
                    <tr key={batch._id} className={`transition ${batch.isDeleted ? 'bg-slate-50/80 opacity-75' : 'hover:bg-slate-50/50'}`}>
                      <td className="p-6">
                        <div className="font-bold text-slate-700">{batch.name}</div>
                        {batch.isDeleted && <span className="text-[9px] text-red-500 font-black uppercase tracking-tighter">Archived</span>}
                      </td>
                      <td className="p-6 text-sm font-semibold text-slate-600">{batch.mentorId?.name || "N/A"}</td>
                      <td className="p-6 text-sm text-slate-500">{new Date(batch.classAt).toLocaleDateString()}</td>

                      {/* THE STATUS BADGE */}
                      <td className="p-6">
                        {batch.isDeleted ? (
                          <span className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg uppercase w-fit bg-red-100 text-red-700">
                            <Ban size={10} /> Inactive
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg uppercase w-fit bg-green-100 text-green-700">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="p-6 text-right">
                        <button
                          onClick={() => { setSelectedBatch(batch); setView('batch'); }}
                          className="p-2 border rounded-full hover:bg-white transition shadow-sm"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* STUDENTS TABLE */}
            {activeTab === 'students' && (
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="p-6">Student Info</th>
                    <th className="p-6">Plan</th>
                    <th className="p-6">Joined Date</th>
                    <th className="p-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {selectedComm.students.map(student => (
                    <tr key={student.enrollmentId} className="hover:bg-slate-50/50 transition">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{student.name}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1"><Mail size={10} /> {student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg uppercase w-fit ${student.plan === 'pro' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                          {student.plan === 'pro' && <Crown size={10} />} {student.plan}
                        </span>
                      </td>
                      <td className="p-6 text-xs font-medium text-slate-500">
                        {new Date(student.enrolledAt).toLocaleDateString()}
                      </td>
                      <td className="p-6 text-right">
                        <button className="text-slate-400 hover:text-red-600 transition"><Ban size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {(activeTab === 'batches' ? selectedComm.batches : selectedComm.students).length === 0 && (
              <div className="p-20 text-center text-slate-400 italic">No records found.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 3: BATCH DETAILS ---
  if (view === 'batch') {
    return (
      <div className="animate-in zoom-in-95 duration-300">
        <button onClick={() => setView('detail')} className="flex items-center gap-2 text-slate-500 font-bold mb-6 hover:text-slate-800">
          <ArrowLeft size={20} /> Back to {selectedComm.name}
        </button>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-3xl font-black text-slate-800">{selectedBatch.name}</h2>
          <div className="flex items-center gap-2 text-blue-600 font-bold mt-2"><User size={16} /> Instructor: {selectedBatch.mentorId?.name}</div>
          <p className="text-slate-500 mt-6 leading-relaxed">{selectedBatch.description}</p>
          <div className="flex gap-4 mt-8">
            <a href={selectedBatch.classLink} target="_blank" rel="noreferrer" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">Join Live Session</a>
          </div>
        </div>
      </div>
    );
  }
};

export default CommunityAdmin;