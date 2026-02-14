import React, { useState } from 'react'

export default function Community() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  // New State for Batch Selection
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  const communities = [
    {
      name: "Web Development",
      members: "12.5k",
      mentors: "2",
      projects: "890",
      icon: "💻",
      color: "from-emerald-400 via-teal-400 to-cyan-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-400/30",
      category: "development",
      trend: "+15%",
      // Added Batch Data
      batches: [
        { id: 1, name: "Alpha Batch", timing: "Mon-Wed (7 PM IST)", instructor: "John Doe", seats: "5 seats left" },
        { id: 2, name: "Weekend Warriors", timing: "Sat-Sun (10 AM IST)", instructor: "Jane Smith", seats: "Filling Fast" }
      ]
    },
    {
      name: "UI/UX Design",
      members: "8.3k",
      mentors: "2",
      projects: "654",
      icon: "🎨",
      color: "from-fuchsia-400 via-pink-400 to-rose-500",
      bgColor: "bg-fuchsia-500/10",
      borderColor: "border-fuchsia-400/30",
      category: "design",
      trend: "+22%",
      batches: [
        { id: 3, name: "Design Sprint", timing: "Tue-Thu (8 PM IST)", instructor: "Sarah Lee", seats: "2 seats left" }
      ]
    },
    // ... other communities (Data Science, AI/ML, etc. also need a 'batches' array)
    {
      name: "Mobile Dev",
      members: "9.1k",
      mentors: "2",
      projects: "567",
      icon: "📱",
      color: "from-amber-400 via-orange-400 to-red-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-400/30",
      category: "development",
      trend: "+12%",
      batches: [
        { id: 4, name: "Learn Flutter", timing: "Tue-Thu (8 PM IST)", instructor: "Kishor Naik", seats: "5 seats left" }
      ]
    },
    {
      name: "AI & ML",
      members: "11.4k",
      mentors: "3",
      projects: "812",
      icon: "🤖",
      color: "from-violet-400 via-purple-400 to-indigo-500",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-400/30",
      category: "data",
      trend: "+28%",
      batches: [
        { id: 5, name: "Core Concepts", timing: "Mon-Thu (8 PM IST)", instructor: "Dr Ravi Naik", seats: "2 seats left" }
      ]
    },

    {
      name: "Data Science",
      members: "10.2k",
      mentors: "3",
      projects: "723",
      icon: "📊",
      color: "from-teal-400 via-emerald-400 to-green-500",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-400/30",
      category: "data",
      trend: "+18%",
      batches: [{ id: 6, name: "Data Insights", timing: "Weekend (2 PM)", instructor: "Dr. Mike", seats: "Open" }]
    }
  ];

  const filters = [
    { id: 'all', label: 'All Communities', icon: '🌟' },
    { id: 'development', label: 'Development', icon: '💻' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'data', label: 'Data & AI', icon: '📊' }
  ];

  const filteredCommunities = activeFilter === 'all' 
    ? communities 
    : communities.filter(c => c.category === activeFilter);

  return (
    <section id="community" className="relative py-20 bg-slate-950 overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-slate-950 to-slate-950"></div>

      <div className="relative container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm rounded-full bg-emerald-500/10 backdrop-blur border border-emerald-400/30 text-emerald-300 hover:scale-105 transition-transform cursor-pointer">
            <span className="animate-pulse">👥</span> Join Active Communities
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 animate-gradient">Community</span>
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105'
                  : 'bg-slate-900/50 border border-slate-700 text-slate-300 hover:bg-slate-900/70'
              }`}
            >
              <span className="mr-2">{filter.icon}</span>{filter.label}
            </button>
          ))}
        </div>

        {/* Communities Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {filteredCommunities.map((community, index) => (
            <div
              key={community.name}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative bg-slate-900/50 backdrop-blur-xl border ${community.borderColor} rounded-3xl p-6 transition-all duration-500 transform hover:-translate-y-4 hover:shadow-2xl cursor-pointer`}
            >
              {/* Trend Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
                📈 {community.trend}
              </div>

              {/* Icon */}
              <div className={`w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br ${community.color} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-all`}>
                {community.icon}
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">{community.name}</h3>

              {/* Stats Block */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm bg-slate-800/30 rounded-lg p-2">
                  <span className="text-slate-400">👥 Members</span>
                  <span className="text-emerald-400 font-bold">{community.members}</span>
                </div>
                <div className="flex justify-between text-sm bg-slate-800/30 rounded-lg p-2">
                  <span className="text-slate-400">🎓 Mentors</span>
                  <span className="text-teal-400 font-bold">{community.mentors}</span>
                </div>
              </div>

              {/* JOIN BUTTON TRIGGERS MODAL */}
              <button 
                onClick={() => setSelectedCommunity(community)}
                className={`w-full py-4 rounded-xl font-bold bg-gradient-to-r ${community.color} text-white transition-all shadow-lg active:scale-95`}
              >
                Join Community →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- BATCH SELECTION MODAL --- */}
      {selectedCommunity && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSelectedCommunity(null)}
          ></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in">
            <div className={`h-2 w-full bg-gradient-to-r ${selectedCommunity.color}`}></div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">Available Batches</h3>
                  <p className="text-slate-400">for {selectedCommunity.name}</p>
                </div>
                <button 
                  onClick={() => setSelectedCommunity(null)}
                  className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {selectedCommunity.batches?.map((batch) => (
                  <div key={batch.id} className="group relative bg-slate-800/50 border border-slate-700 p-5 rounded-2xl hover:border-emerald-400/50 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-white">{batch.name}</h4>
                      <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase">
                        {batch.seats}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                      <div className="flex items-center gap-2">
                        <span>⏰</span> {batch.timing}
                      </div>
                      <div className="flex items-center gap-2">
                        <span>👨‍🏫</span> {batch.instructor}
                      </div>
                    </div>

                    <button className="mt-4 w-full py-2 bg-slate-700 hover:bg-emerald-500 text-white rounded-lg font-bold transition-colors">
                      Confirm Batch
                    </button>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-center text-slate-500 text-xs">
                Can't find a suitable time? <span className="text-emerald-400 cursor-pointer">Join Waiting List</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); scale: 0.95; }
          to { opacity: 1; transform: translateY(0); scale: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}