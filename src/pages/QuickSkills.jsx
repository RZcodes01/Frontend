import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, MessageCircle, Eye, Play, Send, ThumbsUp,
  ChevronDown, Loader2, Volume2, VolumeX, Plus
} from "lucide-react";
import { fetchReels } from "../api/reels.api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCount(n) {
  if (!n) return 0;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n;
}

// ─── Action Button Component ──────────────────────────────────────────────────
function ActionBtn({ icon, label, onClick, labelColor = "#fff" }) {
  return (
    <button
      onClick={onClick}
      style={{ background: "none", border: "none", cursor: onClick ? "pointer" : "default", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: 0 }}
    >
      {icon}
      <span style={{ fontSize: "0.75rem", fontWeight: 700, fontFamily: "'Nunito',sans-serif", color: labelColor, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
        {label}
      </span>
    </button>
  );
}

// ─── Comment Panel Component ──────────────────────────────────────────────────
function CommentPanel({ reelId, comments, onClose, onAddComment, onLikeComment }) {
  const [text, setText] = useState("");
  const listRef = useRef();
  const inputRef = useRef();

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAddComment(reelId, {
      id: Date.now(),
      user: "@you",
      avatar: "✨",
      text: trimmed,
      likes: 0,
      liked: false,
      time: "just now",
    });
    setText("");
    if (inputRef.current) { inputRef.current.style.height = "auto"; }
    setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 80);
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.45)", animation: "fadeIn 0.2s ease" }} />
      <div style={{
        position: "fixed", left: "50%", bottom: 0, transform: "translateX(-50%)",
        width: "min(430px, 100vw)", height: "60dvh", background: "#111", borderRadius: "20px 20px 0 0",
        display: "flex", flexDirection: "column", zIndex: 300, boxShadow: "0 -8px 40px rgba(0,0,0,0.7)",
        animation: "sheetUp 0.3s cubic-bezier(.34,1.2,.64,1)", overflow: "hidden",
      }}>
        <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)", margin: "0 auto 12px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#fff", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "1rem" }}>
              Comments &nbsp;·&nbsp; {formatCount(comments.length)}
            </span>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
              <ChevronDown size={22} />
            </button>
          </div>
        </div>
        <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
          {comments.map((c) => (
            <div key={c.id} style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>{c.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.82rem" }}>{c.user}</span>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem" }}>{c.time}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "0.88rem", marginTop: 2 }}>{c.text}</p>
                <button onClick={() => onLikeComment(reelId, c.id)} style={{ background: "none", border: "none", marginTop: 6, color: c.liked ? "#ff2d55" : "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
                  <ThumbsUp size={13} fill={c.liked ? "#ff2d55" : "transparent"} /> {c.likes > 0 && c.likes}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 12px 18px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 8, background: "#111" }}>
          <textarea
            ref={inputRef} rows={1} value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…"
            style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 24, padding: "10px 15px", color: "#fff", resize: "none" }}
          />
          <button onClick={submit} disabled={!text.trim()} style={{ background: text.trim() ? "#ff0000" : "transparent", border: "none", borderRadius: "50%", width: 38, height: 38 }}>
            <Send size={16} color="#fff" />
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Single Reel Component ──────────────────────────────────────────────────
function Reel({ reel, isActive, comments, onOpenComments, isMuted, onToggleMute }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(reel.likes);
  const [playing, setPlaying] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const videoRef = useRef();

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      setIsBuffering(true);
      videoRef.current.play().catch(() => setIsBuffering(false));
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsBuffering(false);
    }
    setPlaying(isActive);
  }, [isActive]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    videoRef.current.paused ? (videoRef.current.play(), setPlaying(true)) : (videoRef.current.pause(), setPlaying(false));
  };

  const circleStyle = (active, color) => ({
    width: 44, height: 44, borderRadius: "50%",
    background: active ? `${color}22` : "rgba(255,255,255,0.12)",
    border: `2px solid ${active ? color : "transparent"}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(6px)", transition: "all 0.2s",
  });

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", flexShrink: 0, scrollSnapAlign: "start", scrollSnapStop: "always", background: "#000", overflow: "hidden" }}>
      <video
        ref={videoRef}
        src={reel.video}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
      />

      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <Loader2 className="animate-spin text-cyan-500" size={40} />
        </div>
      )}

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%)", pointerEvents: "none" }} />

      {!playing && !isBuffering && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-black/40 rounded-full pointer-events-none">
          <Play size={28} fill="#fff" color="#fff" />
        </div>
      )}

      <div style={{ position: "absolute", bottom: 30, left: 16, right: 80, color: "#fff", pointerEvents: "none" }}>
        <h3 style={{ fontWeight: 800, fontSize: "1rem", margin: 0, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>{reel.title}</h3>
        <p style={{ opacity: 0.8, fontSize: "0.85rem", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>{reel.creator}</p>
      </div>

      <div style={{ position: "absolute", right: 12, bottom: 30, display: "flex", flexDirection: "column", gap: 18 }}>
        <ActionBtn
          icon={<div style={circleStyle(!isMuted, "#06b6d4")}>{isMuted ? <VolumeX size={20} color="#fff" /> : <Volume2 size={20} color="#fff" />}</div>}
          label={isMuted ? "Muted" : "On"}
          onClick={onToggleMute}
        />
        <ActionBtn
          icon={<div style={circleStyle(liked, "#ff2d55")}><Heart size={22} fill={liked ? "#ff2d55" : "transparent"} color={liked ? "#ff2d55" : "#fff"} /></div>}
          label={formatCount(likeCount)}
          onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1); }}
        />
        <ActionBtn
          icon={<div style={circleStyle(false, "#fff")}><MessageCircle size={22} color="#fff" /></div>}
          label={formatCount(comments.length)}
          onClick={() => onOpenComments(reel._id)}
        />
        <ActionBtn icon={<div style={circleStyle(false, "#fff")}><Eye size={22} color="#fff" /></div>} label={formatCount(reel.views)} />
      </div>
    </div>
  );
}

// ─── Main Reels Page ──────────────────────────────────────────────────────────
export default function QuickSkills() {
  const navigate = useNavigate();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [allComments, setAllComments] = useState({});
  const [openCommentsId, setOpenCommentsId] = useState(null);
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);
  const containerRef = useRef();

  // Role check logic
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const canUpload = userData.role === "admin" || userData.role === "mentor";

  useEffect(() => {
    const loadReels = async () => {
      try {
        setLoading(true);
        const data = await fetchReels();
        setReels(data);
        const commentMap = {};
        data.forEach(reel => { commentMap[reel._id] = reel.comments || []; });
        setAllComments(commentMap);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadReels();
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const index = Math.round(container.scrollTop / container.clientHeight);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleAddComment = (reelId, comment) => {
    setAllComments(p => ({ ...p, [reelId]: [...(p[reelId] || []), comment] }));
  };

  const handleLikeComment = (reelId, commentId) => {
    setAllComments(p => ({
      ...p, [reelId]: p[reelId].map(c => c.id === commentId ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c)
    }));
  };

  if (loading) {
    return (
      <div className="h-full w-full bg-black flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="animate-spin text-cyan-500" size={40} />
        <p className="font-bold tracking-widest text-sm uppercase opacity-50">Syncing Skills...</p>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", width: "100vw", display: "flex", justifyContent: "center", background: "#000", overflow: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap');
        ::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes sheetUp { from { transform: translateX(-50%) translateY(100%) } to { transform: translateX(-50%) translateY(0) } }
      `}</style>

      {/* Conditional Upload Button */}
      {canUpload && (
        <button
          onClick={() => navigate("/upload-skill")}
          className="absolute bottom-10 left-10 z-50 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-3 rounded-full font-black shadow-lg shadow-cyan-500/40 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          <span className="hidden sm:inline">Upload Skill</span>
        </button>
      )}

      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          height: "100%",
          width: "min(100%, calc((100dvh - 72px) * 9 / 16))",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          position: "relative",
          backgroundColor: "#000",
          scrollbarWidth: "none",
        }}
      >
        {reels.map((reel, i) => (
          <Reel
            key={reel._id}
            reel={{
              ...reel,
              video: reel.videoUrl || reel.video,
              title: reel.title || "SkillConnect",
              creator: reel.creator?.username || "@creator",
              likes: reel.likes?.length || 0,
              views: reel.views || 0,
            }}
            isActive={i === activeIndex}
            comments={allComments[reel._id] || []}
            onOpenComments={setOpenCommentsId}
            isMuted={isGlobalMuted}
            onToggleMute={() => setIsGlobalMuted(!isGlobalMuted)}
          />
        ))}
      </div>

      {openCommentsId && (
        <CommentPanel
          reelId={openCommentsId}
          comments={allComments[openCommentsId] || []}
          onClose={() => setOpenCommentsId(null)}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
        />
      )}
    </div>
  );
}