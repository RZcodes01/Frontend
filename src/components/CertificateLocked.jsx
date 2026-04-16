import React from "react";
import { motion } from "framer-motion";
import { Lock, TrendingUp } from "lucide-react";

const CertificateLocked = ({ score, communityName }) => {
  const maxScore = 60;
  const progress = Math.min((score / maxScore) * 100, 100);
  const remaining = Math.max(maxScore - score, 0);

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
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-purple-500/15 to-pink-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Lock Icon */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 0] }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              className="mb-6"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                <Lock size={36} className="text-white" />
              </div>
            </motion.div>

            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
              Certificate Locked
            </h2>

            {/* Community Name */}
            {communityName && (
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">
                {communityName}
              </p>
            )}

            <p className="text-sm text-neutral-400 mb-8 max-w-xs leading-relaxed">
              Score at least <span className="text-white font-bold">60 points</span>{" "}
              from project submissions to unlock your certificate
            </p>

            {/* Score Display */}
            <div className="w-full mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-400" />
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Your Score
                  </span>
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {score}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-full" />
                </motion.div>
              </div>

              <div className="flex justify-between mt-2">
                <span className="text-[11px] text-neutral-500">0</span>
                <span className="text-[11px] text-neutral-500">60 required</span>
              </div>
            </div>

            {/* Remaining Points */}
            <div className="w-full rounded-xl bg-white/5 border border-white/5 px-5 py-4">
              <p className="text-sm text-neutral-300">
                You need{" "}
                <span className="text-lg font-black text-amber-400">
                  {remaining}
                </span>{" "}
                more {remaining === 1 ? "point" : "points"} to unlock
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CertificateLocked;
