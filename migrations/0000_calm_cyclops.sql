CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `social_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`platform` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`icon` text NOT NULL,
	`image` text NOT NULL,
	`images` text DEFAULT '[]',
	`lead_count` text,
	`videos` text,
	`metrics` text NOT NULL,
	`reach` text NOT NULL,
	`engagement` text NOT NULL,
	`campaign_url` text,
	`order` text DEFAULT '0',
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`is_admin` text DEFAULT 'false' NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE TABLE `video_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`duration` text NOT NULL,
	`quality` text NOT NULL,
	`thumbnail` text NOT NULL,
	`video_url` text NOT NULL,
	`category` text NOT NULL,
	`order` text DEFAULT '0',
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `website_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`image` text NOT NULL,
	`demo_url` text NOT NULL,
	`github_url` text NOT NULL,
	`tags` text DEFAULT '[]',
	`order` text DEFAULT '0',
	`created_at` integer
);
