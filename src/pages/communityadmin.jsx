import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  ArrowLeft, Users, Calendar, Ban, ChevronRight, X,
  User, Clock, Trash2, Edit3, Plus, ShieldAlert, GraduationCap, Mail, Crown, Image as ImageIcon, Loader2
} from 'lucide-react';
import { fetchAllCommunities, createCommunity, updateCommunity } from '../api/community.api';
import { allEnrollmentsForACommunity, fetchAllBatchesOfACommunity } from '../api/adminDashboard.api';
import { useNavigate } from 'react-router-dom';

const CommunityAdmin = () => {
  const [view, setView] = useState('list'); // 'list' | 'detail' | 'batch'
  const [activeTab, setActiveTab] = useState('batches'); // 'batches' | 'students'
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [selectedComm, setSelectedComm] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'public',
    banner: null
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    visibility: 'public',
    banner: null
  });

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

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleCommunityClick = async (comm) => {
    try {
      setLoading(true);
      const [batchRes, studentRes] = await Promise.all([
        fetchAllBatchesOfACommunity(comm._id),
        allEnrollmentsForACommunity(comm._id)
      ]);

      setSelectedComm({
        ...comm,
        batches: batchRes.data.batches || [],
        students: studentRes.data.students || []
      });
      setActiveTab('batches');
      setView('detail');
    } catch (error) {
      console.error("Error fetching community data:", error);
      toast.error("Could not load community details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommunitySubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('visibility', formData.visibility);
    if (formData.banner) data.append('bannerImage', formData.banner);

    try {
      setLoading(true);
      await createCommunity(data);
      setIsCreateModalOpen(false);
      setFormData({ name: '', description: '', visibility: 'public', banner: null });
      await loadInitialData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    setEditFormData({
      name: selectedComm.name,
      description: selectedComm.description || '',
      visibility: selectedComm.visibility,
      banner: null
    });
    setIsEditModalOpen(true);
  };

  const handleEditCommunitySubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', editFormData.name);
    data.append('description', editFormData.description);
    data.append('visibility', editFormData.visibility);
    if (editFormData.banner) {
      data.append('bannerImage', editFormData.banner);
    }

    try {
      setLoading(true);
      const response = await updateCommunity(selectedComm._id, data);
      setSelectedComm(prev => ({
        ...prev,
        ...response.data.community
      }));
      setIsEditModalOpen(false);
      await loadInitialData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && view === 'list' && communities.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-blue-50">
        <div className="w-10 h-10 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
        <p className="font-bold text-blue-500 animate-pulse">Loading Hub...</p>
      </div>
    );
  }

  // --- VIEW 1: HUB (LIST) ---
  if (view === 'list') {
    return (
      <div className="space-y-6 selection:bg-amber-400/30">
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-blue-100">
          <div>
            <h2 className="text-3xl font-black text-blue-950 tracking-tight uppercase">Community Hub</h2>
            <p className="text-blue-500 font-medium">Active Ecosystems: <span className="text-amber-500">{communities.length}</span></p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-900 text-amber-400 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-800 transition shadow-lg"
          >
            <Plus size={20} /> Create Community
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map(comm => (
            <div key={comm._id} onClick={() => handleCommunityClick(comm)}
              className="group bg-white rounded-3xl border-2 border-blue-200 shadow-sm hover:shadow-xl hover:border-amber-400 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="h-32 bg-blue-100 relative">
                {comm.bannerImage ? (
                  <img src={comm.bannerImage} alt={comm.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-800 to-blue-950 flex items-center justify-center text-blue-400"><ImageIcon size={40} /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-950/70 backdrop-blur border border-blue-600/40 px-3 py-1 rounded-full text-[10px] font-black text-blue-50 uppercase tracking-wider">
                    {comm.visibility}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-1 group-hover:text-amber-500 transition-colors">{comm.name}</h3>
                <p className="text-blue-400 text-xs mb-4 uppercase font-bold tracking-widest">Est. {new Date(comm.createdAt).toLocaleDateString()}</p>
                <div className="flex justify-between items-center text-sm font-bold border-t border-blue-100 pt-4">
                  <span className="text-blue-400 text-[10px] uppercase">Details</span>
                  <ChevronRight size={18} className="text-blue-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
              {/* Hover glow line */}
              <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* CREATE COMMUNITY MODAL */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-blue-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 relative shadow-2xl border border-blue-100">
              <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-8 right-8 text-blue-400 hover:text-blue-900"><X /></button>
              <h2 className="text-2xl font-black text-blue-950 mb-8 uppercase tracking-tighter">New Community</h2>

              <form onSubmit={handleCreateCommunitySubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-blue-400 uppercase ml-2">Community Name</label>
                  <input required className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 font-bold text-blue-950 outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition placeholder-blue-300"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-blue-400 uppercase ml-2">Description</label>
                  <textarea className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 font-bold text-blue-950 outline-none h-24 resize-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition"
                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-blue-400 uppercase ml-2">Visibility</label>
                    <select className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 font-bold text-blue-950 outline-none cursor-pointer focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition"
                      value={formData.visibility} onChange={e => setFormData({ ...formData, visibility: e.target.value })}>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-blue-400 uppercase ml-2">Banner</label>
                    <input type="file" className="w-full text-[10px] pt-4 text-blue-500" onChange={e => setFormData({ ...formData, banner: e.target.files[0] })} />
                  </div>
                </div>

                <button disabled={loading} className="w-full bg-blue-900 text-amber-400 py-4 rounded-2xl font-black mt-4 uppercase hover:bg-blue-800 transition disabled:opacity-50">
                  {loading ? 'Processing...' : 'Launch Community'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- VIEW 2: DETAILS (BATCHES & STUDENTS) ---
  if (view === 'detail') {
    return (
      <div className="selection:bg-amber-400/30">
        <button onClick={() => setView('list')} className="flex items-center gap-2 text-blue-500 font-bold mb-6 hover:text-blue-900 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Hub
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-blue-200 shadow-sm">
              <h2 className="text-2xl font-black text-blue-950 mb-2">{selectedComm.name}</h2>
              <p className="text-blue-500 text-sm mb-6">{selectedComm.description}</p>
              <div className="space-y-3 pt-4 border-t border-blue-100">
                <div className="flex justify-between text-[10px] font-black text-blue-400 uppercase">
                  <span>Enrolled Students</span>
                  <span className="text-amber-500">{selectedComm.students.length}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black text-blue-400 uppercase">
                  <span>Total Batches</span>
                  <span className="text-blue-900">{selectedComm.batches.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-3xl border-2 border-blue-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-blue-100">
              <button onClick={() => setActiveTab('batches')}
                className={`flex-1 p-4 font-bold text-xs uppercase tracking-widest transition ${activeTab === 'batches' ? 'bg-blue-900 text-amber-400' : 'text-blue-400 hover:bg-blue-50'}`}>
                Batches ({selectedComm.batches.length})
              </button>
              <button onClick={() => setActiveTab('students')}
                className={`flex-1 p-4 font-bold text-xs uppercase tracking-widest transition ${activeTab === 'students' ? 'bg-blue-900 text-amber-400' : 'text-blue-400 hover:bg-blue-50'}`}>
                Students ({selectedComm.students.length})
              </button>
            </div>

            {activeTab === 'batches' && (
              <table className="w-full text-left">
                <thead className="bg-blue-50 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  <tr>
                    <th className="p-6">Batch Name</th>
                    <th className="p-6">Mentor</th>
                    <th className="p-6">Class Date</th>
                    <th className="p-6">Status</th>
                    <th className="p-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {selectedComm.batches.map(batch => (
                    <tr key={batch._id} className={`transition ${batch.isDeleted ? 'bg-blue-50/80 opacity-75' : 'hover:bg-blue-50/50'}`}>
                      <td className="p-6">
                        <div className="font-bold text-blue-900">{batch.name}</div>
                        {batch.isDeleted && <span className="text-[9px] text-red-500 font-black uppercase tracking-tighter">Archived</span>}
                      </td>
                      <td className="p-6 text-sm font-semibold text-blue-600">{batch.mentorId?.name || "N/A"}</td>
                      <td className="p-6 text-sm text-blue-400">{new Date(batch.classAt).toLocaleDateString()}</td>
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
                        <button onClick={() => { setSelectedBatch(batch); setView('batch'); }} className="p-2 border-2 border-blue-200 rounded-full hover:bg-blue-50 hover:border-amber-400 shadow-sm transition"><ChevronRight size={18} className="text-blue-400" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'students' && (
              <table className="w-full text-left">
                <thead className="bg-blue-50 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  <tr><th className="p-6">Student Info</th><th className="p-6">Plan</th><th className="p-6">Joined Date</th><th className="p-6 text-right">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {selectedComm.students.map(student => (
                    <tr key={student.enrollmentId} className="hover:bg-blue-50/50 transition">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">{student.name.charAt(0)}</div>
                          <div>
                            <div className="font-bold text-blue-900 text-sm">{student.name}</div>
                            <div className="text-xs text-blue-400 flex items-center gap-1"><Mail size={10} /> {student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg uppercase w-fit ${student.plan === 'pro' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-600'}`}>
                          {student.plan === 'pro' && <Crown size={10} />} {student.plan}
                        </span>
                      </td>
                      <td className="p-6 text-xs font-medium text-blue-400">{new Date(student.enrolledAt).toLocaleDateString()}</td>
                      <td className="p-6 text-right"><button className="text-blue-300 hover:text-red-500 transition"><Ban size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {(activeTab === 'batches' ? selectedComm.batches : selectedComm.students).length === 0 && (
              <div className="p-20 text-center text-blue-300 italic">No records found.</div>
            )}
          </div>

          <button
            onClick={openEditModal}
            className="bg-blue-900 text-amber-400 px-6 py-3 rounded-2xl font-bold hover:bg-blue-800 transition"
          >
            Edit Community
          </button>
          <button className="bg-blue-900 text-amber-400 px-6 py-3 rounded-2xl font-bold hover:bg-blue-800 transition" onClick={() => navigate(`/community/${selectedComm._id}/edit`)}>Manage Modules</button>
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-blue-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 relative shadow-2xl border border-blue-100">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-8 right-8 text-blue-400 hover:text-blue-900"
              >
                <X />
              </button>

              <h2 className="text-2xl font-black text-blue-950 mb-8 uppercase tracking-tighter">
                Edit Community
              </h2>

              <form onSubmit={handleEditCommunitySubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-blue-400 uppercase ml-2">Community Name</label>
                  <input
                    required
                    className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 font-bold text-blue-950 outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition"
                    value={editFormData.name}
                    onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-blue-400 uppercase ml-2">Description</label>
                  <textarea
                    className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 font-bold text-blue-950 outline-none h-24 resize-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition"
                    value={editFormData.description}
                    onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-blue-400 uppercase ml-2">Visibility</label>
                    <select
                      className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 font-bold text-blue-950 outline-none cursor-pointer focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition"
                      value={editFormData.visibility}
                      onChange={e => setEditFormData({ ...editFormData, visibility: e.target.value })}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-blue-400 uppercase ml-2">Banner</label>
                    <input
                      type="file"
                      className="w-full text-[10px] pt-4 text-blue-500"
                      onChange={e => setEditFormData({ ...editFormData, banner: e.target.files[0] })}
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-blue-900 text-amber-400 py-4 rounded-2xl font-black mt-4 uppercase hover:bg-blue-800 transition disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Community'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- VIEW 3: BATCH DETAILS ---
  if (view === 'batch') {
    return (
      <div>
        <button onClick={() => setView('detail')} className="flex items-center gap-2 text-blue-500 font-bold mb-6 hover:text-blue-900 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to {selectedComm.name}
        </button>
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-blue-200 shadow-sm relative overflow-hidden">
          {selectedBatch.isDeleted && (
            <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-center text-[10px] font-black py-1 uppercase tracking-widest">This batch is currently archived</div>
          )}
          <h2 className="text-3xl font-black text-blue-950 pt-4">{selectedBatch.name}</h2>
          <div className="flex items-center gap-2 text-amber-500 font-bold mt-2"><User size={16} /> Instructor: {selectedBatch.mentorId?.name}</div>
          <p className="text-blue-500 mt-6 leading-relaxed max-w-2xl">{selectedBatch.description || "No description provided for this batch."}</p>
          <div className="flex gap-4 mt-8">
            {!selectedBatch.isDeleted && (
              <a href={selectedBatch.classLink} target="_blank" rel="noreferrer" className="bg-blue-900 text-amber-400 px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-800 transition">Join Live Session</a>
            )}
            <button onClick={() => setView('detail')} className="px-8 py-4 border-2 border-blue-200 rounded-2xl font-black text-blue-400 hover:text-blue-900 hover:border-blue-400 transition">Go Back</button>
          </div>
        </div>
      </div>
    );
  }
};

export default CommunityAdmin;