import express from "express";
import path from "path";
import { ViteDevServer, createServer as createViteServer } from "vite";
import type { Express } from "express";

// 🧩 Vite setup for local development
export async function setupVite(app: Express, server: any) {
  const vite: ViteDevServer = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);
  console.log("⚙️ Vite development server running...");
}

// 🧱 Static serve setup for production (Render, Vercel, etc.)
export function serveStatic(app: Express) {
  const distPath = path.join(__dirname, "../client/dist");

  app.use(express.static(distPath));

  // ✅ React Router fallback (for all frontend routes)
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  console.log("📦 Serving static files from:", distPath);
}

// 🪵 Simple logger
export function log(message: string) {
  console.log(`[Klystra-Agency] ${message}`);
}
