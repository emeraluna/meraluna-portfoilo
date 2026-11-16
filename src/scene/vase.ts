import { LatheGeometry, Vector2 } from "three"

/**
 * Clear glass vase matched to a classic bulb silhouette:
 * small foot, full belly, narrow neck, thin flared lip.
 * Points run up the outside, across the rim, and back down the inside.
 */
const OUTER: [number, number][] = [
  [0.0, 0.0],
  [0.16, 0.0],
  [0.26, 0.012],
  [0.36, 0.06],
  [0.46, 0.18],
  [0.54, 0.36],
  [0.57, 0.54],
  [0.52, 0.7],
  [0.42, 0.86],
  [0.32, 1.0],
  [0.25, 1.12],
  [0.23, 1.24],
  [0.27, 1.34],
  [0.33, 1.42],
  [0.37, 1.48],
]

export const VASE_HEIGHT = OUTER[OUTER.length - 1][1]
export const WATER_LEVEL = 0.72

function radiusAt(y: number) {
  for (let i = 1; i < OUTER.length; i += 1) {
    const [r0, y0] = OUTER[i - 1]
    const [r1, y1] = OUTER[i]
    if (y <= y1 || i === OUTER.length - 1) {
      const t = Math.min(1, Math.max(0, (y - y0) / (y1 - y0 || 1)))
      return r0 + (r1 - r0) * t
    }
  }
  return OUTER[OUTER.length - 1][0]
}

function wallAt(y: number) {
  const t = y / VASE_HEIGHT
  if (t < 0.08) return 0.042
  if (t > 0.94) return 0.02
  if (t > 0.82) return 0.016
  return 0.018
}

export const waterSurfaceRadius = Math.max(0.08, radiusAt(WATER_LEVEL) - wallAt(WATER_LEVEL) - 0.012)

export function createVaseGeometry() {
  const lip = OUTER[OUTER.length - 1]
  const points: Vector2[] = OUTER.map(([x, y]) => new Vector2(x, y))
  points.push(new Vector2(lip[0] - wallAt(lip[1]), lip[1]))
  for (let i = OUTER.length - 2; i >= 1; i -= 1) {
    const [radius, y] = OUTER[i]
    points.push(new Vector2(Math.max(0.045, radius - wallAt(y)), y))
  }
  points.push(new Vector2(0.045, 0.05))
  points.push(new Vector2(0, 0.05))
  return new LatheGeometry(points, 96)
}

/** Water held in the belly, just below where the glass begins to narrow. */
export function createWaterGeometry() {
  const samples = [0.06, 0.16, 0.28, 0.4, 0.52, 0.64, WATER_LEVEL]
  const points = samples.map((y, index) => {
    const radius = index === 0 ? 0 : Math.max(0.05, radiusAt(y) - wallAt(y) - 0.02)
    return new Vector2(radius, y)
  })
  points.push(new Vector2(0, WATER_LEVEL))
  return new LatheGeometry(points, 72)
}
