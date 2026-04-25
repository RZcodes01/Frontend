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
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.25)", animation: "fadeIn 0.2s ease" }} />
      <div style={{
        position: "fixed", left: "50%", bottom: 0, transform: "translateX(-50%)",
        width: "min(430px, 100vw)", height: "60dvh", background: "#ffffff", borderRadius: "20px 20px 0 0",
        display: "flex", flexDirection: "column", zIndex: 300, boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
        animation: "sheetUp 0.3s cubic-bezier(.34,1.2,.64,1)", overflow: "hidden",
      }}>
        <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid #e5e7eb", flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#d1d5db", margin: "0 auto 12px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#1f2937", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "1rem" }}>
              Comments &nbsp;·&nbsp; {formatCount(comments.length)}
            </span>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
              <ChevronDown size={22} />
            </button>
          </div>
        </div>
        <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
          {comments.map((c) => (
            <div key={c.id} style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>{c.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                  <span style={{ color: "#1f2937", fontWeight: 700, fontSize: "0.82rem" }}>{c.user}</span>
                  <span style={{ color: "#9ca3af", fontSize: "0.72rem" }}>{c.time}</span>
                </div>
                <p style={{ color: "#374151", fontSize: "0.88rem", marginTop: 2 }}>{c.text}</p>
                <button onClick={() => onLikeComment(reelId, c.id)} style={{ background: "none", border: "none", marginTop: 6, color: c.liked ? "#2563eb" : "#9ca3af", fontSize: "0.75rem", cursor: "pointer" }}>
                  <ThumbsUp size={13} fill={c.liked ? "#2563eb" : "transparent"} /> {c.likes > 0 && c.likes}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 12px 18px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 8, background: "#ffffff" }}>
          <textarea
            ref={inputRef} rows={1} value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…"
            style={{ flex: 1, background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 24, padding: "10px 15px", color: "#1f2937", resize: "none", outline: "none" }}
          />
          <button onClick={submit} disabled={!text.trim()} style={{ background: text.trim() ? "#2563eb" : "transparent", border: text.trim() ? "none" : "1px solid #e5e7eb", borderRadius: "50%", width: 38, height: 38, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Send size={16} color={text.trim() ? "#fff" : "#9ca3af"} />
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
    background: active ? `${color}22` : "rgba(255,255,255,0.15)",
    border: `2px solid ${active ? color : "rgba(255,255,255,0.2)"}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(6px)", transition: "all 0.2s",
  });

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", flexShrink: 0, background: "#000", overflow: "hidden", borderRadius: "16px" }}>
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
          <Loader2 className="animate-spin text-white" size={40} />
        </div>
      )}

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)", pointerEvents: "none" }} />

      {!playing && !isBuffering && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-black/40 rounded-full pointer-events-none">
          <Play size={28} fill="#fff" color="#fff" />
        </div>
      )}

      <div style={{ position: "absolute", bottom: 30, left: 16, right: 80, color: "#fff", pointerEvents: "none" }}>
        <h3 style={{ fontWeight: 800, fontSize: "1rem", margin: 0, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>{reel.title}</h3>
        <p style={{ opacity: 0.8, fontSize: "0.85rem", textShadow: "0 1px 2px rgba(0,0,0,0.5)", color: "#e5e7eb" }}>{reel.creator}</p>
      </div>

      <div style={{ position: "absolute", right: 12, bottom: 30, display: "flex", flexDirection: "column", gap: 18 }}>
        <ActionBtn
          icon={<div style={circleStyle(!isMuted, "#fff")}>{isMuted ? <VolumeX size={20} color="#fff" /> : <Volume2 size={20} color="#fff" />}</div>}
          label={isMuted ? "Muted" : "On"}
          onClick={onToggleMute}
        />
        <ActionBtn
          icon={<div style={circleStyle(liked, "#ef4444")}><Heart size={22} fill={liked ? "#ef4444" : "transparent"} color={liked ? "#ef4444" : "#fff"} /></div>}
          label={formatCount(likeCount)}
          onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1); }}
        />
        <ActionBtn
          icon={<div style={circleStyle(false, "#fff")}><MessageCircle size={22} color="#fff" /></div>}
          label={formatCount(comments.length)}
          onClick={() => onOpenComments(reel._id)}
        />
        <ActionBtn icon={<div style={circleStyle(false, "#fff")}><Eye size={22} color="#fff" /></div>} label={formatCount(reel.views)} />

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
      <div onClick={onClose} className="fixed inset-0 z-[400] bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-y-0 right-0 z-[401] w-full max-w-md bg-white border-l border-gray-200 shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: "slideInRight 0.3s cubic-bezier(.34,1.2,.64,1)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-gray-900 font-black text-lg">Manage Reels</h2>
            <p className="text-gray-400 text-xs font-medium">{reels.length} total reels</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={32} className="text-blue-500 animate-spin mb-3" />
              <p className="text-gray-500 text-sm">Loading all reels...</p>
            </div>
          ) : reels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <AlertCircle size={40} className="mb-3" />
              <p className="font-bold">No reels found</p>
            </div>
          ) : (
            reels.map((reel) => (
              <div key={reel._id} className={`rounded-xl border p-4 transition-all ${
                reel.isDeleted
                  ? "bg-red-50 border-red-200"
                  : "bg-gray-50 border-gray-200"
              }`}>
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="w-14 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {reel.thumbnail ? (
                      <img src={reel.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play size={16} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        reel.isDeleted
                          ? "bg-red-100 text-red-600 border border-red-200"
                          : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      }`}>
                        {reel.isDeleted ? "Deleted" : "Active"}
                      </span>
                    </div>
                    <h4 className="text-gray-900 font-bold text-sm truncate capitalize">{reel.title}</h4>
                    <p className="text-gray-500 text-xs mt-0.5">
                      by {reel.creator?.username || "Unknown"} · {new Date(reel.createdAt).toLocaleDateString()}
                    </p>
                    {reel.isDeleted && reel.deletedBy && (
                      <p className="text-red-400 text-[11px] mt-1">
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
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-500 hover:text-white"
                        : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-500 hover:text-white"
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
  const itemRefs = useRef([]);

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const canUpload = userData.role === "admin" || userData.role === "mentor";
  const canDelete = userData.role === "admin" || userData.role === "mentor";

  const NAVBAR_HEIGHT = 72;

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

  // Detect which reel is most visible using IntersectionObserver
  useEffect(() => {
    if (!containerRef.current || reels.length === 0) return;

    const options = {
      root: containerRef.current,
      threshold: 0.6,
    };

    let currentIndex = activeIndex;

    const observer = new IntersectionObserver((entries) => {
      let bestIndex = currentIndex;
      let bestRatio = 0;

      entries.forEach((entry) => {
        const idxAttr = entry.target.getAttribute("data-index");
        const idx = typeof idxAttr === "string" ? parseInt(idxAttr, 10) : NaN;
        if (Number.isNaN(idx)) return;

        if (entry.intersectionRatio > bestRatio) {
          bestRatio = entry.intersectionRatio;
          bestIndex = idx;
        }
      });

      if (bestIndex !== currentIndex) {
        currentIndex = bestIndex;
        setActiveIndex(bestIndex);
      }
    }, options);

    itemRefs.current.forEach((ref, i) => {
      if (ref && ref instanceof HTMLElement) {
        ref.setAttribute("data-index", String(i));
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [reels.length]);

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
      <div className="w-full flex flex-col items-center justify-center text-gray-600 gap-4 bg-gray-50" style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}>
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="font-bold tracking-widest text-sm uppercase text-gray-400">Syncing Skills...</p>
      </div>
    );
  }

  return (
    <div style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)`, width: "100%", display: "flex", justifyContent: "center", background: "#f3f4f6", overflow: "hidden", position: "relative" }}>
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
          className="fixed bottom-10 left-10 z-50 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-full font-black shadow-lg shadow-blue-200/60 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          <span className="hidden sm:inline">Upload Skill</span>
        </button>
      )}

      {/* Manage Button (Admin / Mentor) */}
      {canDelete && (
        <button
          onClick={() => setShowManagePanel(true)}
          className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <Settings size={16} />
          <span className="hidden sm:inline">Manage</span>
        </button>
      )}

      <div
        ref={containerRef}
        style={{
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          width: "min(100%, calc((100dvh - 72px) * 9 / 16))",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          position: "relative",
          backgroundColor: "#f3f4f6",
          scrollbarWidth: "none",
          padding: "8px 0",
        }}
      >
        {reels.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
            <AlertCircle size={48} />
            <p className="font-bold text-lg text-gray-600">No reels available</p>
            <p className="text-sm">Be the first to upload a skill!</p>
          </div>
        ) : (
          reels.map((reel, i) => {
            if (!itemRefs.current[i]) {
              itemRefs.current[i] = null;
            }
            return (
              <div
                key={reel._id}
                ref={(el) => {
                  if (el) itemRefs.current[i] = el;
                }}
                data-index={i}
                style={{
                  height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
                  scrollSnapAlign: "start",
                  scrollSnapStop: "always",
                  padding: "4px 0",
                }}
              >
                <Reel
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
              </div>
            );
          })
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