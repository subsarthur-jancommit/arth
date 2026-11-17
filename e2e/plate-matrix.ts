/**
 * The plate material, held to one variable at a time — G2.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * The owner's technical reference (`docs/SOLUSI-TEKNIS-VISUAL-GERAK.md` §2)
 * asks for an isolation matrix of the lit plate: the texture before WebGL,
 * the texture through a neutral shader, normal alpha against additive, the
 * halo alone, the scan alone. `e2e/plate-matrix.e2e.ts` photographs each.
 * This init script is what makes the variants without putting a diagnostic
 * switch into the site: it swaps the plate's fragment shader for a variant
 * before three compiles it, and sets the blending each variant names around
 * the plate's own draw calls only. Every other program on the page draws as
 * shipped.
 *
 * Install it with `page.addInitScript(installPlateMatrix, options)`, before
 * the first navigation; the shader is compiled once per page load, so a
 * variant is a page load.
 *
 * ## The variants
 *
 * All but `shipped` replace the fragment shader whole, declarations and all,
 * so they mean the same thing whatever the shipped shader becomes. Each reads
 * only what every version of the plate has carried: `uTexture`, `uClip`,
 * `uOpacity`, `vUv` and `vLocal`.
 *
 * - `shipped`: nothing replaced, nothing forced.
 * - `neutral`: the texel, nothing added, blended additively (row B).
 * - `halo`: the texel and its halo as the plate wrote it in November 2026,
 *   additive (row D).
 * - `scan`: the texel and a scan band held at `scanAt`, additive (row D).
 * - `normal`: the texture's red channel as coverage, in the given ink, with
 *   straight alpha and normal blending (row C).
 *
 * ## What it reports
 *
 * `window.__plateMatrix`: how many plate fragment shaders it saw and
 * replaced, how many draw calls the plate made, how many frames the canvas
 * cleared (a frame counter that needs no second `requestAnimationFrame`
 * loop, `CLAUDE.md` #6), and the canvases the plates were uploaded from, so
 * row A can show a texture as it was before WebGL sampled it.
 */

export type PlateVariant = 'shipped' | 'neutral' | 'halo' | 'scan' | 'normal'

export interface PlateMatrixOptions {
  variant: PlateVariant
  /** The ink for `normal`, sRGB-encoded, 0 to 1. */
  ink: readonly [number, number, number]
  /** Where `scan` holds its band on each part: 0 the top edge, 1 the bottom. */
  scanAt: number
  /** The plate texture's width (`TEXTURE_WIDTH` in the scene). */
  textureWidth: number
}

export interface PlateMatrixState {
  variant: PlateVariant
  /** Plate fragment shaders seen, and how many were replaced. */
  seen: number
  rewritten: number
  /** Draw calls made with a plate program. */
  draws: number
  /** Frames the canvas cleared: frames rendered. */
  frames: number
  /** The canvases plate textures were uploaded from. */
  textures: HTMLCanvasElement[]
}

declare global {
  interface Window {
    __plateMatrix?: PlateMatrixState
  }
}

/** The init script itself. Self-contained: Playwright runs its source. */
export function installPlateMatrix(options: PlateMatrixOptions): void {
  const { variant, ink, scanAt, textureWidth } = options
  const FRAGMENT_SHADER = 0x8b30
  const FUNC_ADD = 0x8006
  const ONE = 1
  const SRC_ALPHA = 0x0302
  const ONE_MINUS_SRC_ALPHA = 0x0303
  /** Where the plate's own source begins, after three's prefix. */
  const START = 'uniform sampler2D uTexture;'
  /** Declared by the plate's fragment shader and by no other. */
  const MARK = 'uniform vec4 uClip;'

  const state: PlateMatrixState = {
    variant,
    seen: 0,
    rewritten: 0,
    draws: 0,
    frames: 0,
    textures: [],
  }
  window.__plateMatrix = state

  const decimal = (value: number) => value.toFixed(4)
  const head = `
    uniform sampler2D uTexture;
    uniform vec4 uClip;
    uniform float uOpacity;
    varying vec2 vUv;
    varying vec2 vLocal;
  `
  const clip = `
    if (
      gl_FragCoord.x < uClip.x || gl_FragCoord.x > uClip.z ||
      gl_FragCoord.y < uClip.y || gl_FragCoord.y > uClip.w
    ) discard;
    vec3 line = texture2D(uTexture, vUv).rgb;
  `
  /** The plate's own output as it shipped: light added, premultiplied. */
  const light = (colour: string) => `
    float light = min(max(${colour}.r, max(${colour}.g, ${colour}.b)), 1.0);
    gl_FragColor = vec4(${colour} * uOpacity, light * uOpacity);
  `
  const sources: Record<Exclude<PlateVariant, 'shipped'>, string> = {
    neutral: `${head}
      void main() {${clip}${light('line')}}`,
    halo: `${head}
      void main() {${clip}
        vec3 halo = texture2D(uTexture, vUv, 2.0).rgb;
        vec3 colour = line + halo * 0.6;${light('colour')}}`,
    scan: `${head}
      void main() {${clip}
        float scan = 1.0 - smoothstep(0.0, 0.06, abs(1.0 - vLocal.y - ${decimal(scanAt)}));
        vec3 colour = line * (1.0 + scan * 0.9);${light('colour')}}`,
    normal: `${head}
      void main() {${clip}
        gl_FragColor = vec4(${ink.map(decimal).join(', ')}, line.r * uOpacity);}`,
  }

  const plateShaders = new WeakSet<WebGLShader>()
  const platePrograms = new WeakSet<WebGLProgram>()
  const current = new WeakMap<WebGL2RenderingContext, WebGLProgram | null>()
  /** Replays the blending three last asked for, after a forced one. */
  let replayFunc: ((context: WebGL2RenderingContext) => void) | null = null
  let replayEquation: ((context: WebGL2RenderingContext) => void) | null = null

  const proto = WebGL2RenderingContext.prototype
  const setSource = proto.shaderSource
  const attach = proto.attachShader
  const use = proto.useProgram
  const blendFunc = proto.blendFunc
  const blendFuncSeparate = proto.blendFuncSeparate
  const blendEquation = proto.blendEquation
  const blendEquationSeparate = proto.blendEquationSeparate
  const drawElements = proto.drawElements
  const clear = proto.clear

  proto.shaderSource = function shaderSource(
    this: WebGL2RenderingContext,
    shader: WebGLShader,
    source: string
  ) {
    const start = source.indexOf(START)
    const isPlate =
      start >= 0 &&
      source.includes(MARK) &&
      this.getShaderParameter(shader, this.SHADER_TYPE) === FRAGMENT_SHADER
    if (!isPlate) return setSource.call(this, shader, source)
    plateShaders.add(shader)
    state.seen += 1
    if (variant === 'shipped') return setSource.call(this, shader, source)
    state.rewritten += 1
    return setSource.call(
      this,
      shader,
      `${source.slice(0, start)}${sources[variant]}`
    )
  }

  proto.attachShader = function attachShader(
    this: WebGL2RenderingContext,
    program: WebGLProgram,
    shader: WebGLShader
  ) {
    if (plateShaders.has(shader)) platePrograms.add(program)
    return attach.call(this, program, shader)
  }

  proto.useProgram = function useProgram(
    this: WebGL2RenderingContext,
    program: WebGLProgram | null
  ) {
    current.set(this, program)
    return use.call(this, program)
  }

  proto.blendFunc = function forwardBlendFunc(
    this: WebGL2RenderingContext,
    source: number,
    destination: number
  ) {
    replayFunc = (context) => blendFunc.call(context, source, destination)
    return blendFunc.call(this, source, destination)
  }
  proto.blendFuncSeparate = function forwardBlendFuncSeparate(
    this: WebGL2RenderingContext,
    sourceRgb: number,
    destinationRgb: number,
    sourceAlpha: number,
    destinationAlpha: number
  ) {
    replayFunc = (context) =>
      blendFuncSeparate.call(
        context,
        sourceRgb,
        destinationRgb,
        sourceAlpha,
        destinationAlpha
      )
    return blendFuncSeparate.call(
      this,
      sourceRgb,
      destinationRgb,
      sourceAlpha,
      destinationAlpha
    )
  }
  proto.blendEquation = function forwardBlendEquation(
    this: WebGL2RenderingContext,
    mode: number
  ) {
    replayEquation = (context) => blendEquation.call(context, mode)
    return blendEquation.call(this, mode)
  }
  proto.blendEquationSeparate = function forwardBlendEquationSeparate(
    this: WebGL2RenderingContext,
    rgb: number,
    alpha: number
  ) {
    replayEquation = (context) =>
      blendEquationSeparate.call(context, rgb, alpha)
    return blendEquationSeparate.call(this, rgb, alpha)
  }

  proto.drawElements = function plateDrawElements(
    this: WebGL2RenderingContext,
    mode: number,
    count: number,
    type: number,
    offset: number
  ) {
    const program = current.get(this) ?? null
    const isPlate = program !== null && platePrograms.has(program)
    if (isPlate) state.draws += 1
    if (!isPlate || variant === 'shipped') {
      drawElements.call(this, mode, count, type, offset)
      return
    }
    blendEquation.call(this, FUNC_ADD)
    if (variant === 'normal') {
      blendFuncSeparate.call(
        this,
        SRC_ALPHA,
        ONE_MINUS_SRC_ALPHA,
        ONE,
        ONE_MINUS_SRC_ALPHA
      )
    } else {
      blendFunc.call(this, ONE, ONE)
    }
    drawElements.call(this, mode, count, type, offset)
    replayEquation?.(this)
    replayFunc?.(this)
  }

  proto.clear = function countFrames(
    this: WebGL2RenderingContext,
    mask: number
  ) {
    state.frames += 1
    const overlay = document.querySelector('#plate-matrix-frame')
    if (overlay) overlay.textContent = `GL frame ${state.frames}`
    return clear.call(this, mask)
  }

  /*
   * The canvases the plates were drawn from, in the order they arrived.
   * three uploads a `CanvasTexture` as the last argument of either call.
   */
  const keep = (args: unknown[]) => {
    const source = args.at(-1)
    if (
      source instanceof HTMLCanvasElement &&
      source.width === textureWidth &&
      !state.textures.includes(source)
    ) {
      state.textures.push(source)
    }
  }
  for (const name of ['texImage2D', 'texSubImage2D'] as const) {
    const original = proto[name]
    Object.defineProperty(proto, name, {
      configurable: true,
      writable: true,
      value: function upload(this: WebGL2RenderingContext, ...args: unknown[]) {
        keep(args)
        return Reflect.apply(original, this, args)
      },
    })
  }
}
