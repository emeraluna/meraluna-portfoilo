import { useRef } from "react"
import { ArrowGuide } from "./ArrowGuide"
import { PlantCanvas } from "../scene/PlantCanvas"
import type { AnchorName } from "../scene/Arrangement"
import { usePlant } from "../state/PlantContext"

const APPROACH: Record<AnchorName, number> = {
  stem: Math.PI,
  leftLeaf: Math.PI,
  rightLeaf: 0,
  bloom: -2.45,
}

function anchorFor(stage: number): AnchorName {
  if (stage <= 0) return "stem"
  if (stage === 1) return "leftLeaf"
  if (stage === 2) return "rightLeaf"
  return "bloom"
}

export function Plant() {
  const { stage } = usePlant()
  const frameRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)
  const anchor = anchorFor(stage)

  return (
    <div className="plant-frame" ref={frameRef}>
      <PlantCanvas
        frameRef={frameRef}
        arrowRef={arrowRef}
        anchor={anchor}
        approach={APPROACH[anchor]}
        gone={stage >= 5}
      />
      <ArrowGuide ref={arrowRef} gone={stage >= 5} />
    </div>
  )
}
