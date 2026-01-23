#!/usr/bin/env npx tsx
/**
 * @file create-admin.ts
 * @description CLI script to create admin users for the dashboard.
 *
 * Usage:
 *   pnpm tsx scripts/create-admin.ts --email admin@example.com --password securepass123
 *   pnpm tsx scripts/create-admin.ts -e admin@example.com -p securepass123
 */

import 'dotenv/config'

import { Pool } from 'pg'
import bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'

const MIN_PASSWORD_LENGTH = 8
const SALT_ROUNDS = 12

function printUsage() {
  console.log(`
Usage: pnpm tsx scripts/create-admin.ts --email <email> --password <password> [--name <name>]

Options:
  -e, --email     Admin email (required)
  -p, --password  Admin password (required, min ${MIN_PASSWORD_LENGTH} chars)
  -n, --name      Admin name (optional)
  -h, --help      Show this help message

Example:
  pnpm tsx scripts/create-admin.ts --email admin@tribe.com --password securepass123
`)
}

function parseArgs(args: string[]): {
  email?: string
  password?: string
  name?: string
  help?: boolean
} {
  const result: {
    email?: string
    password?: string
    name?: string
    help?: boolean
  } = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    const nextArg = args[i + 1]

    switch (arg) {
      case '-e':
      case '--email':
        result.email = nextArg
        i++
        break
      case '-p':
      case '--password':
        result.password = nextArg
        i++
        break
      case '-n':
      case '--name':
        result.name = nextArg
        i++
        break
      case '-h':
      case '--help':
        result.help = true
        break
    }
  }

  return result
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.help) {
    printUsage()
    process.exit(0)
  }

  if (!args.email || !args.password) {
    printUsage()
    process.exit(1)
  }

  if (!validateEmail(args.email)) {
    process.exit(1)
  }

  if (args.password.length < MIN_PASSWORD_LENGTH) {
    process.exit(1)
  }

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    process.exit(1)
  }

  const pool = new Pool({ connectionString })

  try {
    const existingResult = await pool.query(
      'SELECT id FROM admin_users WHERE email = $1',
      [args.email]
    )

    if (existingResult.rows.length > 0) {
      process.exit(1)
    }

    const id = randomUUID()
    const passwordHash = await hashPassword(args.password)
    const now = new Date()

    await pool.query(
      `INSERT INTO admin_users (id, email, "passwordHash", name, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, args.email, passwordHash, args.name || null, now, now]
    )

    if (args.name) {
    }
  } catch {
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main()
