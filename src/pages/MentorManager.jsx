import React, { useState, useEffect } from 'react';
import {
  UserCheck, UserX, FileText, Loader2,
  ShieldCheck, ExternalLink, Mail, Calendar, AlertCircle
} from 'lucide-react';
import { approveMentor, fetchActiveMentors, fetchPendingMentors, rejectMentor } from '../api/adminDashboard.api';

const MentorManager = () => {
  const [pendingMentors, setPendingMentors] = useState([]);
  const [activeMentors, setActiveMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const loadAllMentors = async () => {
    try {
      setLoading(true);
      const [pendingRes, activeRes] = await Promise.all([
        fetchPendingMentors(),
        fetchActiveMentors()
      ]);
      setPendingMentors(pendingRes.data.mentors || []);
      setActiveMentors(activeRes.data.mentors || []);
      console.log(activeRes.data)
    } catch (error) {
      console.error("Error loading mentor data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllMentors();
  }, []);

  const handleAction = async (userId, action) => {
    let reason = "";

    if (action === 'reject') {
      const inputReason = window.prompt("Enter reason for rejection:", "Application did not meet requirements");
      if (inputReason === null) return; // Admin cancelled the prompt
      if (inputReason.trim() === "") {
        alert("A rejection reason is required.");
        return;
      }
      reason = inputReason;
    } else {
      if (!window.confirm(`Approve this mentor?`)) return;
    }

    try {
      setActionLoading(userId);
      if (action === 'approve') {
        await approveMentor(userId);
      } else {
        // Sends { reason: "..." } in the request body
        await rejectMentor(userId, { reason });
      }
      await loadAllMentors();
    } catch (error) {
      console.error("Action error:", error);
      const errorMsg = error.response?.data?.message || "Operation failed";
      alert(`Error: ${errorMsg}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-96 items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-slate-500 font-bold animate-pulse">Synchronizing Mentor Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* PENDING SECTION */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">RESUME VERIFICATION</h2>
            <p className="text-slate-500 font-medium italic">Review and approve new mentor applications</p>
          </div>
          <div className="bg-orange-50 text-orange-600 px-6 py-2 rounded-2xl border border-orange-100 font-black flex items-center gap-2">
            <AlertCircle size={18} /> {pendingMentors.length} PENDING
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingMentors.map((mentor, index) => (
            <div key={mentor._id || `pending-${index}`} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 font-black text-xl uppercase">
                    {mentor.name?.charAt(0) || 'M'}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 capitalize">{mentor.name}</h3>
                <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                  <Mail size={14} /> {mentor.email}
                </div>
                <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <a href={mentor.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between text-blue-600 font-bold text-sm">
                    <span className="flex items-center gap-2"><FileText size={16} /> View Resume</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t flex gap-3">
                <button
                  disabled={actionLoading === mentor._id}
                  onClick={() => handleAction(mentor._id, 'approve')}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading === mentor._id ? <Loader2 className="animate-spin" size={14} /> : <UserCheck size={16} />} Approve
                </button>
                <button
                  disabled={actionLoading === mentor._id}
                  onClick={() => handleAction(mentor._id, 'reject')}
                  className="flex-1 bg-white border border-red-100 text-red-600 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <UserX size={16} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ACTIVE SECTION */}
      <section>
        <div className="bg-slate-900 rounded-3xl p-8 mb-8 flex items-center justify-between text-white">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-blue-400" size={28} /> ACTIVE MENTORS HUB
          </h2>
          <div className="text-right">
            <span className="text-4xl font-black text-blue-400">{activeMentors.length}</span>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Total Mentors</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
              <tr>
                <th className="p-6">Mentor Identity</th>
                <th className="p-6">Contact Info</th>
                <th className="p-6 text-center">Verification Date</th>
                <th className="p-6 text-right">Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeMentors.map((m, index) => (
                <tr key={m._id || `active-${index}`} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black">
                        {m.name?.charAt(0).toUpperCase() || 'M'}
                      </div>
                      <div className="font-bold text-slate-800 capitalize">{m.name}</div>
                    </div>
                  </td>
                  <td className="p-6 text-sm text-slate-600">{m.email}</td>
                  <td className="p-6 text-center text-xs font-bold text-slate-500">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-6 text-right">
                    <span className="bg-green-100 text-green-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase">Authorized</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MentorManager;