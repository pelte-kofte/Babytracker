import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { 
  InsertFeeding, InsertSleepLog, InsertDiaperLog, InsertGrowthLog, InsertMemory,
  Feeding, SleepLog, DiaperLog, GrowthLog, Memory
} from "@shared/schema";

// --- FEEDINGS ---

export function useFeedings(babyId: number) {
  return useQuery({
    queryKey: [api.feedings.list.path, babyId],
    queryFn: async () => {
      const url = buildUrl(api.feedings.list.path, { babyId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch feedings");
      return api.feedings.list.responses[200].parse(await res.json());
    },
    enabled: !!babyId,
  });
}

export function useCreateFeeding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ babyId, ...data }: { babyId: number } & InsertFeeding) => {
      const url = buildUrl(api.feedings.create.path, { babyId });
      const res = await fetch(url, {
        method: api.feedings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to log feeding");
      return api.feedings.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      const url = buildUrl(api.feedings.list.path, { babyId: variables.babyId });
      queryClient.invalidateQueries({ queryKey: [url] });
      queryClient.invalidateQueries({ queryKey: [api.feedings.list.path, variables.babyId] });
    },
  });
}

// --- SLEEP LOGS ---

export function useSleepLogs(babyId: number) {
  return useQuery({
    queryKey: [api.sleepLogs.list.path, babyId],
    queryFn: async () => {
      const url = buildUrl(api.sleepLogs.list.path, { babyId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sleep logs");
      return api.sleepLogs.list.responses[200].parse(await res.json());
    },
    enabled: !!babyId,
  });
}

export function useCreateSleepLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ babyId, ...data }: { babyId: number } & InsertSleepLog) => {
      const url = buildUrl(api.sleepLogs.create.path, { babyId });
      const res = await fetch(url, {
        method: api.sleepLogs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to log sleep");
      return api.sleepLogs.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.sleepLogs.list.path, variables.babyId] });
    },
  });
}

// --- DIAPER LOGS ---

export function useDiaperLogs(babyId: number) {
  return useQuery({
    queryKey: [api.diaperLogs.list.path, babyId],
    queryFn: async () => {
      const url = buildUrl(api.diaperLogs.list.path, { babyId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch diaper logs");
      return api.diaperLogs.list.responses[200].parse(await res.json());
    },
    enabled: !!babyId,
  });
}

export function useCreateDiaperLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ babyId, ...data }: { babyId: number } & InsertDiaperLog) => {
      const url = buildUrl(api.diaperLogs.create.path, { babyId });
      const res = await fetch(url, {
        method: api.diaperLogs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to log diaper change");
      return api.diaperLogs.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.diaperLogs.list.path, variables.babyId] });
    },
  });
}

// --- GROWTH LOGS ---

export function useGrowthLogs(babyId: number) {
  return useQuery({
    queryKey: [api.growthLogs.list.path, babyId],
    queryFn: async () => {
      const url = buildUrl(api.growthLogs.list.path, { babyId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch growth logs");
      return api.growthLogs.list.responses[200].parse(await res.json());
    },
    enabled: !!babyId,
  });
}

export function useCreateGrowthLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ babyId, ...data }: { babyId: number } & InsertGrowthLog) => {
      const url = buildUrl(api.growthLogs.create.path, { babyId });
      const res = await fetch(url, {
        method: api.growthLogs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to log growth");
      return api.growthLogs.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.growthLogs.list.path, variables.babyId] });
    },
  });
}

// --- MEMORIES ---

export function useMemories(babyId: number) {
  return useQuery({
    queryKey: [api.memories.list.path, babyId],
    queryFn: async () => {
      const url = buildUrl(api.memories.list.path, { babyId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch memories");
      return api.memories.list.responses[200].parse(await res.json());
    },
    enabled: !!babyId,
  });
}

export function useCreateMemory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ babyId, ...data }: { babyId: number } & InsertMemory) => {
      const url = buildUrl(api.memories.create.path, { babyId });
      const res = await fetch(url, {
        method: api.memories.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to save memory");
      return api.memories.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.memories.list.path, variables.babyId] });
    },
  });
}
