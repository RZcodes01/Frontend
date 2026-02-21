// src/pages/MentorRegister.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";
const MentorRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mentorData, setMentorData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    experience_year: "",
    expertise: "",
    bio: ""
  });
  const handleMentorChange = (e) =>
    setMentorData({ ...mentorData, [e.target.name]: e.target.value });
  // ---------------- MENTOR REGISTER ----------------
  const handleMentorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerUser({
        name: mentorData.name,
        email: mentorData.email,
        password: mentorData.password,
        phone: mentorData.phone,
        experience_year: mentorData.experience_year,
        expertise: mentorData.expertise,
        bio: mentorData.bio,
        role: "mentor"
      });
      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-[550px] bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-slate-100">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Mentor Registration</h2>
          <p className="text-slate-500 text-sm mt-1">Apply to become a mentor on SkillConnect</p>
        </div>
        {/* MENTOR FORM */}
        <form onSubmit={handleMentorSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={mentorData.name}
            onChange={handleMentorChange}
            required
            className="w-full px-4 py-3 border rounded-xl"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={mentorData.email}
            onChange={handleMentorChange}
            required
            className="w-full px-4 py-3 border rounded-xl"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={mentorData.phone}
            onChange={handleMentorChange}
            required
            className="w-full px-4 py-3 border rounded-xl"
          />
          <input
            type="number"
            name="experience_year"
            placeholder="Years of Experience"
            value={mentorData.experience_year}
            onChange={handleMentorChange}
            required
            min="0"
            className="w-full px-4 py-3 border rounded-xl"
          />
          <input
            type="text"
            name="expertise"
            placeholder="Expertise (e.g. React, Python, UI/UX)"
            value={mentorData.expertise}
            onChange={handleMentorChange}
            required
            className="w-full px-4 py-3 border rounded-xl"
          />
          <textarea
            name="bio"
            placeholder="Short Bio"
            value={mentorData.bio}
            onChange={handleMentorChange}
            required
            rows={3}
            className="w-full px-4 py-3 border rounded-xl resize-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={mentorData.password}
            onChange={handleMentorChange}
            required
            className="w-full px-4 py-3 border rounded-xl"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold"
          >
            {loading ? "Processing..." : "Apply as Mentor"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 font-bold"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};
export default MentorRegister;