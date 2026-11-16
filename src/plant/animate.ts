import { useLayoutEffect, useRef } from "react"
import type { RefObject } from "react"

type Transform = {
  x: number
  y: number
  sx: number
  sy: number
}

export function useAnimatedTransform(
  ref: RefObject<SVGGElement | null>,
  target: Transform,
  speed = 5,
) {
  const current = useRef({ ...target })
  const targetRef = useRef(target)
  targetRef.current = target

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0
    let cancelled = false
    let last = performance.now()

    const apply = (value: Transform) => {
      ref.current?.setAttribute(
        "transform",
        `translate(${value.x} ${value.y}) scale(${value.sx} ${value.sy})`,
      )
    }

    if (reduce || document.hidden) {
      current.current = { ...targetRef.current }
      apply(current.current)
      return
    }

    const tick = (now: number) => {
      if (cancelled) return
      const dt = Math.min(0.034, (now - last) / 1000)
      last = now
      const next = targetRef.current
      const value = current.current
      const k = 1 - Math.exp(-speed * dt)
      value.x += (next.x - value.x) * k
      value.y += (next.y - value.y) * k
      value.sx += (next.sx - value.sx) * k
      value.sy += (next.sy - value.sy) * k

      const settled =
        Math.abs(next.x - value.x) < 0.2 &&
        Math.abs(next.y - value.y) < 0.2 &&
        Math.abs(next.sx - value.sx) < 0.004 &&
        Math.abs(next.sy - value.sy) < 0.004

      if (settled) {
        current.current = { ...next }
        apply(next)
        return
      }

      apply(value)
      frame = requestAnimationFrame(tick)
    }

    apply(current.current)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [ref, speed, target.x, target.y, target.sx, target.sy])
}
