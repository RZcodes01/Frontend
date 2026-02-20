import React, { useState } from 'react';
import { Search, Ban, CheckCircle } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', avatar: 'AJ', community: 'React Developers', blocked: false },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', avatar: 'BS', community: 'Python Enthusiasts', blocked: false },
  { id: 3, name: 'Carol White', email: 'carol@example.com', avatar: 'CW', community: 'UI/UX Designers', blocked: false },
  { id: 4, name: 'David Lee', email: 'david@example.com', avatar: 'DL', community: 'Data Science Hub', blocked: false },
  { id: 5, name: 'Eva Martinez', email: 'eva@example.com', avatar: 'EM', community: 'React Developers', blocked: false },
  { id: 6, name: 'Frank Chen', email: 'frank@example.com', avatar: 'FC', community: 'Cloud Computing', blocked: false },
  { id: 7, name: 'Grace Kim', email: 'grace@example.com', avatar: 'GK', community: 'Python Enthusiasts', blocked: false },
  { id: 8, name: 'Henry Brown', email: 'henry@example.com', avatar: 'HB', community: 'UI/UX Designers', blocked: false },
];

const UserManager = () => {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.community.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBlock = (id) => {
    setUsers(prev =>
      prev.map(u => u.id === id ? { ...u, blocked: !u.blocked } : u)
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
        <p className="text-slate-500 mt-1">View and manage all registered users and their communities.</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or community..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-6">
        <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-slate-100 text-sm">
          <span className="text-slate-400">Total Users</span>
          <span className="ml-2 font-bold text-slate-800">{users.length}</span>
        </div>
        <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-slate-100 text-sm">
          <span className="text-slate-400">Active</span>
          <span className="ml-2 font-bold text-green-600">{users.filter(u => !u.blocked).length}</span>
        </div>
        <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-slate-100 text-sm">
          <span className="text-slate-400">Blocked</span>
          <span className="ml-2 font-bold text-red-500">{users.filter(u => u.blocked).length}</span>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-6 py-4 font-semibold text-slate-500">User</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-500">Email</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-500">Community</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-500">Status</th>
              <th className="text-right px-6 py-4 font-semibold text-slate-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-slate-400">
                  No users found matching <span className="font-semibold text-slate-600">"{search}"</span>
                </td>
              </tr>
            ) : (
              filtered.map(user => (
                <tr key={user.id} className={`hover:bg-slate-50 transition-colors ${user.blocked ? 'opacity-60' : ''}`}>
                  {/* Avatar + Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${user.blocked ? 'bg-slate-400' : 'bg-blue-500'}`}>
                        {user.avatar}
                      </div>
                      <span className="font-semibold text-slate-800">{user.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-slate-500">{user.email}</td>

                  {/* Community */}
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                      {user.community}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {user.blocked ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-500 rounded-full text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"></span> Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span> Active
                      </span>
                    )}
                  </td>

                  {/* Block / Unblock */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleBlock(user.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        user.blocked
                          ? 'bg-green-50 text-green-600 hover:bg-green-100'
                          : 'bg-red-50 text-red-500 hover:bg-red-100'
                      }`}
                    >
                      {user.blocked
                        ? <><CheckCircle size={14} /> Unblock</>
                        : <><Ban size={14} /> Block</>
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

export default UserManager;