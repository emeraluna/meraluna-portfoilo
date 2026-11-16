import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { resolveInteraction } from "../plant/interaction"
import type { Part, SectionId, Stage } from "../plant/interaction"

type PlantContextValue = {
  stage: Stage
  section: SectionId | null
  interact: (part: Part) => void
  showContact: () => void
}

const PlantContext = createContext<PlantContextValue | null>(null)

export function PlantProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<Stage>(0)
  const [section, setSection] = useState<SectionId | null>(null)
  const stageRef = useRef<Stage>(0)
  const sectionRef = useRef<SectionId | null>(null)
  const lockRef = useRef<{ part: Part; at: number } | null>(null)

  const interact = useCallback((part: Part) => {
    const now = performance.now()
    const lock = lockRef.current
    if (lock && lock.part === part && now - lock.at < 450) return
    const result = resolveInteraction(stageRef.current, part, sectionRef.current)
    if (!result) return
    lockRef.current = { part, at: now }
    stageRef.current = result.stage
    sectionRef.current = result.section
    setStage(result.stage)
    setSection(result.section)
  }, [])

  const showContact = useCallback(() => {
    if (stageRef.current < 5) return
    setSection("contact")
  }, [])

  const value = useMemo(
    () => ({ stage, section, interact, showContact }),
    [stage, section, interact, showContact],
  )

  return <PlantContext.Provider value={value}>{children}</PlantContext.Provider>
}

export function usePlant() {
  const value = useContext(PlantContext)
  if (!value) {
    throw new Error("usePlant must be used within PlantProvider")
  }
  return value
}
