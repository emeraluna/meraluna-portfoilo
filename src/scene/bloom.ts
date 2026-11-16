import { Color, DoubleSide, MeshPhysicalMaterial } from "three"
import type { BufferGeometry } from "three"
import { createPetalGeometry } from "../components/rose/petal"

type RGB = [number, number, number]

export type BloomPart = {
  geometry: BufferGeometry
  kind: "petal" | "sepal"
  azimuth: number
  radius: number
  y: number
  roll: number
  tiltClosed: number
  tiltOpen: number
  delay: number
}

function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export function createBloom() {
  const parts: BloomPart[] = []
  // Five-fold rose: a tight upright heart, then layers that open into five reflexed outer petals.
  const whorls = [
    { count: 5, length: 0.15, width: 0.08, radius: 0.008, y: 0.1, tiltOpen: 0.1, tiltClosed: 0.02, curl: 0.38, reflex: 0, delay: 0.58 },
    { count: 5, length: 0.22, width: 0.12, radius: 0.024, y: 0.07, tiltOpen: 0.28, tiltClosed: 0.05, curl: 0.24, reflex: 0, delay: 0.44 },
    { count: 5, length: 0.3, width: 0.17, radius: 0.046, y: 0.04, tiltOpen: 0.52, tiltClosed: 0.09, curl: 0.12, reflex: 0.03, delay: 0.3 },
    { count: 5, length: 0.38, width: 0.23, radius: 0.074, y: 0.012, tiltOpen: 0.82, tiltClosed: 0.14, curl: 0.04, reflex: 0.1, delay: 0.14 },
    { count: 5, length: 0.44, width: 0.3, radius: 0.1, y: -0.01, tiltOpen: 1.02, tiltClosed: 0.2, curl: 0, reflex: 0.16, delay: 0 },
  ]

  whorls.forEach((whorl, layer) => {
    const tone = layer / (whorls.length - 1)
    for (let i = 0; i < whorl.count; i += 1) {
      const jitter = hash(layer * 20 + i + 1)
      parts.push({
        geometry: createPetalGeometry({
          length: whorl.length * (0.96 + jitter * 0.06),
          width: whorl.width * (0.96 + hash(layer * 20 + i + 4) * 0.08),
          curl: whorl.curl,
          reflex: whorl.reflex,
          cup: 0.2 - tone * 0.08,
          fold: 0.035,
          ruffle: 0.001 + tone * 0.004,
          twist: (jitter - 0.5) * 0.08,
          profile: "rose",
          colorBase: mix([0.38, 0.006, 0.01], [0.55, 0.01, 0.014], tone),
          colorTip: mix([0.52, 0.008, 0.012], [0.78, 0.014, 0.016], tone),
          colorEdge: mix([0.58, 0.01, 0.014], [0.9, 0.018, 0.018], tone),
        }),
        kind: "petal",
        azimuth: (i / whorl.count) * Math.PI * 2 + layer * (Math.PI / whorl.count),
        radius: whorl.radius * (0.94 + hash(i + layer) * 0.1),
        y: whorl.y,
        roll: (hash(i + layer * 3) - 0.5) * 0.08,
        tiltClosed: whorl.tiltClosed,
        tiltOpen: whorl.tiltOpen + (jitter - 0.5) * 0.04,
        delay: whorl.delay,
      })
    }
  })

  for (let i = 0; i < 5; i += 1) {
    const turn = (i / 5) * Math.PI * 2
    parts.push({
      geometry: createPetalGeometry({
        length: 0.34,
        width: 0.11,
        curl: 0.16,
        reflex: 0.04,
        cup: 0.02,
        fold: 0.01,
        ruffle: 0.006,
        twist: (i - 2) * 0.04,
        profile: "sepal",
        colorBase: [0.04, 0.16, 0.04],
        colorTip: [0.1, 0.32, 0.07],
        colorEdge: [0.22, 0.42, 0.1],
      }),
      kind: "sepal",
      azimuth: turn + 0.2,
      radius: 0.045,
      y: -0.07,
      roll: Math.sin(turn) * 0.08,
      tiltClosed: 0.5,
      tiltOpen: 1.25,
      delay: 0,
    })
  }

  const petalMaterial = new MeshPhysicalMaterial({
    vertexColors: true,
    color: 0xffffff,
    roughness: 0.46,
    metalness: 0,
    sheen: 0.72,
    sheenRoughness: 0.4,
    sheenColor: new Color("#c4121c"),
    clearcoat: 0.06,
    clearcoatRoughness: 0.45,
    side: DoubleSide,
    envMapIntensity: 0.38,
  })

  petalMaterial.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
       if (!gl_FrontFacing) diffuseColor.rgb *= vec3(0.52, 0.4, 0.4);`,
    )
  }

  const sepalMaterial = new MeshPhysicalMaterial({
    vertexColors: true,
    color: 0xffffff,
    roughness: 0.55,
    metalness: 0,
    sheen: 0.25,
    sheenColor: new Color("#d5ee9a"),
    clearcoat: 0.18,
    clearcoatRoughness: 0.4,
    side: DoubleSide,
  })

  return {
    parts,
    petalMaterial,
    sepalMaterial,
    dispose() {
      for (const part of parts) part.geometry.dispose()
      petalMaterial.dispose()
      sepalMaterial.dispose()
    },
  }
}
