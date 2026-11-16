import { useEffect, useMemo, useRef } from "react"
import type { RefObject } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { ACESFilmicToneMapping, PCFShadowMap, PMREMGenerator, SRGBColorSpace, Vector3 } from "three"
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { Arrangement, emptyAnchors } from "./Arrangement"
import type { AnchorName } from "./Arrangement"

const TIP_X = 74
const TIP_Y = 14

const GAP: Record<AnchorName, number> = {
  stem: 22,
  leftLeaf: 18,
  rightLeaf: 18,
  bloom: 26,
}

function Studio() {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)

  useEffect(() => {
    const pmrem = new PMREMGenerator(gl)
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = environment
    scene.environmentIntensity = 1.05
    gl.setRenderTarget(null)
    gl.setClearColor(0x000000, 0)
    return () => {
      environment.dispose()
      pmrem.dispose()
      scene.environment = null
    }
  }, [gl, scene])

  return (
    <>
      <hemisphereLight args={["#f4f7ff", "#b7c9ae", 0.5]} />
      <directionalLight
        position={[-6.2, 8.2, 3.4]}
        intensity={3.35}
        color="#fff3e4"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={2}
        shadow-camera-far={18}
        shadow-camera-left={-2.6}
        shadow-camera-right={2.6}
        shadow-camera-top={3}
        shadow-camera-bottom={-2.2}
        shadow-bias={-0.0005}
      >
        <object3D attach="target" position={[0, 1.2, 0]} />
      </directionalLight>
      <directionalLight position={[4.2, 2.6, 3.6]} intensity={0.62} color="#f3f7ff" />
      <directionalLight position={[-1.4, 3.2, -4.2]} intensity={0.42} color="#ffe4e6" />
    </>
  )
}

function Turntable() {
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const controls = useRef<OrbitControls | null>(null)

  useEffect(() => {
    const orbit = new OrbitControls(camera, gl.domElement)
    orbit.target.set(0, 1.35, 0)
    orbit.enablePan = false
    orbit.enableDamping = true
    orbit.dampingFactor = 0.08
    orbit.minDistance = 4.6
    orbit.maxDistance = 9.2
    orbit.minPolarAngle = 0.55
    orbit.maxPolarAngle = 1.42
    orbit.update()
    controls.current = orbit
    return () => orbit.dispose()
  }, [camera, gl])

  useFrame(() => controls.current?.update())
  return null
}

function Tracker({
  anchors,
  anchor,
  approach,
  gone,
  arrowRef,
  frameRef,
}: {
  anchors: RefObject<ReturnType<typeof emptyAnchors>>
  anchor: AnchorName
  approach: number
  gone: boolean
  arrowRef: RefObject<HTMLDivElement | null>
  frameRef: RefObject<HTMLDivElement | null>
}) {
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const point = useMemo(() => new Vector3(), [])
  const gap = GAP[anchor]

  useFrame(() => {
    const arrow = arrowRef.current
    const frame = frameRef.current
    if (!arrow || !frame) return
    if (gone) {
      arrow.style.opacity = "0"
      return
    }
    const node = anchors.current[anchor]
    if (!node) return
    node.getWorldPosition(point)
    point.project(camera)
    if (point.z > 1) {
      arrow.style.opacity = "0"
      return
    }
    const canvas = gl.domElement.getBoundingClientRect()
    const host = frame.getBoundingClientRect()
    const x = (point.x * 0.5 + 0.5) * canvas.width + (canvas.left - host.left)
    const y = (-point.y * 0.5 + 0.5) * canvas.height + (canvas.top - host.top)
    const tipX = x + Math.cos(approach) * gap
    const tipY = y + Math.sin(approach) * gap
    const angle = (Math.atan2(y - tipY, x - tipX) * 180) / Math.PI
    arrow.style.opacity = "1"
    arrow.style.left = `${tipX - TIP_X}px`
    arrow.style.top = `${tipY - TIP_Y}px`
    arrow.style.transform = `rotate(${angle}deg)`
  })

  return null
}

export function PlantCanvas({
  frameRef,
  arrowRef,
  anchor,
  approach,
  gone,
}: {
  frameRef: RefObject<HTMLDivElement | null>
  arrowRef: RefObject<HTMLDivElement | null>
  anchor: AnchorName
  approach: number
  gone: boolean
}) {
  const anchors = useRef(emptyAnchors())

  return (
    <Canvas
      className="plant-canvas"
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 32, position: [0.72, 1.72, 6.35], near: 0.05, far: 40 }}
      onCreated={({ gl, camera }) => {
        camera.lookAt(0, 1.35, 0)
        gl.toneMapping = ACESFilmicToneMapping
        gl.toneMappingExposure = 1.08
        gl.outputColorSpace = SRGBColorSpace
        gl.shadowMap.enabled = true
        gl.shadowMap.type = PCFShadowMap
        gl.setClearColor(0x000000, 0)
      }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <Studio />
      <Turntable />
      <Arrangement anchors={anchors} />
      <Tracker
        anchors={anchors}
        anchor={anchor}
        approach={approach}
        gone={gone}
        arrowRef={arrowRef}
        frameRef={frameRef}
      />
    </Canvas>
  )
}
