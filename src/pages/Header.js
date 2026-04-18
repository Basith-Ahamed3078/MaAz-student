import React from "react";

function Header({ user, onLogout }) {
  return (
    <div style={styles.header}>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
        
        <span>
          Logged in as <strong>{user?.first_name} {user?.last_name}</strong>
        </span>

        <span style={styles.roleBadge}>Student</span>

        <button onClick={onLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
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
    fontSize: "12px",
  },
  logoutBtn: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Header;