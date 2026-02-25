import React, { useState } from "react";
import { Trash2, Briefcase, Star, Users } from "lucide-react";
import Leaderboard from "./Leaderboard";

const CompanyDashboardPage = () => {
  const [savedCandidates, setSavedCandidates] = useState([]);

  const handleView = (project) => {
    console.log("Viewing project:", project);
  };

  const handleAddToDashboard = (project) => {
    // Prevent duplicates
    setSavedCandidates((prev) => {
      if (prev.find((p) => p.id === project.id)) return prev;
      return [...prev, project];
    });
  };

  const handleRemove = (id) => {
    setSavedCandidates((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-blue-50">
      
      {/* Header */}
      <div className="bg-blue-900 text-blue-50 px-8 py-6 shadow-md">
        <h1 className="text-3xl font-black">Company Dashboard</h1>
        <p className="text-blue-300 mt-1 font-medium">
          Saved candidates from leaderboard
        </p>
      </div>

      {/* Leaderboard Section */}
      <Leaderboard
        onViewProject={handleView}
        onAddToDashboard={handleAddToDashboard}
      />

      {/* Saved Candidates Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-black text-blue-900 mb-6 flex items-center gap-2">
          <Users size={22} />
          Saved Candidates ({savedCandidates.length})
        </h2>

        {savedCandidates.length === 0 ? (
          <div className="bg-white border border-blue-200 rounded-2xl p-8 text-center shadow-sm">
            <Briefcase size={40} className="mx-auto text-blue-400 mb-3" />
            <p className="text-blue-700 font-bold text-lg">
              No candidates saved yet
            </p>
            <p className="text-blue-500 mt-1">
              Click the + button in leaderboard to add candidates
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {savedCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white border border-blue-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-blue-900">
                      {candidate.student}
                    </h3>
                    <p className="text-blue-600 font-semibold mt-1">
                      {candidate.title}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemove(candidate.id)}
                    className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {candidate.stack.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Score & Reviews */}
                <div className="flex justify-between mt-5 text-sm font-semibold text-blue-700">
                  <div className="flex items-center gap-1">
                    <Star size={16} />
                    {candidate.score} pts
                  </div>
                  <div>{candidate.reviews} Reviews</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboardPage;