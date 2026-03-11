import React from 'react';
import { Link } from 'react-router-dom';

const TrendingCommunities = () => {
  const communities = [
    { id: 1, name: "React", members: "30",  },
    { id: 2, name: "AI", members: "28",  },
    { id: 3, name: "Cyber Security", members: "30", },
  ];

  return (
    <section className="bg-blue-50 text-blue-900 py-24 border-b border-blue-100">
      <style>{`
        @keyframes card-shine {
          0% { left: -75%; }
          100% { left: 125%; }
        }
        @keyframes member-count-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.0); }
          50%       { box-shadow: 0 0 0 4px rgba(251,191,36,0.25); }
        }

        .community-card {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .community-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255,255,255,0.06) 50%,
            transparent 100%
          );
          transform: skewX(-15deg);
          transition: none;
          pointer-events: none;
          z-index: 1;
        }
        .community-card:hover::before {
          animation: card-shine 0.65s ease forwards;
        }
        .community-card:hover {
          transform: translateY(-6px) scale(1.015);
          box-shadow: 0 24px 48px rgba(30,58,95,0.45), 0 0 0 2px rgba(251,191,36,0.35);
          border-color: rgba(251,191,36,0.5) !important;
          animation: pulse-border 2s ease-in-out infinite;
        }
        .community-card:hover .card-topic {
          color: #fde68a !important;
        }
        .community-card:hover .card-badge {
          background: rgba(251,191,36,0.3) !important;
          border-color: rgba(251,191,36,0.6) !important;
          color: #fbbf24 !important;
        }
        .community-card:hover .card-join-btn {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .community-card:hover .card-members {
          color: #93c5fd !important;
        }
        .card-join-btn {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .community-card:active {
          transform: translateY(-3px) scale(1.008);
        }
      `}</style>
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-blue-900">
              Trending Communities
            </h2>
            <p className="text-blue-700 text-lg mt-3 max-w-md">
              Learn alongside motivated peers and grow together in focused skill groups.
            </p>
          </div>

          <Link 
            to="/community" 
            className="text-blue-900 font-semibold hover:text-blue-700 transition-colors flex items-center gap-2"
          >
            View all communities <span>&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {communities.map((item) => (
            <div 
              key={item.id} 
              className="community-card group bg-blue-900 border border-blue-800 p-10 rounded-2xl shadow-md"
            >
            

              <h3 className="text-2xl font-bold mb-3 text-blue-50">
                {item.name}
              </h3>

              <p className="card-topic text-blue-200 text-base font-medium mb-8" style={{ transition: "color 0.25s ease" }}>
                {item.members} active members
              </p>
              
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrendingCommunities;