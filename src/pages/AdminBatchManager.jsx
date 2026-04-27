import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import {
    Plus, Edit2, Trash2, Calendar, X, Globe,
    User as UserIcon, Loader2, RefreshCcw, Link as LinkIcon, BookOpen, Clock
} from 'lucide-react';

import { createBatch, deleteBatch, fetchAllBatches, updateBatch } from '../api/batch.api';
import { fetchAllCommunities } from '../api/community.api';
import { fetchActiveMentors } from '../api/adminDashboard.api';

const AdminBatchManager = () => {
    const [batches, setBatches] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        classAt: '',
        classLink: '',
        communityId: '',
        mentorId: '',
        banner: null
    });

    /* ── Mentors filtered by selected community ── */
    const filteredMentors = useMemo(() => {
        if (!formData.communityId) return [];
        return mentors.filter(m =>
            m.communityIds?.some(id => id === formData.communityId)
        );
    }, [formData.communityId, mentors]);

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
    };

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return 'Not set';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return 'Invalid date';
        return d.toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [batchRes, commRes, mentorRes] = await Promise.allSettled([
                fetchAllBatches(),
                fetchAllCommunities(),
                fetchActiveMentors()
            ]);

            if (batchRes.status === 'fulfilled') {
                setBatches(batchRes.value.data.batches || []);
            } else {
                console.error("Batch load failed:", batchRes.reason);
            }

            if (commRes.status === 'fulfilled') {
                const comms = commRes.value.data.communities || commRes.value.data || [];
                setCommunities(comms);
            } else {
                console.error("Community load failed:", commRes.reason);
            }

            if (mentorRes.status === 'fulfilled') {
                setMentors(mentorRes.value.data.mentors || []);
            } else {
                console.error("Mentor load failed:", mentorRes.reason);
            }

        } catch (err) {
            console.error("Data Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            classAt: '',
            classLink: '',
            communityId: '',
            mentorId: '',
            banner: null
        });
        setEditingBatch(null);
    };

    /* ── Validation ── */
    const validateForm = () => {
        if (!formData.name.trim()) { toast.error("Batch name is required"); return false; }
        if (!editingBatch && !formData.communityId) { toast.error("Please select a community"); return false; }
        if (!formData.mentorId) { toast.error("Please select a mentor"); return false; }
        if (!formData.classAt) { toast.error("Please select a date and time"); return false; }
        const d = new Date(formData.classAt);
        if (isNaN(d.getTime())) { toast.error("Invalid date format"); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        const data = new FormData();
        data.append('name', formData.name.trim());
        data.append('description', formData.description || "");
        data.append('classAt', new Date(formData.classAt).toISOString());
        data.append('classLink', formData.classLink || "");
        data.append('mentorId', formData.mentorId);

        if (formData.banner) {
            data.append('banner', formData.banner);
        }

        try {
            if (editingBatch) {
                await updateBatch(editingBatch._id, data);
                toast.success("Batch updated successfully");
            } else {
                await createBatch(formData.communityId, data);
                toast.success("Batch created successfully");
            }

            setIsModalOpen(false);
            resetForm();
            loadData();

        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleDelete = async (id) => {
        const currentBatch = batches.find(b => b._id === id);
        const action = currentBatch.isDeleted ? "restore" : "delete";

        if (!window.confirm(`Are you sure you want to ${action} this batch?`)) return;

        try {
            await deleteBatch(id);
            setBatches(prev =>
                prev.map(b =>
                    b._id === id ? { ...b, isDeleted: !b.isDeleted } : b
                )
            );
        } catch (err) {
            toast.error(err.response?.data?.message || "Action failed");
        }
    };

    /* ── When community changes, clear mentor selection ── */
    const handleCommunityChange = (newCommunityId) => {
        setFormData(prev => ({
            ...prev,
            communityId: newCommunityId,
            mentorId: ''
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-40">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    const activeBatches = batches.filter(b => !b.isDeleted);
    const deletedBatches = batches.filter(b => b.isDeleted);

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#1e3a5f] uppercase tracking-tight">
                        Batch Management
                    </h1>
                    <p className="text-blue-400 font-medium">
                        {batches.length} total batch{batches.length !== 1 ? 'es' : ''} · {activeBatches.length} active
                    </p>
                </div>

                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-[#1e3a5f] text-amber-400 px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-800 transition shadow-lg shadow-blue-900/20"
                >
                    <Plus size={20} /> NEW BATCH
                </button>
            </div>

            {/* BATCH TABLE */}
            {batches.length === 0 ? (
                <div className="bg-white rounded-3xl border border-blue-100 p-16 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <BookOpen size={28} className="text-blue-300" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1e3a5f]">No Batches Yet</h3>
                    <p className="text-blue-400 text-sm mt-1 mb-6">Create your first batch to get started</p>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="bg-[#1e3a5f] text-amber-400 px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-800 transition inline-flex items-center gap-2"
                    >
                        <Plus size={16} /> Create First Batch
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-blue-50 text-[10px] font-black text-blue-400 uppercase tracking-widest border-b border-blue-100">
                            <tr>
                                <th className="p-5">Batch Name</th>
                                <th className="p-5">Community</th>
                                <th className="p-5">Mentor</th>
                                <th className="p-5">Class Date</th>
                                <th className="p-5 text-center">Status</th>
                                <th className="p-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            {batches.map(batch => (
                                <tr
                                    key={batch._id}
                                    className={`transition-colors ${
                                        batch.isDeleted
                                            ? 'bg-gray-50/50 opacity-60'
                                            : 'hover:bg-blue-50/50'
                                    }`}
                                >
                                    {/* Name + Banner */}
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            {batch.bannerImage ? (
                                                <img
                                                    src={batch.bannerImage}
                                                    alt=""
                                                    className={`w-10 h-10 rounded-xl object-cover border border-blue-100 shrink-0 ${batch.isDeleted ? 'grayscale' : ''}`}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                                    <BookOpen size={16} className="text-blue-300" />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-bold text-[#1e3a5f] truncate text-sm">{batch.name}</p>
                                                {batch.classLink && (
                                                    <a
                                                        href={batch.classLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[10px] text-blue-400 hover:text-blue-600 flex items-center gap-1 mt-0.5"
                                                    >
                                                        <LinkIcon size={10} /> Class Link
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Community */}
                                    <td className="p-5">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e3a5f] bg-blue-50 px-3 py-1.5 rounded-lg">
                                            <Globe size={12} className="text-amber-400" />
                                            {batch.communityId?.name || 'Unknown'}
                                        </span>
                                    </td>

                                    {/* Mentor */}
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-[#1e3a5f] flex items-center justify-center text-amber-400 font-black text-[10px] shrink-0">
                                                {batch.mentorId?.name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-[#1e3a5f] truncate">
                                                    {batch.mentorId?.name || 'Unassigned'}
                                                </p>
                                                {batch.mentorId?.email && (
                                                    <p className="text-[10px] text-blue-300 truncate">{batch.mentorId.email}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Date */}
                                    <td className="p-5">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                                            <Clock size={13} className="text-amber-400 shrink-0" />
                                            {formatDisplayDate(batch.classAt)}
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="p-5 text-center">
                                        {batch.isDeleted ? (
                                            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-red-50 text-red-400 border border-red-100 uppercase">
                                                Inactive
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 uppercase">
                                                Active
                                            </span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => {
                                                    setEditingBatch(batch);
                                                    setFormData({
                                                        name: batch.name,
                                                        description: batch.description || '',
                                                        classAt: formatDateTime(batch.classAt),
                                                        classLink: batch.classLink || '',
                                                        communityId: batch.communityId?._id || '',
                                                        mentorId: batch.mentorId?._id || '',
                                                        banner: null
                                                    });
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-2 text-blue-300 hover:text-[#1e3a5f] hover:bg-blue-50 rounded-xl transition"
                                                title="Edit"
                                            >
                                                <Edit2 size={15} />
                                            </button>

                                            <button
                                                onClick={() => handleToggleDelete(batch._id)}
                                                className={`p-2 rounded-xl transition ${batch.isDeleted
                                                    ? 'text-green-500 hover:bg-green-50'
                                                    : 'text-blue-300 hover:text-red-500 hover:bg-red-50'
                                                    }`}
                                                title={batch.isDeleted ? 'Restore' : 'Delete'}
                                            >
                                                {batch.isDeleted ? <RefreshCcw size={15} /> : <Trash2 size={15} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-[#1e3a5f]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) { setIsModalOpen(false); resetForm(); } }}
                >
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 relative shadow-2xl max-h-[90vh] overflow-y-auto border border-blue-100">

                        {/* Amber accent bar */}
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400 rounded-l-[2.5rem]" />

                        <button
                            onClick={() => { setIsModalOpen(false); resetForm(); }}
                            className="absolute top-8 right-8 text-blue-300 hover:text-[#1e3a5f] transition"
                        >
                            <X />
                        </button>

                        <h2 className="text-2xl font-black text-[#1e3a5f] mb-8 uppercase tracking-tighter ml-4">
                            {editingBatch ? 'Update Batch' : 'Deploy New Batch'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5 ml-4">

                            {/* Batch Name */}
                            <div>
                                <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">
                                    Batch Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    required
                                    className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-4 font-bold outline-none text-[#1e3a5f] placeholder-blue-300 focus:ring-2 focus:ring-blue-500 transition"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Web Dev Batch A - 2026"
                                />
                            </div>

                            {/* Community */}
                            <div>
                                <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">
                                    Community <span className="text-red-400">*</span>
                                </label>
                                <select
                                    required={!editingBatch}
                                    disabled={!!editingBatch}
                                    className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-4 font-bold outline-none text-[#1e3a5f] focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    value={formData.communityId}
                                    onChange={e => handleCommunityChange(e.target.value)}
                                >
                                    <option value="">Select Community</option>
                                    {communities.map(c =>
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    )}
                                </select>
                            </div>

                            {/* Mentor (filtered by community) */}
                            <div>
                                <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">
                                    Assign Mentor <span className="text-red-400">*</span>
                                </label>
                                <select
                                    required
                                    disabled={!formData.communityId}
                                    className={`w-full bg-blue-50 border border-blue-100 rounded-2xl p-4 font-bold outline-none text-[#1e3a5f] focus:ring-2 focus:ring-blue-500 transition ${
                                        !formData.communityId ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    value={formData.mentorId}
                                    onChange={e => setFormData({ ...formData, mentorId: e.target.value })}
                                >
                                    {!formData.communityId ? (
                                        <option value="">Select a community first</option>
                                    ) : filteredMentors.length === 0 ? (
                                        <option value="">No mentors in this community</option>
                                    ) : (
                                        <>
                                            <option value="">Choose a mentor</option>
                                            {filteredMentors.map(m =>
                                                <option key={m.userId} value={m.userId}>{m.name} ({m.email})</option>
                                            )}
                                        </>
                                    )}
                                </select>
                                {formData.communityId && filteredMentors.length === 0 && (
                                    <p className="text-[10px] text-amber-500 font-bold mt-1.5 ml-1">
                                        ⚠ No mentors are enrolled in this community. Assign a mentor first.
                                    </p>
                                )}
                            </div>

                            {/* Date & Time */}
                            <div>
                                <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">
                                    Class Date & Time <span className="text-red-400">*</span>
                                </label>
                                <input
                                    required
                                    type="datetime-local"
                                    className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-4 font-bold outline-none text-[#1e3a5f] focus:ring-2 focus:ring-blue-500 transition"
                                    value={formData.classAt}
                                    onChange={e => setFormData({ ...formData, classAt: e.target.value })}
                                />
                            </div>

                            {/* Class Link (optional) */}
                            <div>
                                <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">
                                    Class Link <span className="text-blue-300">(optional)</span>
                                </label>
                                <input
                                    className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-4 font-bold outline-none text-[#1e3a5f] placeholder-blue-300 focus:ring-2 focus:ring-blue-500 transition"
                                    value={formData.classLink}
                                    onChange={e => setFormData({ ...formData, classLink: e.target.value })}
                                    placeholder="https://meet.google.com/..."
                                />
                            </div>

                            {/* Banner (optional) */}
                            <div>
                                <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">
                                    Banner Image <span className="text-blue-300">(optional)</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full text-xs pt-2 text-blue-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#1e3a5f] hover:file:bg-blue-100 file:transition file:cursor-pointer"
                                    onChange={e => setFormData({ ...formData, banner: e.target.files[0] })}
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-[#1e3a5f] text-amber-400 py-4 rounded-2xl font-black uppercase hover:bg-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting && <Loader2 size={18} className="animate-spin" />}
                                {editingBatch ? 'Save Changes' : 'Launch Batch'}
                            </button>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminBatchManager;