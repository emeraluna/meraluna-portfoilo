import { Color, DoubleSide, MeshPhysicalMaterial, MeshStandardMaterial } from "three"
import type { BufferGeometry } from "three"
import { createPetalGeometry } from "./petal"

type RGB = [number, number, number]

export type FlowerPart = {
  geometry: BufferGeometry
  kind: "petal" | "sepal"
  azimuth: number
  radius: number
  y: number
  roll: number
  tiltClosed: number
  tiltOpen: number
  delay: number
  scaleClosed: number
  scaleOpen: number
}

export type FlowerModel = {
  parts: FlowerPart[]
  petalMaterial: MeshPhysicalMaterial
  sepalMaterial: MeshStandardMaterial
  dispose: () => void
}

const GOLDEN = Math.PI * (3 - Math.sqrt(5))

function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

function createFlower(): FlowerModel {
  const parts: FlowerPart[] = []
  const petals = 30

  for (let i = 0; i < petals; i += 1) {
    const t = i / (petals - 1)
    parts.push({
      geometry: createPetalGeometry({
        length: 0.36 + Math.pow(t, 0.78) * 0.74,
        width: 0.15 + Math.pow(t, 0.72) * 0.4,
        curl: 0.04 + Math.pow(t, 1.25) * 0.26,
        cup: 0.06 + t * 0.1,
        ruffle: 0.004 + t * 0.016,
        twist: Math.sin(i * 1.7) * 0.1,
        colorBase: mix([0.16, 0.006, 0.012], [0.38, 0.012, 0.018], t),
        colorTip: mix([0.32, 0.01, 0.016], [0.72, 0.03, 0.028], Math.pow(t, 0.85)),
        colorEdge: mix([0.46, 0.02, 0.022], [0.86, 0.06, 0.045], t),
      }),
      kind: "petal",
      azimuth: i * GOLDEN,
      radius: 0.018 + t * 0.12,
      y: 0.15 * (1 - t) - 0.04,
      roll: Math.sin(i * 2.2) * 0.07,
      tiltClosed: 0.02 + t * 0.07,
      tiltOpen: 0.42 + Math.pow(t, 0.8) * 1.32,
      delay: (1 - t) * 0.32,
      scaleClosed: 0.78,
      scaleOpen: 0.94 + t * 0.08,
    })
  }

  for (let i = 0; i < 5; i += 1) {
    parts.push({
      geometry: createPetalGeometry({
        length: 0.5,
        width: 0.18,
        curl: 0.22,
        cup: 0.035,
        ruffle: 0.02,
        twist: (i - 2) * 0.03,
        profile: "sepal",
        colorBase: [0.1, 0.22, 0.08],
        colorTip: [0.24, 0.42, 0.16],
        colorEdge: [0.45, 0.55, 0.24],
      }),
      kind: "sepal",
      azimuth: (i / 5) * Math.PI * 2 + 0.35,
      radius: 0.05,
      y: -0.09,
      roll: 0,
      tiltClosed: 0.42,
      tiltOpen: 1.85,
      delay: 0,
      scaleClosed: 1,
      scaleOpen: 1.04,
    })
  }

  const petalMaterial = new MeshPhysicalMaterial({
    vertexColors: true,
    color: 0xffffff,
    roughness: 0.48,
    metalness: 0,
    sheen: 0.35,
    sheenRoughness: 0.42,
    sheenColor: new Color("#a32032"),
    clearcoat: 0.16,
    clearcoatRoughness: 0.4,
    side: DoubleSide,
    envMapIntensity: 0.42,
  })

  petalMaterial.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
       if (!gl_FrontFacing) diffuseColor.rgb *= vec3(0.5, 0.38, 0.38);`,
    )
  }

  const sepalMaterial = new MeshStandardMaterial({
    vertexColors: true,
    color: 0xffffff,
    roughness: 0.74,
    metalness: 0,
    side: DoubleSide,
  })

  return {
    parts,
    petalMaterial,
    sepalMaterial,
    dispose: () => {
      for (const part of parts) part.geometry.dispose()
      petalMaterial.dispose()
      sepalMaterial.dispose()
    },
  }
}

let cached: FlowerModel | null = null

export function getFlower() {
  if (!cached) cached = createFlower()
  return cached
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cached?.dispose()
    cached = null
  })
}
