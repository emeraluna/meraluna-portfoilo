import { useLayoutEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { ACESFilmicToneMapping, SRGBColorSpace } from "three"
import { Rose } from "./Rose"

const CAMERA = { x: 0.16, y: 0.7, z: 4.35, lookY: 0.22 }

function aim(camera: { position: { set: (x: number, y: number, z: number) => void }; lookAt: (x: number, y: number, z: number) => void }) {
  camera.position.set(CAMERA.x, CAMERA.y, CAMERA.z)
  camera.lookAt(0, CAMERA.lookY, 0)
}

function CameraRig() {
  const camera = useThree((state) => state.camera)

  useLayoutEffect(() => {
    aim(camera)
  }, [camera])

  useFrame(() => {
    aim(camera)
  })

  return null
}

function Paint({ open }: { open: boolean }) {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera)

  useLayoutEffect(() => {
    aim(camera)
    gl.setRenderTarget(null)
    gl.setClearColor(0x000000, 0)
    gl.render(scene, camera)
  }, [open, camera, gl, scene])

  return null
}

function Studio() {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)

  useLayoutEffect(() => {
    scene.background = null
    gl.setClearColor(0x000000, 0)
  }, [gl, scene])

  return (
    <>
      <ambientLight intensity={0.34} />
      <directionalLight position={[-2.2, 3.6, 2.4]} intensity={2.1} color="#fff5ee" />
      <directionalLight position={[2.8, 1.2, 2.6]} intensity={0.55} color="#f3f6ff" />
      <directionalLight position={[0.2, 1.8, -2.6]} intensity={0.7} color="#ffc4cc" />
    </>
  )
}

export function RoseCanvas({ open, live }: { open: boolean; live: boolean }) {
  return (
    <Canvas
      frameloop={live ? "always" : "demand"}
      dpr={[1, 2]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      camera={{ fov: 26, near: 0.05, far: 40, position: [0.16, 0.7, 4.35] }}
      onCreated={({ gl, camera }) => {
        aim(camera)
        gl.toneMapping = ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        gl.outputColorSpace = SRGBColorSpace
        gl.setClearColor(0x000000, 0)
      }}
      style={{ background: "transparent", pointerEvents: "none" }}
    >
      <CameraRig />
      <Studio />
      <Rose open={open} />
      <Paint open={open} />
    </Canvas>
  )
}
