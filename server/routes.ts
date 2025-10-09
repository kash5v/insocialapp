import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import passport from "passport";
import bcrypt from "bcryptjs";
import { signupSchema, loginSchema, verifyOtpSchema, forgotPasswordSchema, resetPasswordSchema } from "@shared/schema";
import { sendOtpEmail, generateOtp } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);
  
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
    try {
      loginSchema.parse(req.body);
    } catch (error: any) {
      return res.status(400).json({ message: error.errors[0].message });
    }

    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: "Login failed" });
        }
        res.json(user);
      });
    })(req, res, next);
  });

  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  return httpServer;
}
