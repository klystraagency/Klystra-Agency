import { 
  type User, 
  type InsertUser, 
  type ContactMessage, 
  type InsertContactMessage,
  type WebsiteProject,
  type InsertWebsiteProject,
  type VideoProject,
  type InsertVideoProject,
  type SocialProject,
  type InsertSocialProject,
  users,
  contactMessages,
  websiteProjects,
  videoProjects,
  socialProjects
} from "@shared/schema";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

// Initialize database with proper path handling for Vercel
function initializeDatabase() {
  // For Vercel serverless, use /tmp directory which is writable; copy bundled DB if present for read access
  const isVercel = process.env.VERCEL === "1";
  const bundledDbPath = path.resolve(process.cwd(), "klystra.db");
  const dbPath = isVercel ? "/tmp/klystra.db" : (process.env.DB_FILE || "klystra.db");

  if (isVercel) {
    try {
      // If a bundled DB exists in the deployment, copy it to /tmp on cold start (read-only baseline data)
      if (fs.existsSync(bundledDbPath) && !fs.existsSync(dbPath)) {
        fs.copyFileSync(bundledDbPath, dbPath);
      }
    } catch (copyErr) {
      console.error("Failed to prepare SQLite database in /tmp:", copyErr);
    }
  }
  
  // Ensure directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  const sqlite = new Database(dbPath);
  const db = drizzle(sqlite);
  
  // Initialize tables if they don't exist (for Vercel deployments)
  if (process.env.VERCEL === "1") {
    try {
      // Create tables if they don't exist
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          is_admin TEXT DEFAULT 'false' NOT NULL,
          created_at INTEGER DEFAULT (strftime('%s', 'now'))
        );
        
        CREATE TABLE IF NOT EXISTS contact_messages (
          id TEXT PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL,
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at INTEGER DEFAULT (strftime('%s', 'now'))
        );
        
        CREATE TABLE IF NOT EXISTS website_projects (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          image TEXT NOT NULL,
          demo_url TEXT NOT NULL,
          github_url TEXT NOT NULL,
          tags TEXT DEFAULT '[]',
          "order" TEXT DEFAULT '0',
          created_at INTEGER DEFAULT (strftime('%s', 'now'))
        );
        
        CREATE TABLE IF NOT EXISTS video_projects (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          duration TEXT NOT NULL,
          quality TEXT NOT NULL,
          thumbnail TEXT NOT NULL,
          video_url TEXT NOT NULL,
          category TEXT NOT NULL,
          "order" TEXT DEFAULT '0',
          created_at INTEGER DEFAULT (strftime('%s', 'now'))
        );
        
        CREATE TABLE IF NOT EXISTS social_projects (
          id TEXT PRIMARY KEY,
          platform TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          icon TEXT NOT NULL,
          image TEXT NOT NULL,
          images TEXT DEFAULT '[]',
          lead_count TEXT,
          videos TEXT,
          metrics TEXT NOT NULL,
          reach TEXT NOT NULL,
          engagement TEXT NOT NULL,
          campaign_url TEXT,
          "order" TEXT DEFAULT '0',
          created_at INTEGER DEFAULT (strftime('%s', 'now'))
        );
      `);
      
      // Insert default admin user if it doesn't exist
      const adminExists = sqlite.prepare("SELECT id FROM users WHERE username = ?").get("admin");
      if (!adminExists) {
        const bcrypt = require("bcrypt");
        const hashedPassword = bcrypt.hashSync("admin123", 10);
        sqlite.prepare(`
          INSERT INTO users (id, username, password, is_admin) 
          VALUES (?, ?, ?, ?)
        `).run(crypto.randomUUID(), "admin", hashedPassword, "true");
      }
      
      // Insert sample projects if they don't exist
      const websiteCount = sqlite.prepare("SELECT COUNT(*) as count FROM website_projects").get() as { count: number };
      if (websiteCount.count === 0) {
        sqlite.prepare(`
          INSERT INTO website_projects (id, title, description, image, demo_url, github_url, tags) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          crypto.randomUUID(),
          "E-Commerce Platform",
          "A modern e-commerce platform built with React and Node.js",
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500",
          "https://demo.example.com",
          "https://github.com/example/ecommerce",
          '["React", "Node.js", "PostgreSQL"]'
        );
      }
      
      const videoCount = sqlite.prepare("SELECT COUNT(*) as count FROM video_projects").get() as { count: number };
      if (videoCount.count === 0) {
        sqlite.prepare(`
          INSERT INTO video_projects (id, title, description, duration, quality, thumbnail, video_url, category) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          crypto.randomUUID(),
          "Product Demo Video",
          "Professional product demonstration video with smooth transitions",
          "2:30",
          "4K",
          "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500",
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          "Product Demo"
        );
      }
      
      const socialCount = sqlite.prepare("SELECT COUNT(*) as count FROM social_projects").get() as { count: number };
      if (socialCount.count === 0) {
        sqlite.prepare(`
          INSERT INTO social_projects (id, platform, title, description, icon, image, metrics, reach, engagement) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          crypto.randomUUID(),
          "Instagram",
          "Brand Awareness Campaign",
          "Successful Instagram campaign that increased brand visibility",
          "instagram",
          "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=500",
          '{"impressions": "50K+", "clicks": "2.5K", "conversions": "150"}',
          "50K+",
          "8.5%"
        );
      }
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }
  
  return { sqlite, db };
}

const { sqlite, db } = initializeDatabase();

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  
  getAllWebsiteProjects(): Promise<WebsiteProject[]>;
  getWebsiteProject(id: string): Promise<WebsiteProject | undefined>;
  createWebsiteProject(project: InsertWebsiteProject): Promise<WebsiteProject>;
  updateWebsiteProject(id: string, project: Partial<InsertWebsiteProject>): Promise<WebsiteProject | undefined>;
  deleteWebsiteProject(id: string): Promise<boolean>;
  
  getAllVideoProjects(): Promise<VideoProject[]>;
  getVideoProject(id: string): Promise<VideoProject | undefined>;
  createVideoProject(project: InsertVideoProject): Promise<VideoProject>;
  updateVideoProject(id: string, project: Partial<InsertVideoProject>): Promise<VideoProject | undefined>;
  deleteVideoProject(id: string): Promise<boolean>;
  
  getAllSocialProjects(): Promise<SocialProject[]>;
  getSocialProject(id: string): Promise<SocialProject | undefined>;
  createSocialProject(project: InsertSocialProject): Promise<SocialProject>;
  updateSocialProject(id: string, project: Partial<InsertSocialProject>): Promise<SocialProject | undefined>;
  deleteSocialProject(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(insertMessage).returning();
    return result[0];
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages);
  }

  async getAllWebsiteProjects(): Promise<WebsiteProject[]> {
    return db.select().from(websiteProjects);
  }

  async getWebsiteProject(id: string): Promise<WebsiteProject | undefined> {
    const result = await db.select().from(websiteProjects).where(eq(websiteProjects.id, id));
    return result[0];
  }

  async createWebsiteProject(project: InsertWebsiteProject): Promise<WebsiteProject> {
    const result = await db.insert(websiteProjects).values(project).returning();
    return result[0];
  }

  async updateWebsiteProject(id: string, project: Partial<InsertWebsiteProject>): Promise<WebsiteProject | undefined> {
    const result = await db.update(websiteProjects).set(project).where(eq(websiteProjects.id, id)).returning();
    return result[0];
  }

  async deleteWebsiteProject(id: string): Promise<boolean> {
    const result = await db.delete(websiteProjects).where(eq(websiteProjects.id, id)).returning();
    return result.length > 0;
  }

  async getAllVideoProjects(): Promise<VideoProject[]> {
    return db.select().from(videoProjects);
  }

  async getVideoProject(id: string): Promise<VideoProject | undefined> {
    const result = await db.select().from(videoProjects).where(eq(videoProjects.id, id));
    return result[0];
  }

  async createVideoProject(project: InsertVideoProject): Promise<VideoProject> {
    const result = await db.insert(videoProjects).values(project).returning();
    return result[0];
  }

  async updateVideoProject(id: string, project: Partial<InsertVideoProject>): Promise<VideoProject | undefined> {
    const result = await db.update(videoProjects).set(project).where(eq(videoProjects.id, id)).returning();
    return result[0];
  }

  async deleteVideoProject(id: string): Promise<boolean> {
    const result = await db.delete(videoProjects).where(eq(videoProjects.id, id)).returning();
    return result.length > 0;
  }

  async getAllSocialProjects(): Promise<SocialProject[]> {
    return db.select().from(socialProjects);
  }

  async getSocialProject(id: string): Promise<SocialProject | undefined> {
    const result = await db.select().from(socialProjects).where(eq(socialProjects.id, id));
    return result[0];
  }

  async createSocialProject(project: InsertSocialProject): Promise<SocialProject> {
    const result = await db.insert(socialProjects).values(project).returning();
    return result[0];
  }

  async updateSocialProject(id: string, project: Partial<InsertSocialProject>): Promise<SocialProject | undefined> {
    const result = await db.update(socialProjects).set(project).where(eq(socialProjects.id, id)).returning();
    return result[0];
  }

  async deleteSocialProject(id: string): Promise<boolean> {
    const result = await db.delete(socialProjects).where(eq(socialProjects.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
