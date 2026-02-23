import React, { useState } from 'react';
import CommunityAdmin from './communityadmin';
import MentorManager from './MentorManager';
import CompanyManager from './CompanyManager';
import UserManager from './UserManager';
import PaymentManager from './PaymentManager';
import CertificateManager from './CertificateManager';
import MentorEnrollments from './MentorEnrollments';
import AdminBatchManager from './AdminBatchManager';

import {
  Users,
  BookOpen,
  ShieldCheck,
  Building2,
  UserCircle,
  CreditCard,
  Award
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('communities');

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 sticky top-0 h-screen">

        <div className="flex items-center gap-2 mb-10 text-blue-400 font-bold text-xl">
          <ShieldCheck /> ADMIN
        </div>

        <nav className="space-y-4">

          <button
            onClick={() => setActiveTab('communities')}
            className={`w-full flex gap-3 p-3 rounded-xl transition ${
              activeTab === 'communities'
                ? 'bg-blue-600'
                : 'text-gray-400 hover:bg-slate-800'
            }`}
          >
            <BookOpen size={20} /> Community
          </button>

          <button
            onClick={() => setActiveTab('mentors')}
            className={`w-full flex gap-3 p-3 rounded-xl transition ${
              activeTab === 'mentors'
                ? 'bg-blue-600'
                : 'text-gray-400 hover:bg-slate-800'
            }`}
          >
            <Users size={20} /> Mentors
          </button>

          <button
            onClick={() => setActiveTab('enrollments')}
            className={`w-full flex gap-3 p-3 rounded-xl transition ${
              activeTab === 'enrollments'
                ? 'bg-blue-600'
                : 'text-gray-400 hover:bg-slate-800'
            }`}
          >
            <Users size={20} /> Enrollment
          </button>

          <button
            onClick={() => setActiveTab('batch')}
            className={`w-full flex gap-3 p-3 rounded-xl transition ${
              activeTab === 'batch'
                ? 'bg-blue-600'
                : 'text-gray-400 hover:bg-slate-800'
            }`}
          >
            <Users size={20} /> Batch
          </button>

          <button
            onClick={() => setActiveTab('company')}
            className={`w-full flex gap-3 p-3 rounded-xl transition ${
              activeTab === 'company'
                ? 'bg-blue-600'
                : 'text-gray-400 hover:bg-slate-800'
            }`}
          >
            <Building2 size={20} /> Company
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex gap-3 p-3 rounded-xl transition ${
              activeTab === 'users'
                ? 'bg-blue-600'
                : 'text-gray-400 hover:bg-slate-800'
            }`}
          >
            <UserCircle size={20} /> Users
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex gap-3 p-3 rounded-xl transition ${
              activeTab === 'payments'
                ? 'bg-blue-600'
                : 'text-gray-400 hover:bg-slate-800'
            }`}
          >
            <CreditCard size={20} /> Payments
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`w-full flex gap-3 p-3 rounded-xl transition ${
              activeTab === 'certificates'
                ? 'bg-blue-600'
                : 'text-gray-400 hover:bg-slate-800'
            }`}
          >
            <Award size={20} /> Certificates
          </button>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">

        {activeTab === 'communities' && <CommunityAdmin />}
        {activeTab === 'mentors' && <MentorManager />}
        {activeTab === 'enrollments' && <MentorEnrollments />}
        {activeTab === 'batch' && <AdminBatchManager />}
        {activeTab === 'company' && <CompanyManager />}
        {activeTab === 'users' && <UserManager />}
        {activeTab === 'payments' && <PaymentManager />}
        {activeTab === 'certificates' && <CertificateManager />}

      </main>

    </div>
  );
};

export default AdminDashboard;