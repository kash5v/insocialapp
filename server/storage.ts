import { eq, and, gt } from "drizzle-orm";
import { db } from "./db";
import { 
  users,
  otpCodes,
  type User, 
  type InsertUser,
  type UpsertUser,
} from "@shared/schema";

type UserWithPassword = User & { password: string | null };

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<UserWithPassword | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<UserWithPassword>;
  upsertUser(user: UpsertUser): Promise<User>;
  createOtp(email: string, code: string, type: string, expiresAt: Date): Promise<void>;
  verifyOtp(email: string, code: string, type: string): Promise<boolean>;
  deleteOtpsByEmail(email: string): Promise<void>;
  verifyUserEmail(email: string): Promise<void>;
  updateUserPassword(email: string, hashedPassword: string): Promise<void>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      profileImageUrl: users.profileImageUrl,
      username: users.username,
      isPremium: users.isPremium,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      provider: users.provider,
    }).from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<UserWithPassword | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] as UserWithPassword;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      profileImageUrl: users.profileImageUrl,
      username: users.username,
      isPremium: users.isPremium,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      provider: users.provider,
    }).from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<UserWithPassword> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0] as UserWithPassword;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        username: users.username,
        isPremium: users.isPremium,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        provider: users.provider,
      });
    return user;
  }

  async createOtp(email: string, code: string, type: string, expiresAt: Date): Promise<void> {
    await db.insert(otpCodes).values({
      email,
      code,
      type,
      expiresAt,
    });
  }

  async verifyOtp(email: string, code: string, type: string): Promise<boolean> {
    const result = await db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.email, email),
          eq(otpCodes.code, code),
          eq(otpCodes.type, type),
          gt(otpCodes.expiresAt, new Date())
        )
      )
      .limit(1);

    return result.length > 0;
  }

  async deleteOtpsByEmail(email: string): Promise<void> {
    await db.delete(otpCodes).where(eq(otpCodes.email, email));
  }

  async verifyUserEmail(email: string): Promise<void> {
    await db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.email, email));
  }

  async updateUserPassword(email: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email));
  }
}

export const storage = new DbStorage();
