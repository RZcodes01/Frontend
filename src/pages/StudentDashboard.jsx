import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ChevronRight,
  Clock,
  Video,
  Award,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchMyBatches, fetchMyCommunities, fetchMyProjects } from '../api/userDashboard.api';

export default function StudentDashboard() {
  const [communities, setCommunities] = useState([]);
  const [batches, setBatches] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("Student");

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser?.name) {
          setStudentName(storedUser.name);
        }

        const communitiesRes = await fetchMyCommunities();
        setCommunities(communitiesRes.data.communities || []);

        if (storedUser?.plan === "pro") {
          setIsPro(true);

          const [batchRes, projectRes] = await Promise.all([
            fetchMyBatches(),
            fetchMyProjects()
          ]);

          setBatches(batchRes.data.batches || []);
          setProjects(projectRes.data.projects || []);
        }

      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-blue-900">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 relative">
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #1e3a5f 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="fixed top-0 left-0 w-1.5 h-full bg-amber-400 z-10" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pl-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-1 tracking-tight">
            Welcome back, {studentName.split(" ")[0]}!
          </h1>
          <p className="text-blue-700">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Communities Joined"
            val={communities.length}
            badge="Active"
          />
        </div>

        {/* Communities */}
        <SectionTitle title="My Communities" />
        <div className="bg-white rounded-xl border border-blue-200 p-6 mb-10 shadow-sm">
          <div className="space-y-4">
            {communities.map((community) => (
              <div
                key={community._id}
                onClick={() => navigate(`/community/${community._id}`)}
                className="border border-blue-100 hover:border-amber-400 rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-md bg-blue-50/50"
              >
                <div className="flex justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      {community.name}
                    </h3>
                    <p className="text-sm text-blue-600">
                      {community.description || "No description available"}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-amber-600">
                    Active
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <div className="flex items-center text-blue-600">
                    <Clock className="w-4 h-4 mr-1" />
                    Members: {community.membersCount || 0}
                  </div>
                </div>
              </div>
            ))}

            {communities.length === 0 && (
              <div className="text-blue-500 text-center py-10">
                You are not enrolled in any communities yet.
              </div>
            )}
          </div>
        </div>

        {/* Batches */}
        <SectionTitle title="My Live Batches" />

        {isPro ? (
          <div className="bg-white rounded-xl border border-blue-200 p-6 mb-10 shadow-sm">
            {batches.length === 0 ? (
              <div className="text-blue-500 text-center py-8">
                No active batches available.
              </div>
            ) : (
              <div className="space-y-4">
                {batches.map((batch) => (
                  <div
                    key={batch._id}
                    className="border border-blue-100 hover:border-amber-400 rounded-lg p-4 transition-all duration-200 bg-blue-50/50"
                  >
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-blue-900">
                          {batch.name}
                        </h3>
                        <p className="text-sm text-blue-600">
                          {batch.communityId?.name}
                        </p>
                      </div>

                      <span className="text-xs px-3 py-1 rounded-full bg-amber-400/10 text-amber-600 border border-amber-400/30 font-medium">
                        {batch.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm mt-3">
                      <span className="text-blue-600">
                        {new Date(batch.classAt).toLocaleString()}
                      </span>

                      {batch.status === "upcoming" && (
                        <a
                          href={batch.classLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-900 hover:text-amber-500 font-semibold transition-colors"
                        >
                          Join Class
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-blue-200 p-6 mb-10 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-blue-900">Pro Benefits</h3>

            <Benefit
              icon={<Video className="w-5 h-5 text-blue-900" />}
              title="Live Classes"
              desc="Weekly mentor sessions."
            />

            <Benefit
              icon={<FileText className="w-5 h-5 text-blue-900" />}
              title="Project Files"
              desc="Premium assets & code."
            />

            <Benefit
              icon={<Award className="w-5 h-5 text-blue-900" />}
              title="Certificates"
              desc="Industry recognition."
            />
          </div>
        )}

        {/* Projects */}
        {isPro && (
          <>
            <SectionTitle title="My Projects" />
            <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm">
              {projects.length === 0 ? (
                <div className="text-blue-500 text-center py-8">
                  No projects assigned yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project._id}
                      className="border border-blue-100 hover:border-amber-400 rounded-lg p-4 transition-all duration-200 bg-blue-50/50"
                    >
                      <div className="flex justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-blue-900">
                            {project.title}
                          </h3>
                          <p className="text-sm text-blue-600">
                            {project.community?.name}
                          </p>
                        </div>

                        <span
                          className={`text-xs px-3 py-1 rounded-full border font-medium ${
                            project.projectStatus === "open"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-red-50 text-red-500 border-red-200"
                          }`}
                        >
                          {project.projectStatus}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm mt-3">
                        <span className="text-blue-600">
                          Due: {new Date(project.dueDate).toLocaleDateString()}
                        </span>

                        <button
                          onClick={() => navigate(`/projects/${project._id}`)}
                          className="text-blue-900 hover:text-amber-500 font-semibold flex items-center transition-colors"
                        >
                          View <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      </main>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h2 className="text-xl font-bold text-blue-900 mb-4 tracking-tight">
      {title}
    </h2>
  );
}

function Benefit({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-amber-400/10 p-2 rounded-lg border border-amber-400/30">
        {icon}
      </div>
      <div>
        <h4 className="text-blue-900 font-semibold">{title}</h4>
        <p className="text-sm text-blue-600">{desc}</p>
      </div>
    </div>
  );
}

function StatCard({ label, val, badge }) {
  return (
    <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-amber-400/10 rounded-lg flex items-center justify-center border border-amber-400/30">
          <BookOpen className="w-6 h-6 text-blue-900" />
        </div>
        <span className="text-xs font-semibold text-amber-600 bg-amber-400/10 border border-amber-400/30 px-2 py-1 rounded-full">
          {badge}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-blue-900 mb-1">{val}</h3>
      <p className="text-sm text-blue-600">{label}</p>
    </div>
  );
}