import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Pure static deployment config for Replit
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: "client",
  base: "/", // Important for static deployment
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    assetsDir: "assets",
    sourcemap: false,
    minify: true,
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
  },
});