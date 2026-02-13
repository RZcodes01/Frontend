const skills = [
  { name: "Web Development", badge: "Paid", img: "/Images/web-development.png" },
  { name: "Electronics Repair", badge: "Free", img: "/Images/Python.webp" },
  { name: "Graphic Design", badge: "Paid", img: "/Images/graphic-design.jpg" },
];

export default function Skills() {
  return (
    <section id="skills" className="relative py-20 bg-slate-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-sm rounded-full bg-white/10 backdrop-blur border border-white/20 text-white">
            🎯 Most In-Demand
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">Skills</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Master the most sought-after skills with expert mentors and hands-on projects
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:bg-white/10 hover:border-white/20 transition duration-300"
            >
              {/* Glow Effect */}
              <div className={`absolute -top-4 -right-4 w-32 h-32 ${
                index === 0 ? 'bg-yellow-400/30' : 
                index === 1 ? 'bg-green-400/30' : 
                'bg-pink-400/30'
              } rounded-full blur-3xl group-hover:scale-110 transition`}></div>

              {/* Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                  skill.badge === "Free" 
                    ? "bg-gradient-to-r from-green-400 to-cyan-400 text-black" 
                    : "bg-gradient-to-r from-yellow-400 to-orange-400 text-black"
                } shadow-lg`}>
                  {skill.badge}
                </span>
              </div>

              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={skill.img}
                  alt={skill.name}
                  className="h-56 w-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative p-6">
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-pink-400 transition">
                  {skill.name}
                </h4>
                <p className="text-slate-400 text-sm mb-4">
                  Learn from industry experts and build real-world projects
                </p>
                
                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    👥 2.5k learners
                  </span>
                  <span className="flex items-center gap-1">
                    ⭐ 4.8
                  </span>
                </div>

                {/* CTA Button */}
                <button className="w-full py-3 rounded-xl font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition">
                  Explore Course
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:scale-105 transition shadow-lg">
            View All Skills →
          </button>
        </div>
      </div>
    </section>
  );
}