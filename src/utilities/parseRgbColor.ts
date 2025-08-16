/**
 * Utility for parsing RGB/RGBA color strings and extracting RGBA components
 * @updatedAt 2025-08-16
 */

/**
 * Parses RGB or RGBA color string and returns normalized RGBA values
 * @param colorString - Color string in format "rgb(r, g, b)" or "rgba(r, g, b, a)"
 * @returns Array of RGBA values normalized to 0-1 range [r, g, b, a] or null if invalid
 */
export function parseRgbaColor(colorString: string): number[] | null {
  // Remove whitespace and convert to lowercase
  const cleanColor = colorString.replace(/\s/g, "").toLowerCase();

  // Match RGB pattern: rgb(r,g,b) or rgba(r,g,b,a)
  const rgbMatch = cleanColor.match(
    /^rgba?\((\d+),(\d+),(\d+)(?:,([\d.]+))?\)$/
  );

  if (!rgbMatch) {
    return null;
  }

  const r = parseInt(rgbMatch[1], 10);
  const g = parseInt(rgbMatch[2], 10);
  const b = parseInt(rgbMatch[3], 10);
  const a = rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1.0;

  // Validate RGB values are in valid range
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    return null;
  }

  // Validate alpha value is in valid range
  if (a < 0 || a > 1) {
    return null;
  }

  // Return normalized RGBA values (0-1 range)
  return [r / 255, g / 255, b / 255, a];
}

/**
 * Legacy function for backward compatibility - now returns RGBA with alpha = 1.0
 * @deprecated Use parseRgbaColor instead
 */
export function parseRgbColor(colorString: string): number[] | null {
  const result = parseRgbaColor(colorString);
  return result ? result.slice(0, 3) : null; // Return only RGB components for backward compatibility
}

/**
 * Validates and parses an array of color strings
 * @param colors - Array of RGB/RGBA color strings (max 5)
 * @returns Array of normalized RGBA color arrays or null if invalid
 */
export function parseColorArray(colors: string[]): number[][] | null {
  if (!colors || colors.length === 0 || colors.length > 5) {
    return null;
  }

  const parsedColors: number[][] = [];

  for (const colorString of colors) {
    const parsedColor = parseRgbaColor(colorString);
    if (!parsedColor) {
      return null; // Invalid color found
    }
    parsedColors.push(parsedColor);
  }

  return parsedColors;
}
