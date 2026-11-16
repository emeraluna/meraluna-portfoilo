const stemTop = 214
const mouthY = 548
const stemMid = (stemTop + mouthY) / 2

export const PLANT = {
  width: 480,
  height: 760,
  stemX: 240,
  stemTop,
  mouthY,
  leafY: stemMid,
  leafRaisedY: stemMid - 40,
  flower: { x: 240, y: stemTop },
  rose: { bud: 168, bloom: 340 },
} as const

/** Where the arrow tip should aim, in SVG user units. */
export function aimPoint(stage: number) {
  const phase = Math.min(stage, 4)
  if (phase <= 0) return { x: PLANT.stemX, y: PLANT.leafY }
  if (phase === 1) return { x: PLANT.stemX - 214, y: PLANT.leafY - 62 }
  if (phase === 2) return { x: PLANT.stemX + 214, y: PLANT.leafRaisedY - 62 }
  if (phase === 3) return { x: PLANT.stemX - 8, y: PLANT.stemTop - 36 }
  return { x: PLANT.stemX - 176, y: PLANT.stemTop - 88 }
}

export function bloomHit(stage: number) {
  if (stage >= 4) {
    return { x: PLANT.stemX, y: PLANT.stemTop - 60, rx: 116, ry: 100 }
  }
  return { x: PLANT.stemX, y: PLANT.stemTop - 36, rx: 54, ry: 72 }
}
