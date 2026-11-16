import { portfolio } from "../../content/portfolio"
import { SkillIcon } from "../icons"

export function SkillsSection() {
  const { heading, groups } = portfolio.skills

  return (
    <>
      <h2 className="panel-title">{heading}</h2>
      <div className="skill-groups">
        {groups.map((group) => (
          <section key={group.id} className="skill-group">
            <h3 className="skill-group__title">{group.title}</h3>
            <ul className="skill-grid">
              {group.items.map((item) => (
                <li key={item.id} className="skill-leaf">
                  <SkillIcon name={item.icon} />
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}
