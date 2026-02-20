import React, { useState } from 'react';
import { 
  ArrowLeft, Users, Calendar, Ban, ChevronRight, 
  User, Clock, Trash2, Edit3, Plus, ShieldAlert 
} from 'lucide-react';

const CommunityAdmin = () => {
  // Navigation State: 'list' | 'detail' | 'batch'
  const [view, setView] = useState('list');
  const [selectedComm, setSelectedComm] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);

  // --- MAIN DATA STATE ---
  const [communities, setCommunities] = useState([
    { 
      id: 1, 
      name: "Web Development", 
      createdAt: "2024-01-15",
      mentors: [
        { id: 101, name: "John Doe", joined: "2024-01-20" },
        { id: 102, name: "Jane Smith", joined: "2024-02-01" }
      ], 
      batches: [
        { 
          id: "B1", 
          name: "React Alpha", 
          teacher: "John Doe", 
          start: "2024-03-01", 
          end: "2024-06-01", 
          students: [
            { id: 501, name: "Alice Wang", email: "alice@example.com", isBlocked: false },
            { id: 502, name: "Bob Miller", email: "bob@example.com", isBlocked: false }
          ] 
        }
      ]
    }
  ]);

  // --- CRUD HANDLERS ---
  const addCommunity = () => {
    const name = prompt("Enter New Community Name:");
    if (name) {
      const newComm = {
        id: Date.now(),
        name,
        createdAt: new Date().toLocaleDateString(),
        mentors: [],
        batches: []
      };
      setCommunities([...communities, newComm]);
    }
  };

  const deleteCommunity = (id, e) => {
    e.stopPropagation(); // Prevents opening detail view
    if (window.confirm("Are you sure you want to delete this community?")) {
      setCommunities(communities.filter(c => c.id !== id));
    }
  };

  const updateCommunity = (id, e) => {
    e.stopPropagation();
    const newName = prompt("Enter updated Community Name:");
    if (newName) {
      setCommunities(communities.map(c => c.id === id ? { ...c, name: newName } : c));
    }
  };

  const toggleBlockStudent = (studentId) => {
    setCommunities(communities.map(comm => ({
      ...comm,
      batches: comm.batches.map(batch => ({
        ...batch,
        students: batch.students.map(s => 
          s.id === studentId ? { ...s, isBlocked: !s.isBlocked } : s
        )
      }))
    })));
  };

  // --- VIEW 1: TOTAL LIST ---
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">COMMUNITY HUB</h2>
            <p className="text-slate-500 font-medium">Managing <span className="text-blue-600">{communities.length}</span> Active Communities</p>
          </div>
          <button onClick={addCommunity} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-200">
            <Plus size={20}/> Create Community
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map(comm => (
            <div key={comm.id} onClick={() => { setSelectedComm(comm); setView('detail'); }}
                 className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={(e) => updateCommunity(comm.id, e)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"><Edit3 size={16}/></button>
                <button onClick={(e) => deleteCommunity(comm.id, e)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"><Trash2 size={16}/></button>
              </div>
              
              <div className="mb-4 bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600">
                <Users size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-1">{comm.name}</h3>
              <p className="text-slate-400 text-xs mb-6 uppercase font-bold tracking-widest">Est. {comm.createdAt}</p>
              
              <div className="flex justify-between items-center text-sm font-bold border-t pt-4">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px] uppercase">Mentors</span>
                  <span className={comm.mentors.length > 3 ? "text-red-500" : "text-blue-600"}>{comm.mentors.length} / 3</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-slate-400 text-[10px] uppercase">Batches</span>
                  <span className="text-slate-800">{comm.batches.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- VIEW 2: COMMUNITY DETAILS ---
  if (view === 'detail') {
    return (
      <div className="animate-in slide-in-from-right duration-300">
        <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 font-bold mb-6 hover:text-slate-800 transition">
          <ArrowLeft size={20}/> Back to Hub
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black text-slate-800 mb-4">{selectedComm.name}</h2>
              <div className="space-y-4 text-sm font-medium text-slate-600">
                <div className="flex justify-between"><span>Created On:</span> <span className="text-slate-900">{selectedComm.createdAt}</span></div>
                <div className="flex justify-between"><span>Total Batches:</span> <span className="text-slate-900">{selectedComm.batches.length}</span></div>
                <div className="flex justify-between"><span>Mentor Load:</span> <span className="text-blue-600 font-bold">{selectedComm.mentors.length} / 3</span></div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-3xl">
              <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-400"><User size={18}/> Assigned Mentors</h4>
              {selectedComm.mentors.length > 0 ? selectedComm.mentors.map(m => (
                <div key={m.id} className="bg-slate-800 p-3 rounded-xl mb-2 flex justify-between text-xs border border-slate-700">
                  {m.name} <span className="text-slate-500 italic">Joined {m.joined}</span>
                </div>
              )) : <p className="text-slate-500 text-xs italic">No mentors assigned yet.</p>}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Active Batches</h3>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <tr><th className="p-6">Batch Name</th><th className="p-6">Teacher</th><th className="p-6 text-center">Status</th><th className="p-6"></th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {selectedComm.batches.map(batch => (
                  <tr key={batch.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-6 font-bold text-slate-700">{batch.name}</td>
                    <td className="p-6 text-sm text-slate-500">{batch.teacher}</td>
                    <td className="p-6 text-center">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${batch.students.length >= 30 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {batch.students.length} / 30 Students
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button onClick={() => { setSelectedBatch(batch); setView('batch'); }} className="p-2 hover:bg-white rounded-full transition shadow-sm border border-slate-100">
                        <ChevronRight size={18}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 3: BATCH & STUDENT DETAILS ---
  if (view === 'batch') {
    return (
      <div className="animate-in zoom-in-95 duration-300">
        <button onClick={() => setView('detail')} className="flex items-center gap-2 text-slate-500 font-bold mb-6 hover:text-slate-800 transition">
          <ArrowLeft size={20}/> Back to {selectedComm.name}
        </button>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800">{selectedBatch.name}</h2>
            <p className="text-blue-600 font-bold text-sm">Lead Instructor: {selectedBatch.teacher}</p>
          </div>
          <div className="flex gap-4 text-xs font-bold uppercase tracking-tight">
            <div className="bg-slate-50 px-4 py-2 rounded-xl flex items-center gap-2"><Calendar size={14}/> {selectedBatch.start} - {selectedBatch.end}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 bg-orange-50 border-b flex items-center gap-2 text-orange-700 font-bold text-xs uppercase">
            <ShieldAlert size={16}/> Student Moderation Control
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
              <tr><th className="p-6">Student Name</th><th className="p-6">Email Address</th><th className="p-6 text-right">Access</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedBatch.students.map(s => (
                <tr key={s.id} className={s.isBlocked ? 'bg-red-50/40' : ''}>
                  <td className="p-6 font-bold text-slate-700">{s.name}</td>
                  <td className="p-6 text-sm text-slate-500 font-medium">{s.email}</td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => toggleBlockStudent(s.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${s.isBlocked ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white border border-orange-200 text-orange-600 hover:bg-orange-50'}`}
                    >
                      {s.isBlocked ? 'Unblock Student' : 'Block Student'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedBatch.students.length === 0 && <div className="p-10 text-center text-slate-400 italic">No students in this batch.</div>}
        </div>
      </div>
    );
  }
};

export default CommunityAdmin;