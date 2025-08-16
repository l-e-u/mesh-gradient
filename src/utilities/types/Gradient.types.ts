/**
 * Type definitions for Gradient class
 * @updatedAt 2025-08-16
 */

import type {
  MiniGl,
  Mesh,
  Material,
  PlaneGeometry,
  Uniform,
} from "./MiniGl.types";

// Configuration interface
export interface GradientConfig {
  playing: boolean;
  density: [number, number];
  [key: string]: any; // Allow additional properties
}

// Gradient uniforms interface
export interface GradientUniforms {
  u_time: Uniform;
  u_shadow_power: Uniform;
  u_darken_top: Uniform;
  u_active_colors: Uniform;
  u_global: Uniform;
  u_vertDeform: Uniform;
  u_baseColor: Uniform;
  u_waveLayers: any;
  [key: string]: any; // Allow additional properties
}

// Shader files interface
export interface ShaderFiles {
  vertex: string;
  noise: string;
  blend: string;
  fragment: string;
}

// Main Gradient interface
export interface IGradient {
  el: HTMLCanvasElement | null;
  angle: number;
  isLoadedClass: boolean;
  isScrolling: boolean;
  scrollingTimeout: number | undefined;
  scrollingRefreshDelay: number;
  isIntersecting: boolean;
  shaderFiles: ShaderFiles | undefined;
  vertexShader: string | undefined;
  sectionColors: number[] | undefined;
  conf: GradientConfig | undefined;
  uniforms: GradientUniforms | undefined;
  t: number;
  last: number;
  width: number | undefined;
  minWidth: number;
  height: number;
  xSegCount: number | undefined;
  ySegCount: number | undefined;
  mesh: Mesh | undefined;
  material: Material | undefined;
  geometry: PlaneGeometry | undefined;
  minigl: MiniGl | undefined;
  scrollObserver: IntersectionObserver | undefined;
  amp: number;
  seed: number;
  freqX: number;
  freqY: number;
  freqDelta: number;
  activeColors: number[];
  isMetaKey: boolean;
  isGradientLegendVisible: boolean;
  isMouseDown: boolean;
  isStatic: boolean;

  // Methods
  handleScroll: () => void;
  handleScrollEnd: () => void;
  resize: () => void;
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseUp: () => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  animate: (e: number) => void;
  pause: () => void;
  play: () => void;
  initGradient: (canvasElement: HTMLCanvasElement) => IGradient;
}
