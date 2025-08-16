/**
 * Utility for converting hex color codes to normalized RGB values
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
