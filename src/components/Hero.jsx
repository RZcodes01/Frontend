import { useState } from "react";

export default function Hero() {
  const [hovered, setHovered] = useState(null);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-[#0a0a0c] text-slate-200 overflow-hidden">

      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: "radial-gradient(circle at 50% -20%, #1e293b, transparent)" }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full flex flex-col px-4 sm:px-8 lg:px-16 py-20 sm:py-24 lg:py-32 max-w-7xl mx-auto">

        <div className="flex flex-col xl:flex-row xl:items-center gap-12 xl:gap-20">

          <div className="flex flex-col gap-8 flex-1">

            <div className="flex flex-col gap-3">
              <h1
                className="font-black tracking-tight text-white leading-none"
                style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)" }}
              >
                Join Community
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(to right, #22d3ee, #3b82f6)" }}
                >
                  Learn Skill.
                </span>
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(to right, #22d3ee, #3b82f6)" }}
                >
                  Get Hired.
                </span>
              </h1>

              <p
                className="text-slate-400 leading-relaxed font-medium max-w-lg"
                style={{ fontSize: "clamp(0.95rem, 2vw, 1.2rem)" }}
              >
                The only platform that combines structured video lessons with a{" "}
                <span className="text-slate-200">live-synced compiler</span> and{" "}
                <span className="text-slate-200">industry-mentor</span> code reviews.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-2xl">
              <div
                className="flex flex-col sm:flex-row overflow-hidden rounded-2xl shadow-2xl w-full"
                style={{
                  background: "rgba(15,23,42,0.8)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(51,65,85,0.5)",
                }}
              >
                <div className="flex flex-1 items-center px-5 py-4 gap-3">
                  <svg
                    className="w-5 h-5 text-slate-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="What do you want to learn today?"
                    className="bg-transparent text-white w-full outline-none text-sm sm:text-base placeholder-slate-600"
                  />
                </div>
                <button
                  className="font-black uppercase tracking-tighter text-slate-950 px-8 py-4 w-full sm:w-auto transition-colors duration-150 text-sm sm:text-base"
                  style={{ background: "#22d3ee" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#67e8f9")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#22d3ee")}
                >
                  Start Learning
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}