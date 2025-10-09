import { eq } from "drizzle-orm";
import { db } from "./db";
import { 
  users,
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
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        provider: users.provider,
      });
    return user;
  }
}

export const storage = new DbStorage();
