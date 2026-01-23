import React from 'react'

/**
 * @file Grain.tsx
 * @description A full-screen film grain overlay effect using SVG noise filters.
 * Creates a subtle texture overlay to add visual depth and a premium feel.
 */

/**
 * Grain Component
 * Renders a fixed-position SVG noise filter as a visual overlay.
 * Uses CSS animation for a subtle, animated grain effect.
 *
 * @returns {JSX.Element} A full-screen grain overlay element.
 */
export default function Grain() {
  return (
    <div
      className="fixed inset-0 z-9999 pointer-events-none opacity-[0.03] animate-grain mix-blend-overlay"
      aria-hidden="true"
    >
      <svg className="w-full h-full" aria-hidden="true">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6"
            numOctaves={3}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  )
}
