/**
 * The café's shaders.
 *
 * Provenance: original work for this project. No third-party code copied.
 * `erf` is Winitzki's closed-form approximation (2008), written from the
 * published formula.
 *
 * ## No lighting here, on purpose
 *
 * The light is worked out once, on the CPU, by `lib/cafe/light.ts`, and
 * reaches these shaders as colours already encoded to sRGB: the same 8-bit
 * values the still writes as SVG fills. So the model shader only places a
 * vertex and blends two colours, and the hand-over between the still and
 * the canvas changes nothing on screen.
 *
 * The café is drawn into a render target of its own (`rig.ts`), blending in
 * encoded values the way a browser composites the SVG, and that target is
 * put on screen by `displayFragment`, already premultiplied. No shader here
 * includes three's `colorspace_fragment`: the colours are converted once, on
 * the CPU, and never again.
 *
 * Every shader names its uniforms `uCafe…`, which is how
 * `e2e/webgl-probe.ts` tells their draws from the rest of the canvas's.
 */

/** Stage offsets and fades, read by the model, the shadows and the pool. */
const STAGE_UNIFORMS = /* glsl */ `
  uniform float uCafeLift[5];
  uniform float uCafeAlpha[5];
`

export const modelVertex = /* glsl */ `
  ${STAGE_UNIFORMS}
  uniform float uCafeNeed[4];

  attribute float aStage;
  attribute float aNeed;
  attribute vec3 aBase0;
  attribute vec3 aBase1;
  attribute vec3 aShade0;
  attribute vec3 aShade1;
  attribute vec2 aRamp;

  varying vec3 vBase0;
  varying vec3 vBase1;
  varying vec3 vShade0;
  varying vec3 vShade1;
  varying vec2 vRamp;
  varying float vAlpha;

  void main() {
    int stage = int(aStage + 0.5);
    int need = int(aNeed + 0.5);
    vec3 placed = position;
    placed.y += uCafeLift[stage] + uCafeNeed[need];
    vAlpha = uCafeAlpha[stage];
    vBase0 = aBase0;
    vBase1 = aBase1;
    vShade0 = aShade0;
    vShade1 = aShade1;
    vRamp = aRamp;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(placed, 1.0);
  }
`

export const modelFragment = /* glsl */ `
  uniform float uCafeRoof;

  varying vec3 vBase0;
  varying vec3 vBase1;
  varying vec3 vShade0;
  varying vec3 vShade1;
  varying vec2 vRamp;
  varying float vAlpha;

  void main() {
    // A ramp's coordinate is linear in world space, so it interpolates
    // exactly; it is clamped here, after interpolation, as the still's
    // gradient pads its ends.
    vec3 base = mix(vBase0, vBase1, clamp(vRamp.x, 0.0, 1.0));
    vec3 shade = mix(vShade0, vShade1, clamp(vRamp.y, 0.0, 1.0));
    // Before the roof is on, the base; as it lands, its shade over the room.
    gl_FragColor = vec4(mix(base, shade, uCafeRoof), vAlpha);
  }
`

export const contactVertex = /* glsl */ `
  ${STAGE_UNIFORMS}

  attribute vec4 aRect;
  attribute vec4 aClip;
  attribute vec4 aSpec;

  varying vec2 vPlan;
  varying vec4 vRect;
  varying vec4 vClip;
  varying float vSoft;
  varying float vAlpha;

  void main() {
    // aSpec: softness, strength, the caster's stage, the receiver's stage.
    int caster = int(aSpec.z + 0.5);
    int receiver = int(aSpec.w + 0.5);
    vec3 placed = position;
    placed.y += uCafeLift[receiver];
    vPlan = position.xz;
    vRect = aRect;
    vClip = aClip;
    vSoft = aSpec.x;
    vAlpha = aSpec.y * uCafeAlpha[caster];
    gl_Position = projectionMatrix * modelViewMatrix * vec4(placed, 1.0);
  }
`

export const contactFragment = /* glsl */ `
  varying vec2 vPlan;
  varying vec4 vRect;
  varying vec4 vClip;
  varying float vSoft;
  varying float vAlpha;

  float erfApprox(float x) {
    float x2 = x * x;
    float a = 0.147;
    float t = sqrt(1.0 - exp(-x2 * (1.2732395 + a * x2) / (1.0 + a * x2)));
    return x < 0.0 ? -t : t;
  }

  // A box of width [lo, hi] blurred by a Gaussian of deviation s, at x.
  float spread(float lo, float hi, float x, float s) {
    float k = 0.70710678 / s;
    return 0.5 * (erfApprox((hi - x) * k) - erfApprox((lo - x) * k));
  }

  void main() {
    // Kept to the surface it lies on, as the still clips it to that face.
    if (
      vPlan.x < vClip.x || vPlan.x > vClip.z ||
      vPlan.y < vClip.y || vPlan.y > vClip.w
    ) discard;
    float coverage =
      spread(vRect.x, vRect.z, vPlan.x, vSoft) *
      spread(vRect.y, vRect.w, vPlan.y, vSoft);
    gl_FragColor = vec4(0.0, 0.0, 0.0, vAlpha * coverage);
  }
`

export const poolVertex = /* glsl */ `
  ${STAGE_UNIFORMS}

  varying vec2 vPlan;
  varying float vFade;

  void main() {
    vPlan = position.xz;
    vFade = uCafeAlpha[0];
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const poolFragment = /* glsl */ `
  uniform vec2 uCafePoolCenter;
  uniform float uCafePoolRadius;
  uniform vec3 uCafePoolColor;
  uniform float uCafePoolAlpha;

  varying vec2 vPlan;
  varying float vFade;

  void main() {
    // lib/cafe/light.ts poolFalloff, the same curve.
    float r = clamp(length(vPlan - uCafePoolCenter) / uCafePoolRadius, 0.0, 1.0);
    float s = r * r * (3.0 - 2.0 * r);
    float alpha = uCafePoolAlpha * pow(1.0 - s, 1.5) * vFade;
    gl_FragColor = vec4(uCafePoolColor, alpha);
  }
`

/** The target on screen: one quad over the art viewport. */
export const displayVertex = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const displayFragment = /* glsl */ `
  uniform sampler2D uCafe;

  varying vec2 vUv;

  void main() {
    // Premultiplied already, and encoded already: put down as it is.
    gl_FragColor = texture2D(uCafe, vUv);
  }
`
