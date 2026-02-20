import React, { useState } from 'react';
import { ShieldCheck, XCircle, CheckCircle, Globe, Building2 } from 'lucide-react';

const CompanyManager = () => {
  const [companies, setCompanies] = useState([
    { id: 1, name: "TechNova", sector: "Software", website: "technova.ai", status: "pending", logo: "T" },
    { id: 2, name: "CloudStream", sector: "Infrastructure", website: "cloudstream.com", status: "approved", logo: "C" }
  ]);

  const updateStatus = (id, newStatus) => {
    setCompanies(companies.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* VETTING SECTION */}
      <section>
        <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <ShieldCheck className="text-blue-600"/> Pending Verification
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companies.filter(c => c.status === 'pending').map(company => (
            <div key={company.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-black">{company.logo}</div>
                <div>
                  <h4 className="font-bold text-lg">{company.name}</h4>
                  <p className="text-blue-600 text-sm flex items-center gap-1"><Globe size={14}/> {company.website}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => updateStatus(company.id, 'approved')} className="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                  <CheckCircle size={18}/> Approve
                </button>
                <button onClick={() => updateStatus(company.id, 'rejected')} className="px-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition">
                  <XCircle size={20}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ACTIVE LIST SECTION */}
      <section>
        <h2 className="text-2xl font-black text-slate-800 mb-6">Verified Partner Companies</h2>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="p-6">Company</th>
                <th className="p-6">Sector</th>
                <th className="p-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {companies.filter(c => c.status === 'approved').map(c => (
                <tr key={c.id}>
                  <td className="p-6 font-bold flex items-center gap-3"><Building2 size={18} className="text-slate-400"/> {c.name}</td>
                  <td className="p-6 text-sm text-slate-500">{c.sector}</td>
                  <td className="p-6"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Verified</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CompanyManager; // THIS LINE FIXES YOUR ERROR