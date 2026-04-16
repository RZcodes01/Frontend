import React, { useState } from "react";
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";
import { registerUser, applyForMentor } from "../api/auth.api";

const MentorRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isLoggedIn = !!localStorage.getItem("accessToken");

  // Full registration form (when not logged in)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    expertise: "",
    experience_years: "",
    resume: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLoggedIn) {
        // Already logged in → just apply for mentor role
        const res = await applyForMentor({
          expertise: form.expertise.split(",").map((e) => e.trim()),
          experience_years: Number(form.experience_years),
          resume: form.resume
        });
        toast.success(res.data.message || "Application submitted! Your request is under review.");
      } else {
        // Not logged in → register new account with mentor application
        const res = await registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          registrationType: "mentor",
          expertise: form.expertise.split(",").map((e) => e.trim()),
          experience_years: Number(form.experience_years),
          resume: form.resume
        });
        toast.success(res.data.message || "OTP sent to your email");
        navigate("/verify-otp", { state: { email: form.email } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Application failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: `
          radial-gradient(ellipse at 15% 30%, rgba(15, 23, 42, 0.08) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 70%, rgba(30, 41, 59, 0.1) 0%, transparent 55%),
          radial-gradient(ellipse at 50% 10%, rgba(71, 85, 105, 0.07) 0%, transparent 50%),
          linear-gradient(160deg, #f8fafc 0%, #f1f5f9 40%, #e9eef5 100%)
        `
      }}
    >
      {/* Decorative background blobs */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(15,23,42,0.08) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          bottom: "-80px",
          left: "-80px",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(51,65,85,0.1) 0%, transparent 70%)",
          filter: "blur(45px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "40%",
          left: "8%",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(100,116,139,0.08) 0%, transparent 70%)",
          filter: "blur(35px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow" style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <h2 className="text-2xl font-bold mb-2 text-slate-900">Apply As Mentor</h2>
        <p className="text-slate-500 text-sm mb-6">
          {isLoggedIn
            ? "Submit your mentor application for admin review."
            : "Create your account & submit your mentor application. Admin will review and approve."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Account fields — only shown when NOT logged in */}
          {!isLoggedIn && (
            <>
              <div>
                <label className="block font-semibold mb-1 text-slate-700">Full Name</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Email</label>
                <input
                  type="email"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Phone</label>
                <input
                  type="tel"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Password</label>
                <input
                  type="password"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>

              <hr className="border-slate-100 my-2" />
            </>
          )}

          <div>
            <label className="block font-semibold mb-1 text-slate-700">Expertise (comma separated)</label>
            <input
              type="text"
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none"
              placeholder="React, Node.js, System Design"
              value={form.expertise}
              onChange={(e) => setForm({ ...form, expertise: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700">Years of Experience</label>
            <input
              type="number"
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none"
              value={form.experience_years}
              onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-0.5 text-slate-700">Resume Link</label>
            <p className="text-xs text-slate-500 mb-1.5">Provide a public link to your portfolio or resume (Google Drive, Dropbox, or PDF URL).</p>
            <input
              type="text"
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none"
              placeholder="https://drive.google.com/..."
              value={form.resume}
              onChange={(e) => setForm({ ...form, resume: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 mt-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : (isLoggedIn ? "Submit Application" : "Register & Apply")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-slate-600 font-bold text-sm"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorRegister;