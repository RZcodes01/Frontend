import React from 'react'
import Navbar from '../components/Navbar'

export default function Community() {
  const communities = [
    {
      name: "Web Development",
      members: "12.5k",
      mentors: "45",
      projects: "890",
      icon: "💻",
      color: "from-cyan-400 to-blue-500",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-400/30"
    },
    {
      name: "UI/UX Design",
      members: "8.3k",
      mentors: "32",
      projects: "654",
      icon: "🎨",
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-400/30"
    },
    {
      name: "Data Science",
      members: "10.2k",
      mentors: "38",
      projects: "723",
      icon: "📊",
      color: "from-green-400 to-cyan-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-400/30"
    },
    {
      name: "Mobile Dev",
      members: "9.1k",
      mentors: "41",
      projects: "567",
      icon: "📱",
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-400/30"
    },
    {
      name: "AI & ML",
      members: "11.4k",
      mentors: "36",
      projects: "812",
      icon: "🤖",
      color: "from-blue-400 to-purple-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-400/30"
    },
    {
      name: "DevOps",
      members: "7.8k",
      mentors: "29",
      projects: "445",
      icon: "⚙️",
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-400/30"
    }
  ];

  return (
    <section id="community" className="relative py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-pink-500/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-sm rounded-full bg-cyan-500/20 backdrop-blur border border-cyan-400/30 text-cyan-300">
            👥 Join Active Communities
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Community</span>
          </h2>
          <p className="text-slate-200 max-w-2xl mx-auto">
            Connect with mentors and peers, learn together, build real projects, and showcase your work to top companies
          </p>
        </div>

        {/* How It Works Section */}
        <div className="mb-20 max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-white mb-12">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="relative group">
              <div className="bg-white/5 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-6 hover:bg-white/10 transition">
                <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  1
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Join Community</h4>
                <p className="text-slate-300 text-sm">Search and join skill-based communities with active mentors and learners</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-cyan-400/50 to-transparent"></div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="bg-white/5 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-6 hover:bg-white/10 transition">
                <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  2
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Choose Learning Path</h4>
                <p className="text-slate-300 text-sm">Select self-paced learning or join mentor-led weekly live sessions</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-purple-400/50 to-transparent"></div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="bg-white/5 backdrop-blur-xl border border-green-400/30 rounded-3xl p-6 hover:bg-white/10 transition">
                <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  3
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Build Projects</h4>
                <p className="text-slate-300 text-sm">Complete weekly projects assigned by mentors and get feedback</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-green-400/50 to-transparent"></div>
            </div>

            {/* Step 4 */}
            <div className="relative group">
              <div className="bg-white/5 backdrop-blur-xl border border-orange-400/30 rounded-3xl p-6 hover:bg-white/10 transition">
                <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  4
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Get Hired</h4>
                <p className="text-slate-300 text-sm">Top projects get ranked and reviewed by hiring companies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {communities.map((community) => (
            <div
              key={community.name}
              className={`group relative bg-white/5 backdrop-blur-xl border ${community.borderColor} rounded-3xl p-6 hover:bg-white/10 transition duration-300 transform hover:-translate-y-2`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${community.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition`}>
                {community.icon}
              </div>

              {/* Community Name */}
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition">
                {community.name}
              </h3>

              {/* Stats */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Members</span>
                  <span className="text-cyan-400 font-semibold">{community.members}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Mentors</span>
                  <span className="text-purple-400 font-semibold">{community.mentors}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Projects</span>
                  <span className="text-pink-400 font-semibold">{community.projects}</span>
                </div>
              </div>

              {/* Live Session Badge */}
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-xs">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Live sessions weekly
              </div>

              {/* Join Button */}
              <button className={`w-full py-3 rounded-xl font-semibold bg-gradient-to-r ${community.color} text-white hover:scale-105 transition shadow-lg`}>
                Join Community
              </button>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/5 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-12 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Learning Journey?</span>
          </h3>
          <p className="text-slate-200 mb-8 max-w-2xl mx-auto">
            Join thousands of learners building real projects, getting mentored by industry experts, and landing their dream jobs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 rounded-full font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:scale-105 transition shadow-lg">
              Browse Communities
            </button>
            <button className="px-8 py-4 rounded-full font-semibold bg-white/10 border border-white/20 text-white hover:bg-white/20 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}