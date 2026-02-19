import React from 'react';
import { Link } from 'react-router-dom';

const TrendingCommunities = () => {
  const communities = [
    { id: 1, name: "Frontend Mastery", members: "1.2k", topic: "React & Tailwind" },
    { id: 2, name: "Python Pioneers", members: "2.1k", topic: "AI & Backend" },
    { id: 3, name: "UI/UX Collective", members: "850", topic: "Figma & Design" },
  ];

  return (
    <section className="bg-[#0a0a0c] text-white py-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              Trending <span className="text-cyan-400">Communities</span>
            </h2>
            <p className="text-gray-400 mt-2">Join fast-growing groups and learn with peers.</p>
          </div>
          <Link to="/community" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors flex items-center gap-2">
            View all communities <span>&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {communities.map((item) => (
            <div 
              key={item.id} 
              className="group bg-[#111114] border border-gray-800 p-8 rounded-2xl hover:border-cyan-500/50 transition-all duration-300 shadow-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg mb-6 flex items-center justify-center font-bold text-xl">
                {item.name.charAt(0)}
              </div>
              <h3 className="text-2xl font-bold mb-1 group-hover:text-cyan-400 transition-colors">
                {item.name}
              </h3>
              <p className="text-cyan-500 text-sm font-medium mb-4">{item.topic}</p>
              
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
                <span className="text-gray-400 text-sm">{item.members} members</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCommunities;