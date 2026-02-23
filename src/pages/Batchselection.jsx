import {
    Crown,
    Calendar,
    Users,
    Clock,
    ArrowLeft,
    ArrowRight,
    Zap,
    CheckCircle2,
    Lock,
    Flame
} from 'lucide-react';
import { useState } from 'react';

// ─── Mock batch data (replace with API call) ────────────────────────────────
const ALL_BATCHES = [
    {
        id: 'batch-jan-2025',
        name: 'Winter Cohort',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-04-15'),
        seats: 120,
        seatsLeft: 0,
        price: 4999,
        tag: 'Full',
        highlights: ['Intensive 12-week program', 'Live sessions every Tue & Thu', 'Project mentorship included'],
    },
    {
        id: 'batch-mar-2025',
        name: 'Spring Cohort',
        startDate: new Date('2025-03-10'),
        endDate: new Date('2025-06-10'),
        seats: 100,
        seatsLeft: 0,
        price: 4999,
        tag: 'Full',
        highlights: ['Weekend-friendly schedule', 'Industry expert guest sessions', 'Resume & portfolio reviews'],
    },
    {
        id: 'batch-jun-2025',
        name: 'Summer Cohort',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-08-31'),
        seats: 80,
        seatsLeft: 14,
        price: 5499,
        tag: 'Almost Full',
        highlights: ['Fast-paced 3-month sprint', 'Daily office hours', 'Hackathon at the end'],
    },
    {
        id: 'batch-sep-2025',
        name: 'Autumn Cohort',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2025-11-30'),
        seats: 100,
        seatsLeft: 68,
        price: 5499,
        tag: 'Open',
        highlights: ['Balanced pace – 3 sessions/week', 'Peer study groups', '1-on-1 mentor calls'],
    },
    {
        id: 'batch-dec-2025',
        name: 'Year-End Cohort',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2026-02-28'),
        seats: 60,
        seatsLeft: 60,
        price: 5999,
        tag: 'Early Bird',
        highlights: ['Holiday schedule flexibility', 'Smaller, focused batch', 'Priority support included'],
    },
    {
        id: 'batch-mar-2026',
        name: 'Spring 2026 Cohort',
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-05-31'),
        seats: 100,
        seatsLeft: 100,
        price: 5999,
        tag: 'Coming Soon',
        highlights: ['Revamped curriculum v3', 'AI-assisted project reviews', 'New certification track'],
    },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (date) =>
    date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const tagStyle = (tag) => {
    switch (tag) {
        case 'Full': return 'bg-neutral-800 text-neutral-500 border-neutral-700';
        case 'Almost Full': return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
        case 'Open': return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
        case 'Early Bird': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
        case 'Coming Soon': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
        default: return 'bg-neutral-800 text-neutral-400';
    }
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function BatchSelectionPage({ onBack, onSelectBatch }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Only show batches that haven't ended yet
    const availableBatches = ALL_BATCHES.filter((b) => b.endDate >= today);
    const pastBatches = ALL_BATCHES.filter((b) => b.endDate < today);

    const [hovered, setHovered] = useState(null);

    const handleSelect = (batch) => {
        if (batch.seatsLeft === 0) return; // full batches are blocked
        onSelectBatch?.(batch);
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            {/* Header strip */}
            <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-5">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Course
                    </button>
                    <div className="flex items-center gap-2 text-cyan-400">
                        <Crown className="w-5 h-5" />
                        <span className="font-bold tracking-wide text-sm uppercase">Pro Upgrade</span>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-14">
                {/* Title */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 px-4 py-1.5 rounded-full text-cyan-400 text-sm font-semibold mb-5">
                        <Zap className="w-4 h-4" />
                        Select Your Batch
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                        Choose When You <br />
                        <span className="text-cyan-400">Start Learning</span>
                    </h1>
                    <p className="text-neutral-400 text-lg max-w-xl mx-auto">
                        Only batches you can join from today are shown. Past batches are hidden automatically.
                    </p>
                </div>

                {/* Available Batches */}
                {availableBatches.length === 0 ? (
                    <div className="text-center text-neutral-500 py-20 text-lg">
                        No upcoming batches right now. Check back soon!
                    </div>
                ) : (
                    <div className="space-y-5">
                        {availableBatches.map((batch) => {
                            const isFull = batch.seatsLeft === 0;
                            const isActive = hovered === batch.id;
                            const fillPct = Math.round(((batch.seats - batch.seatsLeft) / batch.seats) * 100);

                            return (
                                <div
                                    key={batch.id}
                                    onMouseEnter={() => setHovered(batch.id)}
                                    onMouseLeave={() => setHovered(null)}
                                    onClick={() => handleSelect(batch)}
                                    className={`
                                        relative bg-neutral-900 rounded-2xl border transition-all duration-300 overflow-hidden
                                        ${isFull
                                            ? 'border-neutral-800 opacity-50 cursor-not-allowed'
                                            : isActive
                                                ? 'border-cyan-400/50 shadow-xl shadow-cyan-500/10 cursor-pointer scale-[1.01]'
                                                : 'border-neutral-800 hover:border-cyan-400/30 cursor-pointer'
                                        }
                                    `}
                                >
                                    {/* Glowing left accent */}
                                    {!isFull && isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-l-2xl" />
                                    )}

                                    <div className="p-6 md:p-8">
                                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                                            {/* Left: info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3 flex-wrap">
                                                    <h2 className="text-xl font-bold text-white">{batch.name}</h2>
                                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${tagStyle(batch.tag)}`}>
                                                        {batch.tag}
                                                    </span>
                                                    {batch.tag === 'Almost Full' && (
                                                        <span className="flex items-center gap-1 text-orange-400 text-xs font-bold">
                                                            <Flame className="w-3.5 h-3.5" /> Filling fast!
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Dates */}
                                                <div className="flex flex-wrap gap-4 text-sm text-neutral-400 mb-4">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4 text-cyan-400/70" />
                                                        {fmt(batch.startDate)} → {fmt(batch.endDate)}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Users className="w-4 h-4 text-cyan-400/70" />
                                                        {isFull ? 'No seats left' : `${batch.seatsLeft} of ${batch.seats} seats left`}
                                                    </span>
                                                </div>

                                                {/* Seat bar */}
                                                <div className="w-full h-1.5 bg-neutral-800 rounded-full mb-5 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-700 ${fillPct >= 90 ? 'bg-orange-400' : fillPct >= 60 ? 'bg-yellow-400' : 'bg-cyan-400'}`}
                                                        style={{ width: `${fillPct}%` }}
                                                    />
                                                </div>

                                                {/* Highlights */}
                                                <ul className="flex flex-wrap gap-x-5 gap-y-1">
                                                    {batch.highlights.map((h, i) => (
                                                        <li key={i} className="flex items-center gap-1.5 text-sm text-neutral-400">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                                                            {h}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Right: price + CTA */}
                                            <div className="flex flex-col items-center md:items-end gap-3 md:min-w-[160px]">
                                                <div className="text-right">
                                                    <p className="text-3xl font-black text-white">₹{batch.price.toLocaleString('en-IN')}</p>
                                                    <p className="text-neutral-500 text-xs mt-0.5">one-time payment</p>
                                                </div>

                                                {isFull ? (
                                                    <div className="flex items-center gap-1.5 text-neutral-600 text-sm font-semibold">
                                                        <Lock className="w-4 h-4" /> Batch Closed
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20"
                                                        onClick={(e) => { e.stopPropagation(); handleSelect(batch); }}
                                                    >
                                                        Enroll Now <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Past batches notice */}
                {pastBatches.length > 0 && (
                    <div className="mt-12 p-5 rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 text-center">
                        <p className="text-neutral-500 text-sm">
                            <span className="font-semibold text-neutral-400">{pastBatches.length} past batch{pastBatches.length > 1 ? 'es' : ''}</span>
                            {' '}hidden — enrollment is only available for upcoming batches.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}