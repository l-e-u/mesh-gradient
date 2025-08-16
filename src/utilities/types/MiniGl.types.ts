/**
 * Type definitions for MiniGl WebGL wrapper
 * @updatedAt 2025-08-16
 */

// Uniform types mapping
export type UniformType = "float" | "int" | "vec2" | "vec3" | "vec4" | "mat4";
export type UniformTypeFn = "1f" | "1i" | "2fv" | "3fv" | "4fv" | "Matrix4fv";

// Shader types
export type ShaderType = "vertex" | "fragment";

// Uniform value types
export type UniformValue =
  | number
  | number[]
  | Float32Array
  | Uniform
  | UniformStruct
  | UniformArray;

// Uniform configuration
export interface UniformConfig {
  type: UniformType;
  value?: UniformValue;
  transpose?: boolean;
  excludeFrom?: ShaderType;
}

// Struct uniform type
export interface UniformStruct {
  type: "struct";
  value: Record<string, Uniform>;
}

// Array uniform type
export interface UniformArray {
  type: "array";
  value: Uniform[];
}

// Uniform class interface
export interface Uniform {
  type: UniformType;
  value?: UniformValue;
  transpose?: boolean;
  excludeFrom?: ShaderType;
  typeFn?: UniformTypeFn;
  update(location?: WebGLUniformLocation): void;
  getDeclaration(name: string, type: ShaderType, length?: number): string;
}

// Uniform instance
export interface UniformInstance {
  uniform: Uniform;
  location: WebGLUniformLocation | null;
}

// Attribute configuration
export interface AttributeConfig {
  target: number;
  size: number;
  type?: number;
  normalized?: boolean;
  values?: Float32Array | Uint16Array;
}

// Attribute class interface
export interface Attribute {
  target: number;
  size: number;
  type: number;
  normalized: boolean;
  buffer: WebGLBuffer | null;
  values?: Float32Array | Uint16Array;
  update(): void;
  attach(name: string, program: WebGLProgram): number;
  use(location: number): void;
}

// Attribute instance
export interface AttributeInstance {
  attribute: Attribute;
  location: number;
}

// Geometry attributes
export interface GeometryAttributes {
  position: Attribute;
  uv: Attribute;
  uvNorm: Attribute;
  index: Attribute;
}

// PlaneGeometry class interface
export interface PlaneGeometry {
  attributes: GeometryAttributes;
  xSegCount: number;
  ySegCount: number;
  vertexCount: number;
  quadCount: number;
  width: number;
  height: number;
  orientation: string;
  setTopology(xSegments?: number, ySegments?: number): void;
  setSize(width?: number, height?: number, orientation?: string): void;
}

// Material class interface
export interface Material {
  uniforms: Record<string, Uniform>;
  uniformInstances: UniformInstance[];
  vertexSource: string;
  Source: string;
  vertexShader: WebGLShader | null;
  fragmentShader: WebGLShader | null;
  program: WebGLProgram | null;
  attachUniforms(
    name?: string,
    uniforms?: Record<string, Uniform> | Uniform
  ): void;
}

// Mesh class interface
export interface Mesh {
  geometry: PlaneGeometry;
  material: Material;
  wireframe: boolean;
  attributeInstances: AttributeInstance[];
  draw(): void;
  remove(): void;
}

// Common uniforms interface
export interface CommonUniforms {
  projectionMatrix: Uniform;
  modelViewMatrix: Uniform;
  resolution: Uniform;
  aspectRatio: Uniform;
  [key: string]: Uniform;
}

// Debug function type
export type DebugFunction = (message: string, ...args: any[]) => void;

// MiniGl constructor classes
export interface MiniGlClasses {
  Material: new (
    vertexShader: string,
    fragmentShader: string,
    uniforms?: Record<string, Uniform>
  ) => Material;
  Uniform: new (config: UniformConfig) => Uniform;
  PlaneGeometry: new (
    width: number,
    height: number,
    xSegments?: number,
    ySegments?: number,
    orientation?: string
  ) => PlaneGeometry;
  Mesh: new (geometry: PlaneGeometry, material: Material) => Mesh;
  Attribute: new (config: AttributeConfig) => Attribute;
}

// Main MiniGl interface
export interface MiniGl extends MiniGlClasses {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  meshes: Mesh[];
  width: number;
  height: number;
  debug: DebugFunction;
  lastDebugMsg?: Date;
  commonUniforms: CommonUniforms;

  setSize(width?: number, height?: number): void;
  setOrthographicCamera(
    left?: number,
    right?: number,
    top?: number,
    near?: number,
    far?: number
  ): void;
  render(): void;
}

// MiniGl constructor type
export interface MiniGlConstructor {
  new (
    canvas: HTMLCanvasElement,
    width?: number,
    height?: number,
    debug?: boolean
  ): MiniGl;
}
