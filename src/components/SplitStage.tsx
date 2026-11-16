import { GrassField } from "./GrassField"
import { Hero } from "./Hero"
import { Plant } from "./Plant"
import { RightPanel } from "./panel/RightPanel"

export function SplitStage() {
  return (
    <>
      <GrassField />
      <svg className="clip-defs" aria-hidden="true">
        <defs>
          <clipPath id="leaf-up" clipPathUnits="objectBoundingBox">
            <path d="M0.50 0.015 C0.58 0.08 0.72 0.16 0.84 0.28 C0.96 0.42 0.98 0.58 0.86 0.72 C0.74 0.86 0.60 0.97 0.50 0.995 C0.40 0.97 0.26 0.86 0.14 0.72 C0.02 0.58 0.04 0.42 0.16 0.28 C0.28 0.16 0.42 0.08 0.50 0.015 Z" />
          </clipPath>
          <clipPath id="leaf-side" clipPathUnits="objectBoundingBox">
            <path d="M0.02 0.52 C0.06 0.52 0.08 0.46 0.14 0.38 C0.26 0.14 0.48 0.02 0.72 0.1 C0.9 0.18 0.99 0.36 0.985 0.5 C0.99 0.64 0.9 0.84 0.7 0.92 C0.46 0.99 0.24 0.88 0.12 0.68 C0.06 0.58 0.02 0.54 0.02 0.52 Z" />
          </clipPath>
        </defs>
      </svg>
      <main className="stage">
        <section className="stage__left" aria-label="Introduction">
          <Hero />
          <Plant />
        </section>
        <section className="stage__right" aria-label="Portfolio">
          <RightPanel />
        </section>
      </main>
    </>
  )
}
