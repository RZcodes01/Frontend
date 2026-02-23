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
    <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow">
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
  );
};

export default MentorRegister;