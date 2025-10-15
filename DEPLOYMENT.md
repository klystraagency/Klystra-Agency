# Deployment Guide for Vercel

## Overview
This guide explains how to deploy your React + Node.js + SQLite application to Vercel.

## Key Changes Made

### 1. Database Handling
- **Issue**: SQLite database was not accessible in Vercel's serverless environment
- **Solution**: Modified `server/storage.ts` to use `/tmp` directory for database storage in Vercel
- **Features**: 
  - Automatic database initialization
  - Table creation if not exists
  - Default admin user creation (username: `admin`, password: `admin123`)
  - Sample project data insertion

### 2. API Routes
- **Issue**: Missing `/api/projects` endpoint that frontend expected
- **Solution**: Added combined endpoint that returns all project types
- **New Route**: `GET /api/projects` returns `{ website: [], video: [], social: [] }`

### 3. Vercel Configuration
- **Updated**: `vercel.json` with proper build commands and environment settings
- **Added**: Function timeout configuration
- **Fixed**: Build process to handle both client and server

## Deployment Steps

### 1. Environment Variables
Set these environment variables in your Vercel dashboard:
```
NODE_ENV=production
SESSION_SECRET=your-secure-secret-key
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to configure your project
```

### 3. Verify Deployment
1. Visit your deployed URL
2. Check `/api/projects` endpoint returns data
3. Login to admin dashboard with `admin` / `admin123`
4. Verify projects are displayed in both frontend and admin dashboard

## Database Notes

### Vercel Serverless Limitations
- Database is ephemeral (resets on each deployment)
- Data persists only during function execution
- For production, consider migrating to a persistent database like:
  - Vercel Postgres
  - PlanetScale
  - Supabase
  - Neon

### Current Setup
- Database initializes automatically on first request
- Sample data is inserted if tables are empty
- Admin user is created automatically

## Troubleshooting

### Projects Not Showing
1. Check browser console for API errors
2. Verify `/api/projects` endpoint returns data
3. Check Vercel function logs for database errors

### Admin Login Issues
1. Default credentials: `admin` / `admin123`
2. Check if user was created in database initialization
3. Verify session configuration

### Build Issues
1. Ensure all dependencies are in `package.json`
2. Check build logs in Vercel dashboard
3. Verify TypeScript compilation

## Production Recommendations

1. **Database**: Migrate to persistent database service
2. **Security**: Change default admin password
3. **Environment**: Use proper environment variables
4. **Monitoring**: Set up error tracking and logging
5. **Backup**: Implement data backup strategy

## File Structure
```
├── api/
│   └── index.ts          # Vercel serverless entry point
├── server/
│   ├── app.ts           # Express app configuration
│   ├── routes.ts        # API routes
│   └── storage.ts       # Database operations
├── client/
│   └── src/             # React frontend
├── shared/
│   └── schema.ts        # Database schema
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies and scripts
```
