import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
  logout,
} from "../utils/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/",
});

/**
 * Login/register must not send a stale JWT: JWTAuthentication would reject an
 * expired/invalid Bearer token with 401 before the view runs (even with AllowAny).
 */
const shouldAttachAccessToken = (config) => {
  const path = `${config.baseURL || ""}${config.url || ""}`.replace(/\\/g, "/");
  const rel = (config.url || "").split("?")[0] || "";
  if (rel.includes("auth/login") || rel.includes("auth/register")) return false;
  if (path.includes("/auth/login") || path.includes("/auth/register")) return false;
  return true;
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && shouldAttachAccessToken(config)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      const refresh = getRefreshToken();
      if (!refresh) {
        logout();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}auth/refresh/`,
          { refresh }
        );
        updateAccessToken(data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
