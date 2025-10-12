import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { setupVite, serveStatic, log } from "./vite";
import { createApp } from "./app";

const app = createApp();

(async () => {
  const server = createServer(app);

  // ✅ Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error("Error:", err);
  });

  if (process.env.NODE_ENV === "development") {
    // ✅ Local dev (Vite + API)
    await setupVite(app, server);
  } else {
    // ✅ Production (Vercel build)
    serveStatic(app);

    // React router fallback (important for /admin etc.)
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile("index.html", { root: "client/dist" });
    });
  }

  // ✅ Port setup for local only
  const port = parseInt(process.env.PORT || "5000", 10);

  // ⚙️ Only listen locally — not required for Vercel
  if (process.env.VERCEL !== "1") {
    server.listen(port, "0.0.0.0", () => {
      log(`🚀 Server running on http://localhost:${port}`);
    });
  }
})();
