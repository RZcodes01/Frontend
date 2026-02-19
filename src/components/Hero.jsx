import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate("/community", { state: { search: searchQuery.trim() } });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 border-b border-slate-200 overflow-hidden">

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Cyan left accent bar */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500" />

      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 py-28 max-w-6xl mx-auto">

        <div className="flex flex-col gap-10">

          {/* Heading */}
          <div className="flex flex-col gap-5">
            <h1
              className="font-extrabold leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(3rem, 7vw, 5.2rem)" }}
            >
              <span className="text-slate-900">Join Community.</span>
              <br />
              <span className="text-slate-400">Learn Skill.</span>
              <br />
              <span className="text-cyan-500">Get Hired.</span>
            </h1>

            <p
              className="text-slate-500 max-w-xl leading-relaxed"
              style={{ fontSize: "clamp(1rem, 1.6vw, 1.15rem)" }}
            >
              The only platform that combines structured video lessons with
              a live-synced compiler and industry-mentor code reviews.
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-2xl w-full">
            <div className="flex flex-col sm:flex-row rounded-xl bg-white border-2 border-slate-200 shadow-sm hover:border-cyan-400 hover:shadow-md transition-all duration-300 overflow-hidden">
              <div className="flex flex-1 items-center px-5 py-4 gap-3">
                <svg
                  className="w-5 h-5 text-slate-400 shrink-0"
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-slate-800 placeholder-slate-400 outline-none text-base"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-white font-bold px-8 py-4 transition-colors duration-200 text-base"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}