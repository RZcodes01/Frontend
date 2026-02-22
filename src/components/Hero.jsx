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
    <section className="relative min-h-screen flex items-center justify-center bg-blue-50 text-navy-900 border-b border-blue-100 overflow-hidden">

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, #1e3a5f 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Gold left accent bar */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400" />

      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 py-28 max-w-6xl mx-auto">

        <div className="flex flex-col gap-10">

          {/* Heading */}
          <div className="flex flex-col gap-5">
            <h1
              className="font-extrabold leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(3rem, 7vw, 5.2rem)" }}
            >
              <span className="text-blue-900">Join Community.</span>
              <br />
              <span className="text-blue-400">Learn Skill.</span>
              <br />
              <span className="text-amber-400">Get Hired.</span>
            </h1>

            <p
              className="text-blue-700 max-w-xl leading-relaxed"
              style={{ fontSize: "clamp(1rem, 1.6vw, 1.15rem)" }}
            >
              The only platform that combines structured video lessons with
              a live-synced compiler and industry-mentor code reviews.
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-2xl w-full">
            <div className="flex flex-col sm:flex-row rounded-xl bg-blue-50 border-2 border-blue-200 shadow-sm hover:border-amber-400 hover:shadow-md transition-all duration-300 overflow-hidden">
              <div className="flex flex-1 items-center px-5 py-4 gap-3">
                <svg
                  className="w-5 h-5 text-blue-300 shrink-0"
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
                  className="w-full bg-transparent text-blue-900 placeholder-blue-300 outline-none text-base"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-amber-400 font-bold px-8 py-4 transition-colors duration-200 text-base"
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