/**
 * MeshGradientCanvas - A reusable component that renders an animated mesh gradient
 * @updatedAt 2025-08-16
 */

import { useEffect, useRef } from "react";
import { Gradient } from "../utilities/Gradient";
import { parseColorArray } from "../utilities/parseRgbColor";

interface MeshGradientCanvasProps {
  width?: string;
  height?: string;
  className?: string;
  style?: React.CSSProperties;
  colors?: string[]; // Array of RGB/RGBA color strings, max 5 colors
}

export function MeshGradientCanvas({
  width = "100%",
  height = "600px",
  className,
  style,
  colors,
}: MeshGradientCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Create gradient instance
    const gradient = new Gradient();

    // Parse and validate custom colors if provided
    let customColors: number[][] | null = null;
    if (colors && colors.length > 0) {
      customColors = parseColorArray(colors);
      if (!customColors) {
        console.warn("Invalid colors provided, using default colors");
      }
    }

    // Initialize gradient with canvas element
    if (canvasRef.current) {
      console.log("Canvas element:", canvasRef.current);
      console.log(
        "Canvas dimensions:",
        canvasRef.current.width,
        "x",
        canvasRef.current.height
      );
      gradient.initGradient(canvasRef.current, customColors);
    } else {
      console.log("Canvas ref is null");
    }
  }, [colors]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height, ...style }}
    />
  );
}
