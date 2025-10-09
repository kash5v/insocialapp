import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import bcrypt from "bcryptjs";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

async function generateUniqueUsername(email: string, firstName?: string): Promise<string> {
  const baseUsername = (email?.split('@')[0] || firstName?.toLowerCase().replace(/\s+/g, '') || 'user')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  
  let username = baseUsername;
  let attempt = 0;
  const maxAttempts = 100;
  
  while (attempt < maxAttempts) {
    const existingUserByUsername = await storage.getUserByUsername(username);
    if (!existingUserByUsername) {
      return username;
    }
    
    attempt++;
    username = `${baseUsername}${attempt}`;
  }
  
  return `${baseUsername}${Date.now()}`;
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          console.log("[AUTH] Starting authentication for email:", email);
          
          const user = await storage.getUserByEmail(email);
          console.log("[AUTH] User lookup result:", user ? "found" : "not found");
          
          if (!user) {
            console.log("[AUTH] User not found, authentication failed");
            return done(null, false, { message: "Invalid email or password" });
          }

          if (!user.password) {
            console.log("[AUTH] User has no password, authentication failed");
            return done(null, false, { message: "Invalid email or password" });
          }

          console.log("[AUTH] Comparing passwords...");
          const isValid = await bcrypt.compare(password, user.password);
          console.log("[AUTH] Password comparison result:", isValid);
          
          if (!isValid) {
            console.log("[AUTH] Invalid password, authentication failed");
            return done(null, false, { message: "Invalid email or password" });
          }

          console.log("[AUTH] Creating user object without password...");
          const { password: _, ...userWithoutPassword } = user;
          console.log("[AUTH] User object keys:", Object.keys(userWithoutPassword));
          console.log("[AUTH] Authentication successful");
          return done(null, userWithoutPassword);
        } catch (error) {
          console.error("[AUTH] Authentication error occurred:", error);
          console.error("[AUTH] Error stack:", error instanceof Error ? error.stack : 'No stack trace');
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    console.log("[AUTH] Serializing user with ID:", user?.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      console.log("[AUTH] Deserializing user with ID:", id);
      const user = await storage.getUser(id);
      if (user) {
        console.log("[AUTH] User deserialized successfully");
        done(null, user);
      } else {
        console.log("[AUTH] User not found during deserialization");
        done(null, false);
      }
    } catch (error) {
      console.error("[AUTH] Deserialization error:", error);
      done(error);
    }
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
