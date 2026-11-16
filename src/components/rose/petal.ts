import { BufferAttribute, BufferGeometry } from "three"

type RGB = [number, number, number]

export type PetalOptions = {
  length: number
  width: number
  curl: number
  cup: number
  ruffle: number
  twist: number
  /** Tip rolls backward, away from the cup. Outer rose petals use this. */
  reflex?: number
  /** Depth of the midrib channel. */
  fold?: number
  profile?: "rose" | "sepal"
  colorBase: RGB
  colorTip: RGB
  colorEdge: RGB
}

function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0 || 1)))
  return t * t * (3 - 2 * t)
}

/** Broad rose petal: narrow claw, nearly round blade, soft tip. Reads in a top-down spiral. */
function roseProfile(u: number) {
  const samples = [0.05, 0.16, 0.34, 0.56, 0.78, 0.96, 0.86, 0.5, 0.14]
  const x = Math.min(1, Math.max(0, u)) * (samples.length - 1)
  const i = Math.min(samples.length - 2, Math.floor(x))
  const f = x - i
  const s = f * f * (3 - 2 * f)
  return samples[i] * (1 - s) + samples[i + 1] * s
}

/** Pointed sepal: broad at the shoulder, tapering to a tip. */
function sepalProfile(u: number) {
  const samples = [0.18, 0.62, 1, 0.82, 0.55, 0.32, 0.16, 0.06, 0]
  const x = Math.min(1, Math.max(0, u)) * (samples.length - 1)
  const i = Math.min(samples.length - 2, Math.floor(x))
  const f = x - i
  const s = f * f * (3 - 2 * f)
  return samples[i] * (1 - s) + samples[i + 1] * s
}

export function createPetalGeometry(options: PetalOptions) {
  const profile = options.profile ?? "rose"
  const segU = profile === "rose" ? 36 : 28
  const segV = profile === "rose" ? 20 : 12
  const positions: number[] = []
  const colors: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const reflex = options.reflex ?? 0
  const foldAmount = options.fold ?? options.cup * 0.3

  for (let i = 0; i <= segU; i += 1) {
    const u = i / segU
    const halfWidth = Math.max(options.width * (profile === "rose" ? roseProfile(u) : sepalProfile(u)), 0.004)
    for (let j = 0; j <= segV; j += 1) {
      const v = (j / segV) * 2 - 1
      let y = u * options.length
      if (profile === "rose") {
        const notch = Math.pow(Math.max(0, (u - 0.8) / 0.2), 1.15) * Math.exp(-v * v * 8)
        y -= notch * options.length * 0.05
      }

      let x = v * halfWidth * (1 - Math.abs(v) * 0.06)
      if (profile === "sepal") {
        const tooth = Math.pow(Math.max(0, Math.sin(u * 10 * Math.PI * 2)), 0.5)
        const margin = Math.pow(Math.abs(v), 6) * (1 - smoothstep(0.84, 0.98, u))
        x += Math.sign(v || 1) * tooth * margin * options.width * 0.14
      }

      const cup = options.cup * Math.sin(Math.PI * Math.min(u / 0.94, 1)) * (1 - v * v * 0.42)
      const fold = foldAmount * Math.exp(-v * v * 16) * Math.sin(Math.PI * u)
      const intoCup = options.curl * Math.pow(u, 1.45)
      const rolled = reflex * Math.pow(Math.max(u - 0.42, 0) / 0.58, 1.35)
      const edgeRoll = reflex * 0.5 * Math.pow(Math.abs(v), 1.8) * Math.pow(u, 1.2)
      const wave =
        Math.sin(u * Math.PI * 2.5 + v * 0.7) * Math.pow(Math.abs(v), 1.15) * options.ruffle * (0.2 + u)
      let z = -cup - fold - intoCup + rolled + edgeRoll + wave

      const twist = options.twist * u
      const cosine = Math.cos(twist)
      const sine = Math.sin(twist)
      const twistedX = x * cosine - z * sine
      const twistedZ = x * sine + z * cosine

      positions.push(twistedX, y, twistedZ)
      uvs.push(u, (v + 1) / 2)

      const along = Math.pow(u, 0.72)
      const edge = Math.pow(Math.abs(v), 1.25)
      let rgb = mix(options.colorBase, options.colorTip, along)
      rgb = mix(rgb, options.colorEdge, edge * (0.25 + 0.75 * u))
      rgb = mix(
        [rgb[0] * 0.62, rgb[1] * 0.55, rgb[2] * 0.55],
        rgb,
        smoothstep(0.0, 0.22, u),
      )
      const vein = Math.exp(-v * v * 18) * (1 - u * 0.35)
      const fleck = 0.5 + 0.5 * Math.sin(u * 47.3 + v * 18.1) * Math.sin(u * 13.7 - v * 29.4)
      const tone = 0.94 + fleck * 0.06
      colors.push(rgb[0] * (1 - vein * 0.16) * tone, rgb[1] * (1 - vein * 0.05) * tone, rgb[2] * tone)
    }
  }

  const stride = segV + 1
  for (let i = 0; i < segU; i += 1) {
    for (let j = 0; j < segV; j += 1) {
      const a = i * stride + j
      const b = a + 1
      const c = a + stride
      const d = c + 1
      indices.push(a, b, c, b, d, c)
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3))
  geometry.setAttribute("color", new BufferAttribute(new Float32Array(colors), 3))
  geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}
