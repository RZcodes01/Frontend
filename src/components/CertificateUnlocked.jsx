import React from "react";
import { motion } from "framer-motion";
import { Award, Download, Eye, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CertificateUnlocked = ({ certificates, onGenerate, generating }) => {
  const navigate = useNavigate();
  const hasCertificates = certificates && certificates.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="flex items-center justify-center min-h-[70vh] px-4"
    >
      <div className="relative w-full max-w-lg">
        {/* Glassmorphism Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-10 shadow-2xl">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-blue-500/15 to-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Celebration Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              className="mb-6 relative"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Award size={36} className="text-white" />
              </div>
              {/* Sparkle */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles size={18} className="text-amber-400" />
              </motion.div>
            </motion.div>

            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
              🎉 Certificate Unlocked!
            </h2>
            <p className="text-sm text-neutral-400 mb-8 max-w-xs leading-relaxed">
              Congratulations! You've earned the right to claim your certificate.
            </p>

            {hasCertificates ? (
              <div className="w-full space-y-3">
                {certificates.map((cert) => (
                  <div
                    key={cert._id}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-5 py-4 flex items-center justify-between"
                  >
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">{cert.courseName}</p>
                      <p className="text-xs text-neutral-500">
                        Issued {new Date(cert.issuedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/certificate/${cert._id}`)}
                        className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                        title="View Certificate"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onGenerate}
                disabled={generating}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Award size={18} />
                    Generate My Certificate
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CertificateUnlocked;
