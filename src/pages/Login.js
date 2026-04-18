import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import logo from "../assets/MaAz_Logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // ✅ LOAD SAVED DATA
  useEffect(() => {
    const saved = localStorage.getItem("rememberMe");

    if (saved) {
      const data = JSON.parse(saved);
      setEmail(data.email || "");
      setPassword(data.password || "");
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      const { token, user } = res.data.data;

      if (user.role !== "student") {
        alert("Only students allowed");
        return;
      }

      // ✅ SAVE TOKEN
      localStorage.setItem("token", token);
      localStorage.setItem("student", JSON.stringify(user));

      // ✅ REMEMBER ME LOGIC
      if (rememberMe) {
        localStorage.setItem(
          "rememberMe",
          JSON.stringify({ email, password })
        );
      } else {
        localStorage.removeItem("rememberMe");
      }

      // ✅ REDIRECT
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* LOGO */}
        <img src={logo} alt="MaAz Logo" style={styles.logoImg} />

        <h2 style={{ marginBottom: "25px" }}>
          MaAz Student Login
        </h2>

        <form onSubmit={handleLogin}>
          
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          {/* 🔐 PASSWORD WITH EYE ICON */}
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...styles.input, marginBottom: "0" }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "14px",
                color: "#555"
              }}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          {/* ✅ REMEMBER ME */}
          <div style={styles.rememberBox}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label style={{ marginLeft: "8px", fontSize: "14px" }}>
              Remember Me
            </label>
          </div>

          <button type="submit" style={styles.button}>
            Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;

const styles = {
  container: {
    height: "100vh",
    background: "#f4f6f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "380px",
    background: "#fff",
    padding: "35px",
    borderRadius: "14px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  logoImg: {
    width: "180px",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#2c3e50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  rememberBox: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    justifyContent: "flex-start"
  }
};