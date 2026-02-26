import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── Fake live data ───────────────────────────────────────────────────────────
const SKILLS = [
  "React", "Python", "System Design", "DSA", "Node.js",
  "TypeScript", "Machine Learning", "SQL", "Docker", "GraphQL",
  "Rust", "Kubernetes", "AWS", "Next.js", "Golang",
];

const ACTIVITY_TEMPLATES = [
  { icon: "🎓", tpl: (u, s) => `${u} just enrolled in ${s}` },
  { icon: "✅", tpl: (u, s) => `${u} completed a ${s} challenge` },
  { icon: "💬", tpl: (u, s) => `${u} got a mentor review on ${s}` },
  { icon: "🏆", tpl: (u, s) => `${u} earned a ${s} badge` },
  { icon: "🔴", tpl: (u, s) => `Live ${s} session just started` },
];

const NAMES = [
  "Arjun K.", "Priya S.", "Rohan M.", "Sneha P.", "Dev T.",
  "Aisha B.", "Ravi L.", "Meera N.", "Kiran J.", "Tanvi R.",
];

function randItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function genActivity() {
  const t = randItem(ACTIVITY_TEMPLATES);
  return { icon: t.icon, text: t.tpl(randItem(NAMES), randItem(SKILLS)), id: Math.random() };
}

const INITIAL_ACTIVITIES = Array.from({ length: 5 }, genActivity);

// ─── Stat counter component ───────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", prefix = "" }) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const duration = 1800;
    const steps = 60;
    const step = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{prefix}{val.toLocaleString()}{suffix}</span>;
}

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Activity feed state
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [activeSkill, setActiveSkill] = useState(null);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate("/community", { state: { search: searchQuery.trim() } });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Push a new activity every 2.8 s
  useEffect(() => {
    const id = setInterval(() => {
      setActivities(prev => [genActivity(), ...prev.slice(0, 5)]);
    }, 2800);
    return () => clearInterval(id);
  }, []);

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

        /* ── Interactive panel styles ── */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes panel-in {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes live-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
        }

        .interactive-panel {
          animation: panel-in 0.95s cubic-bezier(0.16,1,0.3,1) 0.15s both;
        }
        .activity-item {
          animation: slideDown 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        .skill-chip {
          cursor: pointer;
          transition: all 0.18s ease;
          border: 1.5px solid transparent;
        }
        .skill-chip:hover {
          border-color: #f59e0b;
          background: rgba(245,158,11,0.12) !important;
          color: #92400e !important;
          transform: translateY(-2px);
        }
        .skill-chip.active-chip {
          border-color: #f59e0b;
          background: rgba(245,158,11,0.18) !important;
          color: #78350f !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(245,158,11,0.25);
        }
        .live-dot {
          animation: live-pulse 1.8s ease-in-out infinite;
          border-radius: 50%;
          width: 8px; height: 8px;
          background: #22c55e;
          display: inline-block;
        }
        .stat-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(30,58,95,0.15);
        }
        .search-btn-pulse:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.4);
        }

        @media (max-width: 900px) {
          .hero-illus-wrap  { display: none !important; }
        }
      `}</style>

      <section className="relative min-h-screen flex items-center justify-center bg-blue-50 text-navy-900 border-b border-blue-100 overflow-hidden">

        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.13,
          }}
        />

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
            <div className="flex flex-col gap-10" style={{ flex: "0 0 46%", minWidth: 0 }}>

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
                    className="search-btn-pulse bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-amber-400 font-bold px-8 py-4 transition-colors duration-200 text-base"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
            {/* ──────────── END original markup ──────────── */}

            {/* ──────────── RIGHT: image + overlaid interactive panel ──────────── */}
            <div
              className="hero-illus-wrap interactive-panel"
              style={{ flex: 1, position: "relative", minHeight: "520px" }}
            >

              {/* ── Hero image ── */}
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Developers collaborating"
                style={{
                  width: "100%",
                  height: "520px",
                  objectFit: "cover",
                  borderRadius: "20px",
                  display: "block",
                  boxShadow: "0 24px 60px rgba(30,58,95,0.22)",
                }}
              />

              {/* Dark gradient overlay for readability */}
              <div style={{
                position: "absolute", inset: 0,
                borderRadius: "20px",
                background: "linear-gradient(160deg, rgba(12,28,53,0.18) 0%, rgba(12,28,53,0.72) 100%)",
                pointerEvents: "none",
              }} />

              {/* Gold left accent on image */}
              <div style={{
                position: "absolute", top: "16px", left: 0,
                width: "4px", height: "calc(100% - 32px)",
                background: "#f59e0b",
                borderRadius: "0 4px 4px 0",
                opacity: 0.9,
              }} />

              {/* ── TOP-RIGHT: Stat cards floating ── */}
              <div style={{
                position: "absolute", top: "18px", right: "18px",
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px",
                width: "calc(100% - 36px)",
              }}>
                {[
                  { label: "Learners", value: 48200, suffix: "+", color: "#1e3a5f" },
                  { label: "Hire Rate", value: 94, suffix: "%", color: "#f59e0b" },
                  { label: "Mentors", value: 320, suffix: "+", color: "#2d5a8e" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="stat-card"
                    style={{
                      background: "rgba(255,255,255,0.92)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "10px",
                      padding: "10px 8px",
                      textAlign: "center",
                      border: "1.5px solid rgba(255,255,255,0.6)",
                      boxShadow: "0 4px 16px rgba(30,58,95,0.18)",
                    }}
                  >
                    <div style={{ fontSize: "1.25rem", fontWeight: 900, color: s.color, lineHeight: 1 }}>
                      <AnimatedCounter target={s.value} suffix={s.suffix} />
                    </div>
                    <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#64748b", marginTop: "3px", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── BOTTOM: skill chips + live feed overlaid on image ── */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "20px",
                display: "flex", flexDirection: "column", gap: "10px",
              }}>

                {/* Popular skills chip selector */}
                <div style={{
                  background: "rgba(255,255,255,0.93)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  border: "1.5px solid rgba(255,255,255,0.6)",
                  boxShadow: "0 4px 20px rgba(30,58,95,0.18)",
                }}>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "9px" }}>
                    Trending Skills
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {SKILLS.slice(0, 12).map((skill) => (
                      <button
                        key={skill}
                        className={`skill-chip ${activeSkill === skill ? "active-chip" : ""}`}
                        onClick={() => setActiveSkill(prev => prev === skill ? null : skill)}
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: "20px",
                          background: "rgba(30,58,95,0.07)",
                          color: "#1e3a5f",
                          border: "1.5px solid transparent",
                          cursor: "pointer",
                          transition: "all 0.18s ease",
                        }}
                      >
                        {skill}
                        {activeSkill === skill && <span style={{ marginLeft: "4px", color: "#f59e0b" }}>✓</span>}
                      </button>
                    ))}
                  </div>
                  {activeSkill && (
                    <div style={{
                      marginTop: "9px",
                      padding: "7px 11px",
                      background: "rgba(245,158,11,0.08)",
                      borderRadius: "8px",
                      fontSize: "0.68rem",
                      color: "#78350f",
                      fontWeight: 600,
                      border: "1px solid rgba(245,158,11,0.25)",
                      animation: "slideDown 0.25s ease both",
                    }}>
                      🔍 Searching "{activeSkill}" — <span style={{ color: "#1e3a5f", textDecoration: "underline", cursor: "pointer" }}
                        onClick={() => { setSearchQuery(activeSkill); navigate("/community", { state: { search: activeSkill } }); }}>
                        View courses →
                      </span>
                    </div>
                  )}
                </div>

                {/* Live activity feed */}
                <div style={{
                  background: "rgba(15,30,58,0.88)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "14px",
                  padding: "13px 16px",
                  boxShadow: "0 4px 20px rgba(30,58,95,0.3)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                    <span className="live-dot" />
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Live Community Activity
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {activities.slice(0, 3).map((a, i) => (
                      <div
                        key={a.id}
                        className="activity-item"
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                          padding: "6px 9px",
                          background: "rgba(255,255,255,0.06)",
                          borderRadius: "7px",
                          animationDelay: `${i * 0.04}s`,
                          borderLeft: i === 0 ? "2px solid #f59e0b" : "2px solid transparent",
                          transition: "border-color 0.3s ease",
                        }}
                      >
                        <span style={{ fontSize: "0.8rem", lineHeight: 1.4, flexShrink: 0 }}>{a.icon}</span>
                        <span style={{ fontSize: "0.67rem", color: i === 0 ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.55)", lineHeight: 1.4, fontWeight: i === 0 ? 600 : 400 }}>
                          {a.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
            {/* ──────────── END interactive panel ──────────── */}

          </div>
        </div>
      </section>
    </>
  );
}