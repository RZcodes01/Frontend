import {
    ArrowLeft,
    Crown,
    ShieldCheck,
    CreditCard,
    Lock,
    CheckCircle2,
    Calendar,
    Users,
    Zap,
    IndianRupee
} from 'lucide-react';
import { useState } from 'react';

const fmt = (date) =>
    date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function PaymentPage({ batch, onBack, onSuccess }) {
    const [form, setForm] = useState({ name: '', email: '', cardNumber: '', expiry: '', cvv: '', upi: '' });
    const [method, setMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [errors, setErrors] = useState({});

    const gst = Math.round(batch.price * 0.18);
    const total = batch.price + gst;

    const set = (key) => (e) => {
        let val = e.target.value;
        if (key === 'cardNumber') val = val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
        if (key === 'expiry') val = val.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');
        if (key === 'cvv') val = val.replace(/\D/g, '').slice(0, 3);
        setForm((f) => ({ ...f, [key]: val }));
        setErrors((er) => ({ ...er, [key]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Full name is required';
        if (!form.email.includes('@')) e.email = 'Valid email required';
        if (method === 'card') {
            if (form.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter 16-digit card number';
            if (form.expiry.length < 5) e.expiry = 'Enter MM/YY';
            if (form.cvv.length < 3) e.cvv = 'Enter 3-digit CVV';
        } else {
            if (!form.upi.includes('@')) e.upi = 'Enter valid UPI ID (e.g. name@upi)';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handlePay = async () => {
        if (!validate()) return;
        setLoading(true);
        await new Promise((r) => setTimeout(r, 2000));
        setLoading(false);
        setDone(true);
        onSuccess?.();
    };

    const inputClass = (key) =>
        `w-full bg-blue-50 border ${errors[key] ? 'border-red-400 focus:ring-red-400/30' : 'border-blue-300 focus:border-amber-400 focus:ring-amber-400/20'} rounded-xl px-4 py-3 text-blue-950 placeholder-blue-300 text-base outline-none focus:ring-2 transition-all font-medium`;

    // ── Success Screen ────────────────────────────────────────────────────────
    if (done) {
        return (
            <div className="min-h-screen bg-blue-50 flex items-center justify-center text-blue-950 px-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <CheckCircle2 className="w-10 h-10 text-amber-500" />
                    </div>
                    <h1 className="text-4xl font-black mb-3 text-blue-950">You're In! 🎉</h1>
                    <p className="text-blue-600 text-xl font-medium mb-2">
                        Payment successful for <span className="text-blue-950 font-black">{batch.name}</span>
                    </p>
                    <p className="text-blue-500 text-base font-medium mb-8">
                        A confirmation has been sent to <span className="text-amber-500 font-bold">{form.email}</span>. Your batch starts on{' '}
                        <span className="text-blue-900 font-black">{fmt(batch.startDate)}</span>.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button className="bg-amber-400 hover:bg-amber-300 text-blue-950 px-8 py-3 rounded-xl font-black text-base transition-all hover:scale-105">
                            Go to Dashboard
                        </button>
                        <button onClick={onBack} className="text-blue-400 hover:text-blue-600 text-base font-semibold transition-colors">
                            Back to Course
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Payment Screen ────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-blue-50 text-blue-950">

            {/* Header */}
            <div className="bg-blue-900 border-b border-blue-700 px-6 py-5">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors font-black text-base group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Change Batch
                    </button>
                    <div className="flex items-center gap-2 text-amber-400">
                        <Crown className="w-5 h-5" />
                        <span className="font-black tracking-wide text-sm uppercase">Secure Checkout</span>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-5 gap-10">

                {/* ── Left: Payment Form ── */}
                <div className="lg:col-span-3 space-y-8">
                    <div>
                        <h1 className="text-3xl font-black mb-1 text-blue-950">Complete Payment</h1>
                        <p className="text-blue-500 text-base font-medium">Secure, encrypted payment powered by Razorpay</p>
                    </div>

                    {/* Personal Info */}
                    <div className="bg-blue-900 rounded-2xl border border-blue-700 p-6 space-y-4">
                        <h3 className="font-black text-blue-50 text-lg flex items-center gap-2">
                            <Users className="w-5 h-5 text-amber-400" /> Personal Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-blue-300 font-semibold mb-1 block">Full Name</label>
                                <input value={form.name} onChange={set('name')} placeholder="Aditya Sharma" className={inputClass('name')} />
                                {errors.name && <p className="text-red-400 text-sm mt-1 font-medium">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-sm text-blue-300 font-semibold mb-1 block">Email Address</label>
                                <input value={form.email} onChange={set('email')} placeholder="aditya@email.com" className={inputClass('email')} type="email" />
                                {errors.email && <p className="text-red-400 text-sm mt-1 font-medium">{errors.email}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Toggle */}
                    <div className="bg-blue-900 rounded-2xl border border-blue-700 p-6 space-y-5">
                        <h3 className="font-black text-blue-50 text-lg flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-amber-400" /> Payment Method
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            {['card', 'upi'].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMethod(m)}
                                    className={`py-2.5 rounded-xl border text-base font-black transition-all ${method === m ? 'bg-amber-400/10 border-amber-400/50 text-amber-400' : 'border-blue-700 text-blue-300 hover:border-blue-500'}`}
                                >
                                    {m === 'card' ? '💳 Card' : '⚡ UPI'}
                                </button>
                            ))}
                        </div>

                        {method === 'card' ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-blue-300 font-semibold mb-1 block">Card Number</label>
                                    <input value={form.cardNumber} onChange={set('cardNumber')} placeholder="4242 4242 4242 4242" className={inputClass('cardNumber')} />
                                    {errors.cardNumber && <p className="text-red-400 text-sm mt-1 font-medium">{errors.cardNumber}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-blue-300 font-semibold mb-1 block">Expiry</label>
                                        <input value={form.expiry} onChange={set('expiry')} placeholder="MM/YY" className={inputClass('expiry')} />
                                        {errors.expiry && <p className="text-red-400 text-sm mt-1 font-medium">{errors.expiry}</p>}
                                    </div>
                                    <div>
                                        <label className="text-sm text-blue-300 font-semibold mb-1 block">CVV</label>
                                        <input value={form.cvv} onChange={set('cvv')} placeholder="•••" className={inputClass('cvv')} type="password" />
                                        {errors.cvv && <p className="text-red-400 text-sm mt-1 font-medium">{errors.cvv}</p>}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="text-sm text-blue-300 font-semibold mb-1 block">UPI ID</label>
                                <input value={form.upi} onChange={set('upi')} placeholder="yourname@upi" className={inputClass('upi')} />
                                {errors.upi && <p className="text-red-400 text-sm mt-1 font-medium">{errors.upi}</p>}
                            </div>
                        )}
                    </div>

                    {/* Pay Button */}
                    <button
                        onClick={handlePay}
                        disabled={loading}
                        className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed text-blue-950 py-4 rounded-xl font-black text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-amber-400/20 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-blue-950/30 border-t-blue-950 rounded-full animate-spin" />
                                Processing…
                            </>
                        ) : (
                            <>
                                <Lock className="w-5 h-5" />
                                Pay ₹{total.toLocaleString('en-IN')} Securely
                            </>
                        )}
                    </button>

                    <p className="text-center text-blue-400 text-sm font-medium flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                        256-bit SSL encrypted · Your data is never stored
                    </p>
                </div>

                {/* ── Right: Order Summary ── */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="bg-blue-900 rounded-2xl border border-blue-700 p-6 sticky top-8">
                        <h3 className="font-black text-blue-50 text-xl mb-5 flex items-center gap-2">
                            <Crown className="w-5 h-5 text-amber-400" /> Order Summary
                        </h3>

                        {/* Batch Card */}
                        <div className="bg-blue-950 rounded-xl border border-blue-700 p-4 mb-5">
                            <p className="text-amber-400 text-xs font-black uppercase tracking-widest mb-1">Selected Batch</p>
                            <p className="text-blue-50 font-black text-xl">{batch.name}</p>
                            <div className="mt-3 space-y-1.5 text-base text-blue-300 font-medium">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-amber-400/60" />
                                    {fmt(batch.startDate)} → {fmt(batch.endDate)}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-amber-400/60" />
                                    {batch.seatsLeft} seats remaining
                                </div>
                            </div>
                        </div>

                        {/* Pricing Breakdown */}
                        <div className="space-y-3 text-base">
                            <div className="flex justify-between text-blue-300 font-medium">
                                <span>Course Fee</span>
                                <span>₹{batch.price.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-blue-300 font-medium">
                                <span>GST (18%)</span>
                                <span>₹{gst.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="h-px bg-blue-700 my-2" />
                            <div className="flex justify-between text-blue-50 font-black text-lg">
                                <span>Total</span>
                                <span className="text-amber-400">₹{total.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Perks */}
                        <div className="mt-6 space-y-2">
                            <p className="text-sm text-blue-400 uppercase tracking-widest font-black mb-3">What's included</p>
                            {[
                                'Lifetime access to batch recordings',
                                'Certificate of completion',
                                'Private community access',
                            ].map((perk, i) => (
                                <div key={i} className="flex items-center gap-2 text-base text-blue-200 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                    {perk}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}