import { useLayoutEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { MathUtils } from "three"
import type { Group } from "three"
import { getFlower } from "./flower"

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const span = edge1 - edge0 || 1
  const t = Math.min(1, Math.max(0, (value - edge0) / span))
  return t * t * (3 - 2 * t)
}

function easeOut(t: number) {
  return 1 - (1 - t) ** 3
}

function Receptacle() {
  return (
    <group>
      <mesh position={[0, -0.24, 0]}>
        <cylinderGeometry args={[0.026, 0.034, 0.2, 14]} />
        <meshStandardMaterial color="#3c6b34" roughness={0.78} />
      </mesh>
      <mesh position={[0, -0.11, 0]} scale={[1.15, 0.62, 1.15]}>
        <sphereGeometry args={[0.086, 28, 18]} />
        <meshStandardMaterial color="#4d7b3b" roughness={0.66} />
      </mesh>
    </group>
  )
}

function Stamens() {
  const specs = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        angle: (index / 18) * Math.PI * 2,
        radius: 0.035 + (index % 3) * 0.016,
        height: 0.15 + (index % 4) * 0.032,
        lean: 0.2 + (index % 3) * 0.08,
        color: index % 2 === 0 ? "#e0a322" : "#f3c85a",
      })),
    [],
  )

  return (
    <group>
      {specs.map((spec, index) => (
        <group key={index} rotation-y={spec.angle}>
          <mesh position={[0, spec.height * 0.48, spec.radius]} rotation-x={spec.lean}>
            <cylinderGeometry args={[0.004, 0.005, spec.height, 6]} />
            <meshStandardMaterial color="#f7e7c4" roughness={0.58} />
          </mesh>
          <mesh
            position={[
              0,
              Math.cos(spec.lean) * spec.height * 0.9,
              spec.radius + Math.sin(spec.lean) * spec.height * 0.9,
            ]}
          >
            <sphereGeometry args={[0.018, 10, 10]} />
            <meshStandardMaterial color={spec.color} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function Rose({ open }: { open: boolean }) {
  const flower = getFlower()
  const nodes = useRef<(Group | null)[]>([])
  const sway = useRef<Group>(null)
  const stamens = useRef<Group>(null)
  const bloom = useRef(open ? 1 : 0)
  const openRef = useRef(open)
  const reduce = useRef(false)
  openRef.current = open

  useLayoutEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!document.hidden) return
    bloom.current = openRef.current ? 1 : 0
    const amount = bloom.current
    flower.parts.forEach((part, index) => {
      const node = nodes.current[index]
      if (!node) return
      const local = smoothstep(part.delay, Math.min(part.delay + 0.62, 1), amount)
      const eased = easeOut(local)
      node.rotation.x = lerp(part.tiltClosed, part.tiltOpen, eased)
      node.scale.setScalar(lerp(part.scaleClosed, part.scaleOpen, eased))
      const holder = node.parent
      if (holder) holder.position.z = lerp(part.radius * 0.18, part.radius, eased)
    })
  }, [flower, open])

  useFrame((state, delta) => {
    const target = openRef.current ? 1 : 0
    bloom.current = reduce.current ? target : MathUtils.damp(bloom.current, target, 2.4, delta)
    const amount = bloom.current

    flower.parts.forEach((part, index) => {
      const node = nodes.current[index]
      if (!node) return
      const local = smoothstep(part.delay, Math.min(part.delay + 0.62, 1), amount)
      const eased = easeOut(local)
      node.rotation.x = lerp(part.tiltClosed, part.tiltOpen, eased)
      node.scale.setScalar(lerp(part.scaleClosed, part.scaleOpen, eased))
      const holder = node.parent
      if (holder) {
        holder.position.z = lerp(part.radius * 0.18, part.radius, eased)
      }
    })

    if (stamens.current) {
      const visible = smoothstep(0.56, 0.9, amount)
      stamens.current.visible = visible > 0.03
      stamens.current.scale.setScalar(0.28 + 0.72 * visible)
    }

    if (sway.current && !reduce.current) {
      const time = state.clock.elapsedTime
      sway.current.rotation.y = -0.4 + Math.sin(time * 0.32) * 0.15
      sway.current.rotation.z = Math.sin(time * 0.22) * 0.028
    }
  })

  return (
    <group ref={sway} rotation-y={-0.4} position={[0, 0.08, 0]}>
      <Receptacle />
      {flower.parts.map((part, index) => (
        <group key={index} rotation-y={part.azimuth}>
          <group position={[0, part.y, part.radius * 0.18]}>
            <group
              ref={(node) => {
                nodes.current[index] = node
              }}
              rotation-x={part.tiltClosed}
              rotation-z={part.roll}
              scale={part.scaleClosed}
            >
              <mesh
                geometry={part.geometry}
                material={part.kind === "petal" ? flower.petalMaterial : flower.sepalMaterial}
              />
            </group>
          </group>
        </group>
      ))}
      <group ref={stamens} position={[0, 0.12, 0]} scale={0.001} visible={false}>
        <Stamens />
      </group>
    </group>
  )
}
