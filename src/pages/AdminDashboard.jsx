import React, { useState } from 'react';
import CommunityAdmin from './communityadmin';
import MentorManager from './MentorManager';
import CompanyManager from './CompanyManager';
import UserManager from './UserManager';
import PaymentManager from './PaymentManager';
// import CertificateManager from './CertificateManager';
import MentorEnrollments from './MentorEnrollments';
import AdminBatchManager from './AdminBatchManager';

import {
  Users,
  BookOpen,
  ShieldCheck,
  Building2,
  UserCircle,
  CreditCard,
  Award,
  Menu,
  X
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('communities');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'communities', label: 'Community', icon: <BookOpen size={20} /> },
    { id: 'mentors', label: 'Mentors', icon: <Users size={20} /> },
    { id: 'enrollments', label: 'Enrollment', icon: <Users size={20} /> },
    { id: 'batch', label: 'Batch', icon: <Users size={20} /> },
    { id: 'company', label: 'Company', icon: <Building2 size={20} /> },
    { id: 'users', label: 'Users', icon: <UserCircle size={20} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={20} /> },
    // { id: 'certificates', label: 'Certificates', icon: <Award size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-blue-50 relative overflow-hidden">

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#1e3a5f] text-white p-4 flex justify-between items-center z-50 border-b-2 border-amber-400">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
          <ShieldCheck size={24} /> ADMIN
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 text-amber-400">
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 h-screen w-64 bg-[#1e3a5f] text-white z-40
        transition-transform duration-300 ease-in-out flex-shrink-0
        flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        {/* Amber left accent bar */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400" />

        {/* Brand */}
        <div className="flex items-center gap-2 px-6 pt-6 pb-6 text-amber-400 font-bold text-xl border-b border-white/10 ml-1.5">
          <ShieldCheck /> ADMIN
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 ml-1.5 scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex gap-3 items-center p-3 rounded-xl transition-all duration-200 border-l-2 ${
                activeTab === item.id
                  ? 'bg-blue-600 border-amber-400 text-white font-semibold'
                  : 'border-transparent text-blue-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 mt-16 lg:mt-0 bg-blue-50">
        <div className="max-w-full">
          {activeTab === 'communities' && <CommunityAdmin />}
          {activeTab === 'mentors' && <MentorManager />}
          {activeTab === 'enrollments' && <MentorEnrollments />}
          {activeTab === 'batch' && <AdminBatchManager />}
          {activeTab === 'company' && <CompanyManager />}
          {activeTab === 'users' && <UserManager />}
          {activeTab === 'payments' && <PaymentManager />}
          {/* {activeTab === 'certificates' && <CertificateManager />} */}
        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;