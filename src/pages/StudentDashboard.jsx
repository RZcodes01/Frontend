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
      <div className="h-full flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-full bg-neutral-950">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {studentName.split(" ")[0]}!
          </h1>
          <p className="text-neutral-400">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            bg="bg-cyan-400/10"
            label="Communities Joined"
            val={communities.length}
            badge="Active"
            bColor="text-cyan-400 bg-cyan-400/10 border border-cyan-400/20"
          />
        </div>

        {/* Communities */}
        <SectionTitle title="My Communities" />
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 mb-10">
          <div className="space-y-4">
            {communities.map((community) => (
              <div
                key={community._id}
                onClick={() => navigate(`/community/${community._id}`)}
                className="border border-neutral-800 hover:border-cyan-400/30 rounded-lg p-4 transition-colors cursor-pointer"
              >
                <div className="flex justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">
                      {community.name}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {community.description || "No description available"}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-cyan-400">
                    Active
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <div className="flex items-center text-neutral-500">
                    <Clock className="w-4 h-4 mr-1" />
                    Members: {community.membersCount || 0}
                  </div>
                </div>
              </div>
            ))}

            {communities.length === 0 && (
              <div className="text-neutral-500 text-center py-10">
                You are not enrolled in any communities yet.
              </div>
            )}
          </div>
        </div>

        {/* Batches */}
        <SectionTitle title="My Live Batches" />

        {isPro ? (
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 mb-10">
            {batches.length === 0 ? (
              <div className="text-neutral-500 text-center py-8">
                No active batches available.
              </div>
            ) : (
              <div className="space-y-4">
                {batches.map((batch) => (
                  <div
                    key={batch._id}
                    className="border border-neutral-800 hover:border-cyan-400/30 rounded-lg p-4 transition-colors"
                  >
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">
                          {batch.name}
                        </h3>
                        <p className="text-sm text-neutral-500">
                          {batch.communityId?.name}
                        </p>
                      </div>

                      <span className="text-xs px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                        {batch.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm mt-3">
                      <span className="text-neutral-400">
                        {new Date(batch.classAt).toLocaleString()}
                      </span>

                      {batch.status === "upcoming" && (
                        <a
                          href={batch.classLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 font-medium"
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
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 mb-10 space-y-6">
            <h3 className="text-lg font-semibold text-white">Pro Benefits</h3>

            <Benefit
              icon={<Video className="w-5 h-5 text-cyan-400" />}
              title="Live Classes"
              desc="Weekly mentor sessions."
            />

            <Benefit
              icon={<FileText className="w-5 h-5 text-cyan-400" />}
              title="Project Files"
              desc="Premium assets & code."
            />

            <Benefit
              icon={<Award className="w-5 h-5 text-cyan-400" />}
              title="Certificates"
              desc="Industry recognition."
            />
          </div>
        )}

        {/* Projects */}
        {isPro && (
          <>
            <SectionTitle title="My Projects" />
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
              {projects.length === 0 ? (
                <div className="text-neutral-500 text-center py-8">
                  No projects assigned yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project._id}
                      className="border border-neutral-800 hover:border-cyan-400/30 rounded-lg p-4 transition-colors"
                    >
                      <div className="flex justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white">
                            {project.title}
                          </h3>
                          <p className="text-sm text-neutral-500">
                            {project.community?.name}
                          </p>
                        </div>

                        <span
                          className={`text-xs px-3 py-1 rounded-full border ${project.projectStatus === "open"
                              ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                              : "bg-red-400/10 text-red-400 border-red-400/20"
                            }`}
                        >
                          {project.projectStatus}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm mt-3">
                        <span className="text-neutral-400">
                          Due: {new Date(project.dueDate).toLocaleDateString()}
                        </span>

                        <button
                          onClick={() => navigate(`/projects/${project._id}`)}
                          className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center"
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
    <h2 className="text-xl font-bold text-white mb-4">
      {title}
    </h2>
  );
}

function Benefit({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-cyan-400/10 p-2 rounded-lg border border-cyan-400/20">
        {icon}
      </div>
      <div>
        <h4 className="text-white font-medium">{title}</h4>
        <p className="text-sm text-neutral-500">{desc}</p>
      </div>
    </div>
  );
}

function StatCard({ bg, label, val, badge, bColor }) {
  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center border border-cyan-400/20`}>
          <BookOpen className="w-6 h-6 text-cyan-400" />
        </div>
        <span className={`text-xs font-medium ${bColor} px-2 py-1 rounded-full`}>
          {badge}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{val}</h3>
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  );
}