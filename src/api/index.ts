/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

// VITE ENV VARS
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const MACHINE_TYPE_TO_FETCH = import.meta.env.VITE_MACHINE_TYPE_TO_FETCH;
export const APP_VERSION = import.meta.env.VITE_VITE_APP_VERSION;

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Axios Config
export const api = axios.create({
  baseURL: API_BASE_URL,
  //   withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `JWT ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh_token = localStorage.getItem("zad-assist-jwt-refresh");
        // console.log(refresh_token);

        if (!refresh_token) {
          //   console.log("inside !refresh_token");
          // Logout: You can customize this behavior
          window.location.href = "/login"; // or dispatch logout Redux action
          return Promise.reject("Refresh token not found");
        }

        const { data } = await axios.post(`${API_BASE_URL}/auth/jwt/refresh`, {
          refresh: refresh_token,
        });
        const newToken = data.access;

        // store it (e.g., in localStorage or memory)
        localStorage.setItem("zad-assist-jwt-access", newToken);
        api.defaults.headers.common["Authorization"] = `JWT ${newToken}`;

        processQueue(null, newToken);

        originalRequest.headers["Authorization"] = `JWT ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("zad-assist-jwt-access");
  if (token) config.headers.Authorization = `JWT ${token}`;
  return config;
});
