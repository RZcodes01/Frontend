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
    // FIX 1: changed min-h-screen to h-screen and added overflow-hidden to create a proper scroll container
    <div className="flex h-screen bg-gray-100 relative overflow-hidden">

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-slate-900 text-white p-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-lg">
          <ShieldCheck size={24} /> ADMIN
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1">
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar — FIX 2: sidebar scrolls internally, page does not */}
      <aside className={`
        fixed lg:sticky top-0 h-screen w-64 bg-slate-900 text-white p-6 z-40 transition-transform duration-300 ease-in-out flex-shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center gap-2 mb-10 text-blue-400 font-bold text-xl">
          <ShieldCheck /> ADMIN
        </div>

        <nav className="space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex gap-3 p-3 rounded-xl transition ${
                activeTab === item.id
                  ? 'bg-blue-600'
                  : 'text-gray-400 hover:bg-slate-800'
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

      {/* Main Content — FIX 3: this area scrolls, not the whole page */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 mt-16 lg:mt-0">
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