import React, { useState } from "react";
import axios from "axios";

const MentorRegister = () => {
  const [form, setForm] = useState({
    expertise: "",
    experience_years: "",
    resume: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/mentors/apply",
        {
          expertise: form.expertise.split(",").map(e => e.trim()),
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
        <h2 className="text-2xl font-bold mb-6">Apply As Mentor</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block font-semibold mb-1">Expertise (comma separated)</label>
            <input
              type="text"
              className="w-full border p-3 rounded-xl"
              value={form.expertise}
              onChange={(e) => setForm({ ...form, expertise: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Years of Experience</label>
            <input
              type="number"
              className="w-full border p-3 rounded-xl"
              value={form.experience_years}
              onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Resume Link (Drive / PDF)</label>
            <input
              type="text"
              className="w-full border p-3 rounded-xl"
              value={form.resume}
              onChange={(e) => setForm({ ...form, resume: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default MentorRegister;