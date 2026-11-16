export type Stage = 0 | 1 | 2 | 3 | 4 | 5

export type Part = "stem" | "leftLeaf" | "rightLeaf" | "bloom"

export type SectionId = "about" | "skills" | "experience" | "projects" | "contact"

/**
 * Growth only moves forward.
 * 0 stem → 1 first leaf + About → 2 second leaf + Skills →
 * 3 bud + Experience → 4 open rose + Projects → 5 invitation + Contact.
 * Once the rose has opened (stage >= 4), earlier parts navigate
 * without changing the plant.
 */
export function nextPart(stage: Stage): Part | null {
  switch (stage) {
    case 0:
      return "stem"
    case 1:
      return "leftLeaf"
    case 2:
      return "rightLeaf"
    case 3:
    case 4:
      return "bloom"
    default:
      return null
  }
}

export function sectionForStage(stage: Stage): SectionId | null {
  switch (stage) {
    case 1:
      return "about"
    case 2:
      return "skills"
    case 3:
      return "experience"
    case 4:
      return "projects"
    case 5:
      return "contact"
    default:
      return null
  }
}

export function sectionForPart(part: Part): SectionId {
  switch (part) {
    case "stem":
      return "about"
    case "leftLeaf":
      return "skills"
    case "rightLeaf":
      return "experience"
    case "bloom":
      return "projects"
  }
}

export function isInteractive(stage: Stage, part: Part): boolean {
  if (nextPart(stage) === part) return true
  if (stage < 4) return false
  return part === "stem" || part === "leftLeaf" || part === "rightLeaf" || part === "bloom"
}

export function resolveInteraction(
  stage: Stage,
  part: Part,
  section: SectionId | null,
): { stage: Stage; section: SectionId } | null {
  if (nextPart(stage) === part) {
    const stageNext = (stage + 1) as Stage
    const next = sectionForStage(stageNext)
    if (!next) return null
    return { stage: stageNext, section: next }
  }

  if (stage < 4) return null
  if (part === "bloom") {
    if (stage < 5) return null
    return { stage, section: section === "projects" ? "contact" : "projects" }
  }
  if (part === "rightLeaf") return { stage, section: "experience" }
  if (part === "leftLeaf") return { stage, section: "skills" }
  if (part === "stem") return { stage, section: "about" }
  return null
}

export function isActivationKey(key: string) {
  return key === "Enter" || key === " "
}
