import { z } from 'zod';
import { insertBabySchema, insertFeedingSchema, insertSleepLogSchema, insertDiaperLogSchema, insertGrowthLogSchema, insertMemorySchema, babies, feedings, sleepLogs, diaperLogs, growthLogs, memories } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  babies: {
    list: {
      method: 'GET' as const,
      path: '/api/babies',
      responses: {
        200: z.array(z.custom<typeof babies.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/babies/:id',
      responses: {
        200: z.custom<typeof babies.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/babies',
      input: insertBabySchema,
      responses: {
        201: z.custom<typeof babies.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/babies/:id',
      input: insertBabySchema.partial(),
      responses: {
        200: z.custom<typeof babies.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/babies/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  feedings: {
    list: {
      method: 'GET' as const,
      path: '/api/babies/:babyId/feedings',
      responses: {
        200: z.array(z.custom<typeof feedings.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/babies/:babyId/feedings',
      input: insertFeedingSchema,
      responses: {
        201: z.custom<typeof feedings.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/feedings/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  sleepLogs: {
    list: {
      method: 'GET' as const,
      path: '/api/babies/:babyId/sleep-logs',
      responses: {
        200: z.array(z.custom<typeof sleepLogs.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/babies/:babyId/sleep-logs',
      input: insertSleepLogSchema,
      responses: {
        201: z.custom<typeof sleepLogs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/sleep-logs/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  diaperLogs: {
    list: {
      method: 'GET' as const,
      path: '/api/babies/:babyId/diaper-logs',
      responses: {
        200: z.array(z.custom<typeof diaperLogs.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/babies/:babyId/diaper-logs',
      input: insertDiaperLogSchema,
      responses: {
        201: z.custom<typeof diaperLogs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/diaper-logs/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  growthLogs: {
    list: {
      method: 'GET' as const,
      path: '/api/babies/:babyId/growth-logs',
      responses: {
        200: z.array(z.custom<typeof growthLogs.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/babies/:babyId/growth-logs',
      input: insertGrowthLogSchema,
      responses: {
        201: z.custom<typeof growthLogs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/growth-logs/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  memories: {
    list: {
      method: 'GET' as const,
      path: '/api/babies/:babyId/memories',
      responses: {
        200: z.array(z.custom<typeof memories.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/babies/:babyId/memories',
      input: insertMemorySchema,
      responses: {
        201: z.custom<typeof memories.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/memories/:id',
      responses: {
        204: z.void(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
