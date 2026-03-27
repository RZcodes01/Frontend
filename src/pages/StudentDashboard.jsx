import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  ChevronRight,
  Clock,
  Video,
  Award,
  FileText,
  X,
  Download,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchMyBatches, fetchMyCommunities, fetchMyProjects } from '../api/userDashboard.api';
import { generateCertificate, getScore } from '../api/certificate.api';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

export default function StudentDashboard() {
  const [communities, setCommunities] = useState([]);
  const [batches, setBatches] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("Student");
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [selectedCertificateCommunity, setSelectedCertificateCommunity] = useState(null);
  const [certificateData, setCertificateData] = useState(null);
  const [certGenerating, setCertGenerating] = useState(false);
  const [certDownloading, setCertDownloading] = useState(false);
  const [communityScore, setCommunityScore] = useState(0);
  const [scoreLoading, setScoreLoading] = useState(false);
  const certRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser?.name) {
          setStudentName(storedUser.name);
        }

        const communitiesRes = await fetchMyCommunities();
        const myCommunities = communitiesRes.data.communities || [];
        setCommunities(myCommunities);

        // Check if user has Pro plan in ANY community
        const hasProPlan = myCommunities.some(c => c.plan === "pro");

        if (hasProPlan) {
          setIsPro(true);
        }

        // Always fetch projects and batches — backend filters by Pro enrollment
        const [batchRes, projectRes] = await Promise.all([
          fetchMyBatches(),
          fetchMyProjects()
        ]);

        setBatches(batchRes.data.batches || []);
        setProjects(projectRes.data.projects || []);

      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleOpenCertificate = async (community) => {
    setSelectedCertificateCommunity(community);
    setIsCertificateOpen(true);
    setCertificateData(null);
    setCommunityScore(0);

    try {
      setScoreLoading(true);
      const scoreRes = await getScore(community._id);
      const score = scoreRes.data.score || 0;
      setCommunityScore(score);

      if (score < 60) {
        setScoreLoading(false);
        return; // Will show locked state
      }

      setCertGenerating(true);
      const res = await generateCertificate(community._id, community.name || "Community Projects");
      setCertificateData(res.data.certificate);
    } catch (err) {
      if (err.response?.status === 409 && err.response?.data?.certificate) {
        setCertificateData(err.response.data.certificate);
      } else {
        toast.error(err.response?.data?.message || "Failed to generate certificate");
      }
    } finally {
      setCertGenerating(false);
      setScoreLoading(false);
    }
  };

  const handleCloseCertificate = () => {
    setIsCertificateOpen(false);
    setSelectedCertificateCommunity(null);
    setCertificateData(null);
  };

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    try {
      setCertDownloading(true);

      const element = certRef.current;
      const allEls = [element, ...element.querySelectorAll("*")];
      const overrides = [];

      const hasUnsupported = (val) =>
        val && (val.includes("oklch") || val.includes("oklab") || val.includes("color-mix"));

      allEls.forEach((el) => {
        const cs = window.getComputedStyle(el);
        const restored = [];

        // Solid color props
        const colorProps = [
          "color", "background-color", "border-color",
          "border-top-color", "border-bottom-color",
          "border-left-color", "border-right-color",
          "outline-color", "text-decoration-color", "fill", "stroke",
        ];
        colorProps.forEach((prop) => {
          const val = cs.getPropertyValue(prop);
          if (hasUnsupported(val)) {
            const prev = el.style.getPropertyValue(prop);
            const prevPriority = el.style.getPropertyPriority(prop);
            el.style.setProperty(prop, "#1e3a5f", "important");
            restored.push({ prop, prev, prevPriority });
          }
        });

        // background-image — strip oklch from gradients
        const bgImage = cs.getPropertyValue("background-image");
        if (hasUnsupported(bgImage)) {
          const prev = el.style.getPropertyValue("background-image");
          const prevPriority = el.style.getPropertyPriority("background-image");
          el.style.setProperty("background-image", "none", "important");
          // Preserve the background color fallback so it doesn't go transparent
          const bgColor = cs.getPropertyValue("background-color");
          if (!hasUnsupported(bgColor)) {
            // bg-color is fine, gradient just gets removed
          } else {
            el.style.setProperty("background-color", "#ffffff", "important");
          }
          restored.push({ prop: "background-image", prev, prevPriority });
        }

        // box-shadow can also carry oklch
        const shadow = cs.getPropertyValue("box-shadow");
        if (hasUnsupported(shadow)) {
          const prev = el.style.getPropertyValue("box-shadow");
          const prevPriority = el.style.getPropertyPriority("box-shadow");
          el.style.setProperty("box-shadow", "none", "important");
          restored.push({ prop: "box-shadow", prev, prevPriority });
        }

        if (restored.length) overrides.push({ el, restored });
      });

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      // Restore all original styles
      overrides.forEach(({ el, restored }) => {
        restored.forEach(({ prop, prev, prevPriority }) => {
          if (prev) {
            el.style.setProperty(prop, prev, prevPriority);
          } else {
            el.style.removeProperty(prop);
          }
        });
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`certificate-${certificateData.certificateId || "download"}.pdf`);
      toast.success("Certificate downloaded!");
    } catch (err) {
      console.error("Certificate download error:", err);
      toast.error("Failed to download certificate");
    } finally {
      setCertDownloading(false);
    }
  };

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

                <div className="flex justify-between items-center text-sm">

                  <div className="flex items-center text-blue-600">
                    <Clock className="w-4 h-4 mr-1" />
                    Members: {community.membersCount || 0}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCertificate(community);
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-md text-xs font-semibold transition"
                  >
                    🎓 Certificate
                  </button>

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

        {isCertificateOpen && selectedCertificateCommunity && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">

              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-blue-900 flex items-center gap-2">
                  <Award size={20} className="text-amber-500" />
                  Certificate — {selectedCertificateCommunity.name}
                </h2>
                <button
                  onClick={handleCloseCertificate}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto" style={{ maxHeight: '75vh' }}>

                {scoreLoading ? (
                  /* Loading Score */
                  <div className="text-center py-16">
                    <Loader2 size={36} className="animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Checking your eligibility...</p>
                  </div>
                ) : communityScore < 60 ? (
                  /* Locked State */
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Award size={32} className="text-amber-500" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">Certificate Locked</h3>
                    <p className="text-gray-600 mb-6">
                      Score at least <span className="font-bold text-blue-900">60 points</span> to unlock your certificate
                    </p>

                    {/* Progress */}
                    <div className="max-w-sm mx-auto">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Your Score</span>
                        <span className="font-bold text-blue-900">{communityScore}/60</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-1000"
                          style={{ width: `${Math.min((communityScore / 60) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-3">
                        You need <span className="font-bold text-amber-600">{Math.max(60 - communityScore, 0)}</span> more points
                      </p>
                    </div>
                  </div>
                ) : certGenerating ? (
                  /* Generating State */
                  <div className="text-center py-16">
                    <Loader2 size={36} className="animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Generating your certificate...</p>
                  </div>
                ) : certificateData ? (
                  /* Certificate Template */
                  <>
                    <div
                      ref={certRef}
                      className="relative bg-white rounded-xl overflow-hidden border border-gray-200"
                      style={{ aspectRatio: '297/210' }}
                    >
                      <div className="absolute inset-0 p-10 flex flex-col items-center justify-between">

                        {/* Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
                          <p className="text-[100px] font-black tracking-widest rotate-[-30deg]" style={{ color: 'rgba(0,0,0,0.03)' }}>SKILLCONNECT</p>
                        </div>

                        {/* Decorative borders */}
                        <div className="absolute inset-3 border-2 border-blue-200 rounded-lg pointer-events-none" />
                        <div className="absolute inset-5 border border-blue-100 rounded-md pointer-events-none" />

                        {/* Corner decorations */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-br-full opacity-60" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-100 to-transparent rounded-bl-full opacity-60" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-50 to-transparent rounded-tr-full opacity-60" />
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-indigo-50 to-transparent rounded-tl-full opacity-60" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center w-full">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                              <Award size={22} className="text-white" />
                            </div>
                            <div className="text-left">
                              <p className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase">SkillConnect</p>
                              <p className="text-[8px] text-gray-400 tracking-widest uppercase">Academy</p>
                            </div>
                          </div>

                          <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-1" style={{ fontFamily: "Georgia, serif" }}>
                            Certificate of Completion
                          </h1>
                          <p className="text-sm text-gray-400 mb-4">This is to certify that</p>

                          <p className="text-3xl font-black text-blue-700 mb-2" style={{ fontFamily: "Georgia, serif" }}>
                            {studentName}
                          </p>
                          <p className="text-sm text-gray-500 mb-3">has successfully completed the course</p>

                          <div className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-sm mb-4 shadow-lg shadow-blue-500/20">
                            {certificateData.courseName}
                          </div>

                          <p className="text-xs text-gray-400 max-w-md">
                            Awarded in recognition of successful completion of all required projects and assessments.
                          </p>
                        </div>

                        {/* Bottom */}
                        <div className="relative z-10 w-full flex items-end justify-between px-6">
                          <div className="flex flex-col items-center">
                            <QRCodeSVG
                              value={`${window.location.origin}/certificate/verify/${certificateData.certificateId}`}
                              size={56}
                              bgColor="transparent"
                              fgColor="#1e293b"
                              level="M"
                            />
                            <p className="text-[8px] text-gray-400 mt-0.5">Scan to verify</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-bold text-gray-700">
                              {new Date(certificateData.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <div className="w-24 h-px bg-gray-300 mx-auto mt-1 mb-0.5" />
                            <p className="text-[9px] text-gray-400 uppercase tracking-wider">Date of Issue</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] text-gray-400 uppercase tracking-wider">Certificate ID</p>
                            <p className="text-[10px] font-mono text-gray-500 mt-0.5">{certificateData.certificateId?.slice(0, 18)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-5">
                      <button
                        onClick={() => navigate(`/certificate/${certificateData._id}`)}
                        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                      >
                        <ExternalLink size={14} />
                        View Full Page
                      </button>

                      <button
                        onClick={handleDownloadPDF}
                        disabled={certDownloading}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-md disabled:opacity-50"
                      >
                        {certDownloading ? (
                          <><Loader2 size={15} className="animate-spin" /> Generating PDF...</>
                        ) : (
                          <><Download size={15} /> Download PDF</>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500">Something went wrong. Please try again.</div>
                )}
              </div>
            </div>
          </div>
        )}

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
                          className={`text-xs px-3 py-1 rounded-full border font-medium ${project.projectStatus === "open"
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