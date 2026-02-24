// src/pages/StudentRegister.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";

const StudentRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        alert(res.data.message);
        navigate("/login");
      }, 1500);

    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-10 px-4">

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Registration Successful!</h3>
            <p className="text-sm text-gray-500">Your student account has been created.</p>
          </div>
        </div>
      )}

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