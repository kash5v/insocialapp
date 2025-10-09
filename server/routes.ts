import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import passport from "passport";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import { signupSchema, loginSchema, verifyOtpSchema, forgotPasswordSchema, resetPasswordSchema, updateProfileSchema, searchUsersSchema } from "@shared/schema";
import { sendOtpEmail, generateOtp } from "./email";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);
  
  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Configure multer for file uploads
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({
    storage: multerStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'));
      }
    }
  });
  
  const httpServer = createServer(app);

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/auth/signup', async (req, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      const createdUser = await storage.createUser({
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        username: validatedData.username,
        provider: "email",
        emailVerified: false,
      });

      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      await storage.createOtp(validatedData.email, otp, 'verification', expiresAt);
      await sendOtpEmail(validatedData.email, otp, 'verification');

      const { password: _, ...userWithoutPassword } = createdUser as any;

      req.login(userWithoutPassword, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed after signup" });
        }
        res.json({ ...userWithoutPassword, requiresVerification: true });
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Signup error:", error);
      res.status(500).json({ message: "Signup failed" });
    }
  });

  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const validatedData = verifyOtpSchema.parse(req.body);
      
      const isValid = await storage.verifyOtp(
        validatedData.email, 
        validatedData.code, 
        'verification'
      );

      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired verification code" });
      }

      await storage.verifyUserEmail(validatedData.email);
      await storage.deleteOtpsByEmail(validatedData.email);

      res.json({ message: "Email verified successfully" });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Verification error:", error);
      res.status(500).json({ message: "Verification failed" });
    }
  });

  app.post('/api/auth/resend-otp', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.emailVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      await storage.deleteOtpsByEmail(email);

      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      await storage.createOtp(email, otp, 'verification', expiresAt);
      await sendOtpEmail(email, otp, 'verification');

      res.json({ message: "Verification code sent successfully" });
    } catch (error) {
      console.error("Resend OTP error:", error);
      res.status(500).json({ message: "Failed to resend verification code" });
    }
  });

  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const validatedData = forgotPasswordSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.json({ message: "If the email exists, a reset code has been sent" });
      }

      await storage.deleteOtpsByEmail(validatedData.email);

      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      await storage.createOtp(validatedData.email, otp, 'reset', expiresAt);
      await sendOtpEmail(validatedData.email, otp, 'reset');

      res.json({ message: "If the email exists, a reset code has been sent" });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to process request" });
    }
  });

  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const validatedData = resetPasswordSchema.parse(req.body);
      
      const isValid = await storage.verifyOtp(
        validatedData.email, 
        validatedData.code, 
        'reset'
      );

      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired reset code" });
      }

      const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);
      await storage.updateUserPassword(validatedData.email, hashedPassword);
      await storage.deleteOtpsByEmail(validatedData.email);

      res.json({ message: "Password reset successfully" });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  app.post('/api/auth/login', (req, res, next) => {
    console.log("[LOGIN] Login attempt received");
    try {
      loginSchema.parse(req.body);
      console.log("[LOGIN] Request body validated successfully");
    } catch (error: any) {
      console.log("[LOGIN] Request body validation failed:", error.errors?.[0]?.message);
      return res.status(400).json({ message: error.errors[0].message });
    }

    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        console.error("[LOGIN] Passport authentication error:", err);
        console.error("[LOGIN] Error details:", err instanceof Error ? err.message : err);
        console.error("[LOGIN] Error stack:", err instanceof Error ? err.stack : 'No stack');
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        console.log("[LOGIN] Authentication failed - no user returned");
        console.log("[LOGIN] Info message:", info?.message);
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      console.log("[LOGIN] Passport authentication successful, calling req.login");
      req.login(user, async (loginErr) => {
        if (loginErr) {
          console.error("[LOGIN] req.login error:", loginErr);
          return res.status(500).json({ message: "Login failed" });
        }
        
        // Log the login activity
        try {
          const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || 
                           req.socket.remoteAddress || 
                           'unknown';
          const userAgent = req.headers['user-agent'] || 'unknown';
          
          await storage.logActivity({
            userId: user.id,
            action: 'login',
            ipAddress,
            userAgent,
            metadata: {
              email: user.email,
              sessionId: req.sessionID,
              loginMethod: 'password',
              timestamp: new Date().toISOString()
            }
          });
          console.log("[LOGIN] Activity logged for user:", user.email);
        } catch (activityErr) {
          console.error("[LOGIN] Failed to log activity:", activityErr);
        }
        
        console.log("[LOGIN] Login successful, sending user response");
        res.json(user);
      });
    })(req, res, next);
  });

  app.post('/api/auth/logout', async (req, res) => {
    const user = req.user as any;
    const userId = user?.id;
    const userEmail = user?.email;
    
    console.log("[LOGOUT] Logout attempt received");
    console.log("[LOGOUT] User ID:", userId || "No user ID");
    console.log("[LOGOUT] User Email:", userEmail || "No email");
    console.log("[LOGOUT] Session ID:", req.sessionID || "No session ID");
    
    if (!req.isAuthenticated()) {
      console.log("[LOGOUT] User not authenticated, nothing to logout");
      return res.json({ message: "Already logged out", redirectTo: "/auth/login" });
    }
    
    // Log the logout activity before destroying session
    if (userId) {
      try {
        const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || 
                         req.socket.remoteAddress || 
                         'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';
        
        await storage.logActivity({
          userId,
          action: 'logout',
          ipAddress,
          userAgent,
          metadata: {
            email: userEmail,
            sessionId: req.sessionID,
            timestamp: new Date().toISOString()
          }
        });
        console.log("[LOGOUT] Activity logged for user:", userEmail || userId);
      } catch (activityErr) {
        console.error("[LOGOUT] Failed to log activity:", activityErr);
      }
    }
    
    req.logout((err) => {
      if (err) {
        console.error("[LOGOUT] Logout error:", err);
        console.error("[LOGOUT] Error details:", err instanceof Error ? err.message : err);
        return res.status(500).json({ message: "Logout failed" });
      }
      
      console.log("[LOGOUT] Passport logout successful, destroying session");
      
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          console.error("[LOGOUT] Session destruction error:", sessionErr);
          return res.status(500).json({ message: "Failed to clear session" });
        }
        
        console.log("[LOGOUT] Session destroyed successfully");
        console.log("[LOGOUT] Clearing session cookie");
        res.clearCookie('connect.sid');
        console.log("[LOGOUT] Logout complete for user:", userEmail || userId);
        res.json({ 
          message: "Logged out successfully",
          redirectTo: "/auth/login",
          timestamp: new Date().toISOString()
        });
      });
    });
  });

  app.get('/api/users/search', isAuthenticated, async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim() === '') {
        return res.json([]);
      }
      
      const users = await storage.searchUsers(query.trim());
      res.json(users);
    } catch (error) {
      console.error("User search error:", error);
      res.status(500).json({ message: "Failed to search users" });
    }
  });

  app.get('/api/users/:userId', isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUserId = (req.user as any).id;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const [followerCount, followingCount, isFollowing] = await Promise.all([
        storage.getFollowerCount(userId),
        storage.getFollowingCount(userId),
        storage.isFollowing(currentUserId, userId)
      ]);

      res.json({
        ...user,
        followerCount,
        followingCount,
        isFollowing,
        isOwnProfile: currentUserId === userId
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.get('/api/users/username/:username', isAuthenticated, async (req, res) => {
    try {
      const { username } = req.params;
      const currentUserId = (req.user as any).id;
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const [followerCount, followingCount, isFollowing] = await Promise.all([
        storage.getFollowerCount(user.id),
        storage.getFollowingCount(user.id),
        storage.isFollowing(currentUserId, user.id)
      ]);

      res.json({
        ...user,
        followerCount,
        followingCount,
        isFollowing,
        isOwnProfile: currentUserId === user.id
      });
    } catch (error) {
      console.error("Get user by username error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post('/api/users/profile/upload-image', isAuthenticated, upload.single('profileImage'), async (req, res) => {
    try {
      const userId = (req.user as any).id;
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      const updatedUser = await storage.updateProfile(userId, { profileImageUrl: imageUrl });
      
      res.json({ imageUrl, user: updatedUser });
    } catch (error: any) {
      console.error("Upload image error:", error);
      res.status(500).json({ message: error.message || "Failed to upload image" });
    }
  });

  app.put('/api/users/profile', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const validatedData = updateProfileSchema.parse(req.body);
      
      if (validatedData.username) {
        const existingUser = await storage.getUserByUsername(validatedData.username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ message: "Username already taken" });
        }
      }

      const updatedUser = await storage.updateProfile(userId, validatedData);
      res.json(updatedUser);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.post('/api/users/:userId/follow', isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const followerId = (req.user as any).id;

      if (followerId === userId) {
        return res.status(400).json({ message: "Cannot follow yourself" });
      }

      const userToFollow = await storage.getUser(userId);
      if (!userToFollow) {
        return res.status(404).json({ message: "User not found" });
      }

      await storage.followUser(followerId, userId);
      res.json({ message: "User followed successfully" });
    } catch (error) {
      console.error("Follow user error:", error);
      res.status(500).json({ message: "Failed to follow user" });
    }
  });

  app.delete('/api/users/:userId/follow', isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const followerId = (req.user as any).id;

      await storage.unfollowUser(followerId, userId);
      res.json({ message: "User unfollowed successfully" });
    } catch (error) {
      console.error("Unfollow user error:", error);
      res.status(500).json({ message: "Failed to unfollow user" });
    }
  });

  app.get('/api/users/:userId/followers', isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const followers = await storage.getFollowers(userId);
      res.json(followers);
    } catch (error) {
      console.error("Get followers error:", error);
      res.status(500).json({ message: "Failed to get followers" });
    }
  });

  app.get('/api/users/:userId/following', isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const following = await storage.getFollowing(userId);
      res.json(following);
    } catch (error) {
      console.error("Get following error:", error);
      res.status(500).json({ message: "Failed to get following" });
    }
  });

  return httpServer;
}
