import { BufferAttribute, BufferGeometry } from "three"

type RGB = [number, number, number]

function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0 || 1)))
  return t * t * (3 - 2 * t)
}

/** Lanceolate rose leaflet: narrow base, widest below the middle, long point. */
function leafletProfile(u: number) {
  const base = smoothstep(0, 0.07, u)
  const belly = Math.sin(Math.PI * Math.pow(Math.min(u, 1), 0.78))
  const tip = u < 0.3 ? 1 : Math.max(0, 1 - Math.pow((u - 0.3) / 0.7, 1.2))
  return Math.max(0.015, belly * tip * (0.16 + 0.84 * base))
}

/** A serrated rose leaflet, lying in the XY plane with the tip toward +X. */
export function createLeafletGeometry(length = 0.72, width = 0.28) {
  const segU = 36
  const segV = 14
  const teeth = 16
  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []

  for (let i = 0; i <= segU; i += 1) {
    const u = i / segU
    const profile = leafletProfile(u)

    for (let j = 0; j <= segV; j += 1) {
      const v = (j / segV) * 2 - 1
      const edge = Math.pow(Math.abs(v), 5)
      const tooth = Math.pow(Math.max(0, Math.sin(u * teeth * Math.PI * 2)), 0.4)
      const live = smoothstep(0.06, 0.14, u) * (1 - smoothstep(0.86, 0.97, u))
      const spike = tooth * edge * width * 0.22 * live
      const sign = v < 0 ? -1 : 1

      const x = u * length + spike * 0.35
      const y = v * width * profile + sign * spike
      const fold = Math.abs(v) * 0.05 * Math.sin(Math.PI * u)
      const midrib = Math.exp(-v * v * 36) * Math.sin(Math.PI * u) * 0.01
      const arch = Math.sin(Math.PI * u) * length * 0.06
      const z = -fold + midrib - arch

      positions.push(x, y, z)

      const sun = 0.35 + 0.65 * Math.pow(u, 0.45)
      let rgb = mix([0.3, 0.45, 0.24], [0.42, 0.78, 0.28], sun)
      rgb = mix(rgb, [0.55, 0.95, 0.4], Math.exp(-v * v * 28) * 0.7)
      const fleck = 0.5 + 0.5 * Math.sin(u * 31 + v * 17)
      colors.push(rgb[0] * (0.97 + fleck * 0.04), rgb[1] * (0.98 + fleck * 0.03), rgb[2])
    }
  }

  const stride = segV + 1
  for (let i = 0; i < segU; i += 1) {
    for (let j = 0; j < segV; j += 1) {
      const a = i * stride + j
      const b = a + 1
      const c = a + stride
      const d = c + 1
      indices.push(a, c, b, b, c, d)
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3))
  geometry.setAttribute("color", new BufferAttribute(new Float32Array(colors), 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}
