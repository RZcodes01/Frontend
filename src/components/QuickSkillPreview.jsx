import React, { useState, useRef } from "react";
import { Play, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickSkillPreview() {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const previewVideo = "https://res.cloudinary.com/dkiuhq7gb/video/upload/q_auto/v1771481879/reelsFolder/fbcdje7v8iadiqfm3ymd.mp4";

  const goToSkills = () => navigate("/quickskills");

  const handleMouseEnter = () => {
    setIsHovered(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <section style={{ padding: "60px 20px", background: "#000", textAlign: "center" }}>
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#fff", fontSize: "2.5rem", fontWeight: 800, marginBottom: "10px" }}>
          Master Skills in <span style={{ color: "#ff2d55" }}>Seconds</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.1rem" }}>
          Watch bite-sized tutorials just like YouTube Shorts.
        </p>
      </div>

      <div 
        onClick={goToSkills} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        aria-label="View Skill Preview"
        style={{
          width: "280px",
          height: "450px",
          borderRadius: "16px",
          background: "#111",
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
          margin: "0 auto",
          transition: "transform 0.3s ease",
          transform: isHovered ? "scale(1.05)" : "scale(1)",
          boxShadow: isHovered ? "0 10px 30px rgba(255, 45, 85, 0.2)" : "none"
        }}
      >
        <video 
          ref={videoRef}
          src={previewVideo}
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isHovered ? 1 : 0.7,
            transition: "opacity 0.3s"
          }}
        />

        {!isHovered && (
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,0.2)"
          }}>
            <Play size={48} color="#fff" fill="#fff" />
          </div>
        )}

        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px 15px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
          textAlign: "left"
        }}>
          <h3 style={{ color: "#fff", fontSize: "1rem", fontWeight: 700, margin: 0 }}>
            Learn Today
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "5px", color: "rgba(255,255,255,0.7)", fontSize: "0.8rem" }}>
            <Eye size={14} /> 15K views
          </div>
        </div>
      </div>
      
      <button 
        onClick={goToSkills}
        style={{
          marginTop: "30px",
          padding: "12px 24px",
          borderRadius: "30px",
          border: "none",
          background: "#ff2d55",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer"
        }}
      >
        View All QuickSkills
      </button>
    </section>
  );
}