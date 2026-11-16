import { BufferAttribute, CatmullRomCurve3, TubeGeometry, Vector3 } from "three"

export const STEM_BOTTOM = 0.16
export const STEM_TOP = 2.58

/** Lip of the vase. The stem stays straight in the glass and bows above it. */
const LIP = 1.34

/**
 * Almost upright. A cut stem leans a little as it rises;
 * it does not bow out and hook back.
 */
export function stemPoint(t: number) {
  const clamped = Math.min(1, Math.max(0, t))
  const y = STEM_BOTTOM + clamped * (STEM_TOP - STEM_BOTTOM)
  const above = Math.min(1, Math.max(0, (y - LIP) / (STEM_TOP - LIP)))
  const lean = above * above * 0.035
  return new Vector3(lean, y, lean * 0.2)
}

export function stemPointAtY(y: number) {
  return stemPoint((y - STEM_BOTTOM) / (STEM_TOP - STEM_BOTTOM))
}

export function createStemTube(radius: number, tubular = 56, radial = 8) {
  const points = Array.from({ length: 36 }, (_, index) => stemPoint(index / 35))
  const curve = new CatmullRomCurve3(points)
  const geometry = new TubeGeometry(curve, tubular, radius, radial, false)
  const colors = new Float32Array(geometry.attributes.position.count * 3)
  const position = geometry.attributes.position
  for (let index = 0; index < position.count; index += 1) {
    const underwater = position.getY(index) < 0.74
    colors[index * 3] = underwater ? 0.07 : 0.16
    colors[index * 3 + 1] = underwater ? 0.3 : 0.5
    colors[index * 3 + 2] = underwater ? 0.14 : 0.11
  }
  geometry.setAttribute("color", new BufferAttribute(colors, 3))
  return geometry
}
