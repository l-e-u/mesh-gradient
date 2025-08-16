import { normalizeColor } from "./normalizeColor.ts";
import { defineProperty } from "./defineProperty.ts";
import { MiniGl } from "./MiniGl.ts";
import {
  VERTEX_SHADER,
  FRAGMENT_SHADER,
  NOISE_SHADER,
  BLEND_SHADER,
} from "./shaders.ts";

["SCREEN", "LINEAR_LIGHT"].reduce(
  (hexCode, t, n) =>
    Object.assign(hexCode, {
      [t]: n,
    }),
  {}
);

//Gradient object
export class Gradient {
  constructor() {
    defineProperty(this, "el", void 0),
      defineProperty(this, "cssVarRetries", 0),
      defineProperty(this, "maxCssVarRetries", 200),
      defineProperty(this, "angle", 0),
      defineProperty(this, "isLoadedClass", !1),
      defineProperty(this, "isScrolling", !1),
      /*defineProperty(this, "isStatic", o.disableAmbientAnimations()),*/ defineProperty(
        this,
        "scrollingTimeout",
        void 0
      ),
      defineProperty(this, "scrollingRefreshDelay", 200),
      defineProperty(this, "isIntersecting", !1),
      defineProperty(this, "shaderFiles", void 0),
      defineProperty(this, "vertexShader", void 0),
      defineProperty(this, "sectionColors", void 0),
      defineProperty(this, "conf", void 0),
      defineProperty(this, "uniforms", void 0),
      defineProperty(this, "t", 1253106),
      defineProperty(this, "last", 0),
      defineProperty(this, "width", void 0),
      defineProperty(this, "minWidth", 1111),
      defineProperty(this, "height", 600),
      defineProperty(this, "xSegCount", void 0),
      defineProperty(this, "ySegCount", void 0),
      defineProperty(this, "mesh", void 0),
      defineProperty(this, "material", void 0),
      defineProperty(this, "geometry", void 0),
      defineProperty(this, "minigl", void 0),
      defineProperty(this, "scrollObserver", void 0),
      defineProperty(this, "amp", 320),
      defineProperty(this, "seed", 5),
      defineProperty(this, "freqX", 14e-5),
      defineProperty(this, "freqY", 29e-5),
      defineProperty(this, "freqDelta", 1e-5),
      defineProperty(this, "activeColors", [1, 1, 1, 1]),
      defineProperty(this, "isMetaKey", !1),
      defineProperty(this, "isGradientLegendVisible", !1),
      defineProperty(this, "isMouseDown", !1),
      defineProperty(this, "handleScroll", () => {
        clearTimeout(this.scrollingTimeout),
          (this.scrollingTimeout = setTimeout(
            this.handleScrollEnd,
            this.scrollingRefreshDelay
          )),
          this.isGradientLegendVisible && this.hideGradientLegend(),
          this.conf.playing && ((this.isScrolling = !0), this.pause());
      }),
      defineProperty(this, "handleScrollEnd", () => {
        (this.isScrolling = !1), this.isIntersecting && this.play();
      }),
      defineProperty(this, "resize", () => {
        (this.width = window.innerWidth),
          this.minigl.setSize(this.width, this.height),
          this.minigl.setOrthographicCamera(),
          (this.xSegCount = Math.ceil(this.width * this.conf.density[0])),
          (this.ySegCount = Math.ceil(this.height * this.conf.density[1])),
          this.mesh.geometry.setTopology(this.xSegCount, this.ySegCount),
          this.mesh.geometry.setSize(this.width, this.height),
          (this.mesh.material.uniforms.u_shadow_power.value =
            this.width < 600 ? 5 : 6);
      }),
      defineProperty(this, "handleMouseDown", (e) => {
        this.isGradientLegendVisible &&
          ((this.isMetaKey = e.metaKey),
          (this.isMouseDown = !0),
          !1 === this.conf.playing && requestAnimationFrame(this.animate));
      }),
      defineProperty(this, "handleMouseUp", () => {
        this.isMouseDown = !1;
      }),
      defineProperty(this, "animate", (e) => {
        if (!this.shouldSkipFrame(e) || this.isMouseDown) {
          if (
            ((this.t += Math.min(e - this.last, 1e3 / 15)),
            (this.last = e),
            this.isMouseDown)
          ) {
            let e = 160;
            this.isMetaKey && (e = -160), (this.t += e);
          }
          (this.mesh.material.uniforms.u_time.value = this.t),
            this.minigl.render();
        }
        if (0 !== this.last && this.isStatic)
          return this.minigl.render(), void this.disconnect();
        /*this.isIntersecting && */ (this.conf.playing || this.isMouseDown) &&
          requestAnimationFrame(this.animate);
      }),
      defineProperty(this, "addIsLoadedClass", () => {
        /*this.isIntersecting && */ !this.isLoadedClass &&
          ((this.isLoadedClass = !0),
          this.el.classList.add("isLoaded"),
          setTimeout(() => {
            this.el.parentElement.classList.add("isLoaded");
          }, 3e3));
      }),
      defineProperty(this, "pause", () => {
        this.conf.playing = false;
      }),
      defineProperty(this, "play", () => {
        requestAnimationFrame(this.animate), (this.conf.playing = true);
      }),
      defineProperty(this, "initGradient", (canvasElement) => {
        // Accept either a canvas element or a selector string for backward compatibility
        console.log("initGradient called with:", canvasElement);
        this.el =
          canvasElement instanceof HTMLCanvasElement
            ? canvasElement
            : document.querySelector(canvasElement);
        console.log("Canvas element set to:", this.el);

        // Set canvas dimensions directly
        if (this.el) {
          this.el.width = window.innerWidth;
          this.el.height = 600;
        }

        this.connect();
        return this;
      });
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
      document.querySelectorAll("canvas").length < 1
        ? console.log("DID NOT LOAD HERO STRIPE CANVAS")
        : ((this.minigl = new MiniGl(this.el, null, null, true)),
          requestAnimationFrame(() => {
            this.el && this.waitForCssVars();
          }));
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
        value: "" === this.el.dataset.jsDarkenTop ? 1 : 0,
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
  shouldSkipFrame(e) {
    return (
      !!window.document.hidden ||
      !this.conf.playing ||
      parseInt(e, 10) % 2 == 0 ||
      void 0
    );
  }
  updateFrequency(e) {
    (this.freqX += e), (this.freqY += e);
  }
  toggleColor(index) {
    this.activeColors[index] = 0 === this.activeColors[index] ? 1 : 0;
  }
  showGradientLegend() {
    this.width > this.minWidth &&
      ((this.isGradientLegendVisible = !0),
      document.body.classList.add("isGradientLegendVisible"));
  }
  hideGradientLegend() {
    (this.isGradientLegendVisible = !1),
      document.body.classList.remove("isGradientLegendVisible");
  }
  init() {
    this.initGradientColors(),
      this.initMesh(),
      this.resize(),
      requestAnimationFrame(this.animate),
      window.addEventListener("resize", this.resize);
  }
  /*
   * Waiting for the css variables to become available, usually on page load before we can continue.
   * Using default colors assigned below if no variables have been found after maxCssVarRetries
   */
  waitForCssVars() {
    // Use default colors instead of waiting for CSS variables
    this.sectionColors = [
      0xc3e4ff, // #c3e4ff - light blue
      0x6ec3f4, // #6ec3f4 - blue
      0xeae2ff, // #eae2ff - light purple
      0xb9beff, // #b9beff - purple
    ];
    this.init();
    this.addIsLoadedClass();
  }
  /*
   * Initializes the four section colors by retrieving them from css variables.
   */
  initGradientColors() {
    // Colors are already set in waitForCssVars, just convert them to normalized format
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
