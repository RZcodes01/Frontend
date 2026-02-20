import React, { useState } from 'react';
import CommunityAdmin from './communityadmin';
import MentorManager from './MentorManager';
import CompanyManager from './CompanyManager';
import UserManager from './UserManager';
import PaymentManager from './PaymentManager';
import CertificateManager from './CertificateManager';
import { Users, BookOpen, ShieldCheck, Building2, UserCircle, CreditCard, Award } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('communities');
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white p-6">
        <div className="flex items-center gap-2 mb-10 text-blue-400 font-bold text-xl"><ShieldCheck/> ADMIN</div>
        <nav className="space-y-4">
          <button onClick={() => setActiveTab('communities')} 
            className={`w-full flex gap-3 p-3 rounded-xl ${activeTab === 'communities' ? 'bg-blue-600' : 'text-gray-400'}`}>
            <BookOpen size={20}/> Community
          </button>
          <button onClick={() => setActiveTab('mentors')} 
            className={`w-full flex gap-3 p-3 rounded-xl ${activeTab === 'mentors' ? 'bg-blue-600' : 'text-gray-400'}`}>
            <Users size={20}/> Mentors
          </button>

          <button onClick={() => setActiveTab('company')} 
            className={`w-full flex gap-3 p-3 rounded-xl ${activeTab === 'company' ? 'bg-blue-600' : 'text-gray-400'}`}>
            <Building2 size={20}/> Company
          </button>

          <button onClick={() => setActiveTab('users')} 
            className={`w-full flex gap-3 p-3 rounded-xl ${activeTab === 'users' ? 'bg-blue-600' : 'text-gray-400'}`}>
            <UserCircle size={20}/> Users
          </button>

          <button onClick={() => setActiveTab('payments')} 
            className={`w-full flex gap-3 p-3 rounded-xl ${activeTab === 'payments' ? 'bg-blue-600' : 'text-gray-400'}`}>
            <CreditCard size={20}/> Payments
          </button>
          
          <button onClick={() => setActiveTab('certificates')} 
            className={`w-full flex gap-3 p-3 rounded-xl ${activeTab === 'certificates' ? 'bg-blue-600' : 'text-gray-400'}`}>
            <Award size={20}/> Certificates
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === 'communities' && <CommunityAdmin />}
        {activeTab === 'mentors' && <MentorManager />}
        {activeTab === 'company' && <CompanyManager />}
        {activeTab === 'users' && <UserManager />}
        {activeTab === 'payments' && <PaymentManager />}
        {activeTab === 'certificates' && <CertificateManager />}
      </main>
    </div>
  );
};
export default AdminDashboard;