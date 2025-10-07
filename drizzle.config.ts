import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_FILE ? `./${process.env.DB_FILE}` : "./klystra.db",
  },
});
