import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from "../server/app";
import serverlessExpress from "@vendia/serverless-express";

// Build the Express app once and wrap it for Vercel serverless
const app = createApp();
const handler = serverlessExpress({ app });

export default async function vercelHandler(req: VercelRequest, res: VercelResponse) {
  // Delegate handling to serverless-express adapter
  return handler(req as any, res as any);
}


