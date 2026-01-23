/**
 * Determines if an image should be unoptimized by Next.js.
 * This is useful for animated GIFs (which Next.js optimization breaks)
 * and slow external providers like Imgur that frequently time out.
 */
export function shouldUnoptimize(url: string | null | undefined): boolean {
  if (!url) return false

  const lowerUrl = url.toLowerCase()

  if (lowerUrl.includes('.gif')) return true

  if (lowerUrl.includes('imgur.com')) return true

  return false
}
