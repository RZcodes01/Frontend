import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    UserPlus, Users, ShieldCheck, AlertCircle,
    Loader2, Trash2, BookOpen, User as UserIcon
} from 'lucide-react';
import { fetchAllCommunities } from '../api/community.api';
import { fetchActiveMentors } from '../api/adminDashboard.api';
import { enrollMentorToCommunity, fetchMentorAssignments, removeMentorAssignment, updateMentorAssignment } from '../api/enrollment.api';



const MentorEnrollments = () => {
    const [communities, setCommunities] = useState([]);
    const [activeMentors, setActiveMentors] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [selectedMentor, setSelectedMentor] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editingId, setEditingId] = useState(null);
    const [editCommunityId, setEditCommunityId] = useState('');
    const [editMentorId, setEditMentorId] = useState('');

    // Load Data for dropdowns and table
    useEffect(() => {
        const loadData = async () => {
            try {
                const [commRes, mentorRes, assignmentsRes] = await Promise.all([
                    fetchAllCommunities(),
                    fetchActiveMentors(),
                    fetchMentorAssignments()
                ]);
                setCommunities(commRes.data.communities || []);
                setActiveMentors(mentorRes.data.mentors || []);
                setAssignments(assignmentsRes.data.enrollments || []);
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

    const startEdit = (enrollment) => {
        setEditingId(enrollment._id);
        setEditCommunityId(enrollment.communityId?._id || '');
        setEditMentorId(enrollment.userId?._id || '');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditCommunityId('');
        setEditMentorId('');
    };

    const saveEdit = async () => {
        if (!editingId || !editCommunityId || !editMentorId) return;
        try {
            setLoading(true);
            await updateMentorAssignment(editingId, { communityId: editCommunityId, userId: editMentorId });
            toast.success("Assignment updated");
            cancelEdit();
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update assignment");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (enrollmentId) => {
        if (!window.confirm("Remove this mentor from the community?")) return;
        try {
            await removeMentorAssignment(enrollmentId);
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            toast.error("Failed to remove mentor");
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
                            <th className="p-6">Community</th>
                            <th className="p-6">Mentor</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {assignments.map((enroll) => {
                            const isEditing = editingId === enroll._id;
                            return (
                                <tr key={enroll._id} className="group hover:bg-slate-50/50 transition">
                                    <td className="p-6">
                                        {isEditing ? (
                                            <select
                                                value={editCommunityId}
                                                onChange={(e) => setEditCommunityId(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            >
                                                <option value="">Select Community</option>
                                                {communities.map(c => (
                                                    <option key={c._id} value={c._id}>{c.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="font-bold text-slate-800">{enroll.communityId?.name || "Unknown Community"}</div>
                                        )}
                                    </td>
                                    <td className="p-6">
                                        {isEditing ? (
                                            <select
                                                value={editMentorId}
                                                onChange={(e) => setEditMentorId(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            >
                                                <option value="">Select Mentor</option>
                                                {activeMentors.map(m => (
                                                    <option key={m.userId} value={m.userId}>{m.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <>
                                                <div className="font-bold text-slate-800 capitalize">{enroll.userId?.name || "Unknown Mentor"}</div>
                                                <div className="text-[10px] text-slate-400 font-medium">{enroll.userId?.email || ""}</div>
                                            </>
                                        )}
                                    </td>
                                    <td className="p-6 text-right">
                                        {isEditing ? (
                                            <div className="inline-flex gap-2">
                                                <button
                                                    disabled={loading}
                                                    onClick={saveEdit}
                                                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    disabled={loading}
                                                    onClick={cancelEdit}
                                                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="inline-flex gap-2 justify-end">
                                                <button
                                                    onClick={() => startEdit(enroll)}
                                                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-800 font-black text-[10px] uppercase tracking-widest hover:border-blue-300 hover:text-blue-700 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleRemove(enroll._id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-100 text-red-700 font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition"
                                                >
                                                    <Trash2 size={14} /> Remove
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}

                        {assignments.length === 0 && (
                            <tr>
                                <td colSpan="3" className="p-12 text-center text-slate-400 italic font-medium">
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