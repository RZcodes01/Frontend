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
    CheckCircle2,
    ArrowLeft // Added for the back button icon
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
        <div className="min-h-screen bg-blue-50 text-blue-950 selection:bg-amber-400/30">

            {/* --- HERO HEADER SECTION --- */}
                <div className="relative">
                    {/* Back Button - Adjusted: larger size and more padding from left */}
                    <button 
                        onClick={() => navigate(-1)}
                        className="absolute top-8 left-12 z-30 flex items-center gap-3 px-6 py-3 bg-blue-950/60 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-blue-950 hover:scale-105 transition-all font-black text-lg shadow-2xl"
                    >
                        <ArrowLeft size={22} /> Back
                    </button>

                {/* Immersive Banner */}
                <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                    {course?.bannerImage ? (
                        <>
                            <img
                                src={course.bannerImage}
                                alt="Banner"
                                className="w-full h-full object-cover opacity-70 transition-all duration-1000"
                            />
                            {/* Cinematic Vignette Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-blue-950" />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-transparent to-blue-950/80" />
                        </>
                    ) : (
                        <div className="w-full h-full bg-blue-900" />
                    )}
                </div>

                {/* Overlapping Glass Card */}
                <div className="max-w-6xl mx-auto px-6 -mt-48 relative z-20">
                    <div className="bg-blue-900/80 backdrop-blur-xl border border-blue-700 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

                            <div className="flex-1 space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800 border border-blue-600 text-blue-200 text-xs font-black uppercase tracking-[0.2em]">
                                    <Star size={10} className="text-amber-400" /> Global Community
                                </div>

                                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-blue-50">
                                    {course?.name || "Loading..."}
                                </h1>

                                <p className="text-blue-300 text-base md:text-lg max-w-xl leading-relaxed font-medium">
                                    {course?.description || "Master new skills with industry experts and a supportive peer network."}
                                </p>

                                {/* Stats Strip */}
                                <div className="flex items-center gap-6 pt-2">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Enrolled</span>
                                        <span className="text-2xl font-black text-blue-50">{course?.membersCount || 0}</span>
                                    </div>
                                    <div className="w-px h-8 bg-blue-600" />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Modules</span>
                                        <span className="text-2xl font-black text-blue-50">{course?.modules?.length || 0}</span>
                                    </div>
                                    <div className="w-px h-8 bg-blue-600" />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Difficulty</span>
                                        <span className="text-2xl font-black text-amber-400">Pro</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main CTA */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {!isEnrolled ? (
                                    <button
                                        onClick={isLoggedIn ? handleEnroll : () => navigate("/login")}
                                        className="bg-amber-400 text-blue-950 px-8 py-3.5 rounded-xl font-black text-base transition-all hover:bg-amber-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        Enroll Now <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <div className="px-8 py-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-black text-base flex items-center justify-center gap-2">
                                        <CheckCircle2 size={18} /> Joined
                                    </div>
                                )}
                                <button
                                    onClick={() => setPage("batches")}
                                    className="px-8 py-3.5 rounded-xl bg-blue-800 border border-blue-600 text-blue-100 font-black text-base transition-all hover:bg-blue-700"
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
                        <BookOpen className="w-6 h-6 text-amber-500" />
                        <h2 className="text-3xl font-black tracking-tight text-blue-950">Syllabus</h2>
                    </div>

                    <div className="space-y-4">
                        {course?.modules?.map((module, idx) => (
                            <div
                                key={module._id}
                                onClick={() => navigate(`/community/${communityId}/module/${module._id}`)}
                                className="group bg-blue-900 rounded-3xl border border-blue-700 hover:border-amber-400/40 hover:bg-blue-800 transition-all p-6 md:p-8 cursor-pointer relative overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row md:items-start gap-6 relative z-10">
                                    <div className="bg-blue-950 border border-blue-700 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-base font-black text-blue-400 group-hover:text-amber-400 group-hover:border-amber-400/30 transition-all">
                                        {(idx + 1).toString().padStart(2, '0')}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-black text-blue-50 mb-2 group-hover:text-amber-400 transition-colors">
                                            {module.title}
                                        </h3>
                                        <p className="text-blue-300 text-base font-medium mb-6 leading-relaxed line-clamp-2">
                                            {module.description}
                                        </p>

                                        {/* Topics List */}
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-2">
                                            {module.topics?.map((topic, i) => (
                                                <div key={i} className="flex items-center gap-2 text-blue-300">
                                                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                                                    <span className="text-sm font-semibold uppercase tracking-wider">{topic}</span>
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
                        <div className="bg-blue-900 border border-blue-700 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                            <Crown className="absolute -top-4 -right-4 w-20 h-20 text-amber-400/10 rotate-12" />

                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-6 flex items-center gap-2 text-blue-50">
                                    Pro Benefits <Sparkles className="text-amber-400" size={18} />
                                </h3>

                                <div className="space-y-6 mb-8">
                                    <SidebarFeature icon={<Video />} title="Live Classes" desc="Weekly mentor sessions." />
                                    <SidebarFeature icon={<Code />} title="Project Files" desc="Premium assets & code." />
                                    <SidebarFeature icon={<Trophy />} title="Certificates" desc="Industry recognition." />
                                </div>

                                <button
                                    onClick={() => setPage("batches")}
                                    className="w-full py-4 bg-amber-400 text-blue-950 font-black rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/10 active:scale-95 text-base"
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
            <div className="text-amber-400 mt-1 shrink-0">
                {icon && <span className="[&>svg]:w-5 [&>svg]:h-5">{icon}</span>}
            </div>
            <div>
                <h4 className="text-base font-black text-blue-50">{title}</h4>
                <p className="text-sm text-blue-300 font-medium leading-tight mt-0.5">{desc}</p>
            </div>
        </div>
    );
}