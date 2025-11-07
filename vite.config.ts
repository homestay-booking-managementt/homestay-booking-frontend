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
      // FE gọi /auth/... -> Vite proxy sang backend
      "/api": {
        target: "http://localhost:3203",
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


