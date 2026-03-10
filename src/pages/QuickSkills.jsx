import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, MessageCircle, Eye, Play, Send, ThumbsUp,
  ChevronDown, Loader2, Volume2, VolumeX, Plus,
  Trash2, RotateCcw, Settings, X, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { fetchReels, fetchReelsAdmin, softDeleteReel, toggleDeleteReel } from "../api/reels.api";

function formatCount(n) {
  if (!n) return 0;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n;
}

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
        width: "min(430px, 100vw)", height: "60dvh", background: "#0f172a", borderRadius: "20px 20px 0 0",
        display: "flex", flexDirection: "column", zIndex: 300, boxShadow: "0 -8px 40px rgba(0,0,0,0.7)",
        animation: "sheetUp 0.3s cubic-bezier(.34,1.2,.64,1)", overflow: "hidden",
      }}>
        <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid rgba(99,132,199,0.15)", flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(251,191,36,0.3)", margin: "0 auto 12px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#EFF6FF", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "1rem" }}>
              Comments &nbsp;·&nbsp; {formatCount(comments.length)}
            </span>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(147,197,253,0.5)" }}>
              <ChevronDown size={22} />
            </button>
          </div>
        </div>
        <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
          {comments.map((c) => (
            <div key={c.id} style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(99,132,199,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>{c.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                  <span style={{ color: "#EFF6FF", fontWeight: 700, fontSize: "0.82rem" }}>{c.user}</span>
                  <span style={{ color: "rgba(147,197,253,0.35)", fontSize: "0.72rem" }}>{c.time}</span>
                </div>
                <p style={{ color: "rgba(239,246,255,0.88)", fontSize: "0.88rem", marginTop: 2 }}>{c.text}</p>
                <button onClick={() => onLikeComment(reelId, c.id)} style={{ background: "none", border: "none", marginTop: 6, color: c.liked ? "#FBBF24" : "rgba(147,197,253,0.4)", fontSize: "0.75rem" }}>
                  <ThumbsUp size={13} fill={c.liked ? "#FBBF24" : "transparent"} /> {c.likes > 0 && c.likes}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 12px 18px", borderTop: "1px solid rgba(99,132,199,0.1)", display: "flex", gap: 8, background: "#0f172a" }}>
          <textarea
            ref={inputRef} rows={1} value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…"
            style={{ flex: 1, background: "rgba(99,132,199,0.1)", border: "none", borderRadius: 24, padding: "10px 15px", color: "#EFF6FF", resize: "none" }}
          />
          <button onClick={submit} disabled={!text.trim()} style={{ background: text.trim() ? "#1e3a5f" : "transparent", border: text.trim() ? "2px solid #FBBF24" : "none", borderRadius: "50%", width: 38, height: 38 }}>
            <Send size={16} color="#FBBF24" />
          </button>
        </div>
      </div>
    </>
  );
}

function Reel({ reel, isActive, comments, onOpenComments, isMuted, onToggleMute, canDelete, onDelete }) {
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
    background: active ? `${color}22` : "rgba(30,58,95,0.6)",
    border: `2px solid ${active ? color : "transparent"}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(6px)", transition: "all 0.2s",
  });

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", flexShrink: 0, scrollSnapAlign: "start", scrollSnapStop: "always", background: "#0f172a", overflow: "hidden" }}>
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
          <Loader2 className="animate-spin text-amber-400" size={40} />
        </div>
      )}

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.9) 0%, transparent 40%)", pointerEvents: "none" }} />

      {!playing && !isBuffering && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-blue-950/60 rounded-full pointer-events-none">
          <Play size={28} fill="#FBBF24" color="#FBBF24" />
        </div>
      )}

      <div style={{ position: "absolute", bottom: 30, left: 16, right: 80, color: "#EFF6FF", pointerEvents: "none" }}>
        <h3 style={{ fontWeight: 800, fontSize: "1rem", margin: 0, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>{reel.title}</h3>
        <p style={{ opacity: 0.7, fontSize: "0.85rem", textShadow: "0 1px 2px rgba(0,0,0,0.5)", color: "#93C5FD" }}>{reel.creator}</p>
      </div>

      <div style={{ position: "absolute", right: 12, bottom: 30, display: "flex", flexDirection: "column", gap: 18 }}>
        <ActionBtn
          icon={<div style={circleStyle(!isMuted, "#FBBF24")}>{isMuted ? <VolumeX size={20} color="#EFF6FF" /> : <Volume2 size={20} color="#FBBF24" />}</div>}
          label={isMuted ? "Muted" : "On"}
          onClick={onToggleMute}
        />
        <ActionBtn
          icon={<div style={circleStyle(liked, "#FBBF24")}><Heart size={22} fill={liked ? "#FBBF24" : "transparent"} color={liked ? "#FBBF24" : "#EFF6FF"} /></div>}
          label={formatCount(likeCount)}
          onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1); }}
        />
        <ActionBtn
          icon={<div style={circleStyle(false, "#93C5FD")}><MessageCircle size={22} color="#EFF6FF" /></div>}
          label={formatCount(comments.length)}
          onClick={() => onOpenComments(reel._id)}
        />
        <ActionBtn icon={<div style={circleStyle(false, "#93C5FD")}><Eye size={22} color="#EFF6FF" /></div>} label={formatCount(reel.views)} />

        {canDelete && (
          <ActionBtn
            icon={<div style={circleStyle(false, "#EF4444")}><Trash2 size={20} color="#EF4444" /></div>}
            label="Delete"
            labelColor="#EF4444"
            onClick={() => onDelete(reel._id)}
          />
        )}
      </div>
    </div>
  );
}

// ─── Manage Panel (Admin / Mentor) ────────────────────────────────
function ManagePanel({ onClose }) {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);

  const loadReels = async () => {
    setLoading(true);
    try {
      const data = await fetchReelsAdmin();
      setReels(data || []);
    } catch {
      toast.error("Failed to load reels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReels(); }, []);

  const handleToggle = async (id) => {
    setToggling(id);
    try {
      const res = await toggleDeleteReel(id);
      toast.success(res.data.message);
      await loadReels();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to toggle");
    } finally {
      setToggling(null);
    }
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm" />
      <div className="fixed inset-y-0 right-0 z-[401] w-full max-w-md bg-blue-950 border-l border-blue-800/60 shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: "slideInRight 0.3s cubic-bezier(.34,1.2,.64,1)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-blue-800/40 flex-shrink-0">
          <div>
            <h2 className="text-blue-50 font-black text-lg">Manage Reels</h2>
            <p className="text-blue-400/60 text-xs font-medium">{reels.length} total reels</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-blue-900/60 text-blue-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={32} className="text-amber-400 animate-spin mb-3" />
              <p className="text-blue-400 text-sm">Loading all reels...</p>
            </div>
          ) : reels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-blue-400/60">
              <AlertCircle size={40} className="mb-3" />
              <p className="font-bold">No reels found</p>
            </div>
          ) : (
            reels.map((reel) => (
              <div key={reel._id} className={`rounded-xl border p-4 transition-all ${
                reel.isDeleted
                  ? "bg-red-500/5 border-red-500/20"
                  : "bg-blue-900/30 border-blue-800/40"
              }`}>
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="w-14 h-20 rounded-lg overflow-hidden bg-blue-900/60 flex-shrink-0">
                    {reel.thumbnail ? (
                      <img src={reel.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play size={16} className="text-blue-500" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        reel.isDeleted
                          ? "bg-red-500/15 text-red-400 border border-red-500/20"
                          : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {reel.isDeleted ? "Deleted" : "Active"}
                      </span>
                    </div>
                    <h4 className="text-blue-100 font-bold text-sm truncate capitalize">{reel.title}</h4>
                    <p className="text-blue-500 text-xs mt-0.5">
                      by {reel.creator?.username || "Unknown"} · {new Date(reel.createdAt).toLocaleDateString()}
                    </p>
                    {reel.isDeleted && reel.deletedBy && (
                      <p className="text-red-400/60 text-[11px] mt-1">
                        Deleted by {reel.deletedBy.name || reel.deletedBy.username || "admin"} · {reel.deletedAt && new Date(reel.deletedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => handleToggle(reel._id)}
                    disabled={toggling === reel._id}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                      reel.isDeleted
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white"
                        : "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {toggling === reel._id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : reel.isDeleted ? (
                      <><RotateCcw size={14} /> Restore</>
                    ) : (
                      <><Trash2 size={14} /> Delete</>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}


export default function QuickSkills() {
  const navigate = useNavigate();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [allComments, setAllComments] = useState({});
  const [openCommentsId, setOpenCommentsId] = useState(null);
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);
  const [showManagePanel, setShowManagePanel] = useState(false);
  const containerRef = useRef();

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const canUpload = userData.role === "admin" || userData.role === "mentor";
  const canDelete = userData.role === "admin" || userData.role === "mentor";

  const loadReels = async () => {
    try {
      setLoading(true);
      const data = await fetchReels();
      setReels(data || []);
      const commentMap = {};
      (data || []).forEach(reel => { commentMap[reel._id] = reel.comments || []; });
      setAllComments(commentMap);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReels(); }, []);

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

  const handleDeleteReel = async (reelId) => {
    try {
      await softDeleteReel(reelId);
      toast.success("Reel deleted successfully");
      // Remove from feed immediately (optimistic)
      setReels(prev => prev.filter(r => r._id !== reelId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete reel");
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full bg-blue-950 flex flex-col items-center justify-center text-blue-50 gap-4">
        <Loader2 className="animate-spin text-amber-400" size={40} />
        <p className="font-bold tracking-widest text-sm uppercase text-blue-300">Syncing Skills...</p>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", width: "100vw", display: "flex", justifyContent: "center", background: "#0f172a", overflow: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap');
        ::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes sheetUp { from { transform: translateX(-50%) translateY(100%) } to { transform: translateX(-50%) translateY(0) } }
        @keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>

      {/* Upload Button */}
      {canUpload && (
        <button
          onClick={() => navigate("/upload-skill")}
          className="fixed bottom-10 left-10 z-50 flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-blue-950 px-5 py-3 rounded-full font-black shadow-lg shadow-amber-400/40 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          <span className="hidden sm:inline">Upload Skill</span>
        </button>
      )}

      {/* Manage Button (Admin / Mentor) */}
      {canDelete && (
        <button
          onClick={() => setShowManagePanel(true)}
          className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-blue-900/80 hover:bg-blue-800 border border-blue-700/50 text-blue-200 px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
        >
          <Settings size={16} />
          <span className="hidden sm:inline">Manage</span>
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
          backgroundColor: "#0f172a",
          scrollbarWidth: "none",
        }}
      >
        {reels.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-blue-400/60 gap-3">
            <AlertCircle size={48} />
            <p className="font-bold text-lg">No reels available</p>
            <p className="text-sm">Be the first to upload a skill!</p>
          </div>
        ) : (
          reels.map((reel, i) => (
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
              canDelete={canDelete}
              onDelete={handleDeleteReel}
            />
          ))
        )}
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

      {showManagePanel && (
        <ManagePanel onClose={() => { setShowManagePanel(false); loadReels(); }} />
      )}
    </div>
  );
}