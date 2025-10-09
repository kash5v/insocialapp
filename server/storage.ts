import { eq, and, gt, or, ilike, sql as drizzleSql } from "drizzle-orm";
import { db } from "./db";
import { 
  users,
  otpCodes,
  follows,
  type User, 
  type InsertUser,
  type UpsertUser,
  type UpdateProfileData,
} from "@shared/schema";

type UserWithPassword = User & { password: string | null };

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<UserWithPassword | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByNumericId(numericId: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<UserWithPassword>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateProfile(userId: string, profileData: UpdateProfileData): Promise<User>;
  searchUsers(query: string): Promise<User[]>;
  followUser(followerId: string, followingId: string): Promise<void>;
  unfollowUser(followerId: string, followingId: string): Promise<void>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  getFollowerCount(userId: string): Promise<number>;
  getFollowingCount(userId: string): Promise<number>;
  getFollowers(userId: string): Promise<User[]>;
  getFollowing(userId: string): Promise<User[]>;
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
      numericId: users.numericId,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      profileImageUrl: users.profileImageUrl,
      username: users.username,
      bio: users.bio,
      location: users.location,
      isPremium: users.isPremium,
      privateAccount: users.privateAccount,
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
      numericId: users.numericId,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      profileImageUrl: users.profileImageUrl,
      username: users.username,
      bio: users.bio,
      location: users.location,
      isPremium: users.isPremium,
      privateAccount: users.privateAccount,
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
        numericId: users.numericId,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        username: users.username,
        bio: users.bio,
        location: users.location,
        isPremium: users.isPremium,
        privateAccount: users.privateAccount,
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

  async getUserByNumericId(numericId: number): Promise<User | undefined> {
    const result = await db.select({
      id: users.id,
      numericId: users.numericId,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      profileImageUrl: users.profileImageUrl,
      username: users.username,
      bio: users.bio,
      location: users.location,
      isPremium: users.isPremium,
      privateAccount: users.privateAccount,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      provider: users.provider,
    }).from(users).where(eq(users.numericId, numericId)).limit(1);
    return result[0];
  }

  async updateProfile(userId: string, profileData: UpdateProfileData): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...profileData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        numericId: users.numericId,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        username: users.username,
        bio: users.bio,
        location: users.location,
        isPremium: users.isPremium,
        privateAccount: users.privateAccount,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        provider: users.provider,
      });
    return user;
  }

  async searchUsers(query: string): Promise<User[]> {
    const numericQuery = parseInt(query, 10);
    const isNumeric = !isNaN(numericQuery);

    if (isNumeric) {
      const result = await db.select({
        id: users.id,
        numericId: users.numericId,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        username: users.username,
        bio: users.bio,
        location: users.location,
        isPremium: users.isPremium,
        privateAccount: users.privateAccount,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        provider: users.provider,
      }).from(users).where(eq(users.numericId, numericQuery)).limit(20);
      return result;
    }

    const result = await db.select({
      id: users.id,
      numericId: users.numericId,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      profileImageUrl: users.profileImageUrl,
      username: users.username,
      bio: users.bio,
      location: users.location,
      isPremium: users.isPremium,
      privateAccount: users.privateAccount,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      provider: users.provider,
    }).from(users).where(
      or(
        ilike(users.username, `%${query}%`),
        ilike(users.firstName, `%${query}%`),
        ilike(users.lastName, `%${query}%`)
      )
    ).limit(20);
    return result;
  }

  async followUser(followerId: string, followingId: string): Promise<void> {
    await db.insert(follows).values({
      followerId,
      followingId,
    }).onConflictDoNothing();
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await db.delete(follows).where(
      and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      )
    );
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const result = await db.select().from(follows).where(
      and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      )
    ).limit(1);
    return result.length > 0;
  }

  async getFollowerCount(userId: string): Promise<number> {
    const result = await db.select({ count: drizzleSql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followingId, userId));
    return result[0]?.count || 0;
  }

  async getFollowingCount(userId: string): Promise<number> {
    const result = await db.select({ count: drizzleSql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followerId, userId));
    return result[0]?.count || 0;
  }

  async getFollowers(userId: string): Promise<User[]> {
    const result = await db.select({
      id: users.id,
      numericId: users.numericId,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      profileImageUrl: users.profileImageUrl,
      username: users.username,
      bio: users.bio,
      location: users.location,
      isPremium: users.isPremium,
      privateAccount: users.privateAccount,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      provider: users.provider,
    })
      .from(users)
      .innerJoin(follows, eq(follows.followerId, users.id))
      .where(eq(follows.followingId, userId));
    return result;
  }

  async getFollowing(userId: string): Promise<User[]> {
    const result = await db.select({
      id: users.id,
      numericId: users.numericId,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      profileImageUrl: users.profileImageUrl,
      username: users.username,
      bio: users.bio,
      location: users.location,
      isPremium: users.isPremium,
      privateAccount: users.privateAccount,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      provider: users.provider,
    })
      .from(users)
      .innerJoin(follows, eq(follows.followingId, users.id))
      .where(eq(follows.followerId, userId));
    return result;
  }
}

export const storage = new DbStorage();
