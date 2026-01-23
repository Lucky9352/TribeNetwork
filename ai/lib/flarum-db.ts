/**
 * @file flarum-db.ts
 * @description MySQL connection pool for Flarum database.
 * Provides read-only access to forum data for AI context.
 */

import mysql, { Pool, PoolConnection, RowDataPacket } from 'mysql2/promise'

/**
 * MySQL connection pool configuration.
 * Uses environment variables for Railway internal networking.
 */
const poolConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  database: process.env.MYSQL_DATABASE || 'railway',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
}

/**
 * Singleton pool instance.
 * Lazy initialization to avoid errors during build time.
 */
let pool: Pool | null = null

/**
 * Get the MySQL connection pool.
 * Creates the pool on first call.
 */
export function getFlarumDb(): Pool {
  if (!pool) {
    pool = mysql.createPool(poolConfig)
  }
  return pool
}

/**
 * Execute a query on the Flarum database.
 * @param sql - SQL query string with ? placeholders
 * @param params - Query parameters
 * @returns Query results
 */
export async function query<T extends RowDataPacket[]>(
  sql: string,
  params?: (string | number | boolean | null)[]
): Promise<T> {
  const db = getFlarumDb()
  const [rows] = await db.execute<T>(sql, params)
  return rows
}

/**
 * Get a single connection for transaction-like operations.
 * Remember to release the connection after use.
 */
export async function getConnection(): Promise<PoolConnection> {
  const db = getFlarumDb()
  return db.getConnection()
}

/**
 * Test database connectivity.
 * Useful for health checks.
 */
export async function testConnection(): Promise<boolean> {
  try {
    const db = getFlarumDb()
    await db.query('SELECT 1')
    return true
  } catch {
    return false
  }
}

/**
 * Close the connection pool.
 * Call this during graceful shutdown.
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}

export { pool as flarumDb }
