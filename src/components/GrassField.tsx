import { useEffect, useRef } from "react"

type Blade = {
  x: number
  z: number
  height: number
  lean: number
  phase: number
  shade: number
  width: number
  kind: number
  bend: number
}

type Colors = { body: string; lit: string; edge: string }

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function clampByte(value: number) {
  return Math.max(0, Math.min(255, value)) | 0
}

function makeBlades(count: number, seed: number, band: [number, number]): Blade[] {
  const rand = mulberry32(seed)
  const clumps = Array.from({ length: 48 }, () => ({
    x: rand(),
    z: band[0] + Math.pow(rand(), 0.8) * (band[1] - band[0]),
  }))
  const blades: Blade[] = []
  for (let i = 0; i < count; i += 1) {
    const clump = clumps[i % clumps.length]
    const spread = 0.02 + rand() * 0.04
    const z = Math.min(band[1], Math.max(band[0], clump.z + (rand() - 0.5) * spread))
    const roll = rand()
    const kind = roll > 0.94 ? 2 : roll > 0.58 ? 1 : 0
    blades.push({
      x: Math.min(1.05, Math.max(-0.05, clump.x + (rand() - 0.5) * spread * 2.2)),
      z,
      height: (kind === 1 ? 0.55 : 0.32) + rand() * (kind === 1 ? 0.9 : 0.6),
      lean: (rand() - 0.4) * 1.15,
      phase: rand() * Math.PI * 2,
      shade: rand(),
      width: kind === 1 ? 1.7 + rand() * 1.5 : 0.75 + rand() * 0.85,
      kind,
      bend: (rand() - 0.5) * 0.85,
    })
  }
  blades.sort((a, b) => a.z - b.z)
  return blades
}

function bladeColors(blade: Blade): Colors {
  const depth = blade.z
  const sun = (1 - depth) * 0.5 + blade.shade * 0.28
  if (blade.kind === 2) {
    const r = 146 + sun * 70
    const g = 124 + sun * 48
    const b = 64 + sun * 24
    const alpha = 0.4 + depth * 0.4
    return {
      body: `rgba(${clampByte(r)},${clampByte(g)},${clampByte(b)},${alpha.toFixed(3)})`,
      lit: `rgba(${clampByte(r + 36)},${clampByte(g + 30)},${clampByte(b + 14)},${Math.min(0.9, alpha + 0.08).toFixed(3)})`,
      edge: `rgba(${clampByte(r - 28)},${clampByte(g - 24)},${clampByte(b - 16)},${alpha.toFixed(3)})`,
    }
  }
  const r = 64 + sun * 96 - depth * 10
  const g = 112 + sun * 78 - depth * 6
  const b = 42 + sun * 30 - depth * 6
  const alpha = 0.55 + depth * 0.4
  return {
    body: `rgba(${clampByte(r)},${clampByte(g)},${clampByte(b)},${alpha.toFixed(3)})`,
    lit: `rgba(${clampByte(r + 32)},${clampByte(g + 28)},${clampByte(b + 10)},${Math.min(0.95, alpha + 0.1).toFixed(3)})`,
    edge: `rgba(${clampByte(r * 0.72)},${clampByte(g * 0.78)},${clampByte(b * 0.7)},${alpha.toFixed(3)})`,
  }
}

function paintGround(context: CanvasRenderingContext2D, width: number, height: number) {
  const ground = context.createLinearGradient(0, 0, 0, height)
  ground.addColorStop(0, "#f2f7ec")
  ground.addColorStop(0.18, "#e3f0d8")
  ground.addColorStop(0.42, "#c9deb4")
  ground.addColorStop(0.68, "#a9cc93")
  ground.addColorStop(0.86, "#7eae6c")
  ground.addColorStop(1, "#5f944f")
  context.fillStyle = ground
  context.fillRect(0, 0, width, height)

  const rand = mulberry32(11)
  for (let i = 0; i < 110; i += 1) {
    const x = rand() * width
    const y = rand() * height
    const depth = y / height
    const rx = 30 + rand() * (80 + depth * 160)
    const ry = 12 + rand() * (24 + depth * 50)
    const soil = rand() > 0.84
    const g = 120 + rand() * 70
    context.fillStyle = soil
      ? `rgba(96, 74, 46, ${0.04 + depth * 0.06})`
      : `rgba(${clampByte(g * 0.62)},${clampByte(g)},${clampByte(g * 0.42)},${0.05 + depth * 0.1})`
    context.beginPath()
    context.ellipse(x, y, rx, ry, rand() * Math.PI, 0, Math.PI * 2)
    context.fill()
  }

  for (let i = 0; i < 1800; i += 1) {
    const x = rand() * width
    const y = rand() * height
    const depth = y / height
    const g = 110 + rand() * 90 - depth * 20
    context.fillStyle = `rgba(${clampByte(g * 0.6)},${clampByte(g)},${clampByte(g * 0.42)},${0.12 + depth * 0.2})`
    context.fillRect(x, y, 1 + rand() * 1.8, 1 + rand() * 1.4)
  }
}

function traceBlade(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  tipX: number,
  tipY: number,
  controlX: number,
  controlY: number,
  halfWidth: number,
) {
  context.beginPath()
  context.moveTo(x - halfWidth, y)
  context.quadraticCurveTo(controlX - halfWidth * 0.28, controlY, tipX, tipY)
  context.quadraticCurveTo(controlX + halfWidth * 0.72, controlY, x + halfWidth * 0.48, y)
  context.closePath()
}

function drawBlade(
  context: CanvasRenderingContext2D,
  blade: Blade,
  width: number,
  height: number,
  parallax: number,
  wind: number,
  pointerX: number,
  pointerY: number,
) {
  const depth = blade.z
  const y = height * (0.04 + depth * 0.98)
  const scale = 0.62 + Math.pow(depth, 1.05) * 1.25
  const reach = (20 + blade.height * 64) * scale
  const sway = Math.sin(wind * (0.85 + depth * 0.35) + blade.phase) * (8 + depth * 14)
  const x = blade.x * width + parallax * depth
  const dx = pointerX - x
  const dy = pointerY - y
  const near = Math.max(0, 1 - Math.hypot(dx, dy) / (160 + depth * 90))
  const push = near * (10 + depth * 16) * (dx > 0 ? -1 : 1)
  const lean = blade.lean * 16 * scale
  const tipX = x + lean + sway + push + blade.bend * 10 * scale
  const tipY = y - reach
  const controlX = x + lean * 0.45 + sway * 0.35 + push * 0.3
  const controlY = y - reach * (0.48 + blade.bend * 0.08)
  const halfWidth = blade.width * (0.55 + depth * 0.9) * (blade.kind === 1 ? 1.15 : 0.85)
  const colors = bladeColors(blade)

  traceBlade(context, x + halfWidth * 0.18, y, tipX + 0.6, tipY, controlX + halfWidth * 0.2, controlY, halfWidth)
  context.fillStyle = colors.edge
  context.fill()

  traceBlade(context, x, y, tipX, tipY, controlX, controlY, halfWidth * 0.92)
  context.fillStyle = colors.body
  context.fill()

  traceBlade(context, x - halfWidth * 0.08, y, tipX - 0.4, tipY, controlX - halfWidth * 0.05, controlY, halfWidth * 0.38)
  context.fillStyle = colors.lit
  context.fill()
}

export function GrassField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    const blades = makeBlades(520, 3, [0, 1])
    const cache = document.createElement("canvas")
    const cached = cache.getContext("2d")
    if (!cached) return

    const pointer = { x: window.innerWidth * 0.62, y: window.innerHeight * 0.42 }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0
    let running = true
    let width = 0
    let height = 0

    const paintGroundLayer = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      cache.width = Math.floor(width * dpr)
      cache.height = Math.floor(height * dpr)
      cached.setTransform(dpr, 0, 0, dpr, 0, 0)
      paintGround(cached, width, height)
      const mist = cached.createLinearGradient(0, 0, 0, height * 0.42)
      mist.addColorStop(0, "rgba(246, 251, 242, 0.42)")
      mist.addColorStop(1, "rgba(246, 251, 242, 0)")
      cached.fillStyle = mist
      cached.fillRect(0, 0, width, height * 0.42)
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      paintGroundLayer()
    }

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      context.drawImage(cache, 0, 0, width, height)

      const drift = reduced ? 0.4 : (Math.sin(time * 0.00016) + 1) / 2
      const wash = context.createLinearGradient(
        width * (drift - 0.2),
        0,
        width * (drift + 0.55),
        height,
      )
      wash.addColorStop(0, "rgba(255,255,255,0)")
      wash.addColorStop(0.48, "rgba(255, 250, 236, 0.1)")
      wash.addColorStop(1, "rgba(255,255,255,0)")
      context.fillStyle = wash
      context.fillRect(0, 0, width, height)

      const parallax = (pointer.x / width - 0.5) * 28
      const wind = reduced ? 0 : time * 0.001
      for (const blade of blades) {
        drawBlade(context, blade, width, height, parallax, wind, pointer.x, pointer.y)
      }
    }

    const loop = (time: number) => {
      if (!running) return
      draw(time)
      if (!reduced && !document.hidden) frame = requestAnimationFrame(loop)
    }

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      if (reduced || document.hidden) draw(performance.now())
    }
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        return
      }
      if (!reduced) frame = requestAnimationFrame(loop)
    }

    resize()
    frame = requestAnimationFrame(loop)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("resize", resize)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      running = false
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className="grass-field" aria-hidden="true" />
}
