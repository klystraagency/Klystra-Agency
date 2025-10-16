import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { setupVite, log } from "./vite";
import { createApp } from "./app";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Fix for __dirname not defined in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    // ✅ Local dev mode (Vite + API)
    await setupVite(app, server);
  } else {
    // ✅ Production mode (Render, Vercel, etc.)
    const clientDist = path.join(__dirname, "../client/dist");
    app.use(express.static(clientDist));

    // React Router fallback (for SPA)
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });

    console.log("📦 Serving static files from:", clientDist);
  }

  // ✅ Port setup
  const port = parseInt(process.env.PORT || "5000", 10);

  // ⚙️ Run the server (Render needs this)
  server.listen(port, "0.0.0.0", () => {
    log(`🚀 Server running on port ${port}`);
  });
})();
