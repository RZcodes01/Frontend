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

// ─── Certificate styles (injected once, no Tailwind) ──────────────────────────
const CERT_FONT_URL =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap';

const CERT_COLORS = {
  navy: '#0f2340',
  navyMid: '#1b3c64',
  gold: '#d4af6a',
  goldLight: '#f0e6cc',
  goldMuted: '#9a8060',
  goldBorder: 'rgba(212,175,106,0.4)',
  white: '#ffffff',
  gray1: '#7a6a55',
  gray2: '#b8a07a',
};

// ─── Corner SVG (pure geometry, no oklch) ─────────────────────────────────────
function CertCorner({ flip }) {
  const style = {
    position: 'absolute',
    width: 52,
    height: 52,
    ...(flip === 'tr' && { top: 8, right: 8, transform: 'scaleX(-1)' }),
    ...(flip === 'tl' && { top: 8, left: 8 }),
    ...(flip === 'bl' && { bottom: 8, left: 8, transform: 'scaleY(-1)' }),
    ...(flip === 'br' && { bottom: 8, right: 8, transform: 'scale(-1)' }),
  };
  return (
    <div style={style}>
      <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
        <path d="M4 48 L4 8 Q4 4 8 4 L48 4" stroke={CERT_COLORS.gold} strokeWidth="1.5" fill="none" />
        <circle cx="4" cy="4" r="3" fill={CERT_COLORS.gold} opacity="0.45" />
        <circle cx="48" cy="4" r="1.5" fill={CERT_COLORS.gold} opacity="0.3" />
        <circle cx="4" cy="48" r="1.5" fill={CERT_COLORS.gold} opacity="0.3" />
        <path d="M18 4 L18 9 M32 4 L32 7 M4 18 L9 18 M4 32 L7 32"
          stroke={CERT_COLORS.gold} strokeWidth="0.8" opacity="0.5" />
      </svg>
    </div>
  );
}

// ─── Seal SVG ─────────────────────────────────────────────────────────────────
function CertSeal() {
  return (
    <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" stroke={CERT_COLORS.gold} strokeWidth="0.8" strokeDasharray="4 3" fill="none" opacity="0.6" />
      <circle cx="50" cy="50" r="36" fill={CERT_COLORS.navy} />
      <circle cx="50" cy="50" r="33" stroke={CERT_COLORS.gold} strokeWidth="0.6" fill="none" opacity="0.5" />
      <path d="M50 20L55 35H71L59 44L63 59L50 50L37 59L41 44L29 35H45L50 20Z"
        fill={CERT_COLORS.gold} opacity="0.9" />
      <text x="50" y="72" textAnchor="middle"
        fontFamily="Lato, sans-serif" fontSize="6" fontWeight="700"
        letterSpacing="2" fill={CERT_COLORS.gold} opacity="0.8">
        VERIFIED
      </text>
    </svg>
  );
}

// ─── The certificate template (all inline styles) ─────────────────────────────
function CertificateTemplate({ certRef, studentName, certificateData }) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const issued = new Date(certificateData.issuedAt);
  const dateStr = `${months[issued.getMonth()]} ${issued.getDate()}, ${issued.getFullYear()}`;

  return (
    <div
      ref={certRef}
      style={{
        position: 'relative',
        background: CERT_COLORS.white,
        border: `1.5px solid ${CERT_COLORS.gold}`,
        overflow: 'hidden',
        width: '100%',
        aspectRatio: '297/210',
        fontFamily: 'Lato, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage:
          'linear-gradient(rgba(212,175,106,0.06) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(212,175,106,0.06) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      {/* Outer border */}
      <div style={{
        position: 'absolute', inset: 12,
        border: `1.5px solid rgba(212,175,106,0.45)`,
        pointerEvents: 'none', boxSizing: 'border-box',
      }} />

      {/* Inner border */}
      <div style={{
        position: 'absolute', inset: 18,
        border: `0.5px solid rgba(212,175,106,0.22)`,
        pointerEvents: 'none', boxSizing: 'border-box',
      }} />

      {/* Watermark */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', userSelect: 'none', zIndex: 1,
      }}>
        <p style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 88, fontWeight: 900,
          color: 'rgba(27,60,100,0.025)',
          transform: 'rotate(-25deg)',
          whiteSpace: 'nowrap', letterSpacing: '0.1em', margin: 0,
        }}>SKILLCONNECT</p>
      </div>

      {/* Corners */}
      <CertCorner flip="tl" />
      <CertCorner flip="tr" />
      <CertCorner flip="bl" />
      <CertCorner flip="br" />

      {/* Body */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: '36px 52px 28px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        height: '100%', boxSizing: 'border-box',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 34, height: 34,
            background: CERT_COLORS.navyMid,
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z"
                fill={CERT_COLORS.gold} />
            </svg>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{
              fontFamily: 'Lato, sans-serif', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.18em', color: CERT_COLORS.navyMid,
              textTransform: 'uppercase',
            }}>SkillConnect</div>
            <div style={{
              fontFamily: 'Lato, sans-serif', fontSize: 8, fontWeight: 300,
              letterSpacing: '0.22em', color: CERT_COLORS.goldMuted,
              textTransform: 'uppercase',
            }}>Academy of Excellence</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: 72, height: 1.5, marginBottom: 14,
          background: `linear-gradient(90deg, transparent, ${CERT_COLORS.gold}, transparent)`,
        }} />

        {/* Title line */}
        <div style={{
          fontFamily: 'Lato, sans-serif', fontSize: 10, fontWeight: 400,
          letterSpacing: '0.35em', color: CERT_COLORS.goldMuted,
          textTransform: 'uppercase', marginBottom: 4,
        }}>Certificate of Completion</div>

        {/* Headline */}
        <div style={{
          fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 900,
          color: CERT_COLORS.navy, letterSpacing: '-0.01em',
          lineHeight: 1.1, marginBottom: 14,
        }}>Achievement Recognized</div>

        {/* Certify text */}
        <div style={{
          fontFamily: 'Cormorant Garamond, serif', fontSize: 13,
          fontStyle: 'italic', color: CERT_COLORS.gray1, marginBottom: 6,
        }}>This is to proudly certify that</div>

        {/* Student name */}
        <div style={{
          fontFamily: 'Playfair Display, serif', fontSize: 34, fontWeight: 700,
          color: CERT_COLORS.navyMid, lineHeight: 1.15, marginBottom: 4,
        }}>{studentName}</div>

        {/* Name underline */}
        <div style={{
          width: 150, height: 1,
          background: `linear-gradient(90deg, transparent, ${CERT_COLORS.gold} 30%, ${CERT_COLORS.gold} 70%, transparent)`,
          marginBottom: 12,
        }} />

        {/* Completion text */}
        <div style={{
          fontFamily: 'Cormorant Garamond, serif', fontSize: 13,
          fontStyle: 'italic', color: CERT_COLORS.gray1, marginBottom: 10,
        }}>has successfully completed all requirements of the</div>

        {/* Community badge */}
        <div style={{
          display: 'inline-block',
          background: CERT_COLORS.navy,
          color: CERT_COLORS.goldLight,
          fontFamily: 'Lato, sans-serif', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '7px 24px', marginBottom: 12,
          position: 'relative',
        }}>
          {certificateData.courseName}
        </div>

        {/* Description */}
        <div style={{
          fontFamily: 'Lato, sans-serif', fontSize: 9,
          color: CERT_COLORS.goldMuted, letterSpacing: '0.05em',
          maxWidth: 400, lineHeight: 1.7, marginBottom: 'auto',
        }}>
          Awarded in recognition of demonstrated excellence, project completion, and dedication
          to mastering modern skills within the SkillConnect learning community.
        </div>

        {/* Footer */}
        <div style={{
          width: '100%',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 12,
          borderTop: `1px solid rgba(212,175,106,0.3)`,
          paddingTop: 14, marginTop: 10,
          alignItems: 'center',
        }}>

          {/* QR code */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <QRCodeSVG
              value={`${window.location.origin}/certificate/verify/${certificateData.certificateId}`}
              size={48}
              bgColor="transparent"
              fgColor={CERT_COLORS.navy}
              level="M"
            />
            <span style={{
              fontFamily: 'Lato, sans-serif', fontSize: 7,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: CERT_COLORS.gray2,
            }}>Scan to verify</span>
          </div>

          {/* Seal center */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <CertSeal />
            <span style={{
              fontFamily: 'Lato, sans-serif', fontSize: 7,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: CERT_COLORS.gray2,
            }}>Official Seal</span>
          </div>

          {/* Date + ID */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'Lato, sans-serif', fontSize: 7,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: CERT_COLORS.gray2, marginBottom: 2,
              }}>Date of Issue</div>
              <div style={{
                fontFamily: 'Lato, sans-serif', fontSize: 10, fontWeight: 700,
                color: CERT_COLORS.navyMid,
              }}>{dateStr}</div>
            </div>
            <div style={{
              width: 80, height: 1,
              background: `linear-gradient(90deg, transparent, ${CERT_COLORS.gold})`,
            }} />
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'Lato, sans-serif', fontSize: 7,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: CERT_COLORS.gray2, marginBottom: 2,
              }}>Certificate ID</div>
              <div style={{
                fontFamily: 'Lato, sans-serif', fontSize: 8,
                fontWeight: 400, letterSpacing: '0.08em',
                color: CERT_COLORS.goldMuted, fontVariantNumeric: 'tabular-nums',
              }}>{certificateData.certificateId?.slice(0, 20)}</div>
            </div>
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
                        <span className={`text-xs px-3 py-1 rounded-full border font-medium ${project.projectStatus === "open"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-red-50 text-red-500 border-red-200"
                          }`}>
                          {project.projectStatus}
                        </span>
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