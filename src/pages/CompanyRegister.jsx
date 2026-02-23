import React, { useState } from "react";
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