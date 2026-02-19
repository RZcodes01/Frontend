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
    <section className="relative min-h-screen flex items-center justify-center bg-slate-100 text-slate-900">

      <div className="w-full px-6 sm:px-12 lg:px-20 py-28 max-w-6xl mx-auto">

        <div className="flex flex-col gap-12">

          {/* Heading */}
          <div className="flex flex-col gap-6">
            <h1
              className="font-extrabold leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(3rem, 7vw, 5.2rem)" }}
            >
              <span className="text-slate-900">Join Community</span>
              <br />
              <span className="text-slate-700 ">Learn Skill.</span>
              <br />
              <span className="text-slate-700">Get Hired.</span>
            </h1>

            <p
              className="text-slate-600 max-w-xl leading-relaxed"
              style={{ fontSize: "clamp(1rem, 1.6vw, 1.15rem)" }}
            >
              The only platform that combines structured video lessons with
              a live-synced compiler and industry-mentor code reviews.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl">
            <div className="flex flex-col sm:flex-row rounded-xl bg-white border border-slate-300 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">

              <div className="flex flex-1 items-center px-6 py-4 gap-3">
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
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-4 transition-all duration-200"
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
