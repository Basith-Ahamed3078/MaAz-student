import axios from "axios";

// ✅ Create axios instance
const api = axios.create({
  //baseURL: "http://localhost:5000/api",
  baseURL: "https://maaz-backend-production.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // 🔥 ensure headers exists
      if (!config.headers) {
        config.headers = {};
      }

      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response && error.response.status === 401) {
      console.warn("🔒 Unauthorized → redirecting to login");

      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
