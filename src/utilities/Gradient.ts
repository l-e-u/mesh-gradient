import { normalizeColor } from "./normalizeColor.ts";
import { MiniGl } from "./MiniGl.ts";
import {
  VERTEX_SHADER,
  FRAGMENT_SHADER,
  NOISE_SHADER,
  BLEND_SHADER,
} from "./shaders.ts";

/**
 * Gradient class for creating animated mesh gradients
 * @updatedAt 2025-08-16
 */
export class Gradient {
  el: HTMLCanvasElement | null = null;
  angle = 0;
  isLoadedClass = false;
  isScrolling = false;
  scrollingTimeout: number | undefined = undefined;
  scrollingRefreshDelay = 200;
  isIntersecting = false;
  shaderFiles: any = undefined;
  vertexShader: string | undefined = undefined;
  sectionColors: any = undefined;
  conf: any = undefined;
  uniforms: any = undefined;
  t = 1253106;
  last = 0;
  width: number | undefined = undefined;
  minWidth = 1111;
  height = 600;
  xSegCount: number | undefined = undefined;
  ySegCount: number | undefined = undefined;
  mesh: any = undefined;
  material: any = undefined;
  geometry: any = undefined;
  minigl: any = undefined;
  scrollObserver: any = undefined;
  amp = 320;
  seed = 5;
  freqX = 14e-5;
  freqY = 29e-5;
  freqDelta = 1e-5;
  activeColors = [1, 1, 1, 1];
  isMetaKey = false;
  isGradientLegendVisible = false;
  isMouseDown = false;
  isStatic = false;

  // Method declarations
  handleScroll: () => void;
  handleScrollEnd: () => void;
  resize: () => void;
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseUp: () => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  animate: (e: number) => void;
  pause: () => void;
  play: () => void;
  initGradient: (canvasElement: HTMLCanvasElement) => this;

  constructor() {
    // Set default colors immediately
    this.sectionColors = [
      0xc3e4ff, // #c3e4ff - light blue
      0x6ec3f4, // #6ec3f4 - blue
      0xeae2ff, // #eae2ff - light purple
      0xb9beff, // #b9beff - purple
    ];

    this.handleScroll = () => {
      clearTimeout(this.scrollingTimeout);
      this.scrollingTimeout = setTimeout(
        this.handleScrollEnd,
        this.scrollingRefreshDelay
      );
      this.conf.playing && ((this.isScrolling = true), this.pause());
    };

    this.handleScrollEnd = () => {
      this.isScrolling = false;
      this.isIntersecting && this.play();
    };

    this.resize = () => {
      this.width = window.innerWidth;
      this.minigl.setSize(this.width, this.height);
      this.minigl.setOrthographicCamera();
      this.xSegCount = Math.ceil(this.width * this.conf.density[0]);
      this.ySegCount = Math.ceil(this.height * this.conf.density[1]);
      this.mesh.geometry.setTopology(this.xSegCount, this.ySegCount);
      this.mesh.geometry.setSize(this.width, this.height);
      this.mesh.material.uniforms.u_shadow_power.value =
        this.width < 600 ? 5 : 6;
    };

    this.handleMouseDown = (e: MouseEvent) => {
      this.isGradientLegendVisible &&
        ((this.isMetaKey = e.metaKey),
        (this.isMouseDown = true),
        false === this.conf.playing && requestAnimationFrame(this.animate));
    };

    this.handleMouseUp = () => {
      this.isMouseDown = false;
    };

    this.handleKeyDown = (_e: KeyboardEvent) => {
      // Handle keyboard events if needed
    };

    this.animate = (e: number) => {
      if (!this.shouldSkipFrame(e) || this.isMouseDown) {
        if (
          ((this.t += Math.min(e - this.last, 1e3 / 15)),
          (this.last = e),
          this.isMouseDown)
        ) {
          let timeIncrement = 160;
          this.isMetaKey && (timeIncrement = -160);
          this.t += timeIncrement;
        }
        this.mesh.material.uniforms.u_time.value = this.t;
        this.minigl.render();
      }
      if (0 !== this.last && this.isStatic)
        return this.minigl.render(), void this.disconnect();
      /*this.isIntersecting && */ (this.conf.playing || this.isMouseDown) &&
        requestAnimationFrame(this.animate);
    };

    this.pause = () => {
      this.conf.playing = false;
    };

    this.play = () => {
      requestAnimationFrame(this.animate);
      this.conf.playing = true;
    };

    this.initGradient = (canvasElement: HTMLCanvasElement) => {
      this.el = canvasElement;
      console.log("Canvas element set to:", this.el);

      // Set canvas dimensions directly
      if (this.el) {
        this.el.width = window.innerWidth;
        this.el.height = 600;
      }

      this.connect();
      return this;
    };
  }
  async connect() {
    console.log("connect() called, this.el:", this.el);
    (this.shaderFiles = {
      vertex: VERTEX_SHADER,
      noise: NOISE_SHADER,
      blend: BLEND_SHADER,
      fragment: FRAGMENT_SHADER,
    }),
      (this.conf = {
        presetName: "",
        wireframe: false,
        density: [0.06, 0.16],
        zoom: 1,
        rotation: 0,
        playing: true,
      }),
      (this.minigl = new MiniGl(this.el, null, null, true)),
      requestAnimationFrame(() => {
        this.el && this.init();
      });
  }
  disconnect() {
    this.scrollObserver &&
      (window.removeEventListener("scroll", this.handleScroll),
      window.removeEventListener("mousedown", this.handleMouseDown),
      window.removeEventListener("mouseup", this.handleMouseUp),
      window.removeEventListener("keydown", this.handleKeyDown),
      this.scrollObserver.disconnect()),
      window.removeEventListener("resize", this.resize);
  }
  initMaterial() {
    this.uniforms = {
      u_time: new this.minigl.Uniform({
        value: 0,
      }),
      u_shadow_power: new this.minigl.Uniform({
        value: 5,
      }),
      u_darken_top: new this.minigl.Uniform({
        value: "" === this.el?.dataset.jsDarkenTop ? 1 : 0,
      }),
      u_active_colors: new this.minigl.Uniform({
        value: this.activeColors,
        type: "vec4",
      }),
      u_global: new this.minigl.Uniform({
        value: {
          noiseFreq: new this.minigl.Uniform({
            value: [this.freqX, this.freqY],
            type: "vec2",
          }),
          noiseSpeed: new this.minigl.Uniform({
            value: 5e-6,
          }),
        },
        type: "struct",
      }),
      u_vertDeform: new this.minigl.Uniform({
        value: {
          incline: new this.minigl.Uniform({
            value: Math.sin(this.angle) / Math.cos(this.angle),
          }),
          offsetTop: new this.minigl.Uniform({
            value: -0.5,
          }),
          offsetBottom: new this.minigl.Uniform({
            value: -0.5,
          }),
          noiseFreq: new this.minigl.Uniform({
            value: [3, 4],
            type: "vec2",
          }),
          noiseAmp: new this.minigl.Uniform({
            value: this.amp,
          }),
          noiseSpeed: new this.minigl.Uniform({
            value: 10,
          }),
          noiseFlow: new this.minigl.Uniform({
            value: 3,
          }),
          noiseSeed: new this.minigl.Uniform({
            value: this.seed,
          }),
        },
        type: "struct",
        excludeFrom: "fragment",
      }),
      u_baseColor: new this.minigl.Uniform({
        value: this.sectionColors[0],
        type: "vec3",
        excludeFrom: "fragment",
      }),
      u_waveLayers: new this.minigl.Uniform({
        value: [],
        excludeFrom: "fragment",
        type: "array",
      }),
    };
    for (let e = 1; e < this.sectionColors.length; e += 1)
      this.uniforms.u_waveLayers.value.push(
        new this.minigl.Uniform({
          value: {
            color: new this.minigl.Uniform({
              value: this.sectionColors[e],
              type: "vec3",
            }),
            noiseFreq: new this.minigl.Uniform({
              value: [
                2 + e / this.sectionColors.length,
                3 + e / this.sectionColors.length,
              ],
              type: "vec2",
            }),
            noiseSpeed: new this.minigl.Uniform({
              value: 11 + 0.3 * e,
            }),
            noiseFlow: new this.minigl.Uniform({
              value: 6.5 + 0.3 * e,
            }),
            noiseSeed: new this.minigl.Uniform({
              value: this.seed + 10 * e,
            }),
            noiseFloor: new this.minigl.Uniform({
              value: 0.1,
            }),
            noiseCeil: new this.minigl.Uniform({
              value: 0.63 + 0.07 * e,
            }),
          },
          type: "struct",
        })
      );
    return (
      (this.vertexShader = [
        this.shaderFiles.noise,
        this.shaderFiles.blend,
        this.shaderFiles.vertex,
      ].join("\n\n")),
      new this.minigl.Material(
        this.vertexShader,
        this.shaderFiles.fragment,
        this.uniforms
      )
    );
  }
  initMesh() {
    (this.material = this.initMaterial()),
      (this.geometry = new this.minigl.PlaneGeometry()),
      (this.mesh = new this.minigl.Mesh(this.geometry, this.material));
  }
  shouldSkipFrame(e: number) {
    return (
      !!window.document.hidden ||
      !this.conf.playing ||
      parseInt(e.toString(), 10) % 2 == 0 ||
      void 0
    );
  }
  updateFrequency(e: number) {
    (this.freqX += e), (this.freqY += e);
  }
  toggleColor(index: number) {
    this.activeColors[index] = 0 === this.activeColors[index] ? 1 : 0;
  }
  init() {
    this.initGradientColors(),
      this.initMesh(),
      this.resize(),
      requestAnimationFrame(this.animate),
      window.addEventListener("resize", this.resize);
  }
  /*
   * Initializes the four section colors by converting them to normalized format.
   */
  initGradientColors() {
    // Colors are already set in constructor, just convert them to normalized format
    this.sectionColors = this.sectionColors.map(normalizeColor);
  }
}

/*
 *Finally initializing the Gradient class, assigning a canvas to it and calling Gradient.connect() which initializes everything,
 * Use Gradient.pause() and Gradient.play() for controls.
 *
 * Here are some default property values you can change anytime:
 * Amplitude:    Gradient.amp = 0
 * Colors:       Gradient.sectionColors (if you change colors, use normalizeColor(#hexValue)) before you assign it.
 *
 *
 * Useful functions
 * Gradient.toggleColor(index)
 * Gradient.updateFrequency(freq)
 */
