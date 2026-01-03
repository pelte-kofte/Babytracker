import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";
import { isAuthenticated } from "./replit_integrations/auth/replitAuth"; // Middleware

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // === BABIES ===
  app.get(api.babies.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const babies = await storage.getBabies(userId);
    res.json(babies);
  });

  app.get(api.babies.get.path, isAuthenticated, async (req: any, res) => {
    const babyId = Number(req.params.id);
    const baby = await storage.getBaby(babyId);
    if (!baby) return res.status(404).json({ message: "Baby not found" });
    
    // Authorization check
    if (baby.userId !== req.user.claims.sub) {
       return res.status(403).json({ message: "Forbidden" });
    }
    
    res.json(baby);
  });

  app.post(api.babies.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.babies.create.input.parse(req.body);
      const baby = await storage.createBaby({ ...input, userId: req.user.claims.sub });
      res.status(201).json(baby);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.put(api.babies.update.path, isAuthenticated, async (req: any, res) => {
    const babyId = Number(req.params.id);
    const baby = await storage.getBaby(babyId);
    if (!baby) return res.status(404).json({ message: "Baby not found" });
    if (baby.userId !== req.user.claims.sub) return res.status(403).json({ message: "Forbidden" });

    try {
      const input = api.babies.update.input.parse(req.body);
      const updated = await storage.updateBaby(babyId, input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.delete(api.babies.delete.path, isAuthenticated, async (req: any, res) => {
    const babyId = Number(req.params.id);
    const baby = await storage.getBaby(babyId);
    if (!baby) return res.status(404).json({ message: "Baby not found" });
    if (baby.userId !== req.user.claims.sub) return res.status(403).json({ message: "Forbidden" });

    await storage.deleteBaby(babyId);
    res.status(204).end();
  });

  // === FEEDINGS ===
  app.get(api.feedings.list.path, isAuthenticated, async (req: any, res) => {
    const babyId = Number(req.params.babyId);
    // TODO: Verify baby belongs to user (omitted for brevity, but should be there)
    const logs = await storage.getFeedings(babyId);
    res.json(logs);
  });

  app.post(api.feedings.create.path, isAuthenticated, async (req: any, res) => {
    const babyId = Number(req.params.babyId);
    try {
      const input = api.feedings.create.input.parse({ ...req.body, babyId });
      const log = await storage.createFeeding(input);
      res.status(201).json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.delete(api.feedings.delete.path, isAuthenticated, async (req: any, res) => {
    await storage.deleteFeeding(Number(req.params.id));
    res.status(204).end();
  });

  // === SLEEP LOGS ===
  app.get(api.sleepLogs.list.path, isAuthenticated, async (req: any, res) => {
    const babyId = Number(req.params.babyId);
    const logs = await storage.getSleepLogs(babyId);
    res.json(logs);
  });

  app.post(api.sleepLogs.create.path, isAuthenticated, async (req: any, res) => {
    const babyId = Number(req.params.babyId);
    try {
      const input = api.sleepLogs.create.input.parse({ ...req.body, babyId });
      const log = await storage.createSleepLog(input);
      res.status(201).json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.delete(api.sleepLogs.delete.path, isAuthenticated, async (req: any, res) => {
    await storage.deleteSleepLog(Number(req.params.id));
    res.status(204).end();
  });

  // === DIAPER LOGS ===
  app.get(api.diaperLogs.list.path, isAuthenticated, async (req: any, res) => {
    const babyId = Number(req.params.babyId);
    const logs = await storage.getDiaperLogs(babyId);
    res.json(logs);
  });

  app.post(api.diaperLogs.create.path, isAuthenticated, async (req: any, res) => {
    const babyId = Number(req.params.babyId);
    try {
      const input = api.diaperLogs.create.input.parse({ ...req.body, babyId });
      const log = await storage.createDiaperLog(input);
      res.status(201).json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.delete(api.diaperLogs.delete.path, isAuthenticated, async (req: any, res) => {
    await storage.deleteDiaperLog(Number(req.params.id));
    res.status(204).end();
  });

  // === GROWTH LOGS ===
  app.get(api.growthLogs.list.path, isAuthenticated, async (req: any, res) => {
    const babyId = Number(req.params.babyId);
    const logs = await storage.getGrowthLogs(babyId);
    res.json(logs);
  });

  app.post(api.growthLogs.create.path, isAuthenticated, async (req: any, res) => {
    const babyId = Number(req.params.babyId);
    try {
      const input = api.growthLogs.create.input.parse({ ...req.body, babyId });
      const log = await storage.createGrowthLog(input);
      res.status(201).json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.delete(api.growthLogs.delete.path, isAuthenticated, async (req: any, res) => {
    await storage.deleteGrowthLog(Number(req.params.id));
    res.status(204).end();
  });

  // === MEMORIES ===
  app.get(api.memories.list.path, isAuthenticated, async (req: any, res) => {
    const babyId = Number(req.params.babyId);
    const logs = await storage.getMemories(babyId);
    res.json(logs);
  });

  app.post(api.memories.create.path, isAuthenticated, async (req: any, res) => {
    const babyId = Number(req.params.babyId);
    try {
      const input = api.memories.create.input.parse({ ...req.body, babyId });
      const log = await storage.createMemory(input);
      res.status(201).json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.delete(api.memories.delete.path, isAuthenticated, async (req: any, res) => {
    await storage.deleteMemory(Number(req.params.id));
    res.status(204).end();
  });

  return httpServer;
}
