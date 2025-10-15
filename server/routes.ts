import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import { storage } from "./storage";
import multer from "multer";
import fs from "fs";
import path from "path";
import { 
  insertContactMessageSchema,
  insertWebsiteProjectSchema,
  insertVideoProjectSchema,
  insertSocialProjectSchema
} from "@shared/schema";
import { z } from "zod";

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: "Unauthorized" });
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && (req.user as any)?.isAdmin === "true") {
    return next();
  }
  res.status(403).json({ success: false, message: "Forbidden - Admin access required" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Configure multer storage
  const upload = multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, uploadsDir),
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext)
          .toLowerCase()
          .replace(/[^a-z0-9-_]/g, "-")
          .slice(0, 80);
        const unique = Date.now();
        cb(null, `${base}-${unique}${ext}`);
      },
    }),
    limits: {
      fileSize: 500 * 1024 * 1024, // 500MB max per file
    },
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ success: false, message: info?.message || "Authentication failed" });
      }
      
      req.session.regenerate((regenerateErr) => {
        if (regenerateErr) {
          return next(regenerateErr);
        }
        
        req.logIn(user, (loginErr) => {
          if (loginErr) {
            return next(loginErr);
          }
          
          res.json({ 
            success: true, 
            user: { 
              id: user.id, 
              username: user.username,
              isAdmin: user.isAdmin
            } 
          });
        });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ 
        user: { 
          id: (req.user as any).id, 
          username: (req.user as any).username,
          isAdmin: (req.user as any).isAdmin
        } 
      });
    } else {
      res.status(401).json({ user: null });
    }
  });
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      const message = await storage.createContactMessage(validatedData);
      
      console.log("New contact message received:", {
        from: `${message.firstName} ${message.lastName} <${message.email}>`,
        subject: message.subject,
        message: message.message
      });
      
      res.json({ 
        success: true, 
        message: "Thank you for your message! We will get back to you soon.",
        id: message.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error("Error saving contact message:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  app.get("/api/contact", requireAdmin, async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Combined projects endpoint for frontend
  app.get("/api/projects", async (req, res) => {
    try {
      const [websiteProjects, videoProjects, socialProjects] = await Promise.all([
        storage.getAllWebsiteProjects(),
        storage.getAllVideoProjects(),
        storage.getAllSocialProjects()
      ]);
      
      res.json({
        website: websiteProjects,
        video: videoProjects,
        social: socialProjects
      });
    } catch (error) {
      console.error("Error fetching all projects:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get("/api/projects/website", async (req, res) => {
    try {
      const projects = await storage.getAllWebsiteProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching website projects:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.post("/api/projects/website", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertWebsiteProjectSchema.parse(req.body);
      const project = await storage.createWebsiteProject(validatedData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating website project:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  app.put("/api/projects/website/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.updateWebsiteProject(id, req.body);
      if (!project) {
        res.status(404).json({ success: false, message: "Project not found" });
      } else {
        res.json(project);
      }
    } catch (error) {
      console.error("Error updating website project:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.delete("/api/projects/website/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteWebsiteProject(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: "Project not found" });
      } else {
        res.json({ success: true, message: "Project deleted" });
      }
    } catch (error) {
      console.error("Error deleting website project:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get("/api/projects/video", async (req, res) => {
    try {
      const projects = await storage.getAllVideoProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching video projects:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Upload endpoints
  app.post("/api/upload/video", requireAdmin, upload.single("video"), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const publicUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: publicUrl });
  });

  app.post("/api/upload/image", requireAdmin, upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const publicUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: publicUrl });
  });

  app.post("/api/projects/video", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertVideoProjectSchema.parse(req.body);
      const project = await storage.createVideoProject(validatedData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating video project:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  app.put("/api/projects/video/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.updateVideoProject(id, req.body);
      if (!project) {
        res.status(404).json({ success: false, message: "Project not found" });
      } else {
        res.json(project);
      }
    } catch (error) {
      console.error("Error updating video project:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.delete("/api/projects/video/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteVideoProject(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: "Project not found" });
      } else {
        res.json({ success: true, message: "Project deleted" });
      }
    } catch (error) {
      console.error("Error deleting video project:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get("/api/projects/social", async (req, res) => {
    try {
      const projects = await storage.getAllSocialProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching social projects:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.post("/api/projects/social", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertSocialProjectSchema.parse(req.body);
      const project = await storage.createSocialProject(validatedData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating social project:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  app.put("/api/projects/social/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.updateSocialProject(id, req.body);
      if (!project) {
        res.status(404).json({ success: false, message: "Project not found" });
      } else {
        res.json(project);
      }
    } catch (error) {
      console.error("Error updating social project:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.delete("/api/projects/social/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteSocialProject(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: "Project not found" });
      } else {
        res.json({ success: true, message: "Project deleted" });
      }
    } catch (error) {
      console.error("Error deleting social project:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
