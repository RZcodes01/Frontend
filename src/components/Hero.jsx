export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#0a0a0c] text-slate-200 border-b border-slate-800">
      
      {/* --- LMS STRUCTURAL BACKGROUND --- */}
      <div className="absolute inset-0 z-0 opacity-20">
        {/* Subtle Engineering Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        {/* Architectural Line */}
        <div className="absolute top-0 left-[15%] w-px h-full bg-slate-800"></div>
        <div className="absolute top-0 left-[85%] w-px h-full bg-slate-800"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT: COURSE DISCOVERY (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1 rounded-md">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">System Online: 42 New Lessons Added</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            Build the future <br /> 
            <span className="text-cyan-500 italic">one module</span> at a time.
          </h1>

          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            Access a comprehensive curriculum designed by industry leads. Track your progress, 
            submit assignments, and earn verified certifications.
          </p>

          {/* Search/LMS Command Bar */}
          <div className="flex flex-col sm:flex-row gap-0 max-w-2xl bg-slate-900 border border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500/50 transition-all">
            <div className="flex-1 flex items-center px-4 py-4 gap-3">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search catalog (e.g. 'Advanced TypeScript', 'UI Design')..."
                className="bg-transparent text-white w-full outline-none text-sm"
              />
            </div>
            <button className="bg-white text-black px-8 py-4 font-bold hover:bg-cyan-500 transition-colors">
              Explore Courses
            </button>
          </div>

          {/* User Trust Stats */}
          <div className="flex gap-10 pt-4 border-t border-slate-800">
            <div>
              <p className="text-2xl font-bold text-white">12,402</p>
              <p className="text-xs text-slate-500 uppercase tracking-tighter">Active Students</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">94%</p>
              <p className="text-xs text-slate-500 uppercase tracking-tighter">Completion Rate</p>
            </div>
          </div>
        </div>

        {/* RIGHT: PLATFORM PREVIEW (5 Cols) */}
        <div className="lg:col-span-5 relative">
          {/* Main Dashboard Preview Card */}
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 transform rotate-1">
            {/* Window Controls */}
            <div className="flex gap-1.5 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
            </div>
            
            <div className="space-y-4">
              {/* Course Video Placeholder */}
              <div className="aspect-video bg-slate-950 rounded-lg flex items-center justify-center relative overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all"
                  alt="Lesson preview" 
                />
                <div className="relative z-10 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Current Module</p>
                    <p className="text-sm font-semibold">04. Authentication Flow</p>
                  </div>
                  <p className="text-xs text-cyan-500 font-mono">75%</p>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full">
                  <div className="bg-cyan-500 h-full w-[75%] rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating 'Mentor Online' Tag */}
          <div className="absolute -bottom-6 -left-6 bg-emerald-500 text-black px-4 py-2 rounded-lg font-bold text-xs shadow-lg flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
            </span>
            MENTOR ONLINE
          </div>
        </div>

      </div>
    </section>
  );
}