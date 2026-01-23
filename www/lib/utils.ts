import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * @file utils.ts
 * @description Utility functions for the application.
 * Contains commonly used helpers for styling and other operations.
 */

/**
 * Merges class names using clsx and tailwind-merge.
 * Combines conditional classes and resolves Tailwind CSS conflicts.
 *
 * @param {...ClassValue[]} inputs - Class values to merge (strings, objects, arrays).
 * @returns {string} The merged class string with resolved Tailwind conflicts.
 *
 * @example
 * cn('px-2 py-1', condition && 'bg-red-500', 'px-4')
 * Returns: 'py-1 bg-red-500 px-4' (px-4 overrides px-2)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
