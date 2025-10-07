import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: text("is_admin").default("false").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const contactMessages = sqliteTable("contact_messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export const websiteProjects = sqliteTable("website_projects", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  demoUrl: text("demo_url").notNull(),
  githubUrl: text("github_url").notNull(),
  tags: text("tags").default("[]"),
  order: text("order").default("0"),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const videoProjects = sqliteTable("video_projects", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  quality: text("quality").notNull(),
  thumbnail: text("thumbnail").notNull(),
  videoUrl: text("video_url").notNull(),
  category: text("category").notNull(),
  order: text("order").default("0"),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const socialProjects = sqliteTable("social_projects", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  platform: text("platform").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  image: text("image").notNull(),
  images: text("images").default("[]"),
  leadCount: text("lead_count"),
  videos: text("videos"),
  metrics: text("metrics").notNull(),
  reach: text("reach").notNull(),
  engagement: text("engagement").notNull(),
  campaignUrl: text("campaign_url"),
  order: text("order").default("0"),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  firstName: true,
  lastName: true,
  email: true,
  subject: true,
  message: true,
});

export const insertWebsiteProjectSchema = createInsertSchema(websiteProjects).omit({
  id: true,
  createdAt: true,
});

export const insertVideoProjectSchema = createInsertSchema(videoProjects).omit({
  id: true,
  createdAt: true,
});

export const insertSocialProjectSchema = createInsertSchema(socialProjects).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertWebsiteProject = z.infer<typeof insertWebsiteProjectSchema>;
export type WebsiteProject = typeof websiteProjects.$inferSelect;
export type InsertVideoProject = z.infer<typeof insertVideoProjectSchema>;
export type VideoProject = typeof videoProjects.$inferSelect;
export type InsertSocialProject = z.infer<typeof insertSocialProjectSchema>;
export type SocialProject = typeof socialProjects.$inferSelect;
