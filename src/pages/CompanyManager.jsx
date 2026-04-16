import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  ShieldCheck, XCircle, CheckCircle, Globe, Building2,
  Loader2, AlertCircle, Mail, UserCheck, UserX
} from 'lucide-react';
import { fetchPendingCompanies, approveCompany, rejectCompany, fetchActiveCompanies } from '../api/adminDashboard.api';

const CompanyManager = () => {
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [activeCompanies, setActiveCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const loadAllCompanies = async () => {
    try {
      setLoading(true);
      const [pendingRes, activeRes] = await Promise.all([
        fetchPendingCompanies(),
        fetchActiveCompanies()
      ]);
      setPendingCompanies(pendingRes.data.companies || []);
      setActiveCompanies(activeRes.data.companies || []);
    } catch (error) {
      console.error("Error loading company data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllCompanies();
  }, []);

  const handleAction = async (userId, action) => {
    let reason = "";

    if (action === 'reject') {
      const inputReason = window.prompt("Enter reason for rejection:", "Application did not meet requirements");
      if (inputReason === null) return;
      if (inputReason.trim() === "") {
        toast.error("A rejection reason is required.");
        return;
      }
      reason = inputReason;
    } else {
      if (!window.confirm("Approve this company?")) return;
    }

    try {
      setActionLoading(userId);
      if (action === 'approve') {
        await approveCompany(userId);
        toast.success("Company approved successfully");
      } else {
        await rejectCompany(userId, { reason });
        toast.success("Company application rejected");
      }
      await loadAllCompanies();
    } catch (error) {
      console.error("Action error:", error);
      const errorMsg = error.response?.data?.message || "Operation failed";
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-96 items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-blue-900 font-bold animate-pulse">Synchronizing Company Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">

      {/* PENDING SECTION */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-[#1e3a5f] tracking-tight">COMPANY VERIFICATION</h2>
            <p className="text-blue-400 font-medium italic">Review and approve new company applications</p>
          </div>
          <div className="bg-amber-50 text-amber-600 px-6 py-2 rounded-2xl border border-amber-200 font-black flex items-center gap-2">
            <AlertCircle size={18} /> {pendingCompanies.length} PENDING
          </div>
        </div>

        {pendingCompanies.length === 0 ? (
          <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-12 text-center">
            <Building2 className="mx-auto text-blue-200 mb-4" size={48} />
            <p className="text-blue-400 font-bold">No pending company applications</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingCompanies.map((company, index) => (
              <div key={company._id || `pending-${index}`} className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-[#1e3a5f] rounded-2xl flex items-center justify-center text-amber-400 font-black text-xl uppercase">
                      {company.company_name?.charAt(0) || 'C'}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#1e3a5f] capitalize">{company.company_name}</h3>
                  <div className="text-sm text-blue-400 flex items-center gap-2 mt-1">
                    <Mail size={14} /> {company.email}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building2 size={14} className="text-blue-300" />
                      <span className="font-semibold capitalize">{company.company_industry}</span>
                    </div>
                    {company.company_website && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Globe size={14} className="text-blue-300" />
                        <a href={company.company_website} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline truncate">
                          {company.company_website}
                        </a>
                      </div>
                    )}
                  </div>

                  {company.company_description && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-sm text-slate-600 line-clamp-3">{company.company_description}</p>
                    </div>
                  )}

                  <div className="mt-3 text-xs text-blue-300 font-semibold">
                    Applied by: {company.name}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border-t border-blue-100 flex gap-3">
                  <button
                    disabled={actionLoading === company._id}
                    onClick={() => handleAction(company._id, 'approve')}
                    className="flex-1 bg-[#1e3a5f] text-amber-400 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-blue-800 transition-colors"
                  >
                    {actionLoading === company._id ? <Loader2 className="animate-spin" size={14} /> : <UserCheck size={16} />} Approve
                  </button>
                  <button
                    disabled={actionLoading === company._id}
                    onClick={() => handleAction(company._id, 'reject')}
                    className="flex-1 bg-white border border-red-100 text-red-500 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-red-50 transition-colors"
                  >
                    <UserX size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ACTIVE SECTION */}
      <section>
        <div className="bg-[#1e3a5f] rounded-3xl p-8 mb-8 flex items-center justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400" />
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 ml-4">
            <Building2 className="text-amber-400" size={28} /> VERIFIED PARTNER COMPANIES
          </h2>
          <div className="text-right">
            <span className="text-4xl font-black text-amber-400">{activeCompanies.length}</span>
            <p className="text-[10px] font-bold text-blue-300 uppercase">Total Companies</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-blue-50 text-[10px] font-black text-blue-400 uppercase tracking-widest border-b border-blue-100">
              <tr>
                <th className="p-6">Company</th>
                <th className="p-6">Industry</th>
                <th className="p-6">Website</th>
                <th className="p-6 text-center">Joined</th>
                <th className="p-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {activeCompanies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-blue-300 font-bold">No verified companies yet</td>
                </tr>
              ) : (
                activeCompanies.map((c, index) => (
                  <tr key={c._id || `active-${index}`} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1e3a5f] flex items-center justify-center text-amber-400 font-black">
                          {c.company_name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div>
                          <div className="font-bold text-[#1e3a5f] capitalize">{c.company_name}</div>
                          <div className="text-xs text-blue-300">{c.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-sm text-blue-400 capitalize">{c.company_industry}</td>
                    <td className="p-6 text-sm">
                      {c.company_website ? (
                        <a href={c.company_website} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                          <Globe size={14} /> Visit
                        </a>
                      ) : (
                        <span className="text-blue-200">—</span>
                      )}
                    </td>
                    <td className="p-6 text-center text-xs font-bold text-blue-300">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6 text-right">
                      <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase border border-amber-200">Verified</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default CompanyManager;