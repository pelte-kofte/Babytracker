import { users, babies, feedings, sleepLogs, diaperLogs, growthLogs, memories, type User, type InsertUser, type Baby, type InsertBaby, type Feeding, type InsertFeeding, type SleepLog, type InsertSleepLog, type DiaperLog, type InsertDiaperLog, type GrowthLog, type InsertGrowthLog, type Memory, type InsertMemory } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { authStorage } from "./replit_integrations/auth"; // Import auth storage

export interface IStorage {
  // User methods (delegated to authStorage or extended)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Baby methods
  getBabies(userId: string): Promise<Baby[]>;
  getBaby(id: number): Promise<Baby | undefined>;
  createBaby(baby: InsertBaby): Promise<Baby>;
  updateBaby(id: number, baby: Partial<InsertBaby>): Promise<Baby>;
  deleteBaby(id: number): Promise<void>;

  // Feeding methods
  getFeedings(babyId: number): Promise<Feeding[]>;
  createFeeding(feeding: InsertFeeding): Promise<Feeding>;
  deleteFeeding(id: number): Promise<void>;

  // Sleep Log methods
  getSleepLogs(babyId: number): Promise<SleepLog[]>;
  createSleepLog(sleepLog: InsertSleepLog): Promise<SleepLog>;
  deleteSleepLog(id: number): Promise<void>;

  // Diaper Log methods
  getDiaperLogs(babyId: number): Promise<DiaperLog[]>;
  createDiaperLog(diaperLog: InsertDiaperLog): Promise<DiaperLog>;
  deleteDiaperLog(id: number): Promise<void>;

  // Growth Log methods
  getGrowthLogs(babyId: number): Promise<GrowthLog[]>;
  createGrowthLog(growthLog: InsertGrowthLog): Promise<GrowthLog>;
  deleteGrowthLog(id: number): Promise<void>;

  // Memory methods
  getMemories(babyId: number): Promise<Memory[]>;
  createMemory(memory: InsertMemory): Promise<Memory>;
  deleteMemory(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return authStorage.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    // This might be used if we weren't using Replit Auth for everything, 
    // but Replit Auth handles user creation via upsertUser in auth/storage.ts.
    // We can just proxy or ignore if not needed. 
    // However, if we need to create a user manually:
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Baby methods
  async getBabies(userId: string): Promise<Baby[]> {
    return db.select().from(babies).where(eq(babies.userId, userId));
  }

  async getBaby(id: number): Promise<Baby | undefined> {
    const [baby] = await db.select().from(babies).where(eq(babies.id, id));
    return baby;
  }

  async createBaby(baby: InsertBaby): Promise<Baby> {
    const [newBaby] = await db.insert(babies).values(baby).returning();
    return newBaby;
  }

  async updateBaby(id: number, baby: Partial<InsertBaby>): Promise<Baby> {
    const [updatedBaby] = await db.update(babies).set(baby).where(eq(babies.id, id)).returning();
    return updatedBaby;
  }

  async deleteBaby(id: number): Promise<void> {
    await db.delete(babies).where(eq(babies.id, id));
  }

  // Feeding methods
  async getFeedings(babyId: number): Promise<Feeding[]> {
    return db.select().from(feedings).where(eq(feedings.babyId, babyId)).orderBy(desc(feedings.time));
  }

  async createFeeding(feeding: InsertFeeding): Promise<Feeding> {
    const [newFeeding] = await db.insert(feedings).values(feeding).returning();
    return newFeeding;
  }

  async deleteFeeding(id: number): Promise<void> {
    await db.delete(feedings).where(eq(feedings.id, id));
  }

  // Sleep Log methods
  async getSleepLogs(babyId: number): Promise<SleepLog[]> {
    return db.select().from(sleepLogs).where(eq(sleepLogs.babyId, babyId)).orderBy(desc(sleepLogs.startTime));
  }

  async createSleepLog(sleepLog: InsertSleepLog): Promise<SleepLog> {
    const duration = sleepLog.endTime 
      ? Math.round((new Date(sleepLog.endTime).getTime() - new Date(sleepLog.startTime).getTime()) / 60000) 
      : null;
    
    const [newSleepLog] = await db.insert(sleepLogs).values({ ...sleepLog, duration }).returning();
    return newSleepLog;
  }

  async deleteSleepLog(id: number): Promise<void> {
    await db.delete(sleepLogs).where(eq(sleepLogs.id, id));
  }

  // Diaper Log methods
  async getDiaperLogs(babyId: number): Promise<DiaperLog[]> {
    return db.select().from(diaperLogs).where(eq(diaperLogs.babyId, babyId)).orderBy(desc(diaperLogs.time));
  }

  async createDiaperLog(diaperLog: InsertDiaperLog): Promise<DiaperLog> {
    const [newDiaperLog] = await db.insert(diaperLogs).values(diaperLog).returning();
    return newDiaperLog;
  }

  async deleteDiaperLog(id: number): Promise<void> {
    await db.delete(diaperLogs).where(eq(diaperLogs.id, id));
  }

  // Growth Log methods
  async getGrowthLogs(babyId: number): Promise<GrowthLog[]> {
    return db.select().from(growthLogs).where(eq(growthLogs.babyId, babyId)).orderBy(desc(growthLogs.date));
  }

  async createGrowthLog(growthLog: InsertGrowthLog): Promise<GrowthLog> {
    const [newGrowthLog] = await db.insert(growthLogs).values(growthLog).returning();
    return newGrowthLog;
  }

  async deleteGrowthLog(id: number): Promise<void> {
    await db.delete(growthLogs).where(eq(growthLogs.id, id));
  }

  // Memory methods
  async getMemories(babyId: number): Promise<Memory[]> {
    return db.select().from(memories).where(eq(memories.babyId, babyId)).orderBy(desc(memories.date));
  }

  async createMemory(memory: InsertMemory): Promise<Memory> {
    const [newMemory] = await db.insert(memories).values(memory).returning();
    return newMemory;
  }

  async deleteMemory(id: number): Promise<void> {
    await db.delete(memories).where(eq(memories.id, id));
  }
}

export const storage = new DatabaseStorage();
