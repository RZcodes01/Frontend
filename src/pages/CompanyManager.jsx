import React, { useState } from 'react';
import { ShieldCheck, XCircle, CheckCircle, Globe, Building2 } from 'lucide-react';

const CompanyManager = () => {
  const [companies, setCompanies] = useState([
    { id: 1, name: "Tech", sector: "Software", website: "tech.ai", status: "pending", logo: "T" },
    { id: 2, name: "CloudStream", sector: "Infrastructure", website: "cloudstream.com", status: "approved", logo: "C" }
  ]);

  const updateStatus = (id, newStatus) => {
    setCompanies(companies.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">

      {/* VETTING SECTION */}
      <section>
        <h2 className="text-2xl font-black text-[#1e3a5f] mb-6 flex items-center gap-2">
          <ShieldCheck className="text-amber-400" /> Pending Verification
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companies.filter(c => c.status === 'pending').map(company => (
            <div key={company.id} className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-[#1e3a5f] text-amber-400 rounded-2xl flex items-center justify-center text-xl font-black">
                  {company.logo}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-[#1e3a5f]">{company.name}</h4>
                  <p className="text-blue-400 text-sm flex items-center gap-1">
                    <Globe size={14} /> {company.website}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => updateStatus(company.id, 'approved')}
                  className="flex-1 bg-[#1e3a5f] text-amber-400 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition"
                >
                  <CheckCircle size={18} /> Approve
                </button>
                <button
                  onClick={() => updateStatus(company.id, 'rejected')}
                  className="px-4 bg-red-50 text-red-500 border border-red-100 rounded-2xl hover:bg-red-100 transition"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ACTIVE LIST SECTION */}
      <section>
        <div className="bg-[#1e3a5f] rounded-t-3xl px-8 py-5 flex items-center justify-between relative overflow-hidden">
          {/* Amber accent bar */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400" />
          <h2 className="text-2xl font-black text-white ml-4 flex items-center gap-2">
            <Building2 className="text-amber-400" size={22} /> Verified Partner Companies
          </h2>
        </div>
        <div className="bg-white rounded-b-3xl border border-blue-100 border-t-0 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-blue-50 text-blue-400 text-[10px] font-bold uppercase tracking-widest border-b border-blue-100">
              <tr>
                <th className="p-6">Company</th>
                <th className="p-6">Sector</th>
                <th className="p-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {companies.filter(c => c.status === 'approved').map(c => (
                <tr key={c.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-6 font-bold text-[#1e3a5f] flex items-center gap-3">
                    <Building2 size={18} className="text-blue-300" /> {c.name}
                  </td>
                  <td className="p-6 text-sm text-blue-400">{c.sector}</td>
                  <td className="p-6">
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold uppercase">
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default CompanyManager;