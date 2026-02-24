import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Video, Clock, CheckCircle, ChevronRight,
  Play, GraduationCap, Loader2, MapPin,
  ExternalLink, Plus, Edit, Trash2, X
} from "lucide-react";
import { getMentorProjects, myAllStudents, myAssignedCommunities } from "../api/mentor.api";
import { createBatch, deleteBatch, fetchAllBatches, fetchMentorAssignedBatches, updateBatch } from "../api/batch.api";
import { createProject, deleteProject, updateProject } from "../api/project.api";


const StatCard = ({ label, value, icon: Icon, colorClass }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-10 h-10 rounded-xl ${colorClass} bg-opacity-10 flex items-center justify-center mb-4`}>
      <Icon size={18} className={colorClass.replace('bg-', 'text-')} />
    </div>
    <p className="text-2xl sm:text-3xl font-black syne text-slate-900">{value}</p>
    <p className="text-slate-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">{label}</p>
  </div>
);

export default function MentorDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("communities");
  const [allCommunities, setAllCommunities] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [mentorProjects, setMentorProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== PROJECT MODAL STATE =====
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const emptyForm = {
    title: "",
    description: "",
    dueDate: "",
    status: "open",
    communityId: ""
  };
  const [formData, setFormData] = useState(emptyForm);

  // ===== BATCH MODAL STATE =====
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isBatchEdit, setIsBatchEdit] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const emptyBatchForm = {
    name: "",
    classAt: "",
    classLink: "",
    communityId: ""
  };
  const [batchFormData, setBatchFormData] = useState(emptyBatchForm);

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [commRes, studRes, batchRes, projectRes] = await Promise.all([
          myAssignedCommunities(),
          myAllStudents(),
          fetchMentorAssignedBatches(), // Integrated fetchAllBatches here
          getMentorProjects()
        ]);

        setAllCommunities(commRes.data.communities || []);
        setAllStudents(studRes.data.students || []);
        setBatches(batchRes.data.batches || []);
        setMentorProjects(projectRes.data.projects || []);

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => ({
    totalStudents: allStudents.length,
    totalCommunities: allCommunities.length,
    upcomingSessions: batches.length
  }), [allCommunities, allStudents, batches]);

  // ===== PROJECT MODAL HANDLERS =====
  const openCreateModal = () => {
    setIsEditMode(false);
    setFormData(emptyForm);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setIsEditMode(true);
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      dueDate: project.dueDate.split("T")[0],
      status: project.status,
      communityId: project.communityId?._id
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title required";
    if (!formData.description) newErrors.description = "Description required";
    if (!formData.dueDate) newErrors.dueDate = "Due date required";
    if (!formData.communityId) newErrors.communityId = "Select community";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      if (isEditMode) {
        const res = await updateProject(selectedProject._id, formData);
        setMentorProjects(prev => prev.map(p => p._id === selectedProject._id ? res.data.data : p));
      } else {
        const res = await createProject(formData.communityId, formData);
        setMentorProjects(prev => [res.data.data, ...prev]);
      }
      setIsModalOpen(false);
    } catch {
      alert("Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    const backup = mentorProjects;
    setMentorProjects(prev => prev.filter(p => p._id !== id));
    try {
      await deleteProject(id);
    } catch {
      setMentorProjects(backup);
    }
  };

  // ===== BATCH MODAL HANDLERS =====
  const openBatchCreateModal = () => {
    setIsBatchEdit(false);
    setBatchFormData(emptyBatchForm);
    setIsBatchModalOpen(true);
  };

  const openBatchEditModal = (batch) => {
    setIsBatchEdit(true);
    setSelectedBatch(batch);
    setBatchFormData({
      name: batch.name,
      classAt: new Date(batch.classAt).toISOString().slice(0, 16),
      classLink: batch.classLink,
      communityId: batch.communityId?._id || ""
    });
    setIsBatchModalOpen(true);
  };

  const handleBatchSubmit = async () => {
    if (!batchFormData.name || !batchFormData.classAt || (!isBatchEdit && !batchFormData.communityId)) {
      return alert("Please fill all required fields");
    }

    try {
      setSaving(true);

      // Create FormData object
      const data = new FormData();
      data.append("name", batchFormData.name);
      data.append("classAt", batchFormData.classAt);
      data.append("classLink", batchFormData.classLink);
      // Note: If you add a file input later, you'd append it here:
      // data.append("banner", fileState);

      if (isBatchEdit) {
        // For PUT requests, some backends prefer JSON unless uploading a file
        // If PUT fails with 500, try sending 'data' (FormData) here too
        const res = await updateBatch(selectedBatch._id, batchFormData);
        setBatches(prev => prev.map(b => b._id === selectedBatch._id ? res.data.batch : b));
      } else {
        // POSTing to /batches/:communityId
        const res = await createBatch(batchFormData.communityId, data);
        setBatches(prev => [res.data.batch, ...prev]);
      }

      setIsBatchModalOpen(false);
    } catch (err) {
      console.error("Batch Error Details:", err.response?.data);
      alert(err.response?.data?.message || "Batch operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleBatchDelete = async (id) => {
    if (!window.confirm("Delete this session?")) return;
    const backup = batches;
    setBatches(prev => prev.filter(b => b._id !== id));
    try {
      await deleteBatch(id);
    } catch {
      setBatches(backup);
      alert("Failed to delete session");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 sm:pb-10">

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black syne text-slate-900">
            Mentor Dashboard
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm italic font-medium">
            Monitoring {stats.totalCommunities} assigned hubs
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8">
          <StatCard label="Communities" value={stats.totalCommunities} icon={MapPin} colorClass="bg-blue-500" />
          <StatCard label="Total Students" value={stats.totalStudents} icon={Users} colorClass="bg-purple-500" />
          <StatCard label="Sessions" value={stats.upcomingSessions} icon={Video} colorClass="bg-orange-500" />
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-8">
          {[
            { id: "communities", label: "Projects" },
            { id: "my-communities", label: "Communities" },
            { id: "sessions", label: "Sessions" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id
                ? "bg-orange-500 text-white"
                : "bg-white border border-slate-200 text-slate-500"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= PROJECT TAB ================= */}
        {activeTab === "communities" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black syne">Manage Projects</h2>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase"
              >
                <Plus size={14} /> Create Project
              </button>
            </div>

            {mentorProjects.length > 0 ? (
              mentorProjects.map(p => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/submissions/${p._id}`)}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-orange-400 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black text-orange-500 uppercase">
                        {p.communityId?.name}
                      </p>
                      <h3 className="font-black text-slate-900">{p.title}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Due: {new Date(p.dueDate).toLocaleDateString()} | {p.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <button onClick={() => openEditModal(p)} className="p-2 bg-slate-100 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 bg-slate-100 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                        <Trash2 size={14} />
                      </button>
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white border border-dashed border-slate-200 rounded-2xl">
                <p className="text-sm text-slate-400 italic">No projects created yet.</p>
              </div>
            )}
          </div>
        )}

        {/* ================= COMMUNITIES TAB ================= */}
        {activeTab === "my-communities" && (
          <div className="grid sm:grid-cols-2 gap-6">
            {allCommunities.map(c => (
              <div key={c._id} className="bg-white border rounded-3xl p-6 shadow-sm">
                <h3 className="font-black syne text-slate-900">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-2">{c.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* ================= SESSIONS TAB ================= */}
        {activeTab === "sessions" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black syne">Manage Sessions</h2>
              <button
                onClick={openBatchCreateModal}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase"
              >
                <Plus size={14} /> Schedule Session
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {batches.map(batch => (
                <div key={batch._id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative group">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openBatchEditModal(batch)} className="p-2 bg-slate-100 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
                      <Edit size={12} />
                    </button>
                    <button onClick={() => handleBatchDelete(batch._id)} className="p-2 bg-slate-100 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <p className="text-[10px] font-black text-orange-500 uppercase mb-1">{batch.communityId?.name || "No Community"}</p>
                  <h3 className="font-black text-slate-900">{batch.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-slate-500">
                    <Clock size={14} />
                    <p className="text-xs font-bold uppercase tracking-tight">
                      {new Date(batch.classAt).toLocaleString()}
                    </p>
                  </div>
                  <a
                    href={batch.classLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-colors"
                  >
                    Join Room <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
            {batches.length === 0 && (
              <div className="text-center py-10 bg-white border border-dashed border-slate-200 rounded-2xl">
                <p className="text-sm text-slate-400 italic">No sessions scheduled.</p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* ===== PROJECT MODAL ===== */}
      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between mb-6">
              <h3 className="font-black text-xl">{isEditMode ? "Edit Project" : "Create Project"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X /></button>
            </div>
            <div className="space-y-4">
              <input
                type="text" placeholder="Title" value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-4 border rounded-2xl bg-slate-50 outline-orange-500 transition-all"
              />
              {errors.title && <p className="text-red-500 text-xs px-1">{errors.title}</p>}

              <textarea
                rows="4" placeholder="Description" value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-4 border rounded-2xl bg-slate-50 outline-orange-500 transition-all"
              />
              {errors.description && <p className="text-red-500 text-xs px-1">{errors.description}</p>}

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 px-1">Due Date</label>
                <input
                  type="date" value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full p-4 border rounded-2xl bg-slate-50 outline-orange-500 transition-all"
                />
              </div>

              {!isEditMode && (
                <select
                  value={formData.communityId}
                  onChange={e => setFormData({ ...formData, communityId: e.target.value })}
                  className="w-full p-4 border rounded-2xl bg-slate-50 outline-orange-500 transition-all"
                >
                  <option value="">Select Community</option>
                  {allCommunities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              )}

              <button
                onClick={handleSubmit} disabled={saving}
                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-wider hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {saving ? "Processing..." : isEditMode ? "Update Project" : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== BATCH MODAL ===== */}
      {isBatchModalOpen && (
        <div onClick={() => setIsBatchModalOpen(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between mb-6">
              <h3 className="font-black text-xl">{isBatchEdit ? "Edit Session" : "Schedule Session"}</h3>
              <button onClick={() => setIsBatchModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X /></button>
            </div>
            <div className="space-y-4">
              <input
                type="text" placeholder="Session Name (e.g., Live Q&A)" value={batchFormData.name}
                onChange={e => setBatchFormData({ ...batchFormData, name: e.target.value })}
                className="w-full p-4 border rounded-2xl bg-slate-50 outline-orange-500 transition-all"
              />

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 px-1">Session Date & Time</label>
                <input
                  type="datetime-local" value={batchFormData.classAt}
                  onChange={e => setBatchFormData({ ...batchFormData, classAt: e.target.value })}
                  className="w-full p-4 border rounded-2xl bg-slate-50 outline-orange-500 transition-all"
                />
              </div>

              <input
                type="url" placeholder="Meeting Link (Zoom, Meet, etc.)" value={batchFormData.classLink}
                onChange={e => setBatchFormData({ ...batchFormData, classLink: e.target.value })}
                className="w-full p-4 border rounded-2xl bg-slate-50 outline-orange-500 transition-all"
              />

              {!isBatchEdit && (
                <select
                  value={batchFormData.communityId}
                  onChange={e => setBatchFormData({ ...batchFormData, communityId: e.target.value })}
                  className="w-full p-4 border rounded-2xl bg-slate-50 outline-orange-500 transition-all"
                >
                  <option value="">Select Community</option>
                  {allCommunities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              )}

              <button
                onClick={handleBatchSubmit} disabled={saving}
                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-wider hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : isBatchEdit ? "Update Session" : "Schedule Session"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}