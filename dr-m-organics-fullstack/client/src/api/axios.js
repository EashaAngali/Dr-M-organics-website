import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000"
});

api.interceptors.request.use((config) => {
  const admin = localStorage.getItem("drm_admin");
  if (admin) {
    const parsedAdmin = JSON.parse(admin);
    if (parsedAdmin?.token) {
      config.headers.Authorization = `Bearer ${parsedAdmin.token}`;
    }
  }
  return config;
});

export default api;
