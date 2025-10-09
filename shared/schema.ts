import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, index, jsonb, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  numericId: serial("numeric_id").unique().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password"),
  provider: varchar("provider").default("email"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: text("username").unique(),
  bio: text("bio"),
  location: varchar("location"),
  isPremium: boolean("is_premium").default(false),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const otpCodes = pgTable("otp_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: varchar("follower_id").notNull().references(() => users.id),
  followingId: varchar("following_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_follower_id").on(table.followerId),
  index("idx_following_id").on(table.followingId),
]);

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  numericId: true,
  createdAt: true,
  updatedAt: true,
});

const usernameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username cannot exceed 30 characters")
  .regex(/^[a-zA-Z0-9.]+$/, "Username can only contain letters, numbers, and dots")
  .regex(/^[a-zA-Z0-9]/, "Username cannot start with a dot")
  .regex(/[a-zA-Z0-9]$/, "Username cannot end with a dot");

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().optional().transform(val => val === "" ? undefined : val),
  lastName: z.string().optional().transform(val => val === "" ? undefined : val),
  username: usernameValidation.optional().transform(val => val === "" ? undefined : val),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "OTP must be 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateProfileSchema = z.object({
  firstName: z.string().optional().transform(val => val === "" ? undefined : val),
  lastName: z.string().optional().transform(val => val === "" ? undefined : val),
  username: usernameValidation.optional().transform(val => val === "" ? undefined : val),
  profileImageUrl: z.string().optional().transform(val => val === "" ? undefined : val),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional().transform(val => val === "" ? undefined : val),
  location: z.string().max(100, "Location cannot exceed 100 characters").optional().transform(val => val === "" ? undefined : val),
});

export const searchUsersSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

export const insertFollowSchema = createInsertSchema(follows).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type User = Omit<typeof users.$inferSelect, 'password'>;
export type SignupData = z.infer<typeof signupSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type VerifyOtpData = z.infer<typeof verifyOtpSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type SearchUsersData = z.infer<typeof searchUsersSchema>;
export type Follow = typeof follows.$inferSelect;
export type InsertFollow = z.infer<typeof insertFollowSchema>;
