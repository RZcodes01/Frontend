import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import bgImage from "../assets/register_bg.png"; 

const Register = () => {
  const [activeForm, setActiveForm] = useState("student");
  const navigate = useNavigate()

  // --- Logic & State (Unchanged) ---
  const [studentData, setStudentData] = useState({ name: "", email: "", password: "", phone: "" });
  const [mentorData, setMentorData] = useState({
    name: "", email: "", password: "", phone: "", resume: null, experience_year: "", expertise: "", bio: "",
  });

  const handleStudentChange = (e) => setStudentData({ ...studentData, [e.target.name]: e.target.value });
  const handleMentorChange = (e) => setMentorData({ ...mentorData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setMentorData({ ...mentorData, resume: e.target.files[0] });

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    console.log("Student Data:", studentData);
    alert("Student Registration Successful!");
  };

  const handleMentorSubmit = (e) => {
    e.preventDefault();
    console.log("Mentor Data:", mentorData);
    alert("Mentor Registration Successful!");
  };

  return (
    <div 
      className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-10 px-4 bg-cover bg-center"
      
    >
      {/* Skillconnect Branding */}
      <div className="flex items-center gap-2 mb-8 bg-white/80 backdrop-blur px-6 py-2 rounded-full shadow-sm">
        <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
        <h1 className="text-xl font-bold text-blue-600 tracking-tight">Skillconnect</h1>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[550px] bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-slate-100">
        
        {/* Toggle Headers */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl mb-8">
          <button
            onClick={() => setActiveForm("student")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeForm === "student" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setActiveForm("mentor")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeForm === "mentor" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Mentor
          </button>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
          {activeForm === "student" ? "Join as a Student" : "Apply as a Mentor"}
        </h2>
        <p className="text-slate-500 text-center mb-8 text-sm">
          {activeForm === "student" ? "Start your learning journey today" : "Share your expertise with the world"}
        </p>

        {/* --- STUDENT FORM --- */}
        {activeForm === "student" && (
          <form onSubmit={handleStudentSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
              <input
                type="text" name="name" placeholder="John Doe"
                value={studentData.name} onChange={handleStudentChange} required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <input
                type="email" name="email" placeholder="john@example.com"
                value={studentData.email} onChange={handleStudentChange} required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Phone</label>
                <input
                  type="tel" name="phone" placeholder="+1..."
                  value={studentData.phone} onChange={handleStudentChange} required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                <input
                  type="password" name="password" placeholder="••••••••"
                  value={studentData.password} onChange={handleStudentChange} required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4">
              Create Student Account
            </button>
          </form>
        )}

        {/* --- MENTOR FORM --- */}
{activeForm === "mentor" && (
  <form onSubmit={handleMentorSubmit} className="space-y-5">
    <div className="space-y-1">
      <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
      <input
        type="text" name="name" placeholder="Dr. Sarah Smith"
        value={mentorData.name} onChange={handleMentorChange} required
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
      />
    </div>

    <div className="space-y-1">
      <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
      <input
        type="email" name="email" placeholder="sarah@mentor.com"
        value={mentorData.email} onChange={handleMentorChange} required
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
      />
    </div>

    {/* Phone and Password Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700 ml-1">Phone</label>
        <input
          type="tel" name="phone" placeholder="+1..."
          value={mentorData.phone} onChange={handleMentorChange} required
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
        <input
          type="password" name="password" placeholder="••••••••"
          value={mentorData.password} onChange={handleMentorChange} required
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700 ml-1">Experience (Yrs)</label>
        <input
          type="number" name="experience_year" placeholder="5"
          value={mentorData.experience_year} onChange={handleMentorChange} required
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700 ml-1">Expertise</label>
        <input
          type="text" name="expertise" placeholder="UI/UX, Python"
          value={mentorData.expertise} onChange={handleMentorChange} required
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
        />
      </div>
    </div>

    <div className="space-y-1">
      <label className="text-sm font-semibold text-slate-700 ml-1">Resume (PDF/DOC)</label>
      <input
        type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} required
        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-dashed border-slate-300 p-2 rounded-xl"
      />
    </div>

    <div className="space-y-1">
      <label className="text-sm font-semibold text-slate-700 ml-1">Short Bio</label>
      <textarea
        name="bio" rows="3" placeholder="Tell us about your teaching style..."
        value={mentorData.bio} onChange={handleMentorChange} required
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all resize-none"
      />
    </div>

    <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
      Apply as Mentor
    </button>
  </form>
)}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-blue-600 font-bold hover:underline underline-offset-4">
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register