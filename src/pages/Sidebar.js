import React from "react";

function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2 style={{ color: "#fff" }}>JT Live</h2>

      <div style={styles.menu}>
        <p style={styles.menuItem}>📚 My Courses</p>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#0f172a",
    color: "#fff",
    padding: "20px",
  },
  menu: {
    marginTop: "30px",
  },
  menuItem: {
    padding: "10px",
    cursor: "pointer",
  },
};

export default Sidebar;