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
 * ## The glow is the texture's own
 *
 * The B direction's lines are light that bleeds a little. The halo is the
 * same texture read two mip levels up, where each texel is the average of
 * sixteen: a blur the GPU has already computed, added under the line.
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
  uniform float uOpacity;
  uniform float uScan;
  uniform float uFocal;

  varying vec2 vUv;
  varying vec2 vLocal;
  varying float vDepth;

  void main() {
    // Only inside the drawing's own cell: never behind its caption, never
    // below the frame a parked plate waits under.
    if (
      gl_FragCoord.x < uClip.x || gl_FragCoord.x > uClip.z ||
      gl_FragCoord.y < uClip.y || gl_FragCoord.y > uClip.w
    ) discard;

    vec3 line = texture2D(uTexture, vUv).rgb;
    vec3 halo = texture2D(uTexture, vUv, 2.0).rgb;

    // What leans away dims a little, as a lit model does in a dark room.
    float depth = clamp(1.0 + vDepth / (uFocal * 1.4), 0.45, 1.0);

    // The light that sweeps the part as it turns, then is gone.
    float scan = uScan < 0.0
      ? 0.0
      : smoothstep(0.06, 0.0, abs(1.0 - vLocal.y - uScan));

    vec3 colour = (line + halo * 0.6) * depth * (1.0 + scan * 0.9);

    // Light added to what is behind, and nothing where there is no light:
    // premultiplied, with the alpha the light's own, so the texture's black
    // ground never paints a box over the page's.
    float light = min(max(colour.r, max(colour.g, colour.b)), 1.0);
    gl_FragColor = vec4(colour * uOpacity, light * uOpacity);
  }
`
