import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, IndianRupee, Users, Loader2, CreditCard } from 'lucide-react';
import { fetchPayments } from '../api/adminDashboard.api';

const getTotal = (base) => {
    const gst = Math.round(base * 0.18);
    return base + gst;
};

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const PaymentManager = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => { loadPayments(); }, []);

    const loadPayments = async () => {
        setLoading(true);
        try {
            const res = await fetchPayments();
            setPayments(res.data.payments || []);
        } catch (err) {
            console.error("Failed to fetch payments:", err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = payments.filter(p => {
        const q = search.toLowerCase();
        const matchesSearch =
            p.studentName?.toLowerCase().includes(q) ||
            p.studentEmail?.toLowerCase().includes(q) ||
            p.communityName?.toLowerCase().includes(q);
        const matchesFilter =
            filter === 'all' ||
            (filter === 'active' && p.status === 'active') ||
            (filter === 'cancelled' && p.status === 'cancelled') ||
            (filter === 'banned' && p.status === 'banned');
        return matchesSearch && matchesFilter;
    });

    const totalRevenue = payments
        .filter(p => p.status === 'active')
        .reduce((sum, p) => sum + getTotal(p.communityPrice || 0), 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-40">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#1e3a5f]">Payment Management</h1>
                <p className="text-blue-400 mt-1">Track student Pro upgrades and payment records.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
                        <Users size={22} className="text-amber-400" />
                    </div>
                    <div>
                        <p className="text-xs text-blue-300 font-medium uppercase tracking-wide">Pro Students</p>
                        <p className="text-2xl font-bold text-[#1e3a5f]">{payments.length}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                        <CheckCircle size={22} className="text-green-500" />
                    </div>
                    <div>
                        <p className="text-xs text-blue-300 font-medium uppercase tracking-wide">Active</p>
                        <p className="text-2xl font-bold text-green-600">{payments.filter(p => p.status === 'active').length}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                        <IndianRupee size={22} className="text-amber-500" />
                    </div>
                    <div>
                        <p className="text-xs text-blue-300 font-medium uppercase tracking-wide">Total Revenue</p>
                        <p className="text-2xl font-bold text-amber-500">₹{totalRevenue.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by student name, email or community..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-blue-100 rounded-xl shadow-sm text-sm text-[#1e3a5f] placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                </div>
                <div className="flex bg-white border border-blue-100 rounded-xl shadow-sm overflow-hidden">
                    {['all', 'active', 'cancelled', 'banned'].map(tab => (
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
                            <th className="text-left px-6 py-4 font-semibold text-blue-400">Student</th>
                            <th className="text-left px-6 py-4 font-semibold text-blue-400">Community</th>
                            <th className="text-left px-6 py-4 font-semibold text-blue-400">Amount</th>
                            <th className="text-left px-6 py-4 font-semibold text-blue-400">Status</th>
                            <th className="text-left px-6 py-4 font-semibold text-blue-400">Paid On</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                                            <CreditCard size={24} className="text-blue-300" />
                                        </div>
                                        <p className="text-blue-400 font-medium">
                                            {search ? `No payments found matching "${search}"` : 'No payments yet'}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filtered.map(payment => {
                                const base = payment.communityPrice || 0;
                                const gst = Math.round(base * 0.18);
                                const total = base + gst;

                                return (
                                    <tr key={payment._id} className="hover:bg-blue-50/50 transition-colors">
                                        {/* Student */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-[#1e3a5f] flex items-center justify-center text-xs font-bold text-amber-400 shrink-0">
                                                    {payment.studentName?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-[#1e3a5f] capitalize truncate">{payment.studentName}</p>
                                                    <p className="text-[11px] text-blue-300 truncate">{payment.studentEmail}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Community */}
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-3 py-1 bg-blue-50 text-[#1e3a5f] border border-blue-100 rounded-full text-xs font-semibold">
                                                {payment.communityName}
                                            </span>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-[#1e3a5f]">₹{total.toLocaleString('en-IN')}</p>
                                                <p className="text-[10px] text-blue-300">₹{base.toLocaleString('en-IN')} + ₹{gst.toLocaleString('en-IN')} GST</p>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            {payment.status === 'active' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-xs font-semibold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span> Success
                                                </span>
                                            ) : payment.status === 'banned' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-500 border border-red-100 rounded-full text-xs font-semibold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"></span> Banned
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-500 border border-gray-200 rounded-full text-xs font-semibold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span> Cancelled
                                                </span>
                                            )}
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4 text-blue-300 font-medium">
                                            {formatDate(payment.paidAt)}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentManager;