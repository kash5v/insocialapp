import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  verificationType: text("verification_type"),
  isPremium: boolean("is_premium").default(false),
});

export const matrixSessions = pgTable("matrix_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  matrixUserId: text("matrix_user_id").notNull(),
  accessToken: text("access_token").notNull(),
  deviceId: text("device_id"),
  homeserverUrl: text("homeserver_url").notNull().default("https://matrix.org"),
});

export const matrixRooms = pgTable("matrix_rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: text("room_id").notNull().unique(),
  roomType: text("room_type").notNull(),
  name: text("name"),
  topic: text("topic"),
  avatarUrl: text("avatar_url"),
  memberCount: integer("member_count").default(0),
  isEncrypted: boolean("is_encrypted").default(false),
  lastActivity: timestamp("last_activity").defaultNow(),
});

export const matrixMessages = pgTable("matrix_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: text("event_id").notNull().unique(),
  roomId: text("room_id").notNull(),
  senderId: text("sender_id").notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").notNull().default("m.text"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertMatrixSessionSchema = createInsertSchema(matrixSessions).omit({
  id: true,
});

export const insertMatrixRoomSchema = createInsertSchema(matrixRooms).omit({
  id: true,
});

export const insertMatrixMessageSchema = createInsertSchema(matrixMessages).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type MatrixSession = typeof matrixSessions.$inferSelect;
export type InsertMatrixSession = z.infer<typeof insertMatrixSessionSchema>;
export type MatrixRoom = typeof matrixRooms.$inferSelect;
export type InsertMatrixRoom = z.infer<typeof insertMatrixRoomSchema>;
export type MatrixMessage = typeof matrixMessages.$inferSelect;
export type InsertMatrixMessage = z.infer<typeof insertMatrixMessageSchema>;
