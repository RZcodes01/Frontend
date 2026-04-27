import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getCertificateById } from "../api/certificate.api";
import { Download, Share2, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CertificateView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const certRef = useRef(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      const res = await getCertificateById(id);
      setCertificate(res.data.certificate);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("You are not eligible or this is not your certificate");
        navigate("/certificates");
      } else {
        toast.error("Failed to load certificate");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    try {
      setDownloading(true);
      const canvas = await html2canvas(certRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: certRef.current.scrollWidth,
        height: certRef.current.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`certificate-${certificate.certificateId}.pdf`);
      toast.success("Certificate downloaded!");
    } catch (err) {
      toast.error("Failed to download certificate");
    } finally {
      setDownloading(false);
    }
  };

  const handleLinkedInShare = () => {
    const verifyUrl = `${window.location.origin}/certificate/verify/${certificate.certificateId}`;
    const text = `I just earned my "${certificate.courseName}" certificate from SkillConnect! Verify it here: ${verifyUrl}`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}&title=${encodeURIComponent(text)}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-[3px] border-white/10 border-t-amber-400 rounded-full"
        />
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950">
        <p className="text-neutral-400">Certificate not found.</p>
      </div>
    );
  }

  const verifyUrl = `${window.location.origin}/certificate/verify/${certificate.certificateId}`;
  const issuedDate = new Date(certificate.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Dynamic values
  const studentName = certificate.userId?.name || "Student";
  const communityName = certificate.communityName || certificate.courseName || "SkillConnect Community";
  const courseName = certificate.courseName || "Course";
  const certId = certificate.certificateId || "";

  return (
    <div className="min-h-screen bg-neutral-950 py-8 px-4">

      {/* ── Top Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto flex items-center justify-between mb-8"
      >
        <button
          onClick={() => navigate("/certificates")}
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLinkedInShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A66C2] text-white text-sm font-semibold hover:bg-[#004182] transition-colors"
          >
            <Share2 size={15} />
            Share on LinkedIn
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50"
          >
            {downloading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download size={15} />
                Download PDF
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* ── Certificate Card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div
          ref={certRef}
          className="relative bg-white rounded-2xl overflow-hidden shadow-2xl"
          style={{ aspectRatio: "297/210" }}
        >
          {/* Watermark */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden="true"
          >
            <p
              className="font-black tracking-widest"
              style={{
                fontSize: "clamp(40px, 8vw, 100px)",
                color: "rgba(0,0,0,0.025)",
                transform: "rotate(-30deg)",
                whiteSpace: "nowrap",
              }}
            >
              SKILLCONNECT
            </p>
          </div>

          {/* Decorative Borders */}
          <div className="absolute inset-4 border-2 border-blue-200 rounded-xl pointer-events-none" />
          <div className="absolute inset-6 border border-blue-100 rounded-lg pointer-events-none" />

          {/* Corner Gradients */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-transparent rounded-br-full opacity-60 pointer-events-none" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-100 to-transparent rounded-bl-full opacity-60 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-50 to-transparent rounded-tr-full opacity-60 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-indigo-50 to-transparent rounded-tl-full opacity-60 pointer-events-none" />

          {/* Inner Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-between p-[4%_6%_3.5%]">

            {/* Logo — same as Navbar */}
            <div className="flex items-center gap-2.5 z-10">
              <div className="w-11 h-11 rounded-xl bg-blue-950 flex items-center justify-center shadow-md flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="50,15 85,35 50,55 15,35" fill="#fbbf24" />
                  <rect x="35" y="55" width="30" height="8" rx="4" fill="#fbbf24" />
                  <line x1="70" y1="35" x2="78" y2="60" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="78" cy="68" rx="8" ry="6" stroke="#fbbf24" strokeWidth="3" />
                </svg>
              </div>
              <div>
                <h1 className="font-black leading-none" style={{ fontSize: "clamp(14px, 2.2vw, 22px)", letterSpacing: "-0.3px" }}>
                  <span className="text-blue-950">Skill</span>
                  <span className="text-amber-400">Connect</span>
                </h1>
                <p className="text-slate-400 uppercase tracking-widest" style={{ fontSize: "clamp(6px, 0.8vw, 9px)" }}>
                  Academy
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center text-center flex-1 justify-center w-full mt-[-1%]">

              {/* Certificate of Completion */}
              <h2
                className="font-black text-slate-800 tracking-tight leading-tight mb-1"
                style={{ fontFamily: "Georgia,'Times New Roman',serif", fontSize: "clamp(14px, 3vw, 26px)" }}
              >
                Certificate of Completion
              </h2>
              <p className="text-slate-400" style={{ fontSize: "clamp(7px, 1vw, 11px)", marginBottom: "6px" }}>
                This is to certify that
              </p>

              {/* Divider */}
              <div className="flex items-center gap-2 w-48 mb-2">
                <div className="flex-1 h-px bg-blue-200" />
                <div className="w-1.5 h-1.5 bg-blue-300 rotate-45 flex-shrink-0" />
                <div className="flex-1 h-px bg-blue-200" />
              </div>

              {/* ── DYNAMIC: Student Name ── */}
              <p
                className="font-black text-blue-700 leading-tight"
                style={{ fontFamily: "Georgia,'Times New Roman',serif", fontSize: "clamp(14px, 3vw, 26px)", marginBottom: "4px" }}
              >
                {studentName}
              </p>

              {/* Divider */}
              <div className="flex items-center gap-2 w-48 mb-2">
                <div className="flex-1 h-px bg-blue-200" />
                <div className="w-1.5 h-1.5 bg-blue-300 rotate-45 flex-shrink-0" />
                <div className="flex-1 h-px bg-blue-200" />
              </div>

              <p className="text-slate-500" style={{ fontSize: "clamp(7px, 1vw, 11px)", marginBottom: "6px" }}>
                has successfully completed the course
              </p>

              {/* Course Badge */}
              <div
                className="inline-block bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/20"
                style={{ fontSize: "clamp(8px, 1.2vw, 13px)", padding: "5px 20px", marginBottom: "6px" }}
              >
                {courseName}
              </div>

              <p className="text-slate-400" style={{ fontSize: "clamp(6px, 0.85vw, 10px)", maxWidth: "340px", lineHeight: 1.5 }}>
                This certificate is awarded in recognition of successful completion of all required
                projects and assessments in the community program.
              </p>
            </div>

            {/* ── Footer ── */}
            <div className="relative z-10 w-full flex items-end justify-between px-[3%]">

              {/* Left: Seal */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className="rounded-full border-2 border-blue-600 flex items-center justify-center"
                  style={{ width: "clamp(32px,4vw,48px)", height: "clamp(32px,4vw,48px)", background: "rgba(37,99,235,0.05)" }}
                >
                  <svg viewBox="0 0 100 100" style={{ width: "clamp(18px,2.5vw,28px)", height: "clamp(18px,2.5vw,28px)" }} fill="none">
                    <polygon points="50,15 85,35 50,55 15,35" fill="#2563eb" />
                    <rect x="35" y="55" width="30" height="8" rx="4" fill="#2563eb" />
                    <line x1="70" y1="35" x2="78" y2="60" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                    <ellipse cx="78" cy="68" rx="8" ry="6" stroke="#2563eb" strokeWidth="3" />
                  </svg>
                </div>
                <p className="text-slate-400 uppercase tracking-widest" style={{ fontSize: "clamp(5px,0.7vw,8px)" }}>Verified</p>
              </div>

              {/* Center: Date */}
              <div className="text-center">
                <p className="font-bold text-slate-700" style={{ fontSize: "clamp(7px,1vw,11px)" }}>{issuedDate}</p>
                <div className="w-24 h-px bg-slate-300 mx-auto my-1" />
                <p className="text-slate-400 uppercase tracking-wider" style={{ fontSize: "clamp(5px,0.7vw,9px)" }}>
                  Date of Issue
                </p>
              </div>

              {/* Right: Cert ID */}
              <div className="text-right">
                <p className="text-slate-400 uppercase tracking-wider" style={{ fontSize: "clamp(5px,0.7vw,9px)" }}>
                  Certificate ID
                </p>
                <p className="font-mono text-slate-500" style={{ fontSize: "clamp(6px,0.85vw,10px)", marginTop: "2px" }}>
                  {certId.slice(0, 18)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── DYNAMIC: Student Name & Community below certificate ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-5xl mx-auto mt-6 flex flex-col items-center gap-1"
      >
        {/* Student Name */}
        <p className="text-white font-bold text-lg tracking-tight">
          {studentName}
        </p>

        {/* Community Name */}
        <div className="flex items-center gap-2">
          <span className="w-4 h-px bg-neutral-600" />
          <p className="text-neutral-400 text-sm font-medium">{communityName}</p>
          <span className="w-4 h-px bg-neutral-600" />
        </div>
      </motion.div>

      {/* ── Certificate Meta ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="max-w-5xl mx-auto mt-4 text-center"
      >
        <p className="text-xs text-neutral-600">
          Certificate ID:{" "}
          <span className="font-mono text-neutral-400">{certId}</span>
        </p>
        <p className="text-xs text-neutral-600 mt-1">
          Verify at:{" "}
          <a
            href={verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-500 hover:text-cyan-400 underline"
          >
            {verifyUrl}
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default CertificateView;