import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getScore, getMyCertificates, generateCertificate } from "../api/certificate.api";
import { fetchMyEnrollments } from "../api/enrollment.api";
import { fetchCommunityById } from "../api/community.api";
import CertificateLocked from "../components/CertificateLocked";
import CertificateUnlocked from "../components/CertificateUnlocked";
import { toast } from "sonner";
import { Award, ChevronRight, Users, Loader2 } from "lucide-react";

const CertificateGate = () => {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [generating, setGenerating] = useState(false);

  // Fetch enrolled communities on mount
  useEffect(() => {
    fetchEnrolledCommunities();
  }, []);

  const fetchEnrolledCommunities = async () => {
    try {
      setLoading(true);
      const enrollRes = await fetchMyEnrollments();
      const enrollments = enrollRes.data.enrollments || [];

      // Fetch community details for each enrollment
      const communityPromises = enrollments.map(async (enrollment) => {
        try {
          const communityId =
            typeof enrollment.communityId === "object"
              ? enrollment.communityId._id
              : enrollment.communityId;
          const res = await fetchCommunityById(communityId);
          return {
            _id: communityId,
            name: res.data.community?.name || "Unknown Community",
            bannerImage: res.data.community?.bannerImage || null,
          };
        } catch {
          return null;
        }
      });

      const resolved = (await Promise.all(communityPromises)).filter(Boolean);
      setCommunities(resolved);
    } catch (err) {
      toast.error("Failed to load your communities");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCommunity = async (community) => {
    setSelectedCommunity(community);
    setScoreLoading(true);
    setScore(null);
    setCertificates([]);

    try {
      // Fetch the community-specific score
      const scoreRes = await getScore(community._id);
      setScore(scoreRes.data.score);

      // If eligible, also fetch existing certificates
      if (scoreRes.data.score >= 60) {
        try {
          const certRes = await getMyCertificates();
          const allCerts = certRes.data.certificates || [];
          // Filter to this community
          const communityCerts = allCerts.filter((c) => {
            const certCommunityId =
              typeof c.communityId === "object"
                ? c.communityId._id
                : c.communityId;
            return certCommunityId === community._id;
          });
          setCertificates(communityCerts);
        } catch {
          setCertificates([]);
        }
      }
    } catch (err) {
      toast.error("Failed to fetch score for this community");
      setScore(0);
    } finally {
      setScoreLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedCommunity) return;
    try {
      setGenerating(true);
      const res = await generateCertificate(
        selectedCommunity._id,
        selectedCommunity.name
      );
      toast.success("Certificate generated successfully!");
      setCertificates([res.data.certificate]);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.info("Certificate already exists");
        handleSelectCommunity(selectedCommunity);
      } else if (err.response?.status === 403) {
        toast.error(
          err.response?.data?.message || "Not eligible for certificate"
        );
      } else {
        toast.error(
          err.response?.data?.message || "Failed to generate certificate"
        );
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleBack = () => {
    setSelectedCommunity(null);
    setScore(null);
    setCertificates([]);
  };

  // ─── Loading State ──────────────────────────────
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

  // ─── No Enrollments State ───────────────────────
  if (communities.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 py-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <Users size={36} className="text-neutral-600" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">
            No Communities Found
          </h2>
          <p className="text-sm text-neutral-500 text-center max-w-xs">
            Join a community and complete projects to earn certificates
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 px-4"
      >
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
          My Certificates
        </h1>
        <p className="text-sm text-neutral-500">
          {selectedCommunity
            ? `Checking eligibility for ${selectedCommunity.name}`
            : "Select a community to check your certificate eligibility"}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selectedCommunity ? (
          /* ─── Community Selection Grid ──────────────── */
          <motion.div
            key="community-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto px-4 space-y-3"
          >
            {communities.map((community, idx) => (
              <motion.button
                key={community._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                onClick={() => handleSelectCommunity(community)}
                className="w-full group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex items-center gap-4 text-left hover:border-cyan-500/30 hover:bg-white/[0.07] transition-all duration-300"
              >
                {/* Community Avatar */}
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-white/10">
                  {community.bannerImage ? (
                    <img
                      src={community.bannerImage}
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Award
                      size={24}
                      className="text-cyan-400 group-hover:text-cyan-300 transition-colors"
                    />
                  )}
                </div>

                {/* Community Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                    {community.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Tap to check your score & certificate eligibility
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight
                  size={20}
                  className="text-neutral-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0"
                />

                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.button>
            ))}
          </motion.div>
        ) : scoreLoading ? (
          /* ─── Score Loading ──────────────────────────── */
          <motion.div
            key="score-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[50vh] gap-4"
          >
            <Loader2 size={32} className="text-cyan-500 animate-spin" />
            <p className="text-sm text-neutral-400">
              Checking your score for{" "}
              <span className="text-white font-semibold">
                {selectedCommunity.name}
              </span>
              ...
            </p>
          </motion.div>
        ) : (
          /* ─── Score Result ───────────────────────────── */
          <motion.div
            key="score-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Back Button */}
            <div className="max-w-lg mx-auto px-4 mb-6">
              <button
                onClick={handleBack}
                className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
              >
                ← Back to communities
              </button>
            </div>

            {score !== null && score >= 60 ? (
              <CertificateUnlocked
                certificates={certificates}
                onGenerate={handleGenerate}
                generating={generating}
                communityName={selectedCommunity.name}
                score={score}
              />
            ) : (
              <CertificateLocked
                score={score || 0}
                communityName={selectedCommunity.name}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CertificateGate;
