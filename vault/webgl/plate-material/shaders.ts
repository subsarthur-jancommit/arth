/**
 * The plate material's shaders.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * ## Perspective without a second camera
 *
 * The root canvas has one orthographic camera in CSS pixels, shared by every
 * scene on the page, and this material does not add another. It does the
 * perspective itself, the way a CSS 3D transform does: each part is posed in
 * pixels around the drawing's centre, and a point at depth `z` is drawn at
 * `focal / (focal - z)` of its offset. Writing that factor into `w` rather
 * than dividing here leaves the divide to the GPU, which is what keeps the
 * drawing's lines straight across a tilted quad instead of bending with an
 * affine interpolation.
 *
 * ## Ink, not light (G2)
 *
 * Until G2 the plate was light added to the page: the texel, plus a halo read
 * two mip levels up, plus a scan band while it turned, all with additive
 * blending. Light can only brighten what is behind it, so on paper it
 * vanished, and over the stage's ink it read as a glowing hologram beside a
 * page that speaks in ink and paper. Its words were drawn through the halo
 * and the scan like everything else (`docs/G2-MATRIKS-RENDER.md`).
 *
 * Now the texture is what it always was, coverage: the plate's lines and
 * words in white on black, so the red channel is how much of each texel the
 * pen covered. The shader paints that coverage in the page's own ink
 * (`uInk`, read from the plate's CSS `color` and given in linear light) as
 * straight alpha, blended normally, and converts to the screen's colour
 * space once, at the end. No halo, no scan, nothing added: what is drawn is
 * a print of the flat plate, and the words in it are solid.
 */

export const vertexShader = /* glsl */ `
  uniform mat4 uModel;
  uniform vec2 uSize;
  uniform vec4 uCrop;
  uniform vec2 uAnchor;
  uniform vec2 uPixel;
  uniform float uFocal;

  varying vec2 vUv;
  varying vec2 vLocal;
  varying float vDepth;

  void main() {
    vec4 posed = uModel * vec4(position.xy * uSize, 0.0, 1.0);
    float w = max((uFocal - posed.z) / uFocal, 0.05);
    gl_Position = vec4(uAnchor * w + posed.xy * uPixel, 0.0, w);
    vUv = uCrop.xy + uv * uCrop.zw;
    vLocal = uv;
    vDepth = posed.z;
  }
`

export const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec4 uClip;
  uniform vec3 uInk;
  uniform float uOpacity;

  varying vec2 vUv;

  void main() {
    // Only inside the drawing's own cell: never behind its caption or its
    // legend, never below the frame a parked plate waits under.
    if (
      gl_FragCoord.x < uClip.x || gl_FragCoord.x > uClip.z ||
      gl_FragCoord.y < uClip.y || gl_FragCoord.y > uClip.w
    ) discard;

    // Coverage, once, at the mip level the GPU chose: no second read for a
    // halo, no band for a scan.
    float coverage = texture2D(uTexture, vUv).r;

    // Straight alpha: the ink as it is, covering as much as the pen did.
    gl_FragColor = vec4(uInk, coverage * uOpacity);

    // Linear ink to the screen's colour space, the one conversion.
    #include <colorspace_fragment>
  }
`
