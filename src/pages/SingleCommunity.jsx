import {
  Video,
  Users,
  BookOpen,
  Trophy,
  Sparkles,
  Crown,
  Code
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchCommunityById } from "../api/community.api";
import { useParams, useNavigate } from "react-router-dom";
import BatchSelectionPage from "./Batchselection";
import PaymentPage from "./Payment";

export default function SingleCommunity() {
  const [course, setCourse] = useState(null);
  const { communityId } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState("overview"); // 'overview' | 'batches' | 'payment'
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch community
  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const res = await fetchCommunityById(communityId);
        setCourse(res.data.community);
        console.log(res.data.community);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCommunity();
  }, [communityId]);

  // Batch Page
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

  // Payment Page
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
    <div className="min-h-screen bg-neutral-950 text-white">
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

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Community Info */}
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

        {/* Syllabus */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-white">
              Course Syllabus
            </h2>
          </div>

          <p className="text-neutral-400 mb-8">
            Comprehensive curriculum designed to take you from beginner to
            advanced developer
          </p>

          <div className="space-y-4">
            {course?.modules?.map((module) => (
              <div
                key={module._id}
                onClick={() =>
                  navigate(
                    `/community/${communityId}/module/${module._id}`
                  )
                }
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

                    <p className="text-neutral-400 mb-3">
                      {module.description}
                    </p>

                    <ul className="space-y-2 text-neutral-400 mb-4">
                      {module.topics?.slice(0, 2).map((topic, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                          {topic}
                        </li>
                      ))}

                      {module.topics?.length > 2 && (
                        <li className="text-xs text-neutral-500 italic">
                          + {module.topics.length - 2} more topics
                        </li>
                      )}
                    </ul>

                    {isLoggedIn && (
                      <div className="text-cyan-400 text-sm font-bold flex items-center gap-1">
                        Start Module{" "}
                        <span className="group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Features */}
        <div className="mt-20 border-t border-neutral-800 pt-16 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Crown className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-white">
              Pro Features
            </h2>
          </div>

          <p className="text-neutral-400 mb-8">
            Unlock premium benefits and accelerate your learning journey
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Live Classes */}
            <FeatureCard
              icon={<Video className="w-6 h-6 text-cyan-400" />}
              title="Live Classes"
              desc="Attend interactive live sessions with industry experts."
            />

            <FeatureCard
              icon={<BookOpen className="w-6 h-6 text-cyan-400" />}
              title="Exclusive Resources"
              desc="Access premium tutorials and project templates."
            />

            <FeatureCard
              icon={<Trophy className="w-6 h-6 text-cyan-400" />}
              title="Certification Prep"
              desc="Prepare with mock tests and study materials."
            />

            <FeatureCard
              icon={<Sparkles className="w-6 h-6 text-cyan-400" />}
              title="Priority Support"
              desc="Get faster help and personalized feedback."
            />

            <FeatureCard
              icon={<Users className="w-6 h-6 text-cyan-400" />}
              title="Project Mentorship"
              desc="Work on real-world projects with dedicated mentors."
              fullWidth
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12 mb-20">
          <button
            onClick={() => setPage("batches")}
            className="bg-cyan-400 hover:bg-cyan-300 text-black px-10 py-5 rounded-xl text-lg font-bold transition-all shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95"
          >
            Upgrade to Pro Now
          </button>
        </div>
      </div>
    </div>
  );
}

// Small reusable feature component (UI unchanged)
function FeatureCard({ icon, title, desc, fullWidth }) {
  return (
    <div
      className={`bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 group ${
        fullWidth ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex items-center gap-4 p-4 cursor-pointer">
        <div className="bg-cyan-400/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-400/20">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>

      <div className="max-h-0 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
        <p className="text-neutral-400 px-4 pb-4 text-sm">{desc}</p>
      </div>
    </div>
  );
}