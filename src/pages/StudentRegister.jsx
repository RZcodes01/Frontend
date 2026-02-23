// src/pages/StudentRegister.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";

const StudentRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const handleStudentChange = (e) =>
    setStudentData({ ...studentData, [e.target.name]: e.target.value });

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-10 px-4">

      <div className="w-full max-w-[550px] bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-slate-100">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Student Registration</h2>
          <p className="text-slate-500 text-sm mt-1">Create your student account to get started</p>
        </div>

        {/* STUDENT FORM */}
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

export default StudentRegister;