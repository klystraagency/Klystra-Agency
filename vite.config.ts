import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // Use '/' on Vercel; keep GitHub Pages base otherwise
  base: (process.env.VERCEL === "1" || process.env.VERCEL === "true") ? "/" : "/Klystra-Agency/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client/src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    // Output to client/dist on Vercel static hosting; otherwise into server/public for Node serve
    outDir: (process.env.VERCEL === "1" || process.env.VERCEL === "true")
      ? path.resolve(import.meta.dirname, "client", "dist")
      : path.resolve(import.meta.dirname, "server/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
