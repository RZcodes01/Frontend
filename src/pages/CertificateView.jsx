import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getCertificateById } from "../api/certificate.api";
import { Download, Share2, ArrowLeft, Loader2, Award } from "lucide-react";
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
        height: certRef.current.scrollHeight
      });

      const imgData = canvas.toDataURL("image/png", 1.0);

      // A4 landscape
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });

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
          className="w-10 h-10 border-3 border-white/10 border-t-cyan-500 rounded-full"
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
    day: "numeric"
  });

  return (
    <div className="min-h-screen bg-neutral-950 py-8 px-4">
      {/* Top Actions */}
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

      {/* Certificate Template */}
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
          {/* Certificate Inner Content */}
          <div className="absolute inset-0 p-12 flex flex-col items-center justify-between">
            {/* Watermark */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              aria-hidden="true"
            >
              <p
                className="text-[120px] font-black tracking-widest rotate-[-30deg]"
                style={{ color: "rgba(0,0,0,0.03)" }}
              >
                SKILLCONNECT
              </p>
            </div>

            {/* Decorative Border */}
            <div className="absolute inset-4 border-2 border-blue-200 rounded-xl pointer-events-none" />
            <div className="absolute inset-6 border border-blue-100 rounded-lg pointer-events-none" />

            {/* Top Decorations */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-transparent rounded-br-full opacity-60" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-100 to-transparent rounded-bl-full opacity-60" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-50 to-transparent rounded-tr-full opacity-60" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-indigo-50 to-transparent rounded-tl-full opacity-60" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center w-full">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Award size={26} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold tracking-[0.25em] text-blue-500 uppercase">
                    SkillConnect
                  </p>
                  <p className="text-[10px] text-slate-400 tracking-widest uppercase">
                    Academy
                  </p>
                </div>
              </div>

              {/* Title */}
              <h1
                className="text-4xl font-black text-slate-800 tracking-tight mb-1"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Certificate of Completion
              </h1>
              <p className="text-sm text-slate-400 mb-6">This is to certify that</p>

              {/* Recipient Name */}
              <p
                className="text-4xl font-black text-blue-700 mb-2"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {certificate.userId?.name || "Student"}
              </p>

              <p className="text-sm text-slate-500 mb-4">
                has successfully completed the course
              </p>

              {/* Course Name Badge */}
              <div className="inline-block px-8 py-2.5 bg-blue-600 text-white rounded-full font-bold text-base mb-6 shadow-lg shadow-blue-500/20">
                {certificate.courseName}
              </div>

              <p className="text-xs text-slate-400 max-w-md">
                This certificate is awarded in recognition of successful completion of all
                required projects and assessments in the community program.
              </p>
            </div>

            {/* Bottom Section */}
            <div className="relative z-10 w-full flex items-end justify-between px-8">
              {/* Left - QR Code */}
              <div className="flex flex-col items-center">
                <QRCodeSVG
                  value={verifyUrl}
                  size={72}
                  bgColor="transparent"
                  fgColor="#1e293b"
                  level="M"
                />
                <p className="text-[9px] text-slate-400 mt-1">Scan to verify</p>
              </div>

              {/* Center - Date */}
              <div className="text-center">
                <p className="text-sm font-bold text-slate-700">{issuedDate}</p>
                <div className="w-28 h-px bg-slate-300 mx-auto mt-1 mb-1" />
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Date of Issue
                </p>
              </div>

              {/* Right - Certificate ID */}
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Certificate ID
                </p>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  {certificate.certificateId?.slice(0, 18)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Certificate ID Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-5xl mx-auto mt-6 text-center"
      >
        <p className="text-xs text-neutral-600">
          Certificate ID:{" "}
          <span className="font-mono text-neutral-400">
            {certificate.certificateId}
          </span>
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
