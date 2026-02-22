import React, { useState, useEffect } from 'react';
import {
    UserPlus, Users, ShieldCheck, AlertCircle,
    Loader2, Trash2, BookOpen, User as UserIcon
} from 'lucide-react';
import { fetchAllCommunities } from '../api/community.api';
import { fetchActiveMentors } from '../api/adminDashboard.api';
import { enrollMentorToCommunity } from '../api/enrollment.api';



const MentorEnrollments = () => {
    const [communities, setCommunities] = useState([]);
    const [activeMentors, setActiveMentors] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [selectedMentor, setSelectedMentor] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Load Data for dropdowns and table
    useEffect(() => {
        const loadData = async () => {
            try {
                const [commRes, mentorRes] = await Promise.all([
                    fetchAllCommunities(),
                    fetchActiveMentors()
                ]);
                setCommunities(commRes.data.communities || []);
                setActiveMentors(mentorRes.data.mentors || []);
            } catch (err) {
                console.error("Error loading enrollment data", err);
            }
        };
        loadData();
    }, [refreshTrigger]);

    const handleEnroll = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // API call to: /enrollments/community/:communityId/mentor
            await enrollMentorToCommunity(selectedCommunity, selectedMentor);
            setMessage({ type: 'success', text: "Mentor successfully assigned!" });
            setSelectedMentor('');
            setSelectedCommunity('');
            setRefreshTrigger(prev => prev + 1); // Refresh table and dropdowns
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || "Enrollment failed. This community may already have a mentor."
            });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        }
    };

    const handleRemove = async (commId, userId) => {
        if (!window.confirm("Remove this mentor from the community?")) return;
        try {
            // API call to: /enrollments/community/:communityId/user/:userId
            await removeUserFromCommunity(commId, userId);
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            alert("Failed to remove mentor");
        }
    };

    return (
        <div className="space-y-10 p-6">
            {/* 1. ASSIGNMENT FORM */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                    <UserPlus className="text-blue-600" /> ASSIGN MENTOR
                </h2>

                <form onSubmit={handleEnroll} className="grid grid-cols-1 md:grid-cols-7 gap-6 items-end">
                    <div className="md:col-span-3 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Community</label>
                        <select
                            value={selectedCommunity}
                            onChange={(e) => setSelectedCommunity(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <option value="">Select Target Community</option>
                            {communities.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-3 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mentor</label>
                        <select
                            value={selectedMentor}
                            onChange={(e) => setSelectedMentor(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <option value="">Select Available Mentor</option>
                            {activeMentors.map(m => (
                                <option key={m.userId} value={m.userId}>{m.name} ({m.totalCommunities} assigned)</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-1">
                        <button
                            disabled={loading || !selectedCommunity || !selectedMentor}
                            className="w-full bg-slate-900 text-white h-[58px] rounded-2xl font-black hover:bg-blue-600 transition disabled:opacity-30"
                        >
                            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "ASSIGN"}
                        </button>
                    </div>
                </form>

                {message.text && (
                    <div className={`mt-4 p-4 rounded-xl font-bold text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {message.type === 'success' ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                    </div>
                )}
            </div>

            {/* 2. LIVE ASSIGNMENTS TABLE */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-3 font-black text-slate-800 uppercase text-xs tracking-widest">
                        <Users size={18} /> Live Mentor Connections
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <tr>
                            <th className="p-6">Mentor</th>
                            <th className="p-6">Assigned Communities</th>
                            <th className="p-6 text-center">Managed Batches</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {activeMentors.filter(m => m.totalCommunities > 0).map((m) => (
                            <tr key={m.userId} className="group hover:bg-slate-50/50 transition">
                                <td className="p-6">
                                    <div className="font-bold text-slate-800 capitalize">{m.name}</div>
                                    <div className="text-[10px] text-slate-400 font-medium">{m.email}</div>
                                </td>
                                <td className="p-6">
                                    <div className="flex flex-wrap gap-2">
                                        {/* These community names are coming from the updated Backend Aggregation */}
                                        {m.communities.map((name, i) => (
                                            <span key={i} className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-100 uppercase">
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-6 text-center font-black text-slate-700">
                                    {m.totalBatches}
                                </td>
                                <td className="p-6 text-right">
                                    {/* To remove, we need the specific enrollment. Usually handled in Community view */}
                                    <span className="text-[10px] text-slate-300 font-bold uppercase italic">Verified Mentor</span>
                                </td>
                            </tr>
                        ))}
                        {activeMentors.every(m => m.totalCommunities === 0) && (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-slate-400 italic font-medium">
                                    No mentors are currently assigned to communities.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MentorEnrollments;