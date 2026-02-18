import React from 'react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#0a0a0c] text-slate-200 overflow-hidden">
      
      {/* --- BACKGROUND ARCHITECTURE --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)] opacity-40"></div>
        {/* Engineering Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center pt-20">
        
        {/* LEFT: STRATEGIC COPY */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
          

            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-[0.9]">
              Join Community <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Learn Skill.</span><br></br>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Get Hired.</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-xl leading-relaxed font-medium">
              The only platform that combines structured video lessons with a 
              <span className="text-slate-200"> live-synced compiler </span> and 
              <span className="text-slate-200"> industry-mentor </span> code reviews.
            </p>
          </div>

          {/* Search & Category Pills */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-0 max-w-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden focus-within:border-cyan-500/50 transition-all shadow-2xl">
              <div className="flex-1 flex items-center px-6 py-5 gap-3">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="What do you want to learn today?"
                  className="bg-transparent text-white w-full outline-none text-base placeholder:text-slate-600"
                />
              </div>
              <button className="bg-cyan-500 text-slate-950 px-10 py-5 font-black hover:bg-cyan-400 transition-all uppercase tracking-tighter">
                Start Learning
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {['Frontend', 'Backend', 'System Design', 'Web3', 'AI'].map((cat) => (
                <button key={cat} className="px-4 py-1.5 rounded-full border border-slate-800 text-xs font-bold text-slate-500 hover:border-cyan-500/50 hover:text-cyan-400 transition-all bg-slate-900/50">
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}