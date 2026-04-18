import { useState, useMemo, useEffect } from "react";
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";
import {
  Users, Video, Clock, ChevronRight,
  MapPin, ExternalLink, Plus, Edit, Trash2, X, Loader2,
  BookOpen, Search, Mail, Phone, Crown, UserCheck, ChevronDown, ChevronUp
} from "lucide-react";
import { getMentorProjects, myAllStudents, myAssignedCommunities, getEnrolledUsersByCommunity } from "../api/mentor.api";
import { createBatch, deleteBatch, fetchMentorAssignedBatches, updateBatch } from "../api/batch.api";
import { createProject, deleteProject, updateProject } from "../api/project.api";


const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-amber-400/10 rounded-lg flex items-center justify-center border border-amber-400/30">
        <Icon className="w-6 h-6 text-blue-900" />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-blue-900 mb-1">{value}</h3>
    <p className="text-sm text-blue-600">{label}</p>
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

  // ===== ENROLLED USERS STATE =====
  const [enrolledData, setEnrolledData] = useState({ communities: [], totalStudents: 0 });
  const [enrolledLoading, setEnrolledLoading] = useState(false);
  const [enrolledSearch, setEnrolledSearch] = useState("");
  const [expandedCommunities, setExpandedCommunities] = useState({});

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
          fetchMentorAssignedBatches(),
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

  // ===== FETCH ENROLLED USERS (lazy, on tab click) =====
  const fetchEnrolledUsers = async () => {
    try {
      setEnrolledLoading(true);
      const res = await getEnrolledUsersByCommunity();
      setEnrolledData({
        communities: res.data.communities || [],
        totalStudents: res.data.totalStudents || 0
      });
    } catch (err) {
      console.error("Enrolled users fetch error:", err);
      toast.error("Failed to load enrolled users");
    } finally {
      setEnrolledLoading(false);
    }
  };

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
      toast.error("Operation failed");
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
      return toast.error("Please fill all required fields");
    }

    try {
      setSaving(true);

      const data = new FormData();
      data.append("name", batchFormData.name);
      data.append("classAt", batchFormData.classAt);
      data.append("classLink", batchFormData.classLink);

      if (isBatchEdit) {
        const res = await updateBatch(selectedBatch._id, batchFormData);
        const updatedBatch = res?.data?.batch || res?.data?.data;
        if (!updatedBatch?._id) throw new Error("Invalid batch response");
        setBatches(prev => prev.map(b => (b?._id === selectedBatch._id ? updatedBatch : b)));
      } else {
        const res = await createBatch(batchFormData.communityId, data);
        const createdBatch = res?.data?.batch || res?.data?.data;
        if (!createdBatch?._id) throw new Error("Invalid batch response");
        setBatches(prev => [createdBatch, ...prev].filter(Boolean));
      }

      setIsBatchModalOpen(false);
    } catch (err) {
      console.error("Batch Error Details:", err.response?.data);
      toast.error(err.response?.data?.message || "Batch operation failed");
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
      toast.error("Failed to delete session");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-blue-900">
        Loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', overflowY: 'auto', backgroundColor: '#eff6ff', position: 'relative' }}>
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #1e3a5f 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          minHeight: '100%',
        }}
      />

      {/* Left accent bar */}
      <div className="absolute top-0 left-0 w-1.5 bg-amber-400 z-10" style={{ minHeight: '100%' }} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pl-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-1 tracking-tight">
            Mentor Dashboard
          </h1>
          <p className="text-blue-700">
            Monitoring {stats.totalCommunities} assigned communities
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard label="Communities" value={stats.totalCommunities} icon={MapPin} />
          <StatCard label="Total Students" value={stats.totalStudents} icon={Users} />
          <StatCard label="Sessions" value={stats.upcomingSessions} icon={Video} />
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: "communities", label: "Projects" },
            { id: "my-communities", label: "Communities" },
            { id: "sessions", label: "Sessions" },
            { id: "enrolled-users", label: "Enrolled Users", icon: UserCheck }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "enrolled-users" && enrolledData.communities.length === 0) {
                  fetchEnrolledUsers();
                }
              }}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === tab.id
                  ? "bg-blue-900 text-white"
                  : "bg-white border border-blue-200 text-blue-600 hover:border-amber-400"
                }`}
            >
              {tab.icon && <tab.icon size={15} />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= PROJECTS TAB ================= */}
        {activeTab === "communities" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-900 tracking-tight">Manage Projects</h2>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                <Plus size={16} /> Create Project
              </button>
            </div>

            <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm">
              <div className="space-y-4">
                {mentorProjects.length > 0 ? (
                  mentorProjects.map(p => (
                    <div
                      key={p._id}
                      onClick={() => navigate(`/submissions/${p._id}`)}
                      className="border border-blue-100 hover:border-amber-400 rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-md bg-blue-50/50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0 mr-4">
                          <p className="text-xs font-semibold text-amber-600 uppercase mb-1">
                            {p.communityId?.name}
                          </p>
                          <h3 className="font-semibold text-blue-900">{p.title}</h3>
                          <p className="text-sm text-blue-600 mt-1">
                            Due: {new Date(p.dueDate).toLocaleDateString()} &nbsp;|&nbsp;
                            <span className={`font-semibold ${p.status === "open" ? "text-emerald-600" : "text-red-500"}`}>
                              {p.status}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors text-blue-700"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors text-blue-700"
                          >
                            <Trash2 size={14} />
                          </button>
                          <ChevronRight size={16} className="text-blue-300" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-blue-500 text-center py-10">
                    No projects created yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= COMMUNITIES TAB ================= */}
        {activeTab === "my-communities" && (
          <div>
            <h2 className="text-xl font-bold text-blue-900 mb-4 tracking-tight">Communities</h2>
            <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm">
              <div className="space-y-4">
                {allCommunities.map(c => (
                  <div
                    key={c._id}
                    className="border border-blue-100 hover:border-amber-400 rounded-lg p-4 transition-all duration-200 bg-blue-50/50"
                  >
                    <h3 className="font-semibold text-blue-900">{c.name}</h3>
                    <p className="text-sm text-blue-600 mt-1">{c.description}</p>
                  </div>
                ))}
                {allCommunities.length === 0 && (
                  <div className="text-blue-500 text-center py-10">
                    No communities assigned yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= SESSIONS TAB ================= */}
        {activeTab === "sessions" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-900 tracking-tight">Manage Sessions</h2>
              <button
                onClick={openBatchCreateModal}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                <Plus size={16} /> Schedule Session
              </button>
            </div>

            <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm">
              <div className="space-y-4">
                {batches.filter(Boolean).map(batch => (
                  <div
                    key={batch._id}
                    className="border border-blue-100 hover:border-amber-400 rounded-lg p-4 transition-all duration-200 bg-blue-50/50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="text-xs font-semibold text-amber-600 uppercase mb-1">
                          {batch.communityId?.name || "No Community"}
                        </p>
                        <h3 className="font-semibold text-blue-900">{batch.name}</h3>
                        <div className="flex items-center gap-1 mt-1 text-blue-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{new Date(batch.classAt).toLocaleString()}</span>
                        </div>
                        <a
                          href={batch.classLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="inline-flex items-center gap-1 mt-3 text-blue-900 hover:text-amber-500 font-semibold text-sm transition-colors"
                        >
                          Join Class <ExternalLink size={13} />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => openBatchEditModal(batch)}
                          className="p-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors text-blue-700"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleBatchDelete(batch._id)}
                          className="p-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors text-blue-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {batches.length === 0 && (
                  <div className="text-blue-500 text-center py-10">
                    No sessions scheduled.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= ENROLLED USERS TAB ================= */}
        {activeTab === "enrolled-users" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-blue-900 tracking-tight">Enrolled Users</h2>
                <p className="text-sm text-blue-600 mt-1">
                  {enrolledData.totalStudents} student{enrolledData.totalStudents !== 1 ? 's' : ''} across {enrolledData.communities.length} communit{enrolledData.communities.length !== 1 ? 'ies' : 'y'}
                </p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={enrolledSearch}
                  onChange={e => setEnrolledSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-blue-200 rounded-lg bg-white text-blue-900 placeholder-blue-300 outline-none focus:border-amber-400 transition-all text-sm"
                />
              </div>
            </div>

            {enrolledLoading ? (
              <div className="bg-white rounded-xl border border-blue-200 p-12 shadow-sm flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={28} />
                <span className="ml-3 text-blue-600 font-medium">Loading enrolled users...</span>
              </div>
            ) : enrolledData.communities.length === 0 ? (
              <div className="bg-white rounded-xl border border-blue-200 p-12 shadow-sm text-blue-500 text-center">
                No communities assigned yet.
              </div>
            ) : (
              <div className="space-y-4">
                {enrolledData.communities.map(community => {
                  const isExpanded = expandedCommunities[community.communityId] !== false;
                  const filteredStudents = community.students.filter(s =>
                    !enrolledSearch ||
                    s.name?.toLowerCase().includes(enrolledSearch.toLowerCase()) ||
                    s.email?.toLowerCase().includes(enrolledSearch.toLowerCase()) ||
                    s.username?.toLowerCase().includes(enrolledSearch.toLowerCase())
                  );

                  return (
                    <div key={community.communityId} className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden">
                      {/* Community Header */}
                      <button
                        onClick={() => setExpandedCommunities(prev => ({
                          ...prev,
                          [community.communityId]: !isExpanded
                        }))}
                        className="w-full flex items-center justify-between p-5 hover:bg-blue-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                            <BookOpen size={18} className="text-amber-400" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-bold text-blue-900">{community.communityName}</h3>
                            <p className="text-xs text-blue-500">
                              {community.students.length} enrolled student{community.students.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                            {filteredStudents.length}{enrolledSearch ? ` / ${community.students.length}` : ''}
                          </span>
                          {isExpanded ? <ChevronUp size={18} className="text-blue-400" /> : <ChevronDown size={18} className="text-blue-400" />}
                        </div>
                      </button>

                      {/* Students List */}
                      {isExpanded && (
                        <div className="border-t border-blue-100">
                          {filteredStudents.length > 0 ? (
                            <div className="divide-y divide-blue-50">
                              {filteredStudents.map((student, idx) => (
                                <div
                                  key={student._id}
                                  className="flex items-center gap-4 px-5 py-4 hover:bg-blue-50/30 transition-colors"
                                >
                                  {/* Index */}
                                  <span className="text-xs font-bold text-blue-300 w-6 text-center">
                                    {idx + 1}
                                  </span>

                                  {/* Avatar */}
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-blue-100">
                                    {student.profileImage ? (
                                      <img src={student.profileImage} alt={student.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-sm font-bold text-blue-600">
                                        {student.name?.charAt(0)?.toUpperCase()}
                                      </span>
                                    )}
                                  </div>

                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-semibold text-blue-900 text-sm truncate">{student.name}</h4>
                                      {student.plan === "pro" && (
                                        <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                          <Crown size={10} /> PRO
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-0.5">
                                      <span className="flex items-center gap-1 text-xs text-blue-500">
                                        <Mail size={11} /> {student.email}
                                      </span>
                                      {student.phone && (
                                        <span className="flex items-center gap-1 text-xs text-blue-400">
                                          <Phone size={11} /> {student.phone}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Enrolled date */}
                                  <div className="text-right flex-shrink-0 hidden sm:block">
                                    <p className="text-[10px] text-blue-400 uppercase font-semibold">Enrolled</p>
                                    <p className="text-xs text-blue-600 font-medium">
                                      {new Date(student.enrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-8 text-center text-blue-400 text-sm">
                              {enrolledSearch ? "No students match your search." : "No students enrolled yet."}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ===== PROJECT MODAL ===== */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl"
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-amber-400 rounded-tl-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-amber-400 rounded-tr-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-amber-400 rounded-bl-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-amber-400 rounded-br-2xl pointer-events-none" />

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-blue-900 tracking-tight">
                {isEditMode ? "Edit Project" : "Create Project"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-blue-900 transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-blue-200 rounded-lg bg-blue-50/50 text-blue-900 placeholder-blue-300 outline-none focus:border-amber-400 transition-all"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1 px-1">{errors.title}</p>}
              </div>

              <div>
                <textarea
                  rows="4"
                  placeholder="Description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-blue-200 rounded-lg bg-blue-50/50 text-blue-900 placeholder-blue-300 outline-none focus:border-amber-400 transition-all resize-none"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1 px-1">{errors.description}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider px-1 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full p-3 border border-blue-200 rounded-lg bg-blue-50/50 text-blue-900 outline-none focus:border-amber-400 transition-all"
                />
                {errors.dueDate && <p className="text-red-500 text-xs mt-1 px-1">{errors.dueDate}</p>}
              </div>

              {!isEditMode && (
                <div>
                  <select
                    value={formData.communityId}
                    onChange={e => setFormData({ ...formData, communityId: e.target.value })}
                    className="w-full p-3 border border-blue-200 rounded-lg bg-blue-50/50 text-blue-900 outline-none focus:border-amber-400 transition-all"
                  >
                    <option value="">Select Community</option>
                    {allCommunities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  {errors.communityId && <p className="text-red-500 text-xs mt-1 px-1">{errors.communityId}</p>}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-md disabled:opacity-50 mt-2"
              >
                {saving ? "Processing..." : isEditMode ? "Update Project" : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== BATCH MODAL ===== */}
      {isBatchModalOpen && (
        <div
          onClick={() => setIsBatchModalOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl"
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-amber-400 rounded-tl-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-amber-400 rounded-tr-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-amber-400 rounded-bl-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-amber-400 rounded-br-2xl pointer-events-none" />

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-blue-900 tracking-tight">
                {isBatchEdit ? "Edit Session" : "Schedule Session"}
              </h3>
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="text-gray-400 hover:text-blue-900 transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Session Name (e.g., Live Q&A)"
                value={batchFormData.name}
                onChange={e => setBatchFormData({ ...batchFormData, name: e.target.value })}
                className="w-full p-3 border border-blue-200 rounded-lg bg-blue-50/50 text-blue-900 placeholder-blue-300 outline-none focus:border-amber-400 transition-all"
              />

              <div>
                <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider px-1 block mb-1">Session Date & Time</label>
                <input
                  type="datetime-local"
                  value={batchFormData.classAt}
                  onChange={e => setBatchFormData({ ...batchFormData, classAt: e.target.value })}
                  className="w-full p-3 border border-blue-200 rounded-lg bg-blue-50/50 text-blue-900 outline-none focus:border-amber-400 transition-all"
                />
              </div>

              <input
                type="url"
                placeholder="Meeting Link (Zoom, Meet, etc.)"
                value={batchFormData.classLink}
                onChange={e => setBatchFormData({ ...batchFormData, classLink: e.target.value })}
                className="w-full p-3 border border-blue-200 rounded-lg bg-blue-50/50 text-blue-900 placeholder-blue-300 outline-none focus:border-amber-400 transition-all"
              />

              {!isBatchEdit && (
                <select
                  value={batchFormData.communityId}
                  onChange={e => setBatchFormData({ ...batchFormData, communityId: e.target.value })}
                  className="w-full p-3 border border-blue-200 rounded-lg bg-blue-50/50 text-blue-900 outline-none focus:border-amber-400 transition-all"
                >
                  <option value="">Select Community</option>
                  {allCommunities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              )}

              <button
                onClick={handleBatchSubmit}
                disabled={saving}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-md disabled:opacity-50 mt-2"
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