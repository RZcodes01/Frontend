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
    <>
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-18px); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes rotateSlowReverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%       { opacity: 0.12; transform: scale(1.07); }
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes dash-flow {
          to { stroke-dashoffset: -40; }
        }
        @keyframes badge-float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50%       { transform: translateY(-9px) rotate(-3deg); }
        }
        @keyframes badge2-float {
          0%, 100% { transform: translateY(0px) rotate(4deg); }
          50%       { transform: translateY(-11px) rotate(4deg); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(36px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes dot-ping {
          0%        { transform: scale(1); opacity: 0.9; }
          80%, 100% { transform: scale(2.4); opacity: 0; }
        }

        .hero-illus-float   { animation: floatY 5.5s ease-in-out infinite; }
        .hero-ring-outer    { animation: rotateSlow 20s linear infinite; transform-origin: 210px 230px; }
        .hero-ring-inner    { animation: rotateSlowReverse 13s linear infinite; transform-origin: 210px 230px; }
        .hero-pulse-bg      { animation: pulse-ring 3.8s ease-in-out infinite; }
        .hero-badge-1       { animation: badge-float 4.2s ease-in-out infinite; }
        .hero-badge-2       { animation: badge2-float 5.1s ease-in-out 0.7s infinite; }
        .hero-illus-wrap    { animation: fadeSlideIn 0.95s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .hero-cursor-blink  { animation: blink-cursor 1s step-end infinite; }
        .hero-flow          { animation: dash-flow 1.9s linear infinite; }
        .hero-ping-1        { animation: dot-ping 1.8s ease-out infinite; transform-origin: 60px 268px; }
        .hero-ping-2        { animation: dot-ping 1.8s ease-out 0.6s infinite; transform-origin: 220px 268px; }

        @media (max-width: 900px) {
          .hero-illus-wrap  { display: none !important; }
        }
      `}</style>

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

          {/* Flex row: original left content + new right illustration */}
          <div style={{ display: "flex", alignItems: "center", gap: "3.5rem" }}>

            {/* ──────────── LEFT: original markup, zero changes ──────────── */}
            <div className="flex flex-col gap-10" style={{ flex: 1, minWidth: 0 }}>

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
            {/* ──────────── END original markup ──────────── */}

            {/* ──────────── RIGHT: animated SVG illustration ──────────── */}
            <div
              className="hero-illus-wrap"
              style={{ flex: "0 0 420px", position: "relative", height: "470px" }}
            >
              {/* Glow blob */}
              <div
                className="hero-pulse-bg"
                style={{
                  position: "absolute", inset: 0,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 50% 50%, rgba(30,58,95,0.13) 0%, transparent 68%)",
                  pointerEvents: "none",
                }}
              />

              {/* Outer dashed ring */}
              <svg
                className="hero-ring-outer"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
                viewBox="0 0 420 460"
              >
                <circle cx="210" cy="230" r="185" fill="none" stroke="#1e3a5f"
                  strokeWidth="1.2" strokeDasharray="5 15" strokeOpacity="0.16" />
              </svg>

              {/* Inner gold ring */}
              <svg
                className="hero-ring-inner"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
                viewBox="0 0 420 460"
              >
                <circle cx="210" cy="230" r="140" fill="none" stroke="#f59e0b"
                  strokeWidth="1.2" strokeDasharray="4 16" strokeOpacity="0.24" />
              </svg>

              {/* Floating main SVG illustration */}
              <div
                className="hero-illus-float"
                style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width="290" height="310" viewBox="0 0 280 305" fill="none" xmlns="http://www.w3.org/2000/svg">

                  {/* ── Monitor body ── */}
                  <rect x="28" y="18" width="224" height="158" rx="14" fill="#1e3a5f" />
                  <rect x="28" y="18" width="224" height="158" rx="14" stroke="#2d5a8e" strokeWidth="1.5" />
                  {/* Screen glass */}
                  <rect x="40" y="30" width="200" height="134" rx="8" fill="#0c1c35" />
                  {/* Subtle screen glare */}
                  <rect x="40" y="30" width="200" height="30" rx="8" fill="white" opacity="0.03" />

                  {/* Monitor stand */}
                  <rect x="108" y="176" width="64" height="20" rx="4" fill="#162d4f" />
                  <rect x="78" y="194" width="124" height="10" rx="5" fill="#162d4f" />

                  {/* ── Code lines ── */}
                  {/* row 1 */}
                  <rect x="55" y="48" width="26" height="7" rx="3" fill="#f59e0b" opacity="0.95" />
                  <rect x="87" y="48" width="52" height="7" rx="3" fill="#60a5fa" opacity="0.75" />
                  <rect x="145" y="48" width="28" height="7" rx="3" fill="#94a3b8" opacity="0.45" />
                  {/* row 2 */}
                  <rect x="67" y="64" width="16" height="7" rx="3" fill="#818cf8" opacity="0.85" />
                  <rect x="89" y="64" width="68" height="7" rx="3" fill="#94a3b8" opacity="0.45" />
                  {/* row 3 */}
                  <rect x="67" y="80" width="20" height="7" rx="3" fill="#34d399" opacity="0.85" />
                  <rect x="93" y="80" width="42" height="7" rx="3" fill="#94a3b8" opacity="0.45" />
                  <rect x="141" y="80" width="20" height="7" rx="3" fill="#f472b6" opacity="0.75" />
                  {/* row 4 – blank */}
                  <rect x="55" y="96" width="10" height="7" rx="3" fill="#94a3b8" opacity="0.25" />
                  {/* row 5 */}
                  <rect x="55" y="112" width="26" height="7" rx="3" fill="#f59e0b" opacity="0.95" />
                  <rect x="87" y="112" width="42" height="7" rx="3" fill="#60a5fa" opacity="0.75" />
                  {/* blinking cursor */}
                  <rect className="hero-cursor-blink" x="135" y="112" width="2.5" height="9" rx="1.2" fill="#f59e0b" />
                  {/* row 6 */}
                  <rect x="67" y="128" width="78" height="7" rx="3" fill="#94a3b8" opacity="0.38" />
                  <rect x="151" y="128" width="28" height="7" rx="3" fill="#34d399" opacity="0.6" />
                  {/* row 7 */}
                  <rect x="55" y="144" width="60" height="7" rx="3" fill="#94a3b8" opacity="0.3" />

                  {/* ── Vertical flow line from stand ── */}
                  <line x1="140" y1="204" x2="140" y2="242"
                    stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" className="hero-flow" />

                  {/* ── Node: left avatar ── */}
                  <circle cx="58" cy="268" r="24" fill="#1e3a5f" />
                  <circle cx="58" cy="268" r="24" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.55" />
                  <circle cx="58" cy="262" r="9" fill="#60a5fa" opacity="0.85" />
                  <rect x="44" y="276" width="28" height="9" rx="4.5" fill="#2d5a8e" />
                  {/* ping */}
                  <circle className="hero-ping-1" cx="58" cy="268" r="24"
                    fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />

                  {/* ── Node: center trophy ── */}
                  <circle cx="140" cy="260" r="28" fill="#1e3a5f" />
                  <circle cx="140" cy="260" r="28" stroke="#f59e0b" strokeWidth="2" />
                  <polygon
                    points="140,245 143.5,255 154,255 145.5,261 148.5,271 140,265 131.5,271 134.5,261 126,255 136.5,255"
                    fill="#f59e0b" opacity="0.95"
                  />

                  {/* ── Node: right avatar ── */}
                  <circle cx="222" cy="268" r="24" fill="#1e3a5f" />
                  <circle cx="222" cy="268" r="24" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.55" />
                  <circle cx="222" cy="262" r="9" fill="#34d399" opacity="0.8" />
                  <rect x="208" y="276" width="28" height="9" rx="4.5" fill="#2d5a8e" />
                  {/* ping */}
                  <circle className="hero-ping-2" cx="222" cy="268" r="24"
                    fill="none" stroke="#34d399" strokeWidth="1.5" opacity="0.7" />

                  {/* ── Connecting arcs ── */}
                  <path d="M82 266 Q110 246 117 260"
                    stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 5" strokeOpacity="0.5"
                    className="hero-flow" fill="none" />
                  <path d="M163 260 Q171 246 198 266"
                    stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 5" strokeOpacity="0.5"
                    className="hero-flow" fill="none" />
                </svg>
              </div>

              {/* ── Badge 1: Live Session ── */}
              <div
                className="hero-badge-1"
                style={{
                  position: "absolute", top: "32px", right: "-4px",
                  background: "white",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "8px 14px",
                  boxShadow: "0 8px 28px rgba(0,0,0,0.11)",
                  display: "flex", alignItems: "center", gap: "8px",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#22c55e", display: "inline-block",
                  boxShadow: "0 0 0 3px rgba(34,197,94,0.25)",
                }} />
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1e3a5f", letterSpacing: "0.05em" }}>
                  Live Session
                </span>
              </div>

              {/* ── Badge 2: 94% Hired ── */}
              <div
                className="hero-badge-2"
                style={{
                  position: "absolute", bottom: "50px", left: "-4px",
                  background: "#1e3a5f",
                  borderRadius: "12px",
                  padding: "10px 16px",
                  boxShadow: "0 8px 28px rgba(30,58,95,0.28)",
                  display: "flex", alignItems: "center", gap: "10px",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: "1.15rem", fontWeight: 900, color: "#f59e0b", lineHeight: 1 }}>94%</span>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.72)", letterSpacing: "0.06em", lineHeight: 1.35 }}>
                  Hire<br />Rate
                </span>
              </div>

            </div>
            {/* ──────────── END illustration ──────────── */}

          </div>
        </div>
      </section>
    </>
  );
}