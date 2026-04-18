import { useEffect, useState, useRef } from "react";
import Hls from "hls.js";
import { useParams } from "react-router-dom";
import api from "../services/api";

import { useNavigate } from "react-router-dom";
import logo from "../assets/MaAz_Logo.png";



function CoursePlayer() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [modules, setModules] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [openModule, setOpenModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);

  const videoRef = useRef(null);

  // 📦 Fetch Data
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await api.get(`/students/course/${id}/full-content`);
      const data = res.data.modules || [];

      setModules(data);

      if (data.length > 0) {
  setOpenModule(data[0].module_id);
  setCurrentVideo(null);   // ✅ STOP AUTO PLAY
}
    } catch (err) {
      console.error(err);
    }
  };

  // 🎥 HLS + MP4 PLAYER (🔥 FINAL FIX)
  useEffect(() => {
    if (!currentVideo || !videoRef.current) return;

    const video = videoRef.current;

    // 🔥 CLEAR PREVIOUS VIDEO (VERY IMPORTANT)
    video.pause();
    video.removeAttribute("src");
    video.load();

    let hls;

    console.log("PLAYING VIDEO:", currentVideo);

    if (currentVideo.includes(".m3u8") && Hls.isSupported()) {
      // 🔥 Bunny CDN (HLS)
      hls = new Hls();
      hls.loadSource(currentVideo);
      hls.attachMedia(video);
    } else {
      // 🔥 MaAz (MP4)
      video.src = currentVideo;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [currentVideo]);

  return (
  <div style={{ padding: "20px" }}>

    {/* BACK BUTTON */}
    <div style={{ marginBottom: "15px" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "#e74c3c",
          color: "#fff",
          border: "none",
          padding: "6px 14px",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        ← Back to Courses
      </button>
    </div>

    {/* MAIN LAYOUT */}
    <div style={{ display: "flex", gap: "20px" }}>

      {/* LEFT SIDE (YOUR EXISTING MODULE UI) */}
      <div style={{
        width: "350px",
        maxHeight: "80vh",
        overflowY: "auto"
      }}>

        {modules.map((module, i) => (
          <div key={module.module_id} style={{ marginBottom: "10px" }}>

            <div
              onClick={() =>
                setOpenModule(
                  openModule === module.module_id ? null : module.module_id
                )
              }
              style={{
                background: "#3b82a6",
                color: "#fff",
                padding: "12px 16px",
                cursor: "pointer",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                borderRadius: "6px"
              }}
            >
              <span>{i + 1}. {module.module_title}</span>
              <span>{openModule === module.module_id ? "▲" : "▼"}</span>
            </div>

            {openModule === module.module_id && (
              <div
                style={{
                  border: "1px solid #ddd",
                  borderTop: "none",
                  borderRadius: "0 0 6px 6px",
                  background: "#f9f9f9"
                }}
              >
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.lesson_id}
                    onClick={() => {
                      console.log("LESSON DATA:", lesson);
                      console.log("VIDEO URL:", lesson.video_url);

                      if (!lesson.video_url) {
                        alert("Video not available");
                        return;
                      }
                      setCurrentVideo(lesson.video_url);
                      setCurrentLesson(lesson); // ✅ NEW
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px",
                      borderBottom: "1px solid #eee",
                      cursor: "pointer",
                      background:
                        currentLesson?.lesson_id === lesson.lesson_id
                          ? "#e0f2fe"
                          : "#fff",

                      borderLeft:
                        currentLesson?.lesson_id === lesson.lesson_id
                          ? "4px solid #3b82f6"
                          : "none"
                      
                    }}
                  >
                    <div style={{
                      width: "50px",
                      height: "50px",
                      background: "#111",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "15px"
                    }}>
                      ▶
                    </div>
                    <div style={{ flex: 1 }}>
  <div style={{ fontWeight: "500" }}>
    {lesson.lesson_title}
  </div>

  {/* 🔥 ADD THIS HERE */}
  {currentLesson?.lesson_id === lesson.lesson_id && (
  <div
    style={{
      display: "inline-block",
      marginTop: "4px",
      fontSize: "11px",
      padding: "3px 8px",
      borderRadius: "20px",
      background: "#dbeafe",
      color: "#1d4ed8",
      fontWeight: "500"
    }}
  >
    ▶ Now Playing
  </div>
)}

  {/* DOWNLOAD BUTTON */}
  {lesson.document_url && lesson.allow_download && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        window.open(`http://localhost:5000${lesson.document_url}`, "_blank");
      }}
      style={{
        marginTop: "5px",
        fontSize: "12px",
        padding: "4px 8px",
        borderRadius: "6px",
        border: "none",
        background: "#eef2ff",
        color: "#3b82f6",
        cursor: "pointer"
      }}
    >
      📄 Download
    </button>
  )}

  <div style={{ fontSize: "12px", color: "#777" }}>
    {module.module_title}
  </div>
</div>
                    
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* RIGHT SIDE */}
<div style={{ flex: 1 }}>

  {/* VIDEO */}
  <div style={{ marginBottom: "20px" }}>
    {currentVideo ? (
      <video
        ref={videoRef}
        controls
        autoPlay
        style={{
          width: "100%",
          height: "700px",
          borderRadius: "12px",
          background: "#000",
          objectFit: "contain"
        }}
      />
    ) : (
      <div
        style={{
          width: "100%",
          height: "450px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            padding: "30px 40px",
            borderRadius: "16px",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff"
          }}
        >
          <img
            src={logo}
            alt="MaAz Logo"
            style={{ width: "80px", marginBottom: "10px" }}
          />

          <h2 style={{ marginBottom: "8px" }}>
            Ready to Learn?
          </h2>

          <p style={{ color: "#cbd5e1", fontSize: "14px", marginBottom: "18px" }}>
            Select a lesson from the left to start your journey
          </p>

          <button
            style={{
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Happy Learning 🚀
          </button>
        </div>
      </div>
    )}
  </div>



        {/* NEW RESOURCES SECTION */}
        {currentLesson?.document_url && currentLesson?.allow_download && (
          <div style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            background: "#f8fafc",   // 🔥 updated
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)" // 🔥 added
          }}>
            <h3>📎 Resources</h3>

            <button
              onClick={() =>
                window.open(`http://localhost:5000${currentLesson.document_url}`)
              }
              style={{
                marginTop: "10px",
                padding: "8px 14px",
                borderRadius: "6px",
                border: "none",
                background: "#3b82f6",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              Download Notes
            </button>
          </div>
        )}
      </div>

    </div>
  </div>
);
}

export default CoursePlayer;
