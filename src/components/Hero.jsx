export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1 mb-6 text-sm rounded-full bg-cyan-500/20 backdrop-blur border border-cyan-400/30 text-cyan-300">
            ✨ Future-Ready Learning Platform
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Learn Skills.<br />
            Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Real Projects.
            </span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Get Hired.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-200 max-w-xl">
            Join mentor-led communities, work on industry-grade projects,
            earn certifications, and become job-ready faster than ever.
          </p>

          {/* Search Bar */}
          <div className="mt-10 flex max-w-lg bg-white/10 backdrop-blur-xl border border-cyan-400/30 rounded-2xl overflow-hidden shadow-xl">
            <input
              type="text"
              placeholder="Search skills like React, UI/UX, Java..."
              className="flex-1 px-6 py-4 bg-transparent text-white placeholder-slate-300 outline-none"
            />
            <button className="px-8 font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:scale-105 transition shadow-lg">
              Explore
            </button>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-10 max-w-md">
            <div>
              <h3 className="text-3xl font-bold text-cyan-400">10K+</h3>
              <p className="text-sm text-slate-300">Learners</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-purple-400">600+</h3>
              <p className="text-sm text-slate-300">Projects</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-pink-400">250+</h3>
              <p className="text-sm text-slate-300">Mentors</p>
            </div>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/40 to-purple-500/40 rounded-3xl blur-3xl"></div>

          <div className="relative bg-white/10 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-6 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              alt="Learning"
              className="rounded-2xl w-full max-w-md hover:scale-105 transition duration-500"
            />
          </div>
        </div>

      </div>
    </section>
  );
}   