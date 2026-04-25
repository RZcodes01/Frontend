import React, { useState } from "react";
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";
import { registerUser, applyForCompany } from "../api/auth.api";

const CompanyRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const [companyData, setCompanyData] = useState({
    // Account fields (only used when not logged in)
    name: "",
    email: "",
    password: "",
    phone: "",
    // Company-specific fields
    company_name: "",
    company_website: "",
    company_industry: "",
    company_description: "",
  });

  const handleCompanyChange = (e) =>
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn && companyData.password.length < 8) {
      return toast.error("Password must be at least 8 characters long");
    }
    setLoading(true);

    try {
      if (isLoggedIn) {
        // Already logged in → just apply for company role
        const res = await applyForCompany({
          company_name: companyData.company_name,
          company_website: companyData.company_website,
          company_industry: companyData.company_industry,
          company_description: companyData.company_description,
        });
        toast.success(res.data.message || "Application submitted! Your request is under review.");
      } else {
        // Not logged in → register new account with company application
        const res = await registerUser({
          name: companyData.name,
          email: companyData.email,
          password: companyData.password,
          phone: companyData.phone,
          registrationType: "company",
          company_name: companyData.company_name,
          company_website: companyData.company_website,
          company_industry: companyData.company_industry,
          company_description: companyData.company_description,
        });
        toast.success(res.data.message || "OTP sent to your email");
        navigate("/verify-otp", { state: { email: companyData.email } });
      }
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
          <p className="text-slate-500 text-sm mt-1">
            {isLoggedIn
              ? "Submit your company application for admin review."
              : "Create your account & register your company. Admin will review and approve."}
          </p>
        </div>

        {/* COMPANY FORM */}
        <form onSubmit={handleCompanySubmit} className="space-y-5">

          {/* Account fields — only shown when NOT logged in */}
          {!isLoggedIn && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Your Full Name"
                value={companyData.name}
                onChange={handleCompanyChange}
                required
                className="w-full px-4 py-3 border rounded-xl"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={companyData.email}
                onChange={handleCompanyChange}
                required
                className="w-full px-4 py-3 border rounded-xl"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={companyData.phone}
                onChange={handleCompanyChange}
                required
                className="w-full px-4 py-3 border rounded-xl"
              />

              <input
                type="password"
                name="password"
                placeholder="Create a Password (min 8 characters)"
                value={companyData.password}
                onChange={handleCompanyChange}
                required
                minLength={8}
                className="w-full px-4 py-3 border rounded-xl"
              />

              <hr className="border-slate-100 my-1" />
            </>
          )}

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
            type="url"
            name="company_website"
            placeholder="Website (https://...)"
            value={companyData.company_website}
            onChange={handleCompanyChange}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <select
            name="company_industry"
            value={companyData.company_industry}
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
            name="company_description"
            placeholder="Company Description"
            value={companyData.company_description}
            onChange={handleCompanyChange}
            required
            rows={3}
            className="w-full px-4 py-3 border rounded-xl resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            {loading ? "Submitting..." : (isLoggedIn ? "Submit Company Application" : "Register & Apply")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 font-bold text-sm"
          >
            Already have an account? Login
          </button>
        </div>

      </div>
    </div>
  );
};

export default CompanyRegister;