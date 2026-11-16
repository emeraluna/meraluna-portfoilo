import { useLayoutEffect, useMemo, useRef } from "react"
import type { ReactNode, RefObject } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { DoubleSide, MathUtils, MeshStandardMaterial, Quaternion, Vector3 } from "three"
import type { Group, Object3D } from "three"
import { createLeafletGeometry } from "./leaflet"
import { createBloom } from "./bloom"
import { createVaseGeometry, createWaterGeometry, WATER_LEVEL, waterSurfaceRadius } from "./vase"
import type { Part } from "../plant/interaction"
import { isInteractive } from "../plant/interaction"
import { usePlant } from "../state/PlantContext"
import { createStemTube, stemPoint, stemPointAtY } from "./stem"

export type AnchorName = "stem" | "leftLeaf" | "rightLeaf" | "bloom"

type Anchors = Record<AnchorName, Object3D | null>
const LEFT_LEAF = 0.34
const RIGHT_LEAF = 0.3
const INTRO_TILT = Math.PI / 6

function Leaflet({
  geometry,
  position,
  rotation,
}: {
  geometry: ReturnType<typeof createLeafletGeometry>
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  return (
    <mesh geometry={geometry} position={position} rotation={rotation} castShadow>
      <meshPhysicalMaterial
        vertexColors
        color="#0b4e24"
        roughness={0.58}
        metalness={0}
        clearcoat={0.12}
        clearcoatRoughness={0.45}
        sheen={0.04}
        sheenColor="#145c30"
        side={DoubleSide}
        envMapIntensity={0.2}
      />
    </mesh>
  )
}

function RoseLeaf({
  length,
  sign,
}: {
  length: number
  sign: 1 | -1
}) {
  const leaflet = useMemo(() => createLeafletGeometry(length, length * 0.38), [length])

  useLayoutEffect(() => () => leaflet.dispose(), [leaflet])

  return (
    <group>
      <mesh position={[length * 0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.013, length * 0.28, 8]} />
        <meshStandardMaterial color="#0c3d1e" roughness={0.48} />
      </mesh>
      <Leaflet
        geometry={leaflet}
        position={[length * 0.2, 0, 0]}
        rotation={[sign * 0.35, 0, 0]}
      />
    </group>
  )
}

type Splash = { play: (amount: number) => void; quiet: () => void; warm: () => void; close: () => void }

function createSplash(): Splash {
  let audio: HTMLAudioElement | null = null
  const ensure = () => {
    if (!audio) {
      audio = new Audio("/water_sound.mp3")
      audio.preload = "auto"
      audio.loop = true
    }
    return audio
  }
  return {
    warm() {
      const clip = ensure()
      clip.volume = 0
      const started = clip.play()
      if (!started) return
      void started
        .then(() => {
          clip.pause()
          clip.currentTime = 0
        })
        .catch(() => {})
    },
    play(amount: number) {
      const clip = ensure()
      clip.volume = Math.min(0.9, 0.28 + amount * 0.55)
      if (clip.paused) void clip.play().catch(() => {})
    },
    quiet() {
      if (!audio || audio.paused) return
      audio.pause()
      audio.currentTime = 0
    },
    close() {
      if (!audio) return
      audio.pause()
      audio.src = ""
      audio = null
    },
  }
}

function VaseJewels() {
  const jewels = useMemo(() => {
    return Array.from({ length: 16 }, (_, index) => {
      const turn = (index / 16) * Math.PI * 2 + (index % 2) * 0.2
      const band = index % 2
      const y = band === 0 ? 0.38 : 0.58
      const radius = band === 0 ? 0.22 : 0.28
      return {
        position: [Math.cos(turn) * radius, y, Math.sin(turn) * radius] as [number, number, number],
        phase: index * 0.55,
        spin: 0.4 + (index % 3) * 0.25,
        material: new MeshStandardMaterial({
          color: "#ffe08a",
          metalness: 1,
          roughness: 0.12,
          emissive: "#fff3c4",
          emissiveIntensity: 1.2,
        }),
      }
    })
  }, [])
  const nodes = useRef<(Object3D | null)[]>([])
  const band = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#e8c56a",
        metalness: 1,
        roughness: 0.22,
        emissive: "#ffd978",
        emissiveIntensity: 0.35,
      }),
    [],
  )

  useLayoutEffect(
    () => () => {
      jewels.forEach((jewel) => jewel.material.dispose())
      band.dispose()
    },
    [jewels, band],
  )

  useFrame(({ clock }) => {
    const time = clock.elapsedTime
    band.emissiveIntensity = 0.2 + Math.pow(Math.max(0, Math.sin(time * 3.1)), 4) * 1.8
    jewels.forEach((jewel, index) => {
      const flash = Math.pow(Math.max(0, Math.sin(time * 2.6 + jewel.phase)), 6)
      jewel.material.emissiveIntensity = 0.35 + flash * 4
      const node = nodes.current[index]
      if (node) {
        node.rotation.y = time * jewel.spin
        node.scale.setScalar(0.75 + flash * 1.1)
      }
    })
  })

  return (
    <group>
      <mesh position={[0, 1.16, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.25, 0.012, 10, 48]} />
        <primitive object={band} attach="material" />
      </mesh>
      {jewels.map((jewel, index) => (
        <mesh
          key={index}
          ref={(node) => {
            nodes.current[index] = node
          }}
          position={jewel.position}
          material={jewel.material}
        >
          <octahedronGeometry args={[0.042, 0]} />
        </mesh>
      ))}
    </group>
  )
}

function Thorns() {
  const specs = useMemo(
    () =>
      [1.52, 1.78, 2.02, 2.26].map((y, index) => {
        const point = stemPointAtY(y)
        return { y, point, turn: index * 1.9 + 0.4, drop: 0.22 + (index % 3) * 0.08 }
      }),
    [],
  )

  return (
    <group>
      {specs.map((spec) => (
        <group key={spec.y} position={spec.point} rotation-y={spec.turn}>
          <mesh position={[0.05, -0.008, 0]} rotation-z={Math.PI / 2 + spec.drop} castShadow>
            <coneGeometry args={[0.014, 0.072, 5]} />
            <meshStandardMaterial color="#6d382c" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Bloom({ open }: { open: boolean }) {
  const model = useMemo(() => createBloom(), [])
  const nodes = useRef<(Group | null)[]>([])
  const amount = useRef(open ? 1 : 0)
  const openRef = useRef(open)
  openRef.current = open

  useLayoutEffect(() => () => model.dispose(), [model])

  useFrame((_, delta) => {
    const target = openRef.current ? 1 : 0
    amount.current = MathUtils.damp(amount.current, target, 2.2, delta)
    const value = amount.current
    model.parts.forEach((part, index) => {
      const node = nodes.current[index]
      if (!node) return
      const span = Math.min(part.delay + 0.55, 1)
      const local = Math.min(1, Math.max(0, (value - part.delay) / (span - part.delay || 1)))
      const eased = 1 - (1 - local) ** 3
      node.rotation.x = MathUtils.lerp(part.tiltClosed, part.tiltOpen, eased)
      const holder = node.parent
      if (holder) holder.position.z = MathUtils.lerp(0.004, part.radius, eased)
    })
  })

  return (
    <group>
      <mesh position={[0, -0.06, 0]} scale={[1, 0.72, 1]} castShadow>
        <sphereGeometry args={[0.075, 24, 16]} />
        <meshStandardMaterial color="#3a6a32" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.07, 0]} scale={[0.07, 0.11, 0.07]}>
        <sphereGeometry args={[1, 20, 16]} />
        <meshPhysicalMaterial color="#c41218" roughness={0.42} sheen={0.8} sheenColor="#e02028" />
      </mesh>
      {model.parts.map((part, index) => (
        <group key={index} rotation-y={part.azimuth}>
          <group position={[0, part.y, part.radius * 0.2]}>
            <group
              ref={(node) => {
                nodes.current[index] = node
              }}
              rotation-x={part.tiltClosed}
              rotation-z={part.roll}
            >
              <mesh
                geometry={part.geometry}
                material={part.kind === "petal" ? model.petalMaterial : model.sepalMaterial}
                castShadow
              />
            </group>
          </group>
        </group>
      ))}
    </group>
  )
}

function Clickable({
  part,
  children,
}: {
  part: Part
  children: ReactNode
}) {
  const { stage, interact } = usePlant()
  const hot = isInteractive(stage, part)
  const down = useRef({ x: 0, y: 0 })

  return (
    <group
      onPointerDown={(event) => {
        event.stopPropagation()
        down.current = { x: event.clientX, y: event.clientY }
      }}
      onPointerUp={(event) => {
        const dx = event.clientX - down.current.x
        const dy = event.clientY - down.current.y
        if (dx * dx + dy * dy > 20) return
        event.stopPropagation()
        interact(part)
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        document.body.style.cursor = hot ? "pointer" : "grab"
      }}
      onPointerOut={() => {
        document.body.style.cursor = "grab"
      }}
    >
      {children}
    </group>
  )
}

export function Arrangement({ anchors }: { anchors: RefObject<Anchors> }) {
  const { stage } = usePlant()
  const vase = useMemo(() => createVaseGeometry(), [])
  const water = useMemo(() => createWaterGeometry(), [])
  const stem = useMemo(() => createStemTube(0.034), [])
  const stemHit = useMemo(() => createStemTube(0.12, 28, 6), [])
  const bloomPose = useMemo(() => {
    const tip = stemPoint(1)
    const tangent = tip.clone().sub(stemPoint(0.93)).normalize()
    const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), tangent)
    return { position: [tip.x, tip.y, tip.z] as [number, number, number], quaternion }
  }, [])
  const leftHome = useMemo(() => stemPointAtY(2.04), [])
  const rightHome = useMemo(() => stemPointAtY(1.9), [])
  const stemAnchor = useMemo(() => stemPointAtY(1.7), [])
  const leftLift = useRef<Group>(null)
  const rightLift = useRef<Group>(null)
  const bloomLift = useRef<Group>(null)
  const lean = useRef<Group>(null)
  const waterTilt = useRef<Group>(null)
  const sawBloom = useRef(false)
  const intro = useRef(-1)
  const splash = useRef<Splash | null>(null)
  const camera = useThree((state) => state.camera)
  const previousCamera = useRef(new Vector3())
  const cameraReady = useRef(false)
  const slosh = useRef({ x: 0, z: 0, vx: 0, vz: 0 })
  const previousLean = useRef(0)

  useLayoutEffect(() => {
    splash.current = createSplash()
    const warm = () => splash.current?.warm()
    window.addEventListener("pointerdown", warm)
    return () => {
      window.removeEventListener("pointerdown", warm)
      vase.dispose()
      water.dispose()
      stem.dispose()
      stemHit.dispose()
      splash.current?.close()
    }
  }, [vase, water, stem, stemHit])

  useFrame((_, delta) => {
    if (stage >= 3 && !sawBloom.current) {
      sawBloom.current = true
      intro.current = 0
    }
    const pose = lean.current
    if (pose && intro.current >= 0) {
      intro.current += delta
      const t = intro.current
      let tilt = 0
      if (t < 0.5) tilt = (t / 0.5) * INTRO_TILT
      else if (t < 1.15) tilt = INTRO_TILT
      else if (t < 2.2) tilt = INTRO_TILT * (1 - (t - 1.15) / 1.05)
      else intro.current = -1
      pose.rotation.x = tilt
    } else if (pose && pose.rotation.x !== 0) {
      pose.rotation.x = MathUtils.damp(pose.rotation.x, 0, 4, delta)
    }

    const leanNow = pose?.rotation.x ?? 0
    const leanDelta = leanNow - previousLean.current
    previousLean.current = leanNow
    const cam = camera.position
    if (!cameraReady.current) {
      previousCamera.current.copy(cam)
      cameraReady.current = true
    }
    const dx = cam.x - previousCamera.current.x
    const dz = cam.z - previousCamera.current.z
    previousCamera.current.copy(cam)
    const wave = slosh.current
    const step = Math.min(delta, 0.05)
    wave.vx += dx * 9
    wave.vz += dz * 9 + leanDelta * 4
    wave.vx += (-28 * wave.x - 7 * wave.vx) * step
    wave.vz += (-28 * wave.z - 7 * wave.vz) * step
    wave.x = MathUtils.clamp(wave.x + wave.vx * step, -0.24, 0.24)
    wave.z = MathUtils.clamp(wave.z + wave.vz * step, -0.24, 0.24)
    const surface = waterTilt.current
    if (surface) {
      surface.rotation.z = wave.x
      surface.rotation.x = wave.z
    }
    const energy = Math.hypot(wave.vx, wave.vz)
    if (energy > 0.45) splash.current?.play(Math.min(1, energy / 2.2))
    else splash.current?.quiet()

    const left = leftLift.current
    const right = rightLift.current
    const bloom = bloomLift.current
    if (left) {
      const shown = stage >= 1 ? 1 : 0
      left.scale.setScalar(MathUtils.damp(left.scale.x, shown, 4.5, delta))
    }
    if (right) {
      const shown = stage >= 2 ? 1 : 0
      right.scale.setScalar(MathUtils.damp(right.scale.x, shown, 4.5, delta))
    }
    if (bloom) {
      const shown = stage >= 3 ? 1 : 0
      bloom.scale.setScalar(MathUtils.damp(bloom.scale.x, shown, 4, delta))
    }
  })

  return (
    <group ref={lean} scale={0.9}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, 0]}>
        <circleGeometry args={[0.46, 40]} />
        <meshBasicMaterial color="#1a3824" transparent opacity={0.2} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.006, 0]} receiveShadow>
        <circleGeometry args={[1.45, 48]} />
        <shadowMaterial opacity={0.28} />
      </mesh>

      <mesh geometry={vase}>
        <meshPhysicalMaterial
          color="#f4fbfb"
          roughness={0.015}
          metalness={0}
          transmission={1}
          thickness={0.32}
          ior={1.5}
          transparent
          attenuationColor="#e7f3f0"
          attenuationDistance={2.8}
          envMapIntensity={1.35}
          clearcoat={1}
          clearcoatRoughness={0.04}
        />
      </mesh>
      <VaseJewels />
      <group ref={waterTilt} position={[0, WATER_LEVEL, 0]}>
        <mesh geometry={water} position={[0, -WATER_LEVEL, 0]}>
          <meshPhysicalMaterial
            color="#d4eeea"
            roughness={0.03}
            transmission={1}
            thickness={1.15}
            ior={1.333}
            transparent
            opacity={0.4}
            attenuationColor="#b5ddd4"
            attenuationDistance={0.8}
          />
        </mesh>
        <mesh position={[0, 0.004, 0]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[waterSurfaceRadius, 64]} />
          <meshPhysicalMaterial
            color="#e8f7f4"
            roughness={0.02}
            metalness={0.02}
            transmission={0.88}
            thickness={0.35}
            ior={1.333}
            transparent
            opacity={0.5}
          />
        </mesh>
        <mesh position={[0, 0, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[waterSurfaceRadius - 0.008, 0.01, 8, 48]} />
          <meshPhysicalMaterial
            color="#f4fffd"
            roughness={0.04}
            transmission={0.75}
            thickness={0.08}
            ior={1.333}
            transparent
            opacity={0.45}
          />
        </mesh>
      </group>

      <Clickable part="stem">
        <mesh geometry={stemHit}>
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </Clickable>
      <mesh geometry={stem} castShadow>
        <meshPhysicalMaterial vertexColors roughness={0.46} sheen={0.3} sheenColor="#d7f0a4" />
      </mesh>
      <group
        ref={(node) => {
          anchors.current.stem = node
        }}
        position={stemAnchor}
      />
      <Thorns />

      <group
        ref={leftLift}
        position={leftHome}
        rotation={[0, 0, Math.PI + 0.5]}
        scale={0}
      >
        <Clickable part="leftLeaf">
          <RoseLeaf length={LEFT_LEAF} sign={1} />
        </Clickable>
        <group
          ref={(node) => {
            anchors.current.leftLeaf = node
          }}
          position={[LEFT_LEAF * 0.85, 0, 0]}
        />
      </group>

      <group ref={rightLift} position={rightHome} rotation={[0, 0, -0.55]} scale={0}>
        <Clickable part="rightLeaf">
          <RoseLeaf length={RIGHT_LEAF} sign={-1} />
        </Clickable>
        <group
          ref={(node) => {
            anchors.current.rightLeaf = node
          }}
          position={[RIGHT_LEAF * 0.85, 0, 0]}
        />
      </group>

      <group ref={bloomLift} position={bloomPose.position} quaternion={bloomPose.quaternion} scale={0}>
        <Clickable part="bloom">
          <mesh>
            <sphereGeometry args={[0.68, 16, 12]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          <Bloom open={stage >= 4} />
        </Clickable>
        <group
          ref={(node) => {
            anchors.current.bloom = node
          }}
          position={[-0.28, 0.18, 0]}
        />
      </group>
    </group>
  )
}

export function emptyAnchors(): Anchors {
  return { stem: null, leftLeaf: null, rightLeaf: null, bloom: null }
}
