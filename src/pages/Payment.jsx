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

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (date) =>
    date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// ─── Component ────────────────────────────────────────────────────────────────
export default function PaymentPage({ batch, onBack, onSuccess }) {
    const [form, setForm] = useState({ name: '', email: '', cardNumber: '', expiry: '', cvv: '', upi: '' });
    const [method, setMethod] = useState('card'); // 'card' | 'upi'
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
        // Simulate payment API call
        await new Promise((r) => setTimeout(r, 2000));
        setLoading(false);
        setDone(true);
        onSuccess?.();
    };

    const inputClass = (key) =>
        `w-full bg-neutral-950 border ${errors[key] ? 'border-red-500/60 focus:ring-red-500/30' : 'border-neutral-700 focus:border-cyan-400/60 focus:ring-cyan-400/10'} rounded-xl px-4 py-3 text-white placeholder-neutral-600 text-sm outline-none focus:ring-2 transition-all`;

    // ── Success Screen ────────────────────────────────────────────────────────
    if (done) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white px-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 rounded-full bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <CheckCircle2 className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h1 className="text-4xl font-black mb-3">You're In! 🎉</h1>
                    <p className="text-neutral-400 text-lg mb-2">
                        Payment successful for <span className="text-white font-semibold">{batch.name}</span>
                    </p>
                    <p className="text-neutral-500 text-sm mb-8">
                        A confirmation has been sent to <span className="text-cyan-400">{form.email}</span>. Your batch starts on{' '}
                        <span className="text-white font-medium">{fmt(batch.startDate)}</span>.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button className="bg-cyan-400 hover:bg-cyan-300 text-black px-8 py-3 rounded-xl font-bold transition-all hover:scale-105">
                            Go to Dashboard
                        </button>
                        <button onClick={onBack} className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors">
                            Back to Course
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Payment Screen ────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            {/* Header */}
            <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-5">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Change Batch
                    </button>
                    <div className="flex items-center gap-2 text-cyan-400">
                        <Crown className="w-5 h-5" />
                        <span className="font-bold tracking-wide text-sm uppercase">Secure Checkout</span>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-5 gap-10">

                {/* ── Left: Payment Form ── */}
                <div className="lg:col-span-3 space-y-8">
                    <div>
                        <h1 className="text-3xl font-black mb-1">Complete Payment</h1>
                        <p className="text-neutral-400 text-sm">Secure, encrypted payment powered by Razorpay</p>
                    </div>

                    {/* Personal Info */}
                    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 space-y-4">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Users className="w-4 h-4 text-cyan-400" /> Personal Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">Full Name</label>
                                <input value={form.name} onChange={set('name')} placeholder="Aditya Sharma" className={inputClass('name')} />
                                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">Email Address</label>
                                <input value={form.email} onChange={set('email')} placeholder="aditya@email.com" className={inputClass('email')} type="email" />
                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Toggle */}
                    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 space-y-5">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-cyan-400" /> Payment Method
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            {['card', 'upi'].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMethod(m)}
                                    className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${method === m ? 'bg-cyan-400/10 border-cyan-400/50 text-cyan-400' : 'border-neutral-700 text-neutral-400 hover:border-neutral-600'}`}
                                >
                                    {m === 'card' ? '💳 Card' : '⚡ UPI'}
                                </button>
                            ))}
                        </div>

                        {method === 'card' ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-neutral-500 mb-1 block">Card Number</label>
                                    <input value={form.cardNumber} onChange={set('cardNumber')} placeholder="4242 4242 4242 4242" className={inputClass('cardNumber')} />
                                    {errors.cardNumber && <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-neutral-500 mb-1 block">Expiry</label>
                                        <input value={form.expiry} onChange={set('expiry')} placeholder="MM/YY" className={inputClass('expiry')} />
                                        {errors.expiry && <p className="text-red-400 text-xs mt-1">{errors.expiry}</p>}
                                    </div>
                                    <div>
                                        <label className="text-xs text-neutral-500 mb-1 block">CVV</label>
                                        <input value={form.cvv} onChange={set('cvv')} placeholder="•••" className={inputClass('cvv')} type="password" />
                                        {errors.cvv && <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">UPI ID</label>
                                <input value={form.upi} onChange={set('upi')} placeholder="yourname@upi" className={inputClass('upi')} />
                                {errors.upi && <p className="text-red-400 text-xs mt-1">{errors.upi}</p>}
                            </div>
                        )}
                    </div>

                    {/* Pay Button */}
                    <button
                        onClick={handlePay}
                        disabled={loading}
                        className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed text-black py-4 rounded-xl font-black text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Processing…
                            </>
                        ) : (
                            <>
                                <Lock className="w-5 h-5" />
                                Pay ₹{total.toLocaleString('en-IN')} Securely
                            </>
                        )}
                    </button>

                    <p className="text-center text-neutral-600 text-xs flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-neutral-600" />
                        256-bit SSL encrypted · Your data is never stored
                    </p>
                </div>

                {/* ── Right: Order Summary ── */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 sticky top-8">
                        <h3 className="font-bold text-white text-lg mb-5 flex items-center gap-2">
                            <Crown className="w-5 h-5 text-cyan-400" /> Order Summary
                        </h3>

                        {/* Batch Card */}
                        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 mb-5">
                            <p className="text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1">Selected Batch</p>
                            <p className="text-white font-bold text-lg">{batch.name}</p>
                            <div className="mt-3 space-y-1.5 text-sm text-neutral-400">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-cyan-400/60" />
                                    {fmt(batch.startDate)} → {fmt(batch.endDate)}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-cyan-400/60" />
                                    {batch.seatsLeft} seats remaining
                                </div>
                            </div>
                        </div>

                        {/* Pricing Breakdown */}
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-neutral-400">
                                <span>Course Fee</span>
                                <span>₹{batch.price.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-neutral-400">
                                <span>GST (18%)</span>
                                <span>₹{gst.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="h-px bg-neutral-800 my-2" />
                            <div className="flex justify-between text-white font-bold text-base">
                                <span>Total</span>
                                <span className="text-cyan-400">₹{total.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Perks */}
                        <div className="mt-6 space-y-2">
                            <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold mb-3">What's included</p>
                            {[
                                'Lifetime access to batch recordings',
                                'Certificate of completion',
                                'Private community access',
                                '30-day money back guarantee',
                            ].map((perk, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                                    <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0" />
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