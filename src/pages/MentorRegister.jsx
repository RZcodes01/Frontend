import React, { useState } from "react";
import axios from "axios";

const MentorRegister = () => {
  const [form, setForm] = useState({
    expertise: "",
    experience_years: "",
    resume: "",
    resumeFile: null // State to handle the chosen file
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Logic remains unchanged: sending JSON data
      await axios.post(
        "http://localhost:5000/api/mentors/apply",
        {
          expertise: form.expertise.split(",").map((e) => e.trim()),
          experience_years: form.experience_years,
          resume: form.resume
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );

      alert("Application submitted successfully");
    } catch (err) {
      alert("Application failed");
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
        <h2 className="text-2xl font-bold mb-6 text-slate-900">Apply As Mentor</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

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
            <p className="text-xs text-slate-500 mb-1.5">Please provide a public link to your portfolio or resume (Google Drive, Dropbox, or PDF URL).</p>
            <input
              type="text"
              className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none"
              placeholder="https://drive.google.com/..."
              value={form.resume}
              onChange={(e) => setForm({ ...form, resume: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700">Or Upload File</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="w-full text-sm text-slate-500
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-xl file:border-0
                file:text-sm file:font-bold
                file:bg-slate-100 file:text-slate-700
                hover:file:bg-slate-200
                cursor-pointer border border-slate-100 rounded-xl p-1"
              onChange={(e) => setForm({ ...form, resumeFile: e.target.files[0] })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 mt-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default MentorRegister;