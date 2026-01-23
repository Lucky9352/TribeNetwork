import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

/**
 * @file prisma.ts
 * @description Prisma client singleton for database connections.
 * Uses the Prisma PostgreSQL adapter with connection pooling.
 * Implements the singleton pattern to prevent multiple instances in development.
 */

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    'DATABASE_URL environment variable is not defined. Please set it in your .env file.'
  )
}

/**
 * PostgreSQL connection pool.
 * Manages database connections for efficient reuse.
 */
const pool = new Pool({ connectionString })

/**
 * Prisma PostgreSQL adapter.
 * Bridges the connection pool with Prisma Client.
 */
const adapter = new PrismaPg(pool)

/**
 * Creates a new Prisma Client instance with the PostgreSQL adapter.
 * @returns {PrismaClient} A configured Prisma Client instance.
 */
const prismaClientSingleton = () => {
  return new PrismaClient({ adapter })
}

/**
 * Type alias for the Prisma Client singleton.
 */
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

/**
 * Global reference for storing the Prisma Client singleton.
 * Prevents creating multiple instances during hot reloading in development.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

/**
 * The exported Prisma Client instance.
 * Uses the existing global instance if available, otherwise creates a new one.
 */
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
