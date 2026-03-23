import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { verifyCertificate } from "../api/certificate.api";
import { ShieldCheck, ShieldX, Award, Calendar, User, BookOpen } from "lucide-react";

const CertificateVerify = () => {
  const { certId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    verify();
  }, [certId]);

  const verify = async () => {
    try {
      setLoading(true);
      const res = await verifyCertificate(certId);
      setData(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {error || !data?.valid ? (
          /* Invalid Certificate */
          <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-red-500/5 backdrop-blur-2xl p-10 shadow-2xl text-center">
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="mb-6 flex justify-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                <ShieldX size={36} className="text-white" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-black text-white mb-2">
              Invalid Certificate
            </h2>
            <p className="text-sm text-neutral-400">
              This certificate ID could not be verified. It may be invalid or has been revoked.
            </p>
            <div className="mt-6 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-neutral-500 font-mono break-all">
                ID: {certId}
              </p>
            </div>
          </div>
        ) : (
          /* Valid Certificate */
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-2xl p-10 shadow-2xl text-center">
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="mb-6 flex justify-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <ShieldCheck size={36} className="text-white" />
              </div>
            </motion.div>

            <h2 className="text-2xl font-black text-white mb-1">
              ✅ Certificate Verified
            </h2>
            <p className="text-sm text-neutral-400 mb-8">
              This certificate is authentic and valid
            </p>

            {/* Details */}
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-white/5">
                <User size={18} className="text-cyan-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                    Recipient
                  </p>
                  <p className="text-sm font-bold text-white">{data.user}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-white/5">
                <BookOpen size={18} className="text-cyan-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                    Course
                  </p>
                  <p className="text-sm font-bold text-white">{data.course}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-white/5">
                <Award size={18} className="text-cyan-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                    Community
                  </p>
                  <p className="text-sm font-bold text-white">{data.community}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-white/5">
                <Calendar size={18} className="text-cyan-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                    Issued On
                  </p>
                  <p className="text-sm font-bold text-white">
                    {new Date(data.issuedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="mt-6 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold mb-1">
                Certificate ID
              </p>
              <p className="text-xs text-neutral-300 font-mono break-all">
                {data.certificateId}
              </p>
            </div>
          </div>
        )}

        {/* Branding */}
        <p className="text-center text-[11px] text-neutral-600 mt-6">
          Verified by <span className="font-bold text-neutral-400">SkillConnect</span>
        </p>
      </motion.div>
    </div>
  );
};

export default CertificateVerify;
