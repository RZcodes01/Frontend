import {
    Video,
    Users,
    BookOpen,
    Trophy,
    Sparkles,
    Crown,
    Code,
    ArrowLeft,
    PlayCircle,
    FileText,
    CheckCircle2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchCommunityById } from '../api/community.api';
import { useParams } from 'react-router-dom';

export default function App() {
    const [course, setCourse] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null); // State to toggle views
    const { communityId } = useParams();

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

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            {/* 1. BANNER - Only show on the main overview page */}
            {!selectedModule && (
                <div className="bg-neutral-900 border-b border-neutral-800 py-20 px-6">
                    <div className="max-w-6xl mx-auto text-center">
                        {course?.bannerImage && (
                            <img
                                src={course.bannerImage}
                                alt="Community Banner"
                                className="w-full h-64 object-cover rounded-xl shadow-lg border border-neutral-700"
                            />
                        )}
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-6 py-12">
                
                {/* 2. CONDITIONAL CONTENT: MODULE VIEW vs. OVERVIEW VIEW */}
                {selectedModule ? (
                    /* --- MODULE DETAIL VIEW (The "Different Page" feeling) --- */
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button 
                            onClick={() => setSelectedModule(null)}
                            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors font-medium group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Back to Course Overview
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content: Video & Text */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Video Player Placeholder */}
                                <div className="aspect-video bg-neutral-900 rounded-2xl border border-neutral-800 flex flex-col items-center justify-center overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <PlayCircle className="w-20 h-20 text-cyan-400 opacity-80 group-hover:scale-110 transition-all cursor-pointer shadow-2xl" />
                                    <p className="mt-4 text-neutral-500 font-medium">Click to play Module Video</p>
                                </div>

                                {/* Text Content Area */}
                                <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8 shadow-sm">
                                    <h1 className="text-3xl font-bold mb-4 text-white">{selectedModule.title}</h1>
                                    <p className="text-neutral-400 text-lg mb-6 leading-relaxed">
                                        {selectedModule.description}
                                    </p>
                                    
                                    <div className="h-px bg-neutral-800 my-8" />
                                    
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-cyan-400" />
                                        Lesson Overview
                                    </h3>
                                    <div className="prose prose-invert max-w-none text-neutral-400 space-y-4">
                                        <p>
                                            Welcome to the deep-dive session of <strong>{selectedModule.title}</strong>. 
                                            In this lesson, we will cover the fundamental architectures and best practices 
                                            required to master these concepts.
                                        </p>
                                        <div className="bg-neutral-950 p-6 rounded-xl border border-neutral-800">
                                            <h4 className="text-cyan-400 font-bold mb-2 uppercase text-xs tracking-widest">Key Learning Points</h4>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {selectedModule.topics?.map((topic, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm">
                                                        <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                                                        {topic}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar: Module Navigation */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold flex items-center gap-2 px-2">
                                    <FileText className="w-5 h-5 text-cyan-400" />
                                    Curriculum
                                </h3>
                                <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden sticky top-8">
                                    {selectedModule.topics?.map((topic, index) => (
                                        <div 
                                            key={index}
                                            className="p-4 border-b border-neutral-800 last:border-0 hover:bg-neutral-800/50 cursor-pointer transition-all flex items-center gap-4 group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-xs font-mono text-neutral-500 group-hover:border-cyan-500/50 group-hover:text-cyan-400">
                                                {index + 1}
                                            </div>
                                            <span className="text-sm font-medium text-neutral-300 group-hover:text-white">{topic}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* --- MAIN COURSE OVERVIEW VIEW --- */
                    <>
                        {/* Community Information */}
                        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8 mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <Users className="w-8 h-8 text-cyan-400" />
                                <h2 className="text-3xl font-bold text-white">
                                    {course?.name || ""}
                                </h2>
                            </div>
                            <p className="text-neutral-400 text-lg leading-relaxed">
                                {course?.description}
                            </p>
                        </div>

                        {/* Syllabus Section */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <BookOpen className="w-8 h-8 text-cyan-400" />
                                <h2 className="text-3xl font-bold text-white">Course Syllabus</h2>
                            </div>
                            <p className="text-neutral-400 mb-8">
                                Comprehensive curriculum designed to take you from beginner to advanced developer
                            </p>

                            <div className="space-y-4">
                                {course?.modules?.map((module) => (
                                    <div
                                        key={module._id}
                                        onClick={() => setSelectedModule(module)} // Click triggers Module View
                                        className="bg-neutral-900 rounded-xl border border-neutral-800 hover:border-cyan-400/40 hover:bg-neutral-800/30 transition-all p-6 cursor-pointer group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="bg-cyan-400/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-400/20 group-hover:scale-105 transition-transform">
                                                <Code className="w-6 h-6 text-cyan-400" />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                                    {module.title}
                                                </h3>
                                                <p className="text-neutral-400 mb-3">{module.description}</p>
                                                <ul className="space-y-2 text-neutral-400 mb-4">
                                                    {module.topics?.slice(0, 2).map((topic, index) => (
                                                        <li key={index} className="flex items-center gap-2 text-sm">
                                                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                                                            {topic}
                                                        </li>
                                                    ))}
                                                    {module.topics?.length > 2 && <li className="text-xs text-neutral-500 italic">+ {module.topics.length - 2} more topics</li>}
                                                </ul>
                                                <div className="text-cyan-400 text-sm font-bold flex items-center gap-1">
                                                    Start Module <span className="group-hover:translate-x-1 transition-transform">→</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* 3. PRO FEATURES SECTION (Visible regardless of view or placed at bottom) */}
                <div className="mt-20 border-t border-neutral-800 pt-16 mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Crown className="w-8 h-8 text-cyan-400" />
                        <h2 className="text-3xl font-bold text-white">Pro Features</h2>
                    </div>
                    <p className="text-neutral-400 mb-8">
                        Unlock premium benefits and accelerate your learning journey
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Live Classes */}
                        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 group">
                            <div className="flex items-center gap-4 p-4 cursor-pointer">
                                <div className="bg-cyan-400/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-400/20">
                                    <Video className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Live Classes</h3>
                            </div>
                            <div className="max-h-0 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                                <p className="text-neutral-400 px-4 pb-4 text-sm">Attend interactive live sessions with industry experts.</p>
                            </div>
                        </div>

                        {/* Exclusive Resources */}
                        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 group">
                            <div className="flex items-center gap-4 p-4 cursor-pointer">
                                <div className="bg-cyan-400/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-400/20">
                                    <BookOpen className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Exclusive Resources</h3>
                            </div>
                            <div className="max-h-0 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                                <p className="text-neutral-400 px-4 pb-4 text-sm">Access premium tutorials and project templates.</p>
                            </div>
                        </div>

                        {/* Certification Prep */}
                        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 group">
                            <div className="flex items-center gap-4 p-4 cursor-pointer">
                                <div className="bg-cyan-400/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-400/20">
                                    <Trophy className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Certification Prep</h3>
                            </div>
                            <div className="max-h-0 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                                <p className="text-neutral-400 px-4 pb-4 text-sm">Prepare with mock tests and study materials.</p>
                            </div>
                        </div>

                        {/* Priority Support */}
                        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 group">
                            <div className="flex items-center gap-4 p-4 cursor-pointer">
                                <div className="bg-cyan-400/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-400/20">
                                    <Sparkles className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Priority Support</h3>
                            </div>
                            <div className="max-h-0 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                                <p className="text-neutral-400 px-4 pb-4 text-sm">Get faster help and personalized feedback.</p>
                            </div>
                        </div>

                        {/* Project Mentorship */}
                        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 group md:col-span-2">
                            <div className="flex items-center gap-4 p-4 cursor-pointer">
                                <div className="bg-cyan-400/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-400/20">
                                    <Users className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Project Mentorship</h3>
                            </div>
                            <div className="max-h-0 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                                <p className="text-neutral-400 px-4 pb-4 text-sm">Work on real-world projects with dedicated mentors.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. FINAL CTA */}
                <div className="text-center mt-12 mb-20">
                    <button className="bg-cyan-400 hover:bg-cyan-300 text-black px-10 py-5 rounded-xl text-lg font-bold transition-all shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95">
                        Upgrade to Pro Now
                    </button>
                    <p className="mt-4 text-neutral-500 text-sm">Join 500+ other developers in the Pro community</p>
                </div>
            </div>
        </div>
    );
}