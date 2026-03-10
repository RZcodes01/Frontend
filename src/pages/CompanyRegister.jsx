import React, { useState } from "react";
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";

const CompanyRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [companyData, setCompanyData] = useState({
    company_name: "",
    company_id: "",
    email: "",
    website: "",
    industry_type: "",
    description: "",
    password: ""
  });

  const handleCompanyChange = (e) =>
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });

  // ---------------- COMPANY REGISTER ----------------
  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerUser({
        ...companyData,
        role: "company"
      });

      toast.success(res.data.message);
      navigate("/login");

    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-10 px-4"
      style={{
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(59, 130, 246, 0.12) 0%, transparent 55%),
          radial-gradient(ellipse at 60% 85%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #f1f5ff 0%, #eef2ff 40%, #f5f3ff 100%)
        `
      }}
    >
      {/* Decorative floating blobs */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "-80px",
          left: "-80px",
          width: "340px",
          height: "340px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          bottom: "-60px",
          right: "-60px",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          filter: "blur(35px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "50%",
          right: "5%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <div className="w-full max-w-[550px] bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-slate-100" style={{ position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Company Registration</h2>
          <p className="text-slate-500 text-sm mt-1">Register your company on SkillConnect</p>
        </div>

        {/* COMPANY FORM */}
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

export default CompanyRegister;