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
  ExternalLink,
  Github,
  Globe,
  CheckCircle,
  MessageSquare,
  Star,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchMyBatches, fetchMyCommunities, fetchMyProjects } from '../api/userDashboard.api';
import { getMySubmissions } from '../api/submission.api';
import { generateCertificate, getScore } from '../api/certificate.api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

// ─── Certificate styles (injected once) ───────────────────────────────────────
const CERT_FONT_URL =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap';

// ─── The certificate template (matching CertificateView.jsx design) ───────────
function CertificateTemplate({ certRef, studentName, certificateData }) {
  const issuedDate = new Date(certificateData.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const courseName = certificateData.courseName || "Course";
  const certId = certificateData.certificateId || "";

  return (
    <div
      ref={certRef}
      style={{
        position: 'relative',
        background: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        width: '100%',
        aspectRatio: '297/180',
        boxSizing: 'border-box',
      }}
    >
      {/* Watermark */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', userSelect: 'none',
        }}
        aria-hidden="true"
      >
        <p
          style={{
            fontSize: 80, fontWeight: 900,
            color: 'rgba(0,0,0,0.025)',
            transform: 'rotate(-30deg)',
            whiteSpace: 'nowrap',
            letterSpacing: '0.15em',
            margin: 0,
          }}
        >
          SKILLCONNECT
        </p>
      </div>

      {/* Decorative Borders */}
      <div style={{
        position: 'absolute', top: 16, left: 16, right: 16, bottom: 16,
        border: '2px solid #bfdbfe', borderRadius: 12,
        pointerEvents: 'none', boxSizing: 'border-box',
      }} />
      <div style={{
        position: 'absolute', top: 24, left: 24, right: 24, bottom: 24,
        border: '1px solid #dbeafe', borderRadius: 8,
        pointerEvents: 'none', boxSizing: 'border-box',
      }} />

      {/* Corner Gradients */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 160, height: 160, background: 'radial-gradient(circle at 0 0, #dbeafe 0%, transparent 70%)', opacity: 0.6, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: 160, background: 'radial-gradient(circle at 100% 0, #e0e7ff 0%, transparent 70%)', opacity: 0.6, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 128, height: 128, background: 'radial-gradient(circle at 0 100%, #eff6ff 0%, transparent 70%)', opacity: 0.6, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 128, height: 128, background: 'radial-gradient(circle at 100% 100%, #e0e7ff 0%, transparent 70%)', opacity: 0.6, pointerEvents: 'none' }} />

      {/* Inner Content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '4% 6% 3.5%',
        boxSizing: 'border-box',
      }}>

        {/* Logo — same graduation cap as Navbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, zIndex: 10 }}>
          <div style={{
            width: 44, height: 44,
            borderRadius: 12, background: '#172554',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg viewBox="0 0 100 100" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,15 85,35 50,55 15,35" fill="#fbbf24" />
              <rect x="35" y="55" width="30" height="8" rx="4" fill="#fbbf24" />
              <line x1="70" y1="35" x2="78" y2="60" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="78" cy="68" rx="8" ry="6" stroke="#fbbf24" strokeWidth="3" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 20, lineHeight: 1, letterSpacing: '-0.3px' }}>
              <span style={{ color: '#172554' }}>Skill</span>
              <span style={{ color: '#fbbf24' }}>Connect</span>
            </div>
            <p style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.25em', marginTop: 2 }}>
              Academy
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          flex: 1, justifyContent: 'center', width: '100%',
          marginTop: '-1%',
        }}>

          {/* Certificate of Completion */}
          <h2 style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 24, fontWeight: 900,
            color: '#1e293b', letterSpacing: '-0.3px',
            lineHeight: 1.1, marginBottom: 4, marginTop: 0,
          }}>
            Certificate of Completion
          </h2>
          <p style={{ fontSize: 10, color: '#94a3b8', marginBottom: 6, marginTop: 0 }}>
            This is to certify that
          </p>

          {/* Diamond divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 192, marginBottom: 8 }}>
            <div style={{ flex: 1, height: 1, background: '#bfdbfe' }} />
            <div style={{ width: 6, height: 6, background: '#93c5fd', transform: 'rotate(45deg)', flexShrink: 0 }} />
            <div style={{ flex: 1, height: 1, background: '#bfdbfe' }} />
          </div>

          {/* Student Name */}
          <p style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 26, fontWeight: 900,
            color: '#1d4ed8', lineHeight: 1.1,
            marginBottom: 4, marginTop: 0,
          }}>
            {studentName}
          </p>

          {/* Diamond divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 192, marginBottom: 8 }}>
            <div style={{ flex: 1, height: 1, background: '#bfdbfe' }} />
            <div style={{ width: 6, height: 6, background: '#93c5fd', transform: 'rotate(45deg)', flexShrink: 0 }} />
            <div style={{ flex: 1, height: 1, background: '#bfdbfe' }} />
          </div>

          <p style={{ fontSize: 10, color: '#64748b', marginBottom: 6, marginTop: 0 }}>
            has successfully completed the course
          </p>

          {/* Course Badge */}
          <div style={{
            display: 'inline-block',
            background: '#2563eb', color: '#ffffff',
            fontWeight: 700, fontSize: 12,
            borderRadius: 999, padding: '5px 20px',
            marginBottom: 6,
          }}>
            {courseName}
          </div>

          <p style={{
            fontSize: 9, color: '#94a3b8',
            maxWidth: 340, lineHeight: 1.5, marginTop: 0,
          }}>
            This certificate is awarded in recognition of successful completion of all required
            projects and assessments in the community program.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          position: 'relative', zIndex: 10,
          width: '100%',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          padding: '0 3%',
          boxSizing: 'border-box',
        }}>

          {/* Left: Seal */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 44, height: 44,
              borderRadius: '50%', border: '2px solid #2563eb',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(37,99,235,0.05)',
            }}>
              <svg viewBox="0 0 100 100" width="24" height="24" fill="none">
                <polygon points="50,15 85,35 50,55 15,35" fill="#2563eb" />
                <rect x="35" y="55" width="30" height="8" rx="4" fill="#2563eb" />
                <line x1="70" y1="35" x2="78" y2="60" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                <ellipse cx="78" cy="68" rx="8" ry="6" stroke="#2563eb" strokeWidth="3" />
              </svg>
            </div>
            <p style={{ fontSize: 7, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>Verified</p>
          </div>

          {/* Center: Date */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#334155', margin: 0 }}>{issuedDate}</p>
            <div style={{ width: 96, height: 1, background: '#cbd5e1', margin: '4px auto' }} />
            <p style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>
              Date of Issue
            </p>
          </div>

          {/* Right: Cert ID */}
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>
              Certificate ID
            </p>
            <p style={{ fontSize: 9, fontFamily: 'monospace', color: '#64748b', marginTop: 2, marginBottom: 0 }}>
              {certId.slice(0, 18)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const [communities, setCommunities] = useState([]);
  const [batches, setBatches] = useState([]);
  const [projects, setProjects] = useState([]);
  const [submissions, setSubmissions] = useState([]);
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
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const certRef = useRef(null);
  const navigate = useNavigate();

  // Inject Google Fonts for the certificate once
  useEffect(() => {
    if (!document.getElementById('cert-gfonts')) {
      const link = document.createElement('link');
      link.id = 'cert-gfonts';
      link.rel = 'stylesheet';
      link.href = CERT_FONT_URL;
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.name) setStudentName(storedUser.name);

        const communitiesRes = await fetchMyCommunities();
        const myCommunities = communitiesRes.data.communities || [];
        setCommunities(myCommunities);

        const hasProPlan = myCommunities.some(c => c.plan === "pro");
        if (hasProPlan) setIsPro(true);

        const [batchRes, projectRes, submissionsRes] = await Promise.all([
          fetchMyBatches(),
          fetchMyProjects(),
          getMySubmissions().catch(() => ({ data: { data: [] } }))
        ]);
        setBatches(batchRes.data.batches || []);
        setProjects(projectRes.data.projects || []);
        setSubmissions(submissionsRes.data.data || []);
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
        return;
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

      // Since the certificate uses only hardcoded hex colors (no oklch),
      // html2canvas captures it cleanly. We still defensively strip any
      // inherited oklch that might bleed in from the modal parent.
      const element = certRef.current;
      const allEls = [element, ...element.querySelectorAll("*")];
      const overrides = [];
      const hasUnsupported = (v) =>
        v && (v.includes("oklch") || v.includes("oklab") || v.includes("color-mix"));

      allEls.forEach((el) => {
        const cs = window.getComputedStyle(el);
        const restored = [];
        const solidProps = [
          "color", "background-color", "border-color",
          "border-top-color", "border-bottom-color",
          "border-left-color", "border-right-color",
          "outline-color", "text-decoration-color", "fill", "stroke",
        ];
        solidProps.forEach((prop) => {
          const val = cs.getPropertyValue(prop);
          if (hasUnsupported(val)) {
            const prev = el.style.getPropertyValue(prop);
            const prevP = el.style.getPropertyPriority(prop);
            el.style.setProperty(prop, "#1b3c64", "important");
            restored.push({ prop, prev, prevP });
          }
        });
        ["background-image", "box-shadow"].forEach((prop) => {
          const val = cs.getPropertyValue(prop);
          if (hasUnsupported(val)) {
            const prev = el.style.getPropertyValue(prop);
            const prevP = el.style.getPropertyPriority(prop);
            el.style.setProperty(prop, "none", "important");
            restored.push({ prop, prev, prevP });
          }
        });
        if (restored.length) overrides.push({ el, restored });
      });

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      overrides.forEach(({ el, restored }) => {
        restored.forEach(({ prop, prev, prevP }) => {
          if (prev) el.style.setProperty(prop, prev, prevP);
          else el.style.removeProperty(prop);
        });
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const W = pdf.internal.pageSize.getWidth();
      const H = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, W, H);
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
          <p className="text-blue-700">Ready to continue your learning journey?</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard label="Communities Joined" val={communities.length} badge="Active" />
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
                    <h3 className="font-semibold text-blue-900">{community.name}</h3>
                    <p className="text-sm text-blue-600">{community.description || "No description available"}</p>
                  </div>
                  <span className="text-sm font-semibold text-amber-600">Active</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center text-blue-600">
                    <Clock className="w-4 h-4 mr-1" />
                    Members: {community.membersCount || 0}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleOpenCertificate(community); }}
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

        {/* ── Certificate Modal ─────────────────────────────────────────────── */}
        {isCertificateOpen && selectedCertificateCommunity && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">

              {/* Modal header */}
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

              {/* Modal body */}
              <div className="p-6 overflow-y-auto" style={{ maxHeight: '80vh' }}>

                {scoreLoading ? (
                  <div className="text-center py-16">
                    <Loader2 size={36} className="animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Checking your eligibility...</p>
                  </div>

                ) : communityScore < 60 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Award size={32} className="text-amber-500" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">Certificate Locked</h3>
                    <p className="text-gray-600 mb-6">
                      Score at least <span className="font-bold text-blue-900">60 points</span> to unlock your certificate
                    </p>
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
                  <div className="text-center py-16">
                    <Loader2 size={36} className="animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Generating your certificate...</p>
                  </div>

                ) : certificateData ? (
                  <>
                    {/* ── New Certificate Design ── */}
                    <CertificateTemplate
                      certRef={certRef}
                      studentName={studentName}
                      certificateData={certificateData}
                    />

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-5">
                      <button
                        onClick={() => navigate(`/certificate/${certificateData._id}`)}
                        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                      >
                        <ExternalLink size={14} />
                        View Full Page
                      </button>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleCloseCertificate}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm transition-colors"
                        >
                          <X size={15} />
                          Close
                        </button>
                        <button
                          onClick={handleDownloadPDF}
                          disabled={certDownloading}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-md disabled:opacity-50"
                        >
                          {certDownloading
                            ? <><Loader2 size={15} className="animate-spin" /> Generating PDF...</>
                            : <><Download size={15} /> Download PDF</>}
                        </button>
                      </div>
                    </div>
                  </>

                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Something went wrong. Please try again.
                  </div>
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
              <div className="text-blue-500 text-center py-8">No active batches available.</div>
            ) : (
              <div className="space-y-4">
                {batches.map((batch) => (
                  <div key={batch._id} className="border border-blue-100 hover:border-amber-400 rounded-lg p-4 transition-all duration-200 bg-blue-50/50">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-blue-900">{batch.name}</h3>
                        <p className="text-sm text-blue-600">{batch.communityId?.name}</p>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-amber-400/10 text-amber-600 border border-amber-400/30 font-medium">
                        {batch.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-3">
                      <span className="text-blue-600">{new Date(batch.classAt).toLocaleString()}</span>
                      {batch.status === "upcoming" && (
                        <a href={batch.classLink} target="_blank" rel="noopener noreferrer"
                          className="text-blue-900 hover:text-amber-500 font-semibold transition-colors">
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
            <Benefit icon={<Video className="w-5 h-5 text-blue-900" />} title="Live Classes" desc="Weekly mentor sessions." />
            <Benefit icon={<FileText className="w-5 h-5 text-blue-900" />} title="Project Files" desc="Premium assets & code." />
            <Benefit icon={<Award className="w-5 h-5 text-blue-900" />} title="Certificates" desc="Industry recognition." />
          </div>
        )}

        {/* Projects */}
        {isPro && (
          <>
            <SectionTitle title="My Projects" />
            <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm">
              {projects.length === 0 ? (
                <div className="text-blue-500 text-center py-8">No projects assigned yet.</div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project._id} className="border border-blue-100 hover:border-amber-400 rounded-lg p-4 transition-all duration-200 bg-blue-50/50">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-blue-900">{project.title}</h3>
                          <p className="text-sm text-blue-600">{project.community?.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Submission Status Badge */}
                          {(project.assignmentStatus === "submitted" || project.assignmentStatus === "graded") && (
                            <span className={`text-xs px-3 py-1 rounded-full border font-medium ${
                              project.assignmentStatus === "graded"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : "bg-amber-50 text-amber-600 border-amber-200"
                            }`}>
                              {project.assignmentStatus === "graded" ? "✅ Graded" : "📤 Submitted"}
                            </span>
                          )}
                          {/* Project Open/Closed Badge */}
                          <span className={`text-xs px-3 py-1 rounded-full border font-medium ${project.projectStatus === "open"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-red-50 text-red-500 border-red-200"
                            }`}>
                            {project.projectStatus}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-3">
                        <span className="text-blue-600">Due: {new Date(project.dueDate).toLocaleDateString()}</span>
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

        {/* ── My Submissions ──────────────────────────────────────────────── */}
        {submissions.length > 0 && (
          <>
            <SectionTitle title="My Submissions" />
            <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm mt-4 mb-10">
              <div className="space-y-4">
                {submissions.map((sub) => {
                  const isExpanded = expandedSubmission === sub._id;
                  const projectTitle = sub.projectId?.title || sub.title || "Untitled Project";
                  const isReviewed = sub.status === "reviewed";

                  return (
                    <div
                      key={sub._id}
                      className="border border-blue-100 rounded-lg overflow-hidden transition-all duration-200 bg-blue-50/50 hover:border-blue-200"
                    >
                      {/* Submission Header */}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-blue-900 truncate">{projectTitle}</h3>
                            <p className="text-xs text-blue-500 mt-0.5">
                              Submitted {new Date(sub.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                            {isReviewed && sub.grade != null && (
                              <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                                <Star size={12} /> {sub.grade}/100
                              </span>
                            )}
                            <span className={`text-xs px-3 py-1 rounded-full border font-medium ${
                              isReviewed
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : "bg-amber-50 text-amber-600 border-amber-200"
                            }`}>
                              {isReviewed ? "✅ Reviewed" : "⏳ Pending"}
                            </span>
                          </div>
                        </div>

                        {/* Quick Info Row */}
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          {sub.githubLink && (
                            <a
                              href={sub.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-200"
                            >
                              <Github size={13} /> GitHub
                            </a>
                          )}
                          {sub.liveDemoLink && (
                            <a
                              href={sub.liveDemoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-200"
                            >
                              <Globe size={13} /> Live Demo
                            </a>
                          )}
                          {sub.files?.length > 0 && (
                            <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                              <FileText size={13} /> {sub.files.length} file{sub.files.length !== 1 ? "s" : ""}
                            </span>
                          )}
                          <button
                            onClick={() => setExpandedSubmission(isExpanded ? null : sub._id)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-amber-500 transition-colors ml-auto"
                          >
                            <Eye size={13} /> {isExpanded ? "Hide Details" : "View Details"}
                            <ChevronRight size={14} className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-blue-100 bg-white p-4 space-y-4 animate-fadeIn">
                          {/* Description */}
                          {sub.description && (
                            <div>
                              <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">Description</p>
                              <p className="text-sm text-gray-700 leading-relaxed">{sub.description}</p>
                            </div>
                          )}

                          {/* Uploaded Files */}
                          {sub.files?.length > 0 && (
                            <div>
                              <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2">Uploaded Files</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {sub.files.map((file, idx) => {
                                  // For documents (PDFs etc.), use Google Docs Viewer to display inline
                                  // instead of Cloudinary raw URL which forces download
                                  const viewUrl = file.type === "document"
                                    ? `https://docs.google.com/viewer?url=${encodeURIComponent(file.url)}&embedded=true`
                                    : file.url;

                                  return (
                                    <a
                                      key={idx}
                                      href={viewUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 p-3 bg-blue-50/80 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors group"
                                    >
                                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-100">
                                        {file.type === "image" ? (
                                          <img src={file.url} alt="" className="w-full h-full rounded-lg object-cover" />
                                        ) : (
                                          <FileText size={14} className="text-blue-500" />
                                        )}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold text-blue-900 truncate capitalize">{file.type} file</p>
                                        <p className="text-[10px] text-blue-500">Click to view</p>
                                      </div>
                                      <ExternalLink size={14} className="text-blue-400 group-hover:text-blue-600 flex-shrink-0" />
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Grade & Feedback */}
                          {isReviewed && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                                  <CheckCircle size={13} /> Review Results
                                </span>
                                {sub.grade != null && (
                                  <span className="text-lg font-black text-emerald-700">{sub.grade}<span className="text-xs text-emerald-500 font-semibold">/100</span></span>
                                )}
                              </div>
                              {sub.feedback && (
                                <div>
                                  <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                    <MessageSquare size={12} /> Mentor Feedback
                                  </p>
                                  <p className="text-sm text-emerald-900 leading-relaxed">{sub.feedback}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}

// ─── Small components ──────────────────────────────────────────────────────────
function SectionTitle({ title }) {
  return <h2 className="text-xl font-bold text-blue-900 mb-4 tracking-tight">{title}</h2>;
}

function Benefit({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-amber-400/10 p-2 rounded-lg border border-amber-400/30">{icon}</div>
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