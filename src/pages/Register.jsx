// src/pages/Register.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";

const Register = () => {
  const [activeForm, setActiveForm] = useState("student");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const [mentorData, setMentorData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    experience_year: "",
    expertise: "",
    bio: ""
  });

  const [companyData, setCompanyData] = useState({
    company_name: "",
    company_id: "",
    email: "",
    website: "",
    industry_type: "",
    description: "",
    password: ""
  });

  const handleStudentChange = (e) =>
    setStudentData({ ...studentData, [e.target.name]: e.target.value });

  const handleMentorChange = (e) =>
    setMentorData({ ...mentorData, [e.target.name]: e.target.value });

  const handleCompanyChange = (e) =>
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });

  // ---------------- STUDENT REGISTER ----------------
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerUser({
        ...studentData,
        role: "student"
      });

      alert(res.data.message);
      navigate("/login");

    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

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

  // ---------------- COMPANY REGISTER ----------------
  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerUser({
        ...companyData,
        role: "company"
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

        {/* Toggle */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl mb-8">
          <button
            onClick={() => setActiveForm("student")}
            className={`flex-1 py-2.5 rounded-lg font-bold ${activeForm === "student"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500"
              }`}
          >
            Student
          </button>

          <button
            onClick={() => setActiveForm("mentor")}
            className={`flex-1 py-2.5 rounded-lg font-bold ${activeForm === "mentor"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500"
              }`}
          >
            Mentor
          </button>

          <button
            onClick={() => setActiveForm("company")}
            className={`flex-1 py-2.5 rounded-lg font-bold ${activeForm === "company"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500"
              }`}
          >
            Company
          </button>
        </div>

        {/* STUDENT FORM */}
        {activeForm === "student" && (
          <form onSubmit={handleStudentSubmit} className="space-y-5">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={studentData.name}
              onChange={handleStudentChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={studentData.email}
              onChange={handleStudentChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={studentData.phone}
              onChange={handleStudentChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={studentData.password}
              onChange={handleStudentChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold"
            >
              {loading ? "Processing..." : "Create Student Account"}
            </button>
          </form>
        )}

        {/* MENTOR FORM */}
        {activeForm === "mentor" && (
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
        )}

        {/* COMPANY FORM */}
        {activeForm === "company" && (
          <form onSubmit={handleCompanySubmit} className="space-y-5">

            <input
              type="text"
              name="company_name"
              placeholder="Company Name"
              value={companyData.company_name}
              onChange={handleCompanyChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={companyData.email}
              onChange={handleCompanyChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            <input
              type="url"
              name="website"
              placeholder="Website (https://...)"
              value={companyData.website}
              onChange={handleCompanyChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            <select
              name="industry_type"
              value={companyData.industry_type}
              onChange={handleCompanyChange}
              required
              className="w-full px-4 py-3 border rounded-xl text-slate-500"
            >
              <option value="" disabled>Select Industry Type</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="ecommerce">E-Commerce</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="media">Media & Entertainment</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>

            <textarea
              name="description"
              placeholder="Company Description"
              value={companyData.description}
              onChange={handleCompanyChange}
              required
              rows={3}
              className="w-full px-4 py-3 border rounded-xl resize-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={companyData.password}
              onChange={handleCompanyChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold"
            >
              {loading ? "Processing..." : "Register Company"}
            </button>
          </form>
        )}

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

export default Register;