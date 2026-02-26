import React from 'react';
import { Link } from 'react-router-dom';

const TrendingCommunities = () => {
  const communities = [
    { id: 1, name: "Frontend Mastery", members: "1.2k", topic: "React & Tailwind" },
    { id: 2, name: "Python Pioneers", members: "2.1k", topic: "AI & Backend" },
    { id: 3, name: "UI/UX Collective", members: "850", topic: "Figma & Design" },
  ];

  return (
    <section className="bg-blue-50 text-blue-900 py-24 border-b border-blue-100">
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
              className="group bg-blue-900 border border-blue-800 p-10 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="inline-flex items-center bg-amber-400/20 border border-amber-400/40 text-amber-600 rounded-full mb-6 px-4 py-1.5 text-sm font-semibold tracking-wide">
                {item.name}
              </div>

              <h3 className="text-2xl font-bold mb-3 text-blue-50">
                {item.name}
              </h3>

              <p className="text-blue-200 text-base font-medium mb-8">
                {item.topic}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-blue-700">
                <span className="text-blue-300 text-base font-medium">
                  {item.members} members
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrendingCommunities;