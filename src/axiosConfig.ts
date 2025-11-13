// src/axiosConfig.ts
import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { removeTokens } from "./utils/removeTokens"; // kiểm tra đúng path: utils
import { mockRefreshToken } from "./utils/mockAuth";  // kiểm tra đúng path: utils

type RefreshTokenResult = { idToken: string; refreshToken: string };
type RefreshTokenRequestFunction = () => Promise<void | RefreshTokenResult>;

let refreshTokenRequest: Promise<void | RefreshTokenResult> | null = null;

/** BẬT khi chỉ test FE (mock API) -> không auto-refresh/redirect 401 */
const USE_MOCK = false;

/** Nhận diện route auth: /auth/* hoặc /api/auth/* */
const isAuthRoute = (url?: string) => {
  if (!url) return false;
  try {
    const u = new URL(url, axios.defaults.baseURL || window.location.origin);
    return /^\/(api\/)?auth\//.test(u.pathname);
  } catch {
    return /^\/(api\/)?auth\//.test(url);
  }
};

/** Request interceptor: gắn Authorization cho route thường, bỏ cho /auth/* (trừ /auth/refresh và /auth/v1/me) */
const handleAxiosRequest = async (config: InternalAxiosRequestConfig) => {
  const url = config.url ?? "";

  // Các endpoint auth KHÔNG CẦN token: login, register, logout (public endpoints)
  const publicAuthEndpoints = /\/(auth\/v1\/(login|register|logout))/;

  // Không gắn token cho public auth endpoints
  if (publicAuthEndpoints.test(url)) {
    return config;
  }

  if (/\/auth\/refresh/.test(url)) {
    const refresh_token = localStorage.getItem("refresh_token");
    if (refresh_token) {
      config.headers.set?.("Authorization", "Bearer " + refresh_token);
    }
  } else {
    const id_token = localStorage.getItem("id_token");
    if (id_token) {
      config.headers.set?.("Authorization", "Bearer " + id_token);
    }
  }

  return config;
};

/** Response interceptor: refresh token khi 401 (trừ /auth/*) */
export const handleAxiosResponseError = async (error: unknown) => {
  const err = error as {
    config?: InternalAxiosRequestConfig;
    response?: { status: number };
  };
  const originalRequest = err.config;
  const status = err.response?.status;

  // Chỉ xử lý refresh nếu: 401 + có request gốc + không phải auth route + KHÔNG ở mock mode
  if (!USE_MOCK && status === axios.HttpStatusCode.Unauthorized && originalRequest && !isAuthRoute(originalRequest.url)) {
    try {
      refreshTokenRequest = refreshTokenRequest ?? refreshToken();
      const res = await refreshTokenRequest;

      if (res?.idToken && res?.refreshToken) {
        refreshTokenRequest = null;

        // cập nhật header mặc định & request gốc
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.idToken}`;
        (originalRequest.headers as any)["Authorization"] = `Bearer ${res.idToken}`;

        // gọi lại request gốc
        return trackPromise(axios(originalRequest));
      } else {
        // refresh fail
        removeTokens?.();
        if (typeof window !== "undefined") window.location.replace("/401");
        return Promise.reject(error);
      }
    } catch {
      refreshTokenRequest = null;
      removeTokens?.();
      if (typeof window !== "undefined") window.location.replace("/401");
      return Promise.reject(error);
    }
  }

  // 401 cho auth route (login/register/profile fail) -> để caller xử lý (navigate /401)
  return Promise.reject(error);
};

/** Hàm refresh token: mock hoặc gọi API thật */
export const refreshToken: RefreshTokenRequestFunction = async () => {
  try {
    // MOCK MODE
    const response = await mockRefreshToken();
    if (response?.idToken && response?.refreshToken) {
      refreshTokenRequest = null;
      localStorage.setItem("id_token", response.idToken);
      localStorage.setItem("refresh_token", response.refreshToken);
      return { idToken: response.idToken, refreshToken: response.refreshToken };
    }

    // REAL API MODE (bật khi có backend)
    // const res = await axios.post("/auth/refresh");
    // if (res.data?.idToken && res.data?.refreshToken) {
    //   refreshTokenRequest = null;
    //   localStorage.setItem("id_token", res.data.idToken);
    //   localStorage.setItem("refresh_token", res.data.refreshToken);
    //   return { idToken: res.data.idToken, refreshToken: res.data.refreshToken };
    // }
  } catch {
    removeTokens?.();
  }
  return;
};

// ====== Cấu hình mặc định ======

// Dev FE (proxy Vite) / Mock -> để rỗng để tránh gọi thẳng ra domain khác
axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL || "";

// Timeout
axios.defaults.timeout = 30000;

// Interceptors
axios.interceptors.request.use(handleAxiosRequest, (error) => Promise.reject(error));
axios.interceptors.response.use((res) => res, handleAxiosResponseError);

export default axios;

