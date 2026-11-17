import { describe, expect, it } from 'bun:test'

import { fragmentShader, vertexShader } from './shaders'

/**
 * The plate's fragment shader is a print of the drawing, not light (G2).
 *
 * `docs/G2-MATRIKS-RENDER.md` traced the plate's look to what the shader did
 * on top of the texture: a halo read two mip levels up, a scan band while the
 * part turned, light added to the page. Every glyph went through both. These
 * checks keep them out, and keep the contract the matrix chose: one coverage
 * read, the page's ink, straight alpha, one conversion to the screen.
 */
describe('plate material shaders', () => {
  /** The shader without its comments, so prose cannot satisfy a check. */
  const code = fragmentShader.replaceAll(/\/\/[^\n]*/gu, '')

  it('reads the texture once, at the mip level the GPU chose', () => {
    const reads = [...code.matchAll(/texture2D\(([^)]*)\)/gu)]
    expect(reads).toHaveLength(1)
    // Two arguments: a third would be a level bias, which is how the halo
    // read a blur.
    expect(reads[0]?.[1]?.split(',')).toHaveLength(2)
  })

  it('draws no glyph through a halo or a scan', () => {
    expect(code).not.toMatch(/halo|scan|smoothstep/iu)
    expect(code).not.toMatch(/uScan|vLocal|vDepth/u)
  })

  it('paints coverage in the page ink, as straight alpha', () => {
    expect(code).toMatch(/float coverage = texture2D\(uTexture, vUv\)\.r;/u)
    expect(code).toMatch(/gl_FragColor = vec4\(uInk, coverage \* uOpacity\);/u)
  })

  it('converts to the screen colour space once, at the end', () => {
    expect(code.match(/#include <colorspace_fragment>/gu)).toHaveLength(1)
    expect(code.trimEnd().endsWith('#include <colorspace_fragment>\n  }')).toBe(
      true
    )
  })

  it('keeps the part-local coordinate the vertex stage has always given', () => {
    // `e2e/plate-matrix.ts` reads it to place row D's scan band.
    expect(vertexShader).toMatch(/varying vec2 vLocal;/u)
  })
})
