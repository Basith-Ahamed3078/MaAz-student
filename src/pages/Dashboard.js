import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const decoded = token
    ? JSON.parse(atob(token.split(".")[1]))
    : null;

  const studentId = decoded?.id;
  const studentName = decoded?.email || "Student";

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      if (!studentId) {
        window.location.href = "/login";
        return;
      }

      const res = await api.get(`/students/${studentId}/access`);

      const coursesData = res.data?.data || [];

      const enriched = coursesData.map((c) => ({
        ...c,
        progress: c.progress || 0,
      }));

      setCourses(enriched);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("student");

  // ❌ DO NOT REMOVE rememberMe

  window.location.href = "/login";
};

  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={{ color: "#fff" }}>MaAz</h2>
        <p style={styles.menuItem}>📚 My Courses</p>
      </div>

      {/* Right Side */}
      <div style={{ flex: 1 }}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center" }}>
            <span>
              Logged in as <strong>{studentName}</strong>
            </span>
            <span style={styles.roleBadge}>Student</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "20px" }}>
          <h2>My Courses</h2>

          {courses.length === 0 ? (
            <p>No courses assigned</p>
          ) : (
            <div style={styles.grid}>
              {courses.map((course) => (
                <div key={course.course_id} style={styles.card}>

                  {/* IMAGE FIX (FULL POSTER) */}
                  <div style={styles.imageWrapper}>
                    <img
                      src={course.thumbnail_url}
                      alt="course"
                      style={styles.image}
                    />
                  </div>

                  {/* TITLE */}
                  <h4 style={{ marginTop: "10px" }}>{course.title}</h4>

                  {/* PROGRESS */}
                  <div style={{ marginTop: "10px" }}>
                    <div style={styles.progressHeader}>
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>

                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${course.progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* EXPIRY */}
                  <p style={{ marginTop: "10px", fontSize: "13px" }}>
                    Expiry:{" "}
                    <strong>
                      {course.end_date
                        ? new Date(course.end_date).toLocaleDateString()
                        : "No limit"}
                    </strong>
                  </p>

                  <button
                    onClick={() => navigate(`/course/${course.course_id}`)}
                    style={{
                      width: "100%",
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      padding: "10px",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    Start Learning
                  </button>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#0f172a",
    padding: "20px",
    color: "#fff",
  },

  menuItem: {
    marginTop: "20px",
    cursor: "pointer",
  },

  header: {
    height: "60px",
    background: "#f5f6fa",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    borderBottom: "1px solid #ddd",
  },

  roleBadge: {
    background: "#4CAF50",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "5px",
  },

  logoutBtn: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  imageWrapper: {
  width: "100%",
  height: "260px",
  borderRadius: "12px",
  overflow: "hidden",
},

image: {
  width: "100%",
  height: "100%",
  objectFit: "cover",   // 🔥 fixes white space
},

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
  },

  progressBar: {
    width: "100%",
    height: "8px",
    background: "#eee",
    borderRadius: "5px",
  },

  progressFill: {
    height: "100%",
    background: "#4CAF50",
    borderRadius: "5px",
  },

  btn: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  },
};

export default Dashboard;