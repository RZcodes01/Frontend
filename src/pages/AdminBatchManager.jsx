import React, { useState, useEffect } from 'react';
import {
    Plus, Edit2, Trash2, Calendar, X, User as UserIcon, Loader2, RefreshCcw
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
        name: '', description: '', classAt: '',
        classLink: '', communityId: '', mentorId: '', banner: null
    });

    // Helper: Convert DB Date to HTML Input format (YYYY-MM-DDTHH:MM)
    const formatDateTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        data.append('name', formData.name);
        data.append('description', formData.description || "");
        data.append('classAt', formData.classAt);
        data.append('classLink', formData.classLink || "");
        data.append('mentorId', formData.mentorId); // Fixed reassignment

        if (formData.banner) data.append('banner', formData.banner);

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
            alert(err.response?.data?.message || "Operation failed");
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', classAt: '', classLink: '', communityId: '', mentorId: '', banner: null });
        setEditingBatch(null);
    };

    const handleToggleDelete = async (id) => {
        const currentBatch = batches.find(b => b._id === id);
        const action = currentBatch.isDeleted ? "restore" : "delete";

        if (!window.confirm(`Are you sure you want to ${action} this batch?`)) return;

        try {
            const response = await deleteBatch(id);

            // Update local state without a full reload for a smoother experience
            setBatches(prev => prev.map(b =>
                b._id === id ? { ...b, isDeleted: !b.isDeleted } : b
            ));

            // Optional: Toast notification (if you have one)
            // toast.success(response.data.message);

        } catch (err) {
            const errorMsg = err.response?.data?.message || "Action failed";
            alert(errorMsg);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Batch Management</h1>
                    <p className="text-slate-500 font-medium">Create and oversee community learning cycles</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-600 transition shadow-lg shadow-blue-900/20"
                >
                    <Plus size={20} /> NEW BATCH
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batches.map(batch => (
                    <div key={batch._id} className={`bg-white rounded-[2rem] border transition-all duration-300 ${batch.isDeleted ? 'opacity-60 border-dashed border-slate-300' : 'border-slate-100 shadow-sm hover:shadow-md'}`}>
                        {batch.isDeleted && (
                            <div className="bg-slate-800 text-white text-[10px] font-black py-1 text-center uppercase tracking-widest rounded-t-[2rem]">
                                Soft Deleted / Inactive
                            </div>
                        )}
                        <div className="relative h-40 overflow-hidden rounded-t-[2rem]">
                            <img
                                src={batch.bannerImage || 'https://via.placeholder.com/400x200?text=No+Banner'}
                                alt="banner"
                                className={`w-full h-full object-cover ${batch.isDeleted ? 'grayscale' : ''}`}
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-800 uppercase">
                                    {batch.communityId?.name || 'General'}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-800 truncate pr-2">{batch.name}</h3>
                                <div className="flex gap-1">
                                    <button onClick={() => {
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
                                    }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleToggleDelete(batch._id)} className={`p-2 rounded-xl transition ${batch.isDeleted ? 'text-green-500 hover:bg-green-50' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}>
                                        {batch.isDeleted ? <RefreshCcw size={16} /> : <Trash2 size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 text-xs text-slate-500 font-bold uppercase tracking-wider">
                                <div className="flex items-center gap-2"><Calendar size={14} className="text-blue-500" /> {new Date(batch.classAt).toLocaleString()}</div>
                                <div className="flex items-center gap-2"><UserIcon size={14} className="text-blue-500" /> {batch.mentorId?.name || "Unassigned"}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 relative shadow-2xl animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-800"><X /></button>
                        <h2 className="text-2xl font-black text-slate-800 mb-8 uppercase tracking-tighter">
                            {editingBatch ? 'Update Batch' : 'Deploy New Batch'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Batch Title</label>
                                <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Community</label>
                                    <select disabled={editingBatch} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none" value={formData.communityId} onChange={e => setFormData({ ...formData, communityId: e.target.value })}>
                                        <option value="">Select...</option>
                                        {communities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Mentor</label>
                                    <select required className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none" value={formData.mentorId} onChange={e => setFormData({ ...formData, mentorId: e.target.value })}>
                                        <option value="">Assign...</option>
                                        {mentors.map(m => <option key={m.userId} value={m.userId}>{m.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Class Date/Time</label>
                                    <input required type="datetime-local" className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none" value={formData.classAt} onChange={e => setFormData({ ...formData, classAt: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Banner</label>
                                    <input type="file" className="w-full text-[10px] pt-4" onChange={e => setFormData({ ...formData, banner: e.target.files[0] })} />
                                </div>
                            </div>

                            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black mt-4 uppercase hover:bg-blue-600 transition shadow-lg shadow-blue-900/10">
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