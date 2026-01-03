import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import type { InsertBaby, Baby } from "@shared/schema";

export function useBabies() {
  return useQuery({
    queryKey: [api.babies.list.path],
    queryFn: async () => {
      const res = await fetch(api.babies.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch babies");
      return api.babies.list.responses[200].parse(await res.json());
    },
  });
}

export function useBaby(id: number) {
  return useQuery({
    queryKey: [api.babies.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.babies.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch baby");
      return api.babies.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateBaby() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertBaby) => {
      const res = await fetch(api.babies.create.path, {
        method: api.babies.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create baby");
      }
      return api.babies.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.babies.list.path] });
    },
  });
}

export function useUpdateBaby() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertBaby>) => {
      const url = buildUrl(api.babies.update.path, { id });
      const res = await fetch(url, {
        method: api.babies.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Baby not found");
        throw new Error("Failed to update baby");
      }
      return api.babies.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.babies.list.path] });
    },
  });
}

export function useDeleteBaby() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.babies.delete.path, { id });
      const res = await fetch(url, { 
        method: api.babies.delete.method,
        credentials: "include" 
      });
      if (!res.ok && res.status !== 404) throw new Error("Failed to delete baby");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.babies.list.path] });
    },
  });
}
