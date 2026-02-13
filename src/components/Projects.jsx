const projects = [
  { 
    title: "Smart Home Website", 
    medal: "🥇", 
    rank: "1st Place",
    author: "Sarah Johnson",
    category: "Web Development",
    likes: "234",
    gradient: "from-yellow-400 to-orange-400"
  },
  { 
    title: "Power Supply Repair", 
    medal: "🥈", 
    rank: "2nd Place",
    author: "Mike Chen",
    category: "Electronics",
    likes: "189",
    gradient: "from-slate-300 to-slate-400"
  },
  { 
    title: "Brand Logo Design", 
    medal: "🥉", 
    rank: "3rd Place",
    author: "Emma Davis",
    category: "Graphic Design",
    likes: "156",
    gradient: "from-orange-400 to-amber-600"
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative py-20 bg-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-32 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-sm rounded-full bg-white/10 backdrop-blur border border-white/20 text-white">
            🏆 Hall of Fame
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Top Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">Projects</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Showcasing the best projects built by our talented community members
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="group relative"
            >
              {/* Rank Badge - Floating */}
              <div className={`absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-16 h-16 rounded-full bg-gradient-to-br ${project.gradient} flex items-center justify-center text-3xl shadow-2xl group-hover:scale-110 transition duration-300`}>
                {project.medal}
              </div>

              {/* Card */}
              <div className={`relative bg-white/5 backdrop-blur-xl border ${
                index === 0 ? 'border-yellow-400/30 shadow-yellow-400/20' : 
                index === 1 ? 'border-slate-400/30 shadow-slate-400/20' : 
                'border-orange-400/30 shadow-orange-400/20'
              } rounded-3xl p-8 pt-12 shadow-2xl hover:bg-white/10 hover:border-white/30 transition duration-300 transform hover:-translate-y-2`}>
                
                {/* Glow Effect */}
                <div className={`absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br ${project.gradient} opacity-20 rounded-full blur-3xl group-hover:scale-110 transition`}></div>

                {/* Content */}
                <div className="relative text-center">
                  {/* Rank Text */}
                  <div className={`inline-block px-3 py-1 mb-4 rounded-full text-xs font-bold bg-gradient-to-r ${project.gradient} text-black`}>
                    {project.rank}
                  </div>

                  {/* Project Title */}
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-pink-400 transition">
                    {project.title}
                  </h3>

                  {/* Category */}
                  <p className="text-slate-400 text-sm mb-4">
                    {project.category}
                  </p>

                  {/* Divider */}
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-4"></div>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                      {project.author.charAt(0)}
                    </div>
                    <span className="text-slate-300 text-sm">{project.author}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-6 text-sm text-slate-400 mb-6">
                    <span className="flex items-center gap-1">
                      ❤️ {project.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      👁️ 1.2k
                    </span>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full py-3 rounded-xl font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition">
                    View Project
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-400 mb-6">
            Want to showcase your project here?
          </p>
          <button className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:scale-105 transition shadow-lg">
            Submit Your Project →
          </button>
        </div>
      </div>
    </section>
  );
}