import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getScore, getMyCertificates, generateCertificate } from "../api/certificate.api";
import CertificateLocked from "../components/CertificateLocked";
import CertificateUnlocked from "../components/CertificateUnlocked";
import { toast } from "sonner";

const CertificateGate = () => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const scoreRes = await getScore();
      setScore(scoreRes.data.score);

      if (scoreRes.data.score > 60) {
        try {
          const certRes = await getMyCertificates();
          setCertificates(certRes.data.certificates || []);
        } catch {
          // User eligible but no certificates yet — that's fine
          setCertificates([]);
        }
      }
    } catch (err) {
      toast.error("Failed to fetch score");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      // Get user's first enrolled community from localStorage or use default
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await generateCertificate(
        user.communityId || "000000000000000000000000",
        "Community Projects"
      );
      toast.success("Certificate generated successfully!");
      setCertificates([res.data.certificate]);
    } catch (err) {
      if (err.response?.status === 409) {
        // Already exists — refresh list
        toast.info("Certificate already exists");
        fetchData();
      } else {
        toast.error(err.response?.data?.message || "Failed to generate certificate");
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-3 border-white/10 border-t-cyan-500 rounded-full"
        />
      </div>
    );
  }

  if (score === null) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-neutral-400">Unable to load score data.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 px-4"
      >
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
          My Certificate
        </h1>
        <p className="text-sm text-neutral-500">
          Complete community projects and earn your certificate
        </p>
      </motion.div>

      {score > 60 ? (
        <CertificateUnlocked
          certificates={certificates}
          onGenerate={handleGenerate}
          generating={generating}
        />
      ) : (
        <CertificateLocked score={score} />
      )}
    </div>
  );
};

export default CertificateGate;
