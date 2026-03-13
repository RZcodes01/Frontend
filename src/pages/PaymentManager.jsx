import React, { useState } from 'react';
import { Search, CheckCircle, Clock, DollarSign, Users, TrendingUp } from 'lucide-react';

const mockMentors = [
  { id: 1, name: 'James Carter', email: 'james@example.com', avatar: 'JC', community: 'React Developers', amount: '$120', date: 'Feb 10, 2026', status: 'paid' },
  { id: 2, name: 'Sophia Nguyen', email: 'sophia@example.com', avatar: 'SN', community: 'Python Enthusiasts', amount: '$95', date: 'Feb 12, 2026', status: 'unpaid' },
  { id: 3, name: 'Liam Patel', email: 'liam@example.com', avatar: 'LP', community: 'UI/UX Designers', amount: '$150', date: 'Feb 14, 2026', status: 'paid' },
  { id: 4, name: 'Olivia Brown', email: 'olivia@example.com', avatar: 'OB', community: 'Data Science Hub', amount: '$200', date: 'Feb 15, 2026', status: 'unpaid' },
  { id: 5, name: 'Noah Wilson', email: 'noah@example.com', avatar: 'NW', community: 'Cloud Computing', amount: '$180', date: 'Feb 16, 2026', status: 'paid' },
  { id: 6, name: 'Emma Davis', email: 'emma@example.com', avatar: 'ED', community: 'React Developers', amount: '$110', date: 'Feb 17, 2026', status: 'unpaid' },
  { id: 7, name: 'Aiden Garcia', email: 'aiden@example.com', avatar: 'AG', community: 'Cybersecurity', amount: '$130', date: 'Feb 18, 2026', status: 'paid' },
  { id: 8, name: 'Mia Thompson', email: 'mia@example.com', avatar: 'MT', community: 'Mobile Dev', amount: '$90', date: 'Feb 19, 2026', status: 'unpaid' },
];

const PaymentManager = () => {
  const [mentors, setMentors] = useState(mockMentors);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = mentors.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.community.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || m.status === filter;
    return matchesSearch && matchesFilter;
  });

  const toggleStatus = (id) => {
    setMentors(prev =>
      prev.map(m => m.id === id ? { ...m, status: m.status === 'paid' ? 'unpaid' : 'paid' } : m)
    );
  };

  const totalPaid = mentors.filter(m => m.status === 'paid').length;
  const totalUnpaid = mentors.filter(m => m.status === 'unpaid').length;
  const totalRevenue = mentors
    .filter(m => m.status === 'paid')
    .reduce((sum, m) => sum + parseInt(m.amount.replace('$', '')), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Payment Management</h1>
        <p className="text-blue-400 mt-1">Track mentor payments and update their payment status.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
            <Users size={22} className="text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-blue-300 font-medium uppercase tracking-wide">Total Mentors</p>
            <p className="text-2xl font-bold text-[#1e3a5f]">{mentors.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCircle size={22} className="text-green-500" />
          </div>
          <div>
            <p className="text-xs text-blue-300 font-medium uppercase tracking-wide">Paid</p>
            <p className="text-2xl font-bold text-green-600">{totalPaid}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
            <Clock size={22} className="text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-blue-300 font-medium uppercase tracking-wide">Unpaid</p>
            <p className="text-2xl font-bold text-amber-500">{totalUnpaid}</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or community..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-blue-100 rounded-xl shadow-sm text-sm text-[#1e3a5f] placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>
        <div className="flex bg-white border border-blue-100 rounded-xl shadow-sm overflow-hidden">
          {['all', 'paid', 'unpaid'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 text-sm font-semibold capitalize transition-colors ${
                filter === tab
                  ? 'bg-[#1e3a5f] text-amber-400'
                  : 'text-blue-400 hover:bg-blue-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-50 border-b border-blue-100">
              <th className="text-left px-6 py-4 font-semibold text-blue-400">Mentor</th>
              <th className="text-left px-6 py-4 font-semibold text-blue-400">Email</th>
              <th className="text-left px-6 py-4 font-semibold text-blue-400">Community</th>
              <th className="text-left px-6 py-4 font-semibold text-blue-400">Amount</th>
              <th className="text-left px-6 py-4 font-semibold text-blue-400">Date</th>
              <th className="text-left px-6 py-4 font-semibold text-blue-400">Status</th>
              <th className="text-right px-6 py-4 font-semibold text-blue-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-blue-300">
                  No mentors found{search ? ` matching "${search}"` : ''}.
                </td>
              </tr>
            ) : (
              filtered.map(mentor => (
                <tr key={mentor.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                        mentor.status === 'paid'
                          ? 'bg-[#1e3a5f] text-amber-400'
                          : 'bg-blue-100 text-blue-400'
                      }`}>
                        {mentor.avatar}
                      </div>
                      <span className="font-semibold text-[#1e3a5f]">{mentor.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-blue-400">{mentor.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-[#1e3a5f] border border-blue-100 rounded-full text-xs font-semibold">
                      {mentor.community}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#1e3a5f]">{mentor.amount}</td>
                  <td className="px-6 py-4 text-blue-300">{mentor.date}</td>
                  <td className="px-6 py-4">
                    {mentor.status === 'paid' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span> Unpaid
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleStatus(mentor.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        mentor.status === 'paid'
                          ? 'bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100'
                          : 'bg-[#1e3a5f] text-amber-400 hover:bg-blue-800'
                      }`}
                    >
                      {mentor.status === 'paid'
                        ? <><Clock size={13} /></>
                        : <><DollarSign size={13} /> Pay</>
                      }
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentManager;