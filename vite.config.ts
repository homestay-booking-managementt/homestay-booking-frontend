// vite.config.ts
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";

export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: "gzip", deleteOriginalAssets: false }),
  ],
  server: {
    open: true,
    port: 3200,
    host: "0.0.0.0",
    proxy: {
      // FE gọi /auth/... -> Vite proxy sang auth-service
      "/auth": {
        target: "http://localhost:8081",
        changeOrigin: true,
        secure: false
      },
      // FE gọi /api/v1/host/dashboard/... -> Vite proxy sang API Gateway
      "/api/v1/host/dashboard": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false
      },
      // FE gọi /api/v1/host/... -> Vite proxy sang booking-service
      "/api/v1/host": {
        target: "http://localhost:8084",
        changeOrigin: true,
        secure: false
      },
      // FE gọi /api/v1/bookings/... -> Vite proxy sang booking-service
      "/api/v1/bookings": {
        target: "http://localhost:8084",
        changeOrigin: true,
        secure: false
      },
      // FE gọi /api/admin/... -> Vite proxy sang admin-service
      "/api/admin": {
        target: "http://localhost:8083",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      // FE gọi /api/upload -> Vite proxy sang homestay-service (upload images)
      "/api/upload": {
        target: "http://localhost:8082",
        changeOrigin: true,
        secure: false
      },
      // FE gọi /api/homestays/... -> Vite proxy sang homestay-service
      "/api/homestays": {
        target: "http://localhost:8082",
        changeOrigin: true,
        secure: false
      },
      // FE gọi /uploads/... -> Vite proxy sang homestay-service (serve uploaded images)
      "/uploads": {
        target: "http://localhost:8082",
        changeOrigin: true,
        secure: false
      },
      // FE gọi /api/... (fallback) -> auth-service (for user endpoints)
      "/api": {
        target: "http://localhost:8081",
        changeOrigin: true,
        secure: false
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          bootstrap: ["bootstrap"],
          "react-router": ["react-dom", "react-router", "react-router-dom"],
        },
      },
    },
  },
});
