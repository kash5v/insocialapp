import { eq } from "drizzle-orm";
import { db } from "./db";
import { 
  users,
  matrixSessions,
  matrixRooms,
  matrixMessages,
  type User, 
  type InsertUser,
  type MatrixSession,
  type InsertMatrixSession,
  type MatrixRoom,
  type InsertMatrixRoom,
  type MatrixMessage,
  type InsertMatrixMessage,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getMatrixSession(userId: string): Promise<MatrixSession | undefined>;
  createMatrixSession(session: InsertMatrixSession): Promise<MatrixSession>;
  updateMatrixSession(userId: string, session: Partial<InsertMatrixSession>): Promise<MatrixSession | undefined>;
  
  getMatrixRooms(): Promise<MatrixRoom[]>;
  getMatrixRoom(roomId: string): Promise<MatrixRoom | undefined>;
  createMatrixRoom(room: InsertMatrixRoom): Promise<MatrixRoom>;
  updateMatrixRoom(roomId: string, room: Partial<InsertMatrixRoom>): Promise<MatrixRoom | undefined>;
  
  getMatrixMessages(roomId: string, limit?: number): Promise<MatrixMessage[]>;
  createMatrixMessage(message: InsertMatrixMessage): Promise<MatrixMessage>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getMatrixSession(userId: string): Promise<MatrixSession | undefined> {
    const result = await db.select().from(matrixSessions).where(eq(matrixSessions.userId, userId)).limit(1);
    return result[0];
  }

  async createMatrixSession(session: InsertMatrixSession): Promise<MatrixSession> {
    const result = await db.insert(matrixSessions).values(session).returning();
    return result[0];
  }

  async updateMatrixSession(userId: string, session: Partial<InsertMatrixSession>): Promise<MatrixSession | undefined> {
    const result = await db.update(matrixSessions)
      .set(session)
      .where(eq(matrixSessions.userId, userId))
      .returning();
    return result[0];
  }

  async getMatrixRooms(): Promise<MatrixRoom[]> {
    return await db.select().from(matrixRooms).orderBy(matrixRooms.lastActivity);
  }

  async getMatrixRoom(roomId: string): Promise<MatrixRoom | undefined> {
    const result = await db.select().from(matrixRooms).where(eq(matrixRooms.roomId, roomId)).limit(1);
    return result[0];
  }

  async createMatrixRoom(room: InsertMatrixRoom): Promise<MatrixRoom> {
    const result = await db.insert(matrixRooms).values(room).returning();
    return result[0];
  }

  async updateMatrixRoom(roomId: string, room: Partial<InsertMatrixRoom>): Promise<MatrixRoom | undefined> {
    const result = await db.update(matrixRooms)
      .set(room)
      .where(eq(matrixRooms.roomId, roomId))
      .returning();
    return result[0];
  }

  async getMatrixMessages(roomId: string, limit: number = 50): Promise<MatrixMessage[]> {
    return await db.select()
      .from(matrixMessages)
      .where(eq(matrixMessages.roomId, roomId))
      .orderBy(matrixMessages.timestamp)
      .limit(limit);
  }

  async createMatrixMessage(message: InsertMatrixMessage): Promise<MatrixMessage> {
    const result = await db.insert(matrixMessages).values(message).returning();
    return result[0];
  }
}

export const storage = new DbStorage();
