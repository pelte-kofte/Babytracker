import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

// === TABLE DEFINITIONS ===

export const babies = pgTable("babies", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  gender: text("gender"), // 'boy', 'girl', 'other'
  birthDate: timestamp("birth_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const feedings = pgTable("feedings", {
  id: serial("id").primaryKey(),
  babyId: integer("baby_id").references(() => babies.id).notNull(),
  type: text("type").notNull(), // 'breast', 'bottle', 'formula'
  amount: integer("amount"), // in ml
  duration: integer("duration"), // in minutes
  side: text("side"), // 'left', 'right', 'both'
  time: timestamp("time").notNull().defaultNow(),
});

export const sleepLogs = pgTable("sleep_logs", {
  id: serial("id").primaryKey(),
  babyId: integer("baby_id").references(() => babies.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in minutes (calculated)
});

export const diaperLogs = pgTable("diaper_logs", {
  id: serial("id").primaryKey(),
  babyId: integer("baby_id").references(() => babies.id).notNull(),
  type: text("type").notNull(), // 'wet', 'dirty', 'both'
  time: timestamp("time").notNull().defaultNow(),
  notes: text("notes"),
});

export const growthLogs = pgTable("growth_logs", {
  id: serial("id").primaryKey(),
  babyId: integer("baby_id").references(() => babies.id).notNull(),
  height: decimal("height"), // cm
  weight: decimal("weight"), // kg
  headCircumference: decimal("head_circumference"), // cm
  date: timestamp("date").notNull().defaultNow(),
});

export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  babyId: integer("baby_id").references(() => babies.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull().defaultNow(),
  emoji: text("emoji"), // For fun
});

// === RELATIONS ===

export const usersRelations = relations(users, ({ many }) => ({
  babies: many(babies),
}));

export const babiesRelations = relations(babies, ({ one, many }) => ({
  parent: one(users, {
    fields: [babies.userId],
    references: [users.id],
  }),
  feedings: many(feedings),
  sleepLogs: many(sleepLogs),
  diaperLogs: many(diaperLogs),
  growthLogs: many(growthLogs),
  memories: many(memories),
}));

export const feedingsRelations = relations(feedings, ({ one }) => ({
  baby: one(babies, {
    fields: [feedings.babyId],
    references: [babies.id],
  }),
}));

export const sleepLogsRelations = relations(sleepLogs, ({ one }) => ({
  baby: one(babies, {
    fields: [sleepLogs.babyId],
    references: [babies.id],
  }),
}));

export const diaperLogsRelations = relations(diaperLogs, ({ one }) => ({
  baby: one(babies, {
    fields: [diaperLogs.babyId],
    references: [babies.id],
  }),
}));

export const growthLogsRelations = relations(growthLogs, ({ one }) => ({
  baby: one(babies, {
    fields: [growthLogs.babyId],
    references: [babies.id],
  }),
}));

export const memoriesRelations = relations(memories, ({ one }) => ({
  baby: one(babies, {
    fields: [memories.babyId],
    references: [babies.id],
  }),
}));

// === INSERTS & TYPES ===

export const insertBabySchema = createInsertSchema(babies).omit({ id: true, createdAt: true });
export const insertFeedingSchema = createInsertSchema(feedings).omit({ id: true });
export const insertSleepLogSchema = createInsertSchema(sleepLogs).omit({ id: true, duration: true });
export const insertDiaperLogSchema = createInsertSchema(diaperLogs).omit({ id: true });
export const insertGrowthLogSchema = createInsertSchema(growthLogs).omit({ id: true });
export const insertMemorySchema = createInsertSchema(memories).omit({ id: true });

export type Baby = typeof babies.$inferSelect;
export type Feeding = typeof feedings.$inferSelect;
export type SleepLog = typeof sleepLogs.$inferSelect;
export type DiaperLog = typeof diaperLogs.$inferSelect;
export type GrowthLog = typeof growthLogs.$inferSelect;
export type Memory = typeof memories.$inferSelect;

export type InsertBaby = z.infer<typeof insertBabySchema>;
export type InsertFeeding = z.infer<typeof insertFeedingSchema>;
export type InsertSleepLog = z.infer<typeof insertSleepLogSchema>;
export type InsertDiaperLog = z.infer<typeof insertDiaperLogSchema>;
export type InsertGrowthLog = z.infer<typeof insertGrowthLogSchema>;
export type InsertMemory = z.infer<typeof insertMemorySchema>;
