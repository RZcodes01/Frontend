import React, { useState } from 'react';
import { Award, CheckCircle, Clock, Search, Download, Eye, X } from 'lucide-react';

const mockRequests = [
  { id: 1, studentName: 'Alice Johnson', course: 'React Fundamentals', mentor: 'Dr. Sarah Lee', submittedOn: '2025-02-10', status: 'pending' },
  { id: 2, studentName: 'Bob Smith', course: 'Python for Data Science', mentor: 'Prof. Alan Roy', submittedOn: '2025-02-11', status: 'pending' },
  { id: 3, studentName: 'Carol White', course: 'UI/UX Design Principles', mentor: 'Ms. Priya Nair', submittedOn: '2025-02-12', status: 'generated' },
  { id: 4, studentName: 'David Lee', course: 'Machine Learning Basics', mentor: 'Dr. James Kim', submittedOn: '2025-02-13', status: 'pending' },
  { id: 5, studentName: 'Eva Martinez', course: 'Cloud Computing with AWS', mentor: 'Mr. Ravi Patel', submittedOn: '2025-02-14', status: 'generated' },
  { id: 6, studentName: 'Frank Chen', course: 'React Fundamentals', mentor: 'Dr. Sarah Lee', submittedOn: '2025-02-15', status: 'pending' },
];

// Certificate Preview Modal
const CertificatePreview = ({ request, onClose }) => {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Certificate Preview</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Certificate */}
        <div className="p-8">
          <div className="border-8 border-double border-blue-200 rounded-xl p-8 text-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-100 rounded-full opacity-40"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-100 rounded-full opacity-40"></div>

            <div className="relative z-10">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
                  <Award size={28} className="text-white" />
                </div>
              </div>
              <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-1">SkillConnect</p>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-1">Certificate of Completion</h1>
              <p className="text-slate-400 text-xs mb-6">This is to certify that</p>

              <p className="text-3xl font-black text-blue-700 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                {request.studentName}
              </p>
              <p className="text-slate-500 text-sm mb-4">has successfully completed the course</p>

              <div className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-base mb-6">
                {request.course}
              </div>

              <div className="flex justify-between items-end mt-6 pt-4 border-t border-blue-100 text-xs text-slate-500">
                <div className="text-left">
                  <p className="font-bold text-slate-700">{request.mentor}</p>
                  <p>Mentor</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-700">{today}</p>
                  <p>Date of Issue</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
            Close
          </button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download size={15} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const CertificateManager = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [preview, setPreview] = useState(null);

  const filtered = requests.filter(r => {
    const matchSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.course.toLowerCase().includes(search.toLowerCase()) ||
      r.mentor.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || r.status === filter;
    return matchSearch && matchFilter;
  });

  const handleGenerate = (id) => {
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'generated' } : r)
    );
  };

  const pending = requests.filter(r => r.status === 'pending').length;
  const generated = requests.filter(r => r.status === 'generated').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Certificate Management</h1>
        <p className="text-slate-500 mt-1">Review mentor-submitted requests and generate student certificates.</p>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-6">
        <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-slate-100 text-sm">
          <span className="text-slate-400">Total Requests</span>
          <span className="ml-2 font-bold text-slate-800">{requests.length}</span>
        </div>
        <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-slate-100 text-sm">
          <span className="text-slate-400">Pending</span>
          <span className="ml-2 font-bold text-amber-500">{pending}</span>
        </div>
        <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-slate-100 text-sm">
          <span className="text-slate-400">Generated</span>
          <span className="ml-2 font-bold text-green-600">{generated}</span>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student, course or mentor..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="generated">Generated</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-6 py-4 font-semibold text-slate-500">Student</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-500">Course</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-500">Mentor</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-500">Submitted</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-500">Status</th>
              <th className="text-right px-6 py-4 font-semibold text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-slate-400">
                  No requests found matching <span className="font-semibold text-slate-600">"{search}"</span>
                </td>
              </tr>
            ) : (
              filtered.map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  {/* Student */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                        {req.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-semibold text-slate-800">{req.studentName}</span>
                    </div>
                  </td>

                  {/* Course */}
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                      {req.course}
                    </span>
                  </td>

                  {/* Mentor */}
                  <td className="px-6 py-4 text-slate-500">{req.mentor}</td>

                  {/* Date */}
                  <td className="px-6 py-4 text-slate-400 text-xs">{req.submittedOn}</td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {req.status === 'generated' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold">
                        <CheckCircle size={11} /> Generated
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-semibold">
                        <Clock size={11} /> Pending
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setPreview(req)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        <Eye size={13} /> Preview
                      </button>
                      {req.status === 'pending' && (
                        <button
                          onClick={() => handleGenerate(req.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          <Award size={13} /> Generate
                        </button>
                      )}
                      {req.status === 'generated' && (
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                          <Download size={13} /> Download
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Certificate Preview Modal */}
      {preview && (
        <CertificatePreview request={preview} onClose={() => setPreview(null)} />
      )}
    </div>
  );
};

export default CertificateManager;