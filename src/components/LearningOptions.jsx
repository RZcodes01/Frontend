export default function LearningOptions() {
  return (
    <section className="relative py-24 bg-[#0a0a0c] text-slate-200 border-b border-slate-800 overflow-hidden">
      
      {/* --- MATCHING HERO BACKGROUND STRUCTURE --- */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-[15%] w-px h-full bg-slate-800"></div>
        <div className="absolute top-0 left-[85%] w-px h-full bg-slate-800"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Header matching Hero typography */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1 rounded-md mb-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-500">Path Selection</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Choose your <span className="text-cyan-500 italic">learning velocity.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl">
          
          {/* OPTION 01: SELF-PACED (Matching 'Search Bar' Style) */}
          <div className="group bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-slate-600 transition-all">
            <div className="flex flex-col h-full">
              
              <h3 className="text-2xl font-bold text-white mb-4">Self-Paced Discovery</h3>
              <p className="text-slate-400 leading-relaxed mb-8 flex-grow">
                Complete modules at your own speed. Perfect for independent learners 
                who want high-quality documentation and video assets without a fixed schedule.
              </p>

              <div className="space-y-3 mb-10">
                {['Basic tutorials', 'Community access', 'Automated Progress Tracking'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* OPTION 02: GUIDED (Matching 'Mentor Online' Style) */}
          <div className="group relative bg-slate-900 border-2 border-cyan-500/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.05)]">
            {/* 'Popular' tag matching the Hero's 'Mentor Online' badge */}
            <div className="absolute -top-4 right-6 bg-cyan-500 text-black px-3 py-1 rounded font-bold text-[10px] tracking-widest uppercase">
              Most Effective
            </div>

            <div className="flex flex-col h-full">
              <h3 className="text-2xl font-bold text-white mb-4">Mentor-Led Cohort</h3>
              <p className="text-slate-400 leading-relaxed mb-8 flex-grow">
                Join a live group with industry professionals. Includes 1-on-1 reviews, 
                real-world project deployment, and career networking.
              </p>

              <div className="space-y-3 mb-10">
                {[
                  { text: 'Live mentor sessions', color: 'text-emerald-400' },
                  { text: 'Hands-on projects', color: 'text-emerald-400' },
                  { text: 'Verified Industry Certificate', color: 'text-emerald-400' },
                  { text: 'Job Placement Support', color: 'text-emerald-400' }
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-sm text-slate-200">
                    <span className={item.color}>✓</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}