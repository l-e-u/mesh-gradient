/**
 * MeshGradientCanvas - A reusable component that renders an animated mesh gradient
 * @updatedAt 2025-08-16
 */

import { useEffect, useRef } from "react";
import { Gradient } from "../utilities/Gradient";

interface MeshGradientCanvasProps {
  width?: string;
  height?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function MeshGradientCanvas({
  width = "100%",
  height = "600px",
  className,
  style,
}: MeshGradientCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Create gradient instance
    const gradient = new Gradient();

    // Initialize gradient with canvas element
    if (canvasRef.current) {
      console.log("Canvas element:", canvasRef.current);
      console.log(
        "Canvas dimensions:",
        canvasRef.current.width,
        "x",
        canvasRef.current.height
      );
      gradient.initGradient(canvasRef.current);
    } else {
      console.log("Canvas ref is null");
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height, ...style }}
    />
  );
}
