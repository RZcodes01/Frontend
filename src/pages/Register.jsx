import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [activeForm, setActiveForm] = useState("student");
  const navigate = useNavigate()

  // Student Form State
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  // Mentor Form State
  const [mentorData, setMentorData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    resume: null,
    experience_year: "",
    expertise: "",
    bio: "",
  });

  const handleStudentChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleMentorChange = (e) => {
    setMentorData({ ...mentorData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setMentorData({ ...mentorData, resume: e.target.files[0] });
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      {/* Toggle Buttons */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-center gap-4">
        <button
          onClick={() => setActiveForm("student")}
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${activeForm === "student"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
        >
          Student Registration
        </button>

        <button
          onClick={() => setActiveForm("mentor")}
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${activeForm === "mentor"
              ? "bg-purple-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
        >
          Mentor Registration
        </button>
      </div>

      {/* STUDENT FORM */}
      {activeForm === "student" && (
        <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
            SkillConnect
          </h2>

          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={studentData.name}
                onChange={handleStudentChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={studentData.email}
                onChange={handleStudentChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={studentData.password}
                onChange={handleStudentChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={studentData.phone}
                onChange={handleStudentChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Register
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-4">
            Already have an account?{" "}
            <span onClick={()=> navigate("/login")} className="text-indigo-600 font-medium cursor-pointer hover:underline">
              Login
            </span>
          </p>
        </div>
      )}

      {/* MENTOR FORM */}
      {activeForm === "mentor" && (
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-purple-600 mb-2">
            Mentor Registration
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Join our community of expert mentors
          </p>

          <form onSubmit={handleMentorSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={mentorData.name}
                onChange={handleMentorChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={mentorData.email}
                  onChange={handleMentorChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 123-4567"
                  value={mentorData.phone}
                  onChange={handleMentorChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={mentorData.password}
                onChange={handleMentorChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="experience_year"
                  placeholder="e.g., 5"
                  min="0"
                  value={mentorData.experience_year}
                  onChange={handleMentorChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Expertise <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="expertise"
                  placeholder="e.g., Web Development, AI"
                  value={mentorData.expertise}
                  onChange={handleMentorChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Resume <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bio"
                placeholder="Tell us about yourself, your background, and what you can offer as a mentor..."
                value={mentorData.bio}
                onChange={handleMentorChange}
                required
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 50 characters</p>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold shadow-md hover:shadow-lg"
            >
              Register as Mentor
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <button onClick={()=> navigate("/login")} className="text-purple-600 font-medium cursor-pointer hover:underline">
              Login
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

export default Register