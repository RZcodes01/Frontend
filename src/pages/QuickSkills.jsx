import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Eye, Plus, X, Play, Send, ThumbsUp, ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";

// ─── Seed Data ────────────────────────────────────────────────────────────────
const seedComments = {
  1: [
    { id: 1, user: "@fluffy_fan", avatar: "🐰", text: "This bunny is too cute! 😍", likes: 42, liked: false, time: "2h" },
    { id: 2, user: "@opengl_nerd", avatar: "🎮", text: "Blender Institute classics never get old.", likes: 18, liked: false, time: "1h" },
    { id: 3, user: "@mia.renders", avatar: "🌸", text: "The animation quality for 2008 is insane!", likes: 31, liked: false, time: "45m" },
  ],
  2: [
    { id: 1, user: "@cinephile99", avatar: "🎬", text: "Absolute classic right here 🎞️", likes: 77, liked: false, time: "3h" },
    { id: 2, user: "@moviebuff_raj", avatar: "🍿", text: "Used to watch this every weekend as a kid.", likes: 25, liked: false, time: "2h" },
  ],
};

const initialReels = [
  { id: 1, video: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Big Buck Bunny 🐰", creator: "@bunny_official", likes: 1200, views: 15000 },
  { id: 2, video: "https://www.w3schools.com/html/movie.mp4", title: "Classic Movie Clip 🎬", creator: "@classic_clips", likes: 980, views: 8700 },
];

function formatCount(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n;
}

// ─── Comment Panel (slide-up sheet) ──────────────────────────────────────────
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

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  return (
    <>
      {/* Scrim */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.45)", animation: "fadeIn 0.2s ease" }} />

      {/* Sheet */}
      <div style={{
        position: "fixed", left: "50%", bottom: 0,
        transform: "translateX(-50%)",
        width: "min(430px, 100vw)",
        height: "70dvh",
        background: "#111",
        borderRadius: "20px 20px 0 0",
        display: "flex", flexDirection: "column",
        zIndex: 300,
        boxShadow: "0 -8px 40px rgba(0,0,0,0.7)",
        animation: "sheetUp 0.3s cubic-bezier(.34,1.2,.64,1)",
        overflow: "hidden",
      }}>

        {/* Header */}
        <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)", margin: "0 auto 12px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#fff", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "1rem" }}>
              Comments &nbsp;·&nbsp; {formatCount(comments.length)}
            </span>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", display: "flex" }}>
              <ChevronDown size={22} />
            </button>
          </div>
        </div>

        {/* Comment list */}
        <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
          {comments.length === 0 && (
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontFamily: "'Nunito',sans-serif", marginTop: "3rem", fontSize: "0.9rem" }}>
              No comments yet — be the first! 👋
            </div>
          )}
          {comments.map((c) => (
            <div key={c.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              {/* Avatar */}
              <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
                {c.avatar}
              </div>
              {/* Body */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 3 }}>
                  <span style={{ color: "#fff", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.82rem" }}>{c.user}</span>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", fontFamily: "'Nunito',sans-serif" }}>{c.time}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.88)", fontFamily: "'Nunito',sans-serif", fontSize: "0.88rem", lineHeight: 1.45, margin: 0, wordBreak: "break-word" }}>
                  {c.text}
                </p>
                {/* Like button */}
                <button
                  onClick={() => onLikeComment(reelId, c.id)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 4, marginTop: 6, padding: 0,
                    color: c.liked ? "#ff2d55" : "rgba(255,255,255,0.4)",
                    fontFamily: "'Nunito',sans-serif", fontSize: "0.75rem", fontWeight: 700,
                    transition: "color 0.15s",
                  }}
                >
                  <ThumbsUp size={13} style={{ fill: c.liked ? "#ff2d55" : "transparent", color: c.liked ? "#ff2d55" : "rgba(255,255,255,0.4)", transition: "all 0.15s" }} />
                  {c.likes > 0 && c.likes}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Input row */}
        <div style={{ padding: "10px 12px 18px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 8, alignItems: "center", background: "#111", flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>✨</div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.07)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", padding: "0 12px" }}>
            <textarea
              ref={inputRef}
              rows={1}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 88) + "px";
              }}
              onKeyDown={handleKey}
              placeholder="Add a comment…"
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontFamily: "'Nunito',sans-serif", fontSize: "0.88rem", resize: "none", padding: "10px 0", lineHeight: 1.4, maxHeight: 88, overflowY: "auto" }}
            />
          </div>
          <button
            onClick={submit}
            disabled={!text.trim()}
            style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: text.trim() ? "#ff0000" : "rgba(255,255,255,0.1)", cursor: text.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s", flexShrink: 0 }}
          >
            <Send size={16} color={text.trim() ? "#fff" : "rgba(255,255,255,0.3)"} />
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────
function UploadModal({ onClose, onUpload }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const fileRef = useRef();

  const handleFile = (f) => { if (!f || !f.type.startsWith("video/")) return; setFile(f); setPreview(URL.createObjectURL(f)); };

  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", padding: "0.65rem 0.9rem", fontSize: "0.85rem", fontFamily: "'Nunito',sans-serif", outline: "none", marginBottom: "0.65rem", boxSizing: "border-box" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", animation: "fadeIn 0.2s" }}>
      <div style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, width: 340, padding: "1.5rem", boxShadow: "0 25px 60px rgba(0,0,0,0.6)", animation: "slideUp 0.25s cubic-bezier(.34,1.56,.64,1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <span style={{ color: "#fff", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "1.1rem" }}>Add Media</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)" }}><X size={20} /></button>
        </div>
        {!preview ? (
          <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }} onClick={() => fileRef.current.click()}
            style={{ border: `2px dashed ${dragOver ? "#00e676" : "rgba(255,255,255,0.25)"}`, borderRadius: 14, height: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.6rem", cursor: "pointer", background: dragOver ? "rgba(0,230,118,0.07)" : "rgba(255,255,255,0.04)", transition: "all 0.2s", marginBottom: "1rem" }}>
            <div style={{ fontSize: "2rem" }}>📁</div>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", fontFamily: "'Nunito',sans-serif", textAlign: "center" }}>Drop video or <span style={{ color: "#00e676", fontWeight: 700 }}>browse device</span></span>
          </div>
        ) : (
          <div style={{ position: "relative", marginBottom: "1rem", borderRadius: 14, overflow: "hidden" }}>
            <video src={preview} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} muted autoPlay loop />
            <button onClick={() => { setFile(null); setPreview(null); }} style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 26, height: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><X size={13} /></button>
            <div style={{ position: "absolute", bottom: 6, left: 8, background: "rgba(0,230,118,0.9)", borderRadius: 20, padding: "2px 10px", fontSize: "0.68rem", fontWeight: 800, fontFamily: "'Nunito',sans-serif", color: "#000" }}>✓ Ready</div>
          </div>
        )}
        <input ref={fileRef} type="file" accept="video/*,image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
        <input placeholder="Title…" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} onFocus={(e) => (e.target.style.border = "1px solid #00e676")} onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.12)")} />
        <input placeholder="@your_handle" value={creator} onChange={(e) => setCreator(e.target.value)} style={{ ...inputStyle, marginBottom: "1rem" }} onFocus={(e) => (e.target.style.border = "1px solid #00e676")} onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.12)")} />
        <button onClick={() => { if (!file || !title.trim()) return; onUpload({ id: Date.now(), video: preview, title: title.trim(), creator: creator.trim() || "@you", likes: 0, views: 0 }); }} disabled={!file || !title.trim()}
          style={{ width: "100%", background: file && title.trim() ? "linear-gradient(135deg,#00e676,#00c853)" : "rgba(255,255,255,0.1)", border: "none", borderRadius: 12, color: file && title.trim() ? "#000" : "rgba(255,255,255,0.3)", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.9rem", padding: "0.75rem", cursor: file && title.trim() ? "pointer" : "not-allowed", boxShadow: file && title.trim() ? "0 4px 20px rgba(0,230,118,0.35)" : "none" }}>
          Post Reel ✦
        </button>
      </div>
    </div>
  );
}

// ─── Action Button ─────────────────────────────────────────────────────────────
function ActionBtn({ icon, label, onClick, labelColor = "#fff" }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", cursor: onClick ? "pointer" : "default", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: 0 }}>
      {icon}
      <span style={{ fontSize: "0.75rem", fontWeight: 700, fontFamily: "'Nunito',sans-serif", color: labelColor, textShadow: "0 1px 4px rgba(0,0,0,0.8)", transition: "color 0.2s" }}>{label}</span>
    </button>
  );
}

// ─── Single Reel ──────────────────────────────────────────────────────────────
function Reel({ reel, isActive, onUpload, comments, onOpenComments }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(reel.likes);
  const [added, setAdded] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const videoRef = useRef();

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) videoRef.current.play().catch(() => { });
    else { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    setPlaying(isActive);
  }, [isActive]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) { videoRef.current.play(); setPlaying(true); }
    else { videoRef.current.pause(); setPlaying(false); }
  };

  const circle = (active, color) => ({
    width: 48, height: 48, borderRadius: "50%",
    background: active ? `${color}22` : "rgba(255,255,255,0.12)",
    border: `2px solid ${active ? color : "transparent"}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(6px)", transition: "all 0.2s",
    boxShadow: active ? `0 0 14px ${color}55` : "none",
  });

  return (
    <div style={{ position: "relative", width: "100%", height: "100dvh", flexShrink: 0, scrollSnapAlign: "start", scrollSnapStop: "always", overflow: "hidden", background: "#000" }}>
      <video ref={videoRef} src={reel.video} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} loop muted playsInline onClick={togglePlay} />

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 52%)", pointerEvents: "none" }} />

      {!playing && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "rgba(0,0,0,0.45)", borderRadius: "50%", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <Play size={28} color="#fff" fill="#fff" />
        </div>
      )}

      {/* Meta */}
      <div style={{ position: "absolute", bottom: 90, left: 14, right: 74, color: "#fff", fontFamily: "'Nunito',sans-serif" }}>
        <div style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 4, textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>{reel.title}</div>
        <div style={{ fontSize: "0.85rem", opacity: 0.85, textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>{reel.creator}</div>
      </div>

      {/* Actions */}
      <div style={{ position: "absolute", right: 10, bottom: 82, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        {/* Like */}
        <ActionBtn
          icon={<div style={circle(liked, "#ff2d55")}><Heart size={24} strokeWidth={2} style={{ fill: liked ? "#ff2d55" : "transparent", color: liked ? "#ff2d55" : "#fff", transition: "all 0.2s" }} /></div>}
          label={formatCount(likeCount)}
          onClick={() => { setLiked(p => !p); setLikeCount(p => liked ? p - 1 : p + 1); }}
          labelColor={liked ? "#ff2d55" : "#fff"}
        />

        {/* Comments */}
        <ActionBtn
          icon={
            <div style={{ ...circle(false, "#fff"), position: "relative" }}>
              <MessageCircle size={24} strokeWidth={2} color="#fff" />
              {comments.length > 0 && (
                <div style={{ position: "absolute", top: -2, right: -2, background: "#ff0000", borderRadius: "50%", minWidth: 16, height: 16, fontSize: "0.6rem", fontWeight: 800, fontFamily: "'Nunito',sans-serif", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>
                  {comments.length > 99 ? "99+" : comments.length}
                </div>
              )}
            </div>
          }
          label={formatCount(comments.length)}
          onClick={() => onOpenComments(reel.id)}
          labelColor="#fff"
        />

        {/* Views */}
        <ActionBtn icon={<div style={circle(false, "#fff")}><Eye size={24} strokeWidth={2} color="#fff" /></div>} label={formatCount(reel.views)} />

        {/* Add */}
        <ActionBtn
          icon={<div style={circle(added, "#00e676")}><Plus size={24} color={added ? "#00e676" : "#fff"} strokeWidth={2.5} /></div>}
          label={added ? "Added" : "Add"}
          onClick={() => setShowUpload(true)}
          labelColor={added ? "#00e676" : "#fff"}
        />
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUpload={(r) => { setAdded(true); onUpload(r); setShowUpload(false); }} />}
    </div>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────
export default function ReelsPage() {
  const [reels, setReels] = useState(initialReels);
  const [activeIndex, setActiveIndex] = useState(0);
  const [allComments, setAllComments] = useState(seedComments);
  const [openCommentsId, setOpenCommentsId] = useState(null);
  const containerRef = useRef();

  const NAVBAR_HEIGHT = 80; // matches your navbar height

  const handleScroll = () => {
    if (!containerRef.current) return;
    setActiveIndex(
      Math.round(
        containerRef.current.scrollTop /
        containerRef.current.clientHeight
      )
    );
  };

  const handleUpload = (reel) => {
    setReels(prev => [reel, ...prev]);
    setAllComments(prev => ({ [reel.id]: [], ...prev }));
    setActiveIndex(0);
    setTimeout(() => {
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleAddComment = (reelId, comment) => {
    setAllComments(prev => ({
      ...prev,
      [reelId]: [...(prev[reelId] || []), comment],
    }));
  };

  const handleLikeComment = (reelId, commentId) => {
    setAllComments(prev => ({
      ...prev,
      [reelId]: prev[reelId].map(c =>
        c.id === commentId
          ? {
            ...c,
            liked: !c.liked,
            likes: c.liked ? c.likes - 1 : c.likes + 1,
          }
          : c
      ),
    }));
  };

  return (
    <>
      <style>{`
  ::-webkit-scrollbar { display: none; }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes slideUp { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  @keyframes sheetUp { from { transform: translateX(-50%) translateY(100%) } to { transform: translateX(-50%) translateY(0) } }
`}</style>


      {/* Navbar */}
      <Navbar />

      {/* Reel viewport under navbar */}
      <div
        style={{
          height: `calc(100dvh - ${NAVBAR_HEIGHT}px)`,
          marginTop: `${NAVBAR_HEIGHT}px`,
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
        }}
      >
        <div
          ref={containerRef}
          onScroll={handleScroll}
          style={{
            height: "100%",
            width: "calc(100dvh * 9 / 16)",
            maxWidth: "100vw",
            overflowY: "scroll",
            scrollSnapType: "y mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            position: "relative",
          }}
        >
          {reels.map((reel, i) => (
            <Reel
              key={reel.id}
              reel={reel}
              isActive={i === activeIndex}
              onUpload={handleUpload}
              comments={allComments[reel.id] || []}
              onOpenComments={setOpenCommentsId}
            />
          ))}
        </div>
      </div>

      {openCommentsId !== null && (
        <CommentPanel
          reelId={openCommentsId}
          comments={allComments[openCommentsId] || []}
          onClose={() => setOpenCommentsId(null)}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
        />
      )}
    </>
  );
}
