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

const databaseFile = process.env.DB_FILE || "klystra.db";
const sqlite = new Database(databaseFile);
const db = drizzle(sqlite);

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
