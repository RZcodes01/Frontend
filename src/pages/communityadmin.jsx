import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Users, Calendar, Ban, ChevronRight, X,
  User, Clock, Trash2, Edit3, Plus, ShieldAlert, GraduationCap, Mail, Crown, Image as ImageIcon, Loader2
} from 'lucide-react';
import { fetchAllCommunities, createCommunity } from '../api/community.api';
import { allEnrollmentsForACommunity, fetchAllBatchesOfACommunity } from '../api/adminDashboard.api';
import { useNavigate } from 'react-router-dom';

const CommunityAdmin = () => {
  const [view, setView] = useState('list'); // 'list' | 'detail' | 'batch'
  const [activeTab, setActiveTab] = useState('batches'); // 'batches' | 'students'
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [communities, setCommunities] = useState([]);
  const [selectedComm, setSelectedComm] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const navigate = useNavigate()

  // Community Creation Form State
  const [formData, setFormData] = useState({
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
      alert("Could not load community details.");
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
      alert(error.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  console.log(selectedComm)

  if (loading && view === 'list' && communities.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="font-bold text-slate-400">Loading Hub...</p>
      </div>
    );
  }

  // --- VIEW 1: HUB (LIST) ---
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Community Hub</h2>
            <p className="text-slate-500 font-medium">Active Ecosystems: <span className="text-blue-600">{communities.length}</span></p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-600 transition shadow-lg"
          >
            <Plus size={20} /> Create Community
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map(comm => (
            <div key={comm._id} onClick={() => handleCommunityClick(comm)}
              className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden">
              <div className="h-32 bg-slate-100 relative">
                {comm.bannerImage ? (
                  <img src={comm.bannerImage} alt={comm.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={40} /></div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-800 uppercase">
                    {comm.visibility}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{comm.name}</h3>
                <p className="text-slate-400 text-xs mb-4 uppercase font-bold tracking-widest">Est. {new Date(comm.createdAt).toLocaleDateString()}</p>
                <div className="flex justify-between items-center text-sm font-bold border-t pt-4">
                  <span className="text-slate-400 text-[10px] uppercase">Details</span>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CREATE COMMUNITY MODAL */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 relative shadow-2xl animate-in zoom-in-95 duration-200">
              <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-800"><X /></button>
              <h2 className="text-2xl font-black text-slate-800 mb-8 uppercase tracking-tighter">New Community</h2>

              <form onSubmit={handleCreateCommunitySubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Community Name</label>
                  <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Description</label>
                  <textarea className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none h-24 resize-none"
                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Visibility</label>
                    <select className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none cursor-pointer"
                      value={formData.visibility} onChange={e => setFormData({ ...formData, visibility: e.target.value })}>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Banner</label>
                    <input type="file" className="w-full text-[10px] pt-4" onChange={e => setFormData({ ...formData, banner: e.target.files[0] })} />
                  </div>
                </div>

                <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black mt-4 uppercase hover:bg-blue-600 transition disabled:opacity-50">
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
      <div className="animate-in slide-in-from-right duration-300">
        <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 font-bold mb-6 hover:text-slate-800 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Hub
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black text-slate-800 mb-2">{selectedComm.name}</h2>
              <p className="text-slate-500 text-sm mb-6">{selectedComm.description}</p>
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                  <span>Enrolled Students</span>
                  <span className="text-blue-600">{selectedComm.students.length}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                  <span>Total Batches</span>
                  <span className="text-slate-900">{selectedComm.batches.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex border-b">
              <button onClick={() => setActiveTab('batches')}
                className={`flex-1 p-4 font-bold text-xs uppercase tracking-widest transition ${activeTab === 'batches' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
                Batches ({selectedComm.batches.length})
              </button>
              <button onClick={() => setActiveTab('students')}
                className={`flex-1 p-4 font-bold text-xs uppercase tracking-widest transition ${activeTab === 'students' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
                Students ({selectedComm.students.length})
              </button>
            </div>

            {activeTab === 'batches' && (
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="p-6">Batch Name</th>
                    <th className="p-6">Mentor</th>
                    <th className="p-6">Class Date</th>
                    <th className="p-6">Status</th>
                    <th className="p-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {selectedComm.batches.map(batch => (
                    <tr key={batch._id} className={`transition ${batch.isDeleted ? 'bg-slate-50/80 opacity-75' : 'hover:bg-slate-50/50'}`}>
                      <td className="p-6">
                        <div className="font-bold text-slate-700">{batch.name}</div>
                        {batch.isDeleted && <span className="text-[9px] text-red-500 font-black uppercase tracking-tighter">Archived</span>}
                      </td>
                      <td className="p-6 text-sm font-semibold text-slate-600">{batch.mentorId?.name || "N/A"}</td>
                      <td className="p-6 text-sm text-slate-500">{new Date(batch.classAt).toLocaleDateString()}</td>
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
                        <button onClick={() => { setSelectedBatch(batch); setView('batch'); }} className="p-2 border rounded-full hover:bg-white shadow-sm transition"><ChevronRight size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}


            {activeTab === 'students' && (
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <tr><th className="p-6">Student Info</th><th className="p-6">Plan</th><th className="p-6">Joined Date</th><th className="p-6 text-right">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {selectedComm.students.map(student => (
                    <tr key={student.enrollmentId} className="hover:bg-slate-50/50 transition">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase">{student.name.charAt(0)}</div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{student.name}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1"><Mail size={10} /> {student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg uppercase w-fit ${student.plan === 'pro' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                          {student.plan === 'pro' && <Crown size={10} />} {student.plan}
                        </span>
                      </td>
                      <td className="p-6 text-xs font-medium text-slate-500">{new Date(student.enrolledAt).toLocaleDateString()}</td>
                      <td className="p-6 text-right"><button className="text-slate-400 hover:text-red-600 transition"><Ban size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {(activeTab === 'batches' ? selectedComm.batches : selectedComm.students).length === 0 && (
              <div className="p-20 text-center text-slate-400 italic">No records found.</div>
            )}
          </div>
          
          <button onClick={()=> navigate(`/community/${selectedComm._id}/edit`)}>Edit Community</button>

        </div>
      </div>
    );
  }

  // --- VIEW 3: BATCH DETAILS ---
  if (view === 'batch') {
    return (
      <div className="animate-in zoom-in-95 duration-300">
        <button onClick={() => setView('detail')} className="flex items-center gap-2 text-slate-500 font-bold mb-6 hover:text-slate-800">
          <ArrowLeft size={20} /> Back to {selectedComm.name}
        </button>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          {selectedBatch.isDeleted && (
            <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-center text-[10px] font-black py-1 uppercase tracking-widest">This batch is currently archived</div>
          )}
          <h2 className="text-3xl font-black text-slate-800 pt-4">{selectedBatch.name}</h2>
          <div className="flex items-center gap-2 text-blue-600 font-bold mt-2"><User size={16} /> Instructor: {selectedBatch.mentorId?.name}</div>
          <p className="text-slate-500 mt-6 leading-relaxed max-w-2xl">{selectedBatch.description || "No description provided for this batch."}</p>
          <div className="flex gap-4 mt-8">
            {!selectedBatch.isDeleted && (
              <a href={selectedBatch.classLink} target="_blank" rel="noreferrer" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-600 transition">Join Live Session</a>
            )}
            <button onClick={() => setView('detail')} className="px-8 py-4 border-2 border-slate-100 rounded-2xl font-black text-slate-400 hover:text-slate-800 transition">Go Back</button>
          </div>
        </div>
      </div>
    );
  }
};

export default CommunityAdmin;