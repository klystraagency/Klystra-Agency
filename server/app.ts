import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import * as bcrypt from "bcrypt";
import { registerRoutes } from "./routes";
import { storage } from "./storage";
import cors from "cors";

// Extend Express Request interface instead
interface RequestWithRawBody extends express.Request {
  rawBody: unknown;
}

export function createApp() {
  const app = express();

  // CORS for frontend origin
  app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
  }));

  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || "digital-dynasty-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }));

  // Passport configuration
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) return done(null, false, { message: "Incorrect username or password" });
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return done(null, false, { message: "Incorrect username or password" });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error); 
    }
  });

  app.use(express.json({
    verify: (req, _res, buf) => {
      (req as RequestWithRawBody).rawBody = buf;
    },
  }));
  app.use(express.urlencoded({ extended: false }));

  // Serve uploaded files (note: Vercel serverless has ephemeral fs; uploads won't persist)
  app.use("/uploads", express.static("uploads"));

  // Lightweight API logger
  app.use((req, res, next) => {
    const start = Date.now();
    let capturedJsonResponse: Record<string, any> | undefined = undefined;
    const originalResJson = res.json.bind(res);
    (res as any).json = (body: any, ...args: any[]) => {
      capturedJsonResponse = body;
      return originalResJson(body, ...args);
    };
    res.on("finish", () => {
      if (req.path.startsWith("/api")) {
        const duration = Date.now() - start;
        let line = `${req.method} ${req.path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          try {
            const json = JSON.stringify(capturedJsonResponse);
            line += ` :: ${json.length > 200 ? json.slice(0, 200) + "…" : json}`;
          } catch { /* noop */ }
        }
        console.log(line);
      }
    });
    next();
  });

  // Register API routes (synchronous definitions; returned server is ignored here)
  void registerRoutes(app);

  return app;
}

export default createApp;


