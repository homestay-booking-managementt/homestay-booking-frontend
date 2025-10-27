export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_APP_BASE_URL || "http://localhost:8000/api",
  TIMEOUT: 30000, // 30 seconds
};

export const APP_CONFIG = {
  APP_NAME: "New Project",
  APP_VERSION: "1.0.0",
};

export const AUTH_CONFIG = {
  TOKEN_KEY: "id_token",
  REFRESH_TOKEN_KEY: "refresh_token",
};
