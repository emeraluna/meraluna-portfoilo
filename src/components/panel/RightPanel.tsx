import { usePlant } from "../../state/PlantContext"
import { AboutSection } from "./AboutSection"
import { ContactSection } from "./ContactSection"
import { ExperienceSection } from "./ExperienceSection"
import { ProjectsSection } from "./ProjectsSection"
import { SkillsSection } from "./SkillsSection"

export function RightPanel() {
  const { section } = usePlant()
  if (!section) return null

  return (
    <div className={`panel${section === "contact" ? " panel--contact" : ""}`} key={section}>
      {section === "about" && <AboutSection />}
      {section === "skills" && <SkillsSection />}
      {section === "experience" && <ExperienceSection />}
      {section === "projects" && <ProjectsSection />}
      {section === "contact" && <ContactSection />}
    </div>
  )
}
