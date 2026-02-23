import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Plus, Trash2, Edit3, X,
    Layout, Save, Loader2, List, PlayCircle, ChevronRight, AlertTriangle
} from 'lucide-react';
import { fetchAllCommunities } from '../api/community.api';
import { addModule, updateModule, deleteModule } from '../api/module.api';

const toEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtube.com/embed")) return url;
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/shorts\/))([\w\-]{11})/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const AdminModuleManager = () => {
    const { communityId } = useParams();
    const navigate = useNavigate();

    const [selectedComm, setSelectedComm] = useState(null);
    const [pageLoading, setPageLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null); // { _id, title, topics }
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '', description: '', youtubeUrl: '', topics: ''
    });

    /* ── Data fetching ── */
    const loadCommunityData = async () => {
        try {
            setPageLoading(true);
            const response = await fetchAllCommunities();
            const communities = response.data.communities || response.data;
            const currentComm = communities.find(c => c._id === communityId);
            if (!currentComm) {
                navigate('/admin/communities');
                return;
            }
            setSelectedComm(currentComm);
        } catch (err) {
            console.error("Failed to fetch community data:", err);
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => { if (communityId) loadCommunityData(); }, [communityId]);

    /* ── Form helpers ── */
    const resetForm = () => {
        setFormData({ title: '', description: '', youtubeUrl: '', topics: '' });
        setEditingModule(null);
    };

    const openEditModal = (mod) => {
        setEditingModule(mod);
        setFormData({
            title: mod.title,
            description: mod.description,
            youtubeUrl: mod.youtubeUrl || '',
            topics: mod.topics?.join(', ') || ''
        });
        setIsModalOpen(true);
    };

    /* ── Save (add / update) ── */
    const handleSave = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const payload = {
                ...formData,
                youtubeUrl: toEmbedUrl(formData.youtubeUrl),
                topics: formData.topics.split(',').map(t => t.trim()).filter(Boolean)
            };
            if (editingModule) {
                await updateModule(communityId, editingModule._id, payload);
            } else {
                await addModule(communityId, payload);
            }
            await loadCommunityData();
            setIsModalOpen(false);
            resetForm();
        } catch {
            alert("Failed to save module. Please try again.");
        } finally {
            setFormLoading(false);
        }
    };

    /* ── Delete ── */
    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await deleteModule(communityId, deleteTarget._id);
            await loadCommunityData();
            setDeleteTarget(null);
        } catch {
            alert("Failed to delete module. Please try again.");
        } finally {
            setDeleteLoading(false);
        }
    };

    /* ── Loading screen ── */
    if (pageLoading && !selectedComm) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-950">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-cyan-400" size={36} />
                    <p className="text-sm font-medium text-gray-500 tracking-wide">Loading curriculum…</p>
                </div>
            </div>
        );
    }

    const modules = selectedComm?.modules || [];

    return (
        <div className="h-screen flex flex-col bg-gray-950 font-sans overflow-hidden">

            {/* ── Header ── */}
            <header className="shrink-0 bg-gray-900 border-b border-gray-800 shadow-lg">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => navigate(-1)}
                            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeft size={17} className="text-gray-300" />
                        </button>
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest hidden sm:block">Curriculum</span>
                            <ChevronRight size={13} className="text-gray-600 hidden sm:block shrink-0" />
                            <span className="text-sm font-bold text-white truncate">{selectedComm?.name || '…'}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="shrink-0 inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-gray-900 text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">Add Module</span>
                        <span className="sm:hidden">Add</span>
                    </button>
                </div>
            </header>

            {/* ── Content ── */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Stats */}
                    {modules.length > 0 && (
                        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                            <Layout size={15} className="text-cyan-400" />
                            <span>
                                <span className="font-bold text-gray-300">{modules.length}</span> module{modules.length !== 1 ? 's' : ''}
                                &nbsp;·&nbsp;
                                <span className="font-bold text-gray-300">
                                    {modules.reduce((acc, m) => acc + (m.topics?.length || 0), 0)}
                                </span> topics total
                            </span>
                        </div>
                    )}

                    {/* Cards */}
                    <div className="space-y-4">
                        {modules.length > 0 ? (
                            modules.map((mod, idx) => (
                                <ModuleCard
                                    key={mod._id}
                                    mod={mod}
                                    index={idx}
                                    onEdit={() => openEditModal(mod)}
                                    onDelete={() => setDeleteTarget(mod)}
                                />
                            ))
                        ) : (
                            <EmptyState onAdd={() => setIsModalOpen(true)} />
                        )}
                    </div>
                </div>
            </main>

            {/* ── Add / Edit Modal ── */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) { setIsModalOpen(false); resetForm(); } }}
                >
                    <div className="bg-gray-900 w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">

                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-800">
                            <div>
                                <h2 className="text-lg font-bold text-white">
                                    {editingModule ? 'Edit Module' : 'New Module'}
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {editingModule ? `Editing "${editingModule.title}"` : 'Fill in the details below'}
                                </p>
                            </div>
                            <button
                                onClick={() => { setIsModalOpen(false); resetForm(); }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-colors text-gray-500 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSave} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

                            <Field label="Title *">
                                <input
                                    required
                                    className={inputCls}
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Introduction to React"
                                />
                            </Field>

                            <Field label="Description *">
                                <textarea
                                    required
                                    rows={3}
                                    className={`${inputCls} resize-none`}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief overview of what this module covers…"
                                />
                            </Field>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="YouTube URL">
                                    <input
                                        className={inputCls}
                                        value={formData.youtubeUrl}
                                        onChange={e => setFormData({ ...formData, youtubeUrl: e.target.value })}
                                        placeholder="youtube.com/watch?v=…"
                                    />
                                </Field>
                                <Field label="Topics" hint="Separate with commas">
                                    <input
                                        className={inputCls}
                                        value={formData.topics}
                                        onChange={e => setFormData({ ...formData, topics: e.target.value })}
                                        placeholder="Topic 1, Topic 2, Topic 3"
                                    />
                                </Field>
                            </div>

                            <button
                                type="submit"
                                disabled={formLoading}
                                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            >
                                {formLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={16} />}
                                {editingModule ? 'Update Module' : 'Save Module'}
                            </button>

                        </form>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Modal ── */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-gray-900 w-full max-w-sm rounded-2xl shadow-2xl border border-gray-700 p-6">

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                                <AlertTriangle size={20} className="text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">Delete Module?</h3>
                                <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone.</p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-400 bg-gray-800 rounded-xl px-4 py-3 mb-5 leading-relaxed">
                            You are about to delete{' '}
                            <span className="text-white font-semibold">"{deleteTarget.title}"</span>
                            {deleteTarget.topics?.length > 0 && (
                                <> and its <span className="text-red-400 font-semibold">{deleteTarget.topics.length} topic{deleteTarget.topics.length !== 1 ? 's' : ''}</span></>
                            )}.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleteLoading}
                                className="flex-1 py-2.5 rounded-xl border border-gray-700 text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {deleteLoading
                                    ? <Loader2 size={16} className="animate-spin" />
                                    : <Trash2 size={16} />
                                }
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────
   Shared helpers
───────────────────────────────────────────── */
const inputCls = "w-full bg-gray-800 border border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl px-4 py-3 text-sm font-medium text-white outline-none transition-all placeholder:text-gray-600";

const Field = ({ label, hint, children }) => (
    <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
        {children}
        {hint && <p className="text-[11px] text-gray-600 mt-1">{hint}</p>}
    </div>
);

/* ─────────────────────────────────────────────
   Module Card
───────────────────────────────────────────── */
const ModuleCard = ({ mod, index, onEdit, onDelete }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-black/20 transition-shadow overflow-hidden">

            <div className="flex items-start gap-4 p-5 sm:p-6">

                {/* Index */}
                <div className="shrink-0 w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 text-xs font-black">
                    {String(index + 1).padStart(2, '0')}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-bold text-cyan-400 leading-tight truncate">
                        Module {index + 1}: {mod.title}
                    </h4>
                    {mod.description && (
                        <p className="text-sm text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                            {mod.description}
                        </p>
                    )}

                    {/* Pills */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        {mod.topics?.length > 0 && (
                            <button
                                onClick={() => setExpanded(v => !v)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 px-2.5 py-1 rounded-lg transition-colors"
                            >
                                <List size={12} />
                                {mod.topics.length} topic{mod.topics.length !== 1 ? 's' : ''}
                            </button>
                        )}
                        {mod.youtubeUrl && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-400/10 px-2.5 py-1 rounded-lg">
                                <PlayCircle size={12} />
                                Video
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-1">
                    <button
                        onClick={onEdit}
                        title="Edit module"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-gray-800 transition-colors"
                    >
                        <Edit3 size={15} />
                    </button>
                    <button
                        onClick={onDelete}
                        title="Delete module"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-red-400 hover:bg-gray-800 transition-colors"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>

            {/* Topics */}
            {expanded && mod.topics?.length > 0 && (
                <div className="border-t border-gray-800 bg-gray-900/80 px-5 sm:px-6 py-5">
                    <div className="flex flex-wrap gap-x-8 gap-y-2.5">
                        {mod.topics.map((topic, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                <span className="text-xs font-bold text-gray-100 uppercase tracking-wide">
                                    {topic}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────
   Empty State
───────────────────────────────────────────── */
const EmptyState = ({ onAdd }) => (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900">
        <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
            <Layout size={28} className="text-gray-600" />
        </div>
        <h3 className="text-base font-bold text-gray-300">No modules yet</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-xs">
            Start building your curriculum by adding the first module.
        </p>
        <button
            onClick={onAdd}
            className="mt-5 inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-900 text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
            <Plus size={16} />
            Add First Module
        </button>
    </div>
);

export default AdminModuleManager;