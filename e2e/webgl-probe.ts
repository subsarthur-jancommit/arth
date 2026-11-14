/**
 * A WebGL2 probe for the handover gates: what a live, visible canvas has
 * drawn, and whether any call reached a context that was already lost.
 *
 * Written for `e2e/work-return.e2e.ts` (#86) and moved here when two more
 * gates needed it: `e2e/home-return.e2e.ts` and `e2e/context-loss.e2e.ts`.
 * Install it with `page.addInitScript(installWebglProbe)`, before the first
 * navigation. It survives client-side navigations, since the document does.
 *
 * ## What it follows
 *
 * It wraps the WebGL2 calls three makes to create, bind, upload and draw.
 *
 * - **Calls on a lost context** are counted by method, in `dead`.
 * - **What was drawn.** It follows texture units, bindings, the program in
 *   use and the draw framebuffer. A program is told apart by a uniform only
 *   its own shader declares: `uCover` is `vault/webgl/material-image`'s plate
 *   (a picture), `uColorA` is `vault/webgl/scene-shell`'s wash, `uScan` is
 *   `vault/webgl/plate-material`'s lit plate. When one draws, its kind is
 *   recorded; for a picture, so is the image bound to its `uTexture` sampler,
 *   by URL. The scene loads the `currentSrc` of the plate's own `<img>`, so
 *   the URL names the plate.
 * - **Draws into a cube-map face are left out.** drei's `<Preload all />`
 *   renders every mesh into one when a canvas mounts, and none of it reaches
 *   the screen.
 *
 * "Drawn" only counts for a live context on a canvas the reader can see, and
 * only since the last `clear()`, which a gate calls when the reader leaves a
 * page or when it takes the context away itself.
 */

/** What a program draws, told apart by a uniform only its shader declares. */
export type DrawKind = 'picture' | 'wash' | 'plate'

/** What the probe follows in one WebGL context. */
export interface GlTrack {
  /** The active texture unit, as the `TEXTURE0 + n` enum. */
  unit: number
  /** The `TEXTURE_2D` bound on each unit. */
  bound: Map<number, WebGLTexture | null>
  /** The draw framebuffer; `null` is the canvas itself. */
  framebuffer: WebGLFramebuffer | null
  program: WebGLProgram | null
  /** Pictures `material-image`'s program drew, by URL, since `clear()`. */
  drawn: Set<string>
  /** Every kind that drew, since `clear()`. */
  kinds: Set<DrawKind>
}

/*
 * Real globals rather than assertions at each use, for the reason
 * `e2e/material-layer.e2e.ts` gives: these shapes are written here and read
 * inside the browser, where nothing else would catch a typo.
 */
declare global {
  interface Window {
    __gl?: {
      contexts: Map<WebGL2RenderingContext, GlTrack>
      /** Calls made on a context that was already lost, by method. */
      dead: Record<string, number>
      /** Pictures drawn since `clear()` by live contexts on visible canvases. */
      liveDrawn: () => Set<string>
      /** Kinds drawn since `clear()` by live contexts on visible canvases. */
      liveKinds: () => Set<DrawKind>
      /** Live contexts on visible canvases. */
      liveCount: () => number
      clear: () => void
      /**
       * Loses the live, visible context through `WEBGL_lose_context`, as a
       * GPU reset would. False when there is none.
       */
      lose: () => boolean
      /** Restores the context `lose()` took. False when there is none. */
      restore: () => boolean
    }
  }
}

/** The probe itself. Self-contained: Playwright runs its source in the page. */
export function installWebglProbe(): void {
  const TEXTURE_2D = 0x0de1
  const TEXTURE0 = 0x84c0
  const FRAMEBUFFER = 0x8d40
  const DRAW_FRAMEBUFFER = 0x8ca9
  const CUBE_FACE_FIRST = 0x8515
  const CUBE_FACE_LAST = 0x851a

  const contexts = new Map<WebGL2RenderingContext, GlTrack>()
  const dead: Record<string, number> = {}
  /** The picture last uploaded into each texture, by URL. */
  const pictureOf = new WeakMap<WebGLTexture, string>()
  /** What each program draws, from the uniform only its shader declares. */
  const kindOf = new WeakMap<WebGLProgram, DrawKind>()
  /** Each `uTexture` location, and the program it belongs to. */
  const samplerOf = new WeakMap<WebGLUniformLocation, WebGLProgram>()
  /** The unit each program reads `uTexture` from. */
  const unitOf = new WeakMap<WebGLProgram, number>()
  const cubeFaces = new WeakSet<WebGLFramebuffer>()
  /** The extension `lose()` used, kept for `restore()`. */
  let taken: WEBGL_lose_context | null = null

  const track = (context: WebGL2RenderingContext) => {
    let held = contexts.get(context)
    if (!held) {
      const fresh: GlTrack = {
        unit: TEXTURE0,
        bound: new Map(),
        framebuffer: null,
        program: null,
        drawn: new Set(),
        kinds: new Set(),
      }
      // A restored context starts with nothing bound.
      if (context.canvas instanceof HTMLCanvasElement) {
        context.canvas.addEventListener('webglcontextrestored', () => {
          fresh.unit = TEXTURE0
          fresh.bound.clear()
          fresh.framebuffer = null
          fresh.program = null
        })
      }
      held = fresh
      contexts.set(context, held)
    }
    return held
  }
  const visible = (context: WebGL2RenderingContext) =>
    !context.isContextLost() &&
    context.canvas instanceof HTMLCanvasElement &&
    context.canvas.isConnected &&
    context.canvas.checkVisibility()

  window.__gl = {
    contexts,
    dead,
    liveDrawn: () => {
      const drawn = new Set<string>()
      for (const [context, held] of contexts) {
        if (!visible(context)) continue
        for (const picture of held.drawn) drawn.add(picture)
      }
      return drawn
    },
    liveKinds: () => {
      const kinds = new Set<DrawKind>()
      for (const [context, held] of contexts) {
        if (!visible(context)) continue
        for (const kind of held.kinds) kinds.add(kind)
      }
      return kinds
    },
    liveCount: () => [...contexts.keys()].filter(visible).length,
    clear: () => {
      for (const held of contexts.values()) {
        held.drawn.clear()
        held.kinds.clear()
      }
    },
    lose: () => {
      const context = [...contexts.keys()].find(visible)
      const extension = context?.getExtension('WEBGL_lose_context') ?? null
      if (!extension) return false
      taken = extension
      extension.loseContext()
      return true
    },
    restore: () => {
      if (!taken) return false
      taken.restoreContext()
      taken = null
      return true
    },
  }

  /** False, and counted by method, when the context is already lost. */
  const alive = (context: WebGL2RenderingContext, name: string) => {
    if (!context.isContextLost()) return true
    dead[name] = (dead[name] ?? 0) + 1
    return false
  }

  const proto = WebGL2RenderingContext.prototype
  const makeTexture = proto.createTexture
  proto.createTexture = function createTexture() {
    alive(this, 'createTexture')
    return makeTexture.call(this)
  }
  const makeBuffer = proto.createBuffer
  proto.createBuffer = function createBuffer() {
    alive(this, 'createBuffer')
    return makeBuffer.call(this)
  }
  // three asks for every active uniform's location once per program.
  const locate = proto.getUniformLocation
  proto.getUniformLocation = function getUniformLocation(program, name) {
    const live = alive(this, 'getUniformLocation')
    const location = locate.call(this, program, name)
    if (live && location) {
      if (name === 'uCover') kindOf.set(program, 'picture')
      if (name === 'uColorA') kindOf.set(program, 'wash')
      if (name === 'uScan') kindOf.set(program, 'plate')
      if (name === 'uTexture') samplerOf.set(location, program)
    }
    return location
  }

  /**
   * Wraps a method that returns nothing: counted when the context is already
   * lost, and otherwise handed to `after` once the real call ran.
   */
  const wrap = (
    name:
      | 'activeTexture'
      | 'bindTexture'
      | 'useProgram'
      | 'uniform1i'
      | 'texImage2D'
      | 'texSubImage2D'
      | 'texStorage2D'
      | 'bufferData'
      | 'bindFramebuffer'
      | 'framebufferTexture2D'
      | 'drawElements'
      | 'drawArrays',
    after?: (held: GlTrack, args: unknown[]) => void
  ) => {
    const original = proto[name]
    Object.defineProperty(proto, name, {
      configurable: true,
      writable: true,
      value: function (this: WebGL2RenderingContext, ...args: unknown[]) {
        const live = alive(this, name)
        Reflect.apply(original, this, args)
        if (live) after?.(track(this), args)
      },
    })
  }

  // ...and points each sampler at its unit with `uniform1i`.
  wrap('uniform1i', (_held, [location, unit]) => {
    const program =
      location instanceof WebGLUniformLocation
        ? samplerOf.get(location)
        : undefined
    if (program && typeof unit === 'number') unitOf.set(program, unit)
  })
  wrap('useProgram', (held, [program]) => {
    held.program = program instanceof WebGLProgram ? program : null
  })
  wrap('activeTexture', (held, [unit]) => {
    if (typeof unit === 'number') held.unit = unit
  })
  wrap('bindTexture', (held, [target, texture]) => {
    if (target !== TEXTURE_2D) return
    held.bound.set(held.unit, texture instanceof WebGLTexture ? texture : null)
  })
  // three uploads a picture as the `<img>` it was loaded into, last argument
  // of either call.
  const remember = (held: GlTrack, args: unknown[]) => {
    const source = args.at(-1)
    const texture = held.bound.get(held.unit)
    if (
      args[0] === TEXTURE_2D &&
      texture &&
      source instanceof HTMLImageElement
    ) {
      pictureOf.set(texture, source.currentSrc || source.src)
    }
  }
  wrap('texImage2D', remember)
  wrap('texSubImage2D', remember)
  wrap('bindFramebuffer', (held, [target, framebuffer]) => {
    if (target !== FRAMEBUFFER && target !== DRAW_FRAMEBUFFER) return
    held.framebuffer =
      framebuffer instanceof WebGLFramebuffer ? framebuffer : null
  })
  wrap('framebufferTexture2D', (held, [, , face]) => {
    if (
      held.framebuffer &&
      typeof face === 'number' &&
      face >= CUBE_FACE_FIRST &&
      face <= CUBE_FACE_LAST
    ) {
      cubeFaces.add(held.framebuffer)
    }
  })
  const draw = (held: GlTrack) => {
    const { program, framebuffer } = held
    const kind = program ? kindOf.get(program) : undefined
    if (!program || !kind) return
    if (framebuffer && cubeFaces.has(framebuffer)) return
    held.kinds.add(kind)
    if (kind !== 'picture') return
    const unit = unitOf.get(program)
    const texture =
      unit === undefined ? undefined : held.bound.get(TEXTURE0 + unit)
    const picture = texture ? pictureOf.get(texture) : undefined
    if (picture) held.drawn.add(picture)
  }
  wrap('drawElements', draw)
  wrap('drawArrays', draw)
  wrap('texStorage2D')
  wrap('bufferData')
}
