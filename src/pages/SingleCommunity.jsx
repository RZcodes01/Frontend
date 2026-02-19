import {
    Video,
    Users,
    BookOpen,
    Trophy,
    Sparkles,
    Crown,
    Code
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchCommunityById } from '../api/community.api';
import { useParams } from 'react-router-dom';

export default function App() {
    const [course, setCourse] = useState(null);
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
        <div className="min-h-screen bg-neutral-950">
            {/* Banner */}
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

            {/* Community Information */}
            <div className="max-w-6xl mx-auto px-6 py-12">
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
                        <h2 className="text-3xl font-bold text-white">
                            Course Syllabus
                        </h2>
                    </div>
                    <p className="text-neutral-400 mb-8">
                        Comprehensive curriculum designed to take you from beginner to advanced developer
                    </p>

                    <div className="space-y-4">
                        {course?.modules?.map((module) => (
                            <div
                                key={module._id}
                                className="bg-neutral-900 rounded-xl border border-neutral-800 hover:border-cyan-400/40 transition-colors p-6"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="bg-cyan-400/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-400/20">
                                        <Code className="w-6 h-6 text-cyan-400" />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {module.title}
                                        </h3>

                                        <p className="text-neutral-400 mb-3">
                                            {module.description}
                                        </p>

                                        <ul className="space-y-2 text-neutral-400">
                                            {module.topics?.map((topic, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center gap-2"
                                                >
                                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                                                    {topic}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pro Features Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Crown className="w-8 h-8 text-cyan-400" />
                        <h2 className="text-3xl font-bold text-white">
                            Pro Features
                        </h2>
                    </div>
                    <p className="text-neutral-400 mb-8">
                        Unlock premium benefits and accelerate your learning journey
                    </p>

                    <div className="space-y-3">
                        {/* Live Classes */}
                        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 group">
                            <div className="flex items-center gap-4 p-4 cursor-pointer">
                                <div className="bg-cyan-400/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-400/20">
                                    <Video className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">
                                    Live Classes
                                </h3>
                            </div>
                            <div className="max-h-0 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                                <p className="text-neutral-400 px-4 pb-4">
                                    Attend interactive live sessions with industry experts.
                                </p>
                            </div>
                        </div>

                        {/* Exclusive Resources */}
                        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 group">
                            <div className="flex items-center gap-4 p-4 cursor-pointer">
                                <div className="bg-cyan-400/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-400/20">
                                    <BookOpen className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">
                                    Exclusive Resources
                                </h3>
                            </div>
                            <div className="max-h-0 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                                <p className="text-neutral-400 px-4 pb-4">
                                    Access premium tutorials and project templates.
                                </p>
                            </div>
                        </div>

                        {/* Certification Prep */}
                        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 group">
                            <div className="flex items-center gap-4 p-4 cursor-pointer">
                                <div className="bg-cyan-400/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-400/20">
                                    <Trophy className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">
                                    Certification Prep
                                </h3>
                            </div>
                            <div className="max-h-0 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                                <p className="text-neutral-400 px-4 pb-4">
                                    Prepare with mock tests and study materials.
                                </p>
                            </div>
                        </div>

                        {/* Priority Support */}
                        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 group">
                            <div className="flex items-center gap-4 p-4 cursor-pointer">
                                <div className="bg-cyan-400/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-400/20">
                                    <Sparkles className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">
                                    Priority Support
                                </h3>
                            </div>
                            <div className="max-h-0 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                                <p className="text-neutral-400 px-4 pb-4">
                                    Get faster help and personalized feedback.
                                </p>
                            </div>
                        </div>

                        {/* Project Mentorship */}
                        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 group">
                            <div className="flex items-center gap-4 p-4 cursor-pointer">
                                <div className="bg-cyan-400/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-400/20">
                                    <Users className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">
                                    Project Mentorship
                                </h3>
                            </div>
                            <div className="max-h-0 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                                <p className="text-neutral-400 px-4 pb-4">
                                    Work on real-world projects with mentors.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center mt-12">
                    <button className="bg-cyan-400 hover:bg-cyan-300 text-black px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-105">
                        Upgrade to Pro
                    </button>
                </div>
            </div>
        </div>
    );
}