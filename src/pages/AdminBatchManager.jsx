import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    Plus, Edit2, Trash2, Calendar, X,
    User as UserIcon, Loader2, RefreshCcw
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

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        classAt: '',
        classLink: '',
        communityId: '',
        mentorId: '',
        banner: null
    });

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [batchRes, commRes, mentorRes] = await Promise.all([
                fetchAllBatches(),
                fetchAllCommunities(),
                fetchActiveMentors()
            ]);

            setBatches(batchRes.data.batches);
            setCommunities(commRes.data.communities);
            setMentors(mentorRes.data.mentors);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description || "");
        data.append('classAt', formData.classAt);
        data.append('classLink', formData.classLink || "");
        data.append('mentorId', formData.mentorId);

        if (formData.banner) {
            data.append('banner', formData.banner);
        }

        try {
            if (editingBatch) {
                await updateBatch(editingBatch._id, data);
            } else {
                await createBatch(formData.communityId, data);
            }

            setIsModalOpen(false);
            resetForm();
            loadData();

        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
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

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-blue-50">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 bg-blue-50 min-h-screen overflow-x-hidden">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-[#1e3a5f] uppercase tracking-tight">
                        Batch Management
                    </h1>
                    <p className="text-blue-400 font-medium">
                        Create and oversee community learning cycles
                    </p>
                </div>

                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-[#1e3a5f] text-amber-400 px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-800 transition shadow-lg shadow-blue-900/20"
                >
                    <Plus size={20} /> NEW BATCH
                </button>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batches.map(batch => (
                    <div
                        key={batch._id}
                        className={`bg-white rounded-[2rem] border transition-all duration-300 ${batch.isDeleted
                            ? 'opacity-60 border-dashed border-blue-200'
                            : 'border-blue-100 shadow-sm hover:shadow-md hover:border-blue-200'
                            }`}
                    >

                        {batch.isDeleted && (
                            <div className="bg-[#1e3a5f] text-amber-400 text-[10px] font-black py-1 text-center uppercase tracking-widest rounded-t-[2rem]">
                                Soft Deleted / Inactive
                            </div>
                        )}

                        <div className="relative h-40 overflow-hidden rounded-t-[2rem]">
                            <img
                                src={batch.bannerImage || 'https://via.placeholder.com/400x200?text=No+Banner'}
                                alt="banner"
                                className={`w-full h-full object-cover ${batch.isDeleted ? 'grayscale' : ''}`}
                            />
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-[#1e3a5f] truncate pr-2">
                                    {batch.name}
                                </h3>

                                <div className="flex gap-1">
                                    <button
                                        onClick={() => {
                                            setEditingBatch(batch);
                                            setFormData({
                                                name: batch.name,
                                                description: batch.description,
                                                classAt: formatDateTime(batch.classAt),
                                                classLink: batch.classLink,
                                                communityId: batch.communityId?._id,
                                                mentorId: batch.mentorId?._id,
                                                banner: null
                                            });
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 text-blue-300 hover:text-[#1e3a5f] hover:bg-blue-50 rounded-xl transition"
                                    >
                                        <Edit2 size={16} />
                                    </button>

                                    <button
                                        onClick={() => handleToggleDelete(batch._id)}
                                        className={`p-2 rounded-xl transition ${batch.isDeleted
                                            ? 'text-green-500 hover:bg-green-50'
                                            : 'text-blue-300 hover:text-red-500 hover:bg-red-50'
                                            }`}
                                    >
                                        {batch.isDeleted ? <RefreshCcw size={16} /> : <Trash2 size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 text-xs text-blue-400 font-bold uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-amber-400" />
                                    {new Date(batch.classAt).toLocaleString()}
                                </div>

                                <div className="flex items-center gap-2">
                                    <UserIcon size={14} className="text-amber-400" />
                                    {batch.mentorId?.name || "Unassigned"}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#1e3a5f]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">

                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 relative shadow-2xl max-h-[90vh] overflow-y-auto border border-blue-100">

                        {/* Amber accent bar */}
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400 rounded-l-[2.5rem]" />

                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-8 right-8 text-blue-300 hover:text-[#1e3a5f] transition"
                        >
                            <X />
                        </button>

                        <h2 className="text-2xl font-black text-[#1e3a5f] mb-8 uppercase tracking-tighter ml-4">
                            {editingBatch ? 'Update Batch' : 'Deploy New Batch'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5 ml-4">

                            <input
                                required
                                className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-4 font-bold outline-none text-[#1e3a5f] placeholder-blue-300 focus:ring-2 focus:ring-blue-500 transition"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Batch Title"
                            />

                            <select
                                disabled={editingBatch}
                                className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-4 font-bold outline-none text-[#1e3a5f] focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
                                value={formData.communityId}
                                onChange={e => setFormData({ ...formData, communityId: e.target.value })}
                            >
                                <option value="">Select Community</option>
                                {communities.map(c =>
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                )}
                            </select>

                            <select
                                required
                                className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-4 font-bold outline-none text-[#1e3a5f] focus:ring-2 focus:ring-blue-500 transition"
                                value={formData.mentorId}
                                onChange={e => setFormData({ ...formData, mentorId: e.target.value })}
                            >
                                <option value="">Assign Mentor</option>
                                {mentors.map(m =>
                                    <option key={m.userId} value={m.userId}>{m.name}</option>
                                )}
                            </select>

                            <input
                                required
                                type="datetime-local"
                                className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-4 font-bold outline-none text-[#1e3a5f] focus:ring-2 focus:ring-blue-500 transition"
                                value={formData.classAt}
                                onChange={e => setFormData({ ...formData, classAt: e.target.value })}
                            />

                            <input
                                type="file"
                                className="w-full text-[10px] pt-4 text-blue-400"
                                onChange={e => setFormData({ ...formData, banner: e.target.files[0] })}
                            />

                            <button
                                className="w-full bg-[#1e3a5f] text-amber-400 py-4 rounded-2xl font-black uppercase hover:bg-blue-800 transition"
                            >
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