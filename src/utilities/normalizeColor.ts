/**
 * Utility for converting hex color codes to normalized RGBA values
 * @updatedAt 2025-08-16
 */

/**
 * Converts a hex color code to normalized RGB array
 * @param hexCode - Hex color value as number (e.g., 0xFF5733)
 * @returns Array of RGB values normalized to 0-1 range [r, g, b]
 */
export function normalizeColor(hexCode: number) {
  return [
    ((hexCode >> 16) & 255) / 255, // Extract red component and normalize
    ((hexCode >> 8) & 255) / 255, // Extract green component and normalize
    (255 & hexCode) / 255, // Extract blue component and normalize
  ];
}

/**
 * Converts a hex color code to normalized RGBA array
 * @param hexCode - Hex color value as number (e.g., 0xFF5733)
 * @param alpha - Alpha value (0-1 range, defaults to 1.0)
 * @returns Array of RGBA values normalized to 0-1 range [r, g, b, a]
 */
export function normalizeColorRgba(hexCode: number, alpha: number = 1.0) {
  return [
    ((hexCode >> 16) & 255) / 255, // Extract red component and normalize
    ((hexCode >> 8) & 255) / 255, // Extract green component and normalize
    (255 & hexCode) / 255, // Extract blue component and normalize
    Math.max(0, Math.min(1, alpha)), // Clamp alpha to 0-1 range
  ];
}
