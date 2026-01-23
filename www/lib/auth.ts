import { cookies } from 'next/headers'
import bcrypt from 'bcrypt'
import { SignJWT, jwtVerify } from 'jose'

/**
 * @file auth.ts
 * @description Authentication utilities for admin dashboard.
 * Handles password hashing, JWT session management, and session verification.
 */

const SALT_ROUNDS = 12
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)
const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 60 * 60 * 24 * 7

export interface SessionPayload {
  userId: string
  email: string
  exp?: number
}

/**
 * Hash a password using bcrypt.
 * @param password - Plain text password
 * @returns Hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify a password against a hash.
 * @param password - Plain text password
 * @param hash - Stored password hash
 * @returns True if password matches
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Create a JWT session token.
 * @param userId - User's unique ID
 * @param email - User's email
 * @returns Signed JWT token string
 */
export async function createSession(
  userId: string,
  email: string
): Promise<string> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION * 1000)

  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(JWT_SECRET)

  return token
}

/**
 * Verify and decode a JWT session token.
 * @param token - JWT token string
 * @returns Decoded session payload or null if invalid
 */
export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      exp: payload.exp,
    }
  } catch {
    return null
  }
}

/**
 * Set the session cookie.
 * @param token - JWT token to store in cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  })
}

/**
 * Clear the session cookie.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Get the current session from cookies.
 * @returns Session payload or null if not authenticated
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return verifySession(token)
}

/**
 * Check if the current request is authenticated.
 * @returns True if user has a valid session
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}
