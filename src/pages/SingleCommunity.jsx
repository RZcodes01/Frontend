import {
    Video,
    Users,
    BookOpen,
    Trophy,
    Sparkles,
    Crown,
    Code,
    ArrowRight,
    Check,
    Star,
    CheckCircle2
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchCommunityById } from "../api/community.api";
import { useParams, useNavigate } from "react-router-dom";
import BatchSelectionPage from "./Batchselection";
import PaymentPage from "./Payment";
import { enrollCommunity, fetchMyEnrollments } from "../api/enrollment.api";

export default function SingleCommunity() {
    const [course, setCourse] = useState(null);
    const { communityId } = useParams();
    const navigate = useNavigate();

    const [page, setPage] = useState("overview");
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);

    const handleEnroll = async () => {
        try {
            await enrollCommunity(communityId);
            setIsEnrolled(true);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const checkEnrollment = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setIsEnrolled(false);
                return;
            }
            try {
                const res = await fetchMyEnrollments();
                const enrolledIds = res.data.enrollments.map(
                    (e) => e.communityId.toString()
                );
                setIsEnrolled(enrolledIds.includes(communityId));
            } catch (err) {
                console.log("Enrollment check failed");
            }
        };
        checkEnrollment();
    }, [isLoggedIn, communityId]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                const res = await fetchCommunityById(communityId);
                setCourse(res.data.community);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCommunity();
    }, [communityId]);

    if (page === "batches") {
        return (
            <BatchSelectionPage
                onBack={() => setPage("overview")}
                onSelectBatch={(batch) => {
                    setSelectedBatch(batch);
                    setPage("payment");
                }}
            />
        );
    }

    if (page === "payment" && selectedBatch) {
        return (
            <PaymentPage
                batch={selectedBatch}
                onBack={() => setPage("batches")}
                onSuccess={() => console.log("Payment done!")}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
            {/* --- HERO HEADER SECTION --- */}
            <div className="relative">
                {/* Immersive Banner - Higher visibility, less blur */}
                <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                    {course?.bannerImage ? (
                        <>
                            <img
                                src={course.bannerImage}
                                alt="Banner"
                                className="w-full h-full object-cover opacity-70 transition-all duration-1000"
                            />
                            {/* Cinematic Vignette Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/20 to-[#050505]" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-[#050505]/80" />
                        </>
                    ) : (
                        <div className="w-full h-full bg-neutral-900" />
                    )}
                </div>

                {/* Overlapping Glass Card */}
                <div className="max-w-6xl mx-auto px-6 -mt-48 relative z-20">
                    <div className="bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

                            <div className="flex-1 space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                                    <Star size={10} className="text-cyan-400" /> Global Community
                                </div>

                                {/* Smaller, more elegant title */}
                                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                                    {course?.name || "Loading..."}
                                </h1>

                                {/* Smaller, more readable description */}
                                <p className="text-neutral-400 text-sm md:text-base max-w-xl leading-relaxed font-medium">
                                    {course?.description || "Master new skills with industry experts and a supportive peer network."}
                                </p>

                                {/* Stats Strip - Refined */}
                                <div className="flex items-center gap-6 pt-2">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Enrolled</span>
                                        <span className="text-lg font-bold text-white">{course?.membersCount || 0}</span>
                                    </div>
                                    <div className="w-px h-8 bg-white/5" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Modules</span>
                                        <span className="text-lg font-bold text-white">{course?.modules?.length || 0}</span>
                                    </div>
                                    <div className="w-px h-8 bg-white/5" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Difficulty</span>
                                        <span className="text-lg font-bold text-cyan-500/80">Pro</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main CTA - Sleeker buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {!isEnrolled ? (
                                    <button
                                        onClick={isLoggedIn ? handleEnroll : () => navigate("/login")}
                                        className="bg-white text-black px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-cyan-400 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        Enroll Now <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <div className="px-8 py-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-sm flex items-center justify-center gap-2">
                                        <CheckCircle2 size={18} /> Joined
                                    </div>
                                )}
                                <button
                                    onClick={() => setPage("batches")}
                                    className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm transition-all hover:bg-white/10"
                                >
                                    Pro Benefits
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN BODY SECTION --- */}
            <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-12 gap-16">

                {/* Syllabus Column */}
                <div className="lg:col-span-8">
                    <div className="flex items-center gap-3 mb-8">
                        <BookOpen className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-2xl font-bold tracking-tight">Syllabus</h2>
                    </div>

                    <div className="space-y-4">
                        {course?.modules?.map((module, idx) => (
                            <div
                                key={module._id}
                                onClick={() => navigate(`/community/${communityId}/module/${module._id}`)}
                                className="group bg-neutral-900/30 rounded-3xl border border-white/5 hover:border-cyan-500/20 hover:bg-neutral-900/60 transition-all p-6 md:p-8 cursor-pointer relative overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row md:items-start gap-6 relative z-10">
                                    <div className="bg-black/50 border border-white/5 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-neutral-500 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all">
                                        {(idx + 1).toString().padStart(2, '0')}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                            {module.title}
                                        </h3>
                                        <p className="text-neutral-500 text-sm mb-6 leading-relaxed line-clamp-2">
                                            {module.description}
                                        </p>

                                        {/* Minimal Topics List */}
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-2">
                                            {module.topics?.map((topic, i) => (
                                                <div key={i} className="flex items-center gap-2 text-neutral-400">
                                                    <div className="w-1 h-1 bg-neutral-700 rounded-full" />
                                                    <span className="text-[11px] font-medium uppercase tracking-wider">{topic}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Section */}
                <div className="lg:col-span-4">
                    <div className="sticky top-10 space-y-6">
                        <div className="bg-neutral-900/40 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                            <Crown className="absolute -top-4 -right-4 w-20 h-20 text-white/5 rotate-12" />

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    Pro Benefits <Sparkles className="text-cyan-400" size={16} />
                                </h3>

                                <div className="space-y-6 mb-8">
                                    <SidebarFeature icon={<Video />} title="Live Classes" desc="Weekly mentor sessions." />
                                    <SidebarFeature icon={<Code />} title="Project Files" desc="Premium assets & code." />
                                    <SidebarFeature icon={<Trophy />} title="Certificates" desc="Industry recognition." />
                                </div>

                                <button
                                    onClick={() => setPage("batches")}
                                    className="w-full py-4 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/10 active:scale-95 text-sm"
                                >
                                    Upgrade to Pro
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function SidebarFeature({ icon, title, desc }) {
    return (
        <div className="flex gap-4">
            <div className="text-cyan-400 mt-1 shrink-0">
                {icon && <span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span>}
            </div>
            <div>
                <h4 className="text-sm font-bold text-white">{title}</h4>
                <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">{desc}</p>
            </div>
        </div>
    );
}