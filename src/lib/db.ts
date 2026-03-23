import { PrismaClient } from '@prisma/client'

// Create a singleton instance of PrismaClient to avoid
// exhausting database connections in development hot reload.
const globalCache = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalCache.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : []
  })

if (process.env.NODE_ENV !== 'production') {
  globalCache.prisma = prisma
}

