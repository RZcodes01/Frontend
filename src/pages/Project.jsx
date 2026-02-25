import React, { useState } from "react";
import {
  ArrowLeft,
  Eye,
  Trophy,
  Users,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Project = () => {
  const navigate = useNavigate();

  const communities = [
    {
      id: 1,
      name: "Full Stack Development",
      projects: [
        { studentName: "Aarav Sharma", projectName: "E-Commerce MERN Platform", points: 100 },
        { studentName: "Diya Patel", projectName: "Job Portal with Admin Dashboard", points: 95 },
        { studentName: "Rohan Verma", projectName: "Online Learning Management System", points: 92 },
        { studentName: "Meera Iyer", projectName: "Hospital Management Web App", points: 88 },
        { studentName: "Kabir Singh", projectName: "Real Estate Listing Platform", points: 85 },
        { studentName: "Ananya Reddy", projectName: "Event Booking System", points: 82 },
        { studentName: "Vihaan Nair", projectName: "Food Delivery Web App", points: 80 },
        { studentName: "Sneha Kulkarni", projectName: "Crowdfunding Platform", points: 78 },
        { studentName: "Arjun Mehta", projectName: "Portfolio Builder SaaS", points: 75 },
        { studentName: "Ishita Das", projectName: "Inventory Management System", points: 72 },
      ],
    },
    {
      id: 2,
      name: "UI/UX Design",
      projects: [
        { studentName: "Priya Menon", projectName: "Banking App Redesign", points: 97 },
        { studentName: "Yash Gupta", projectName: "Travel App UX Case Study", points: 93 },
        { studentName: "Tanvi Rao", projectName: "E-Learning App UI Kit", points: 90 },
        { studentName: "Rahul Joshi", projectName: "Fitness Tracking App Design", points: 86 },
        { studentName: "Neha Kapoor", projectName: "Healthcare App Interface", points: 83 },
        { studentName: "Kunal Shah", projectName: "Food Ordering UX Prototype", points: 80 },
        { studentName: "Aditi Deshmukh", projectName: "Crypto Wallet App UI", points: 77 },
        { studentName: "Siddharth Jain", projectName: "Finance Dashboard Design", points: 75 },
        { studentName: "Pooja Nair", projectName: "Social Media App Redesign", points: 72 },
        { studentName: "Manav Bansal", projectName: "OTT Platform UI Concept", points: 70 },
      ],
    },
    {
      id: 3,
      name: "Data Science",
      projects: [
        { studentName: "Aditya Kumar", projectName: "Stock Price Prediction Model", points: 99 },
        { studentName: "Shreya Bose", projectName: "Customer Churn Analysis", points: 94 },
        { studentName: "Ritika Singh", projectName: "Sentiment Analysis on Twitter Data", points: 91 },
        { studentName: "Harsh Agarwal", projectName: "Fraud Detection System", points: 88 },
        { studentName: "Nikhil Soni", projectName: "Movie Recommendation Engine", points: 85 },
        { studentName: "Simran Kaur", projectName: "Sales Forecasting Model", points: 82 },
        { studentName: "Om Prakash", projectName: "Resume Screening using NLP", points: 79 },
        { studentName: "Krishna Yadav", projectName: "Image Classification using CNN", points: 76 },
        { studentName: "Divya Mishra", projectName: "Credit Risk Prediction", points: 73 },
        { studentName: "Tushar Malhotra", projectName: "Traffic Flow Prediction System", points: 70 },
      ],
    },
  ];

  const defaultCommunity = communities[0];

  const [selectedCommunity, setSelectedCommunity] = useState(defaultCommunity.name);
  const [projectData, setProjectData] = useState(
    [...defaultCommunity.projects].sort((a, b) => b.points - a.points)
  );

  const handleCommunityChange = (communityName) => {
    const found = communities.find((c) => c.name === communityName);
    if (found) {
      setSelectedCommunity(communityName);
      setProjectData([...found.projects].sort((a, b) => b.points - a.points));
    }
  };

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto py-8 sm:py-12">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-700 hover:text-amber-500 font-bold mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl sm:text-5xl font-black text-blue-950 mb-6">
          Project Leaderboard
        </h1>

        {/* Responsive Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow border flex items-center gap-3">
            <Users className="text-amber-500" />
            <div>
              <p className="text-sm text-blue-600">Total Students</p>
              <p className="text-2xl font-bold">{projectData.length}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border flex items-center gap-3">
            <Star className="text-amber-500" />
            <div>
              <p className="text-sm text-blue-600">Top Score</p>
              <p className="text-2xl font-bold">
                {Math.max(...projectData.map((p) => p.points))}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border flex items-center gap-3">
            <Trophy className="text-amber-500" />
            <div>
              <p className="text-sm text-blue-600">Active Community</p>
              <p className="font-semibold">{selectedCommunity}</p>
            </div>
          </div>
        </div>

        {/* Dropdown */}
        <div className="mb-6">
          <select
            value={selectedCommunity}
            onChange={(e) => handleCommunityChange(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 rounded-lg border border-blue-300"
          >
            {communities.map((community) => (
              <option key={community.id} value={community.name}>
                {community.name}
              </option>
            ))}
          </select>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow border">
          <table className="min-w-full text-sm sm:text-base">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Project</th>
                <th className="px-4 py-3 text-left">Points</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {projectData.map((item, index) => (
                <tr onClick={()=> navigate("/project-view")} key={index} className="border-b hover:bg-blue-50">
                  <td className="px-4 py-3 font-bold text-amber-500">
                    {getMedal(index)}
                  </td>
                  <td className="px-4 py-3 font-semibold">{item.studentName}</td>
                  <td className="px-4 py-3">{item.projectName}</td>
                  <td className="px-4 py-3 font-bold">{item.points}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="bg-amber-400 hover:bg-amber-300 px-3 py-1 rounded-md flex items-center gap-1 mx-auto">
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Project;