import { portfolio } from "../../content/portfolio"
import type { ProjectItem } from "../../content/portfolio"

function ProjectCard({ project }: { project: ProjectItem }) {
  const body = (
    <>
      <div className="project-leaf__media">
        <img src={project.image} alt="" />
      </div>
      <div className="project-leaf__body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
    </>
  )

  if (!project.href) {
    return <article className="project-leaf">{body}</article>
  }

  return (
    <a className="project-leaf" href={project.href} target="_blank" rel="noreferrer">
      {body}
    </a>
  )
}

export function ProjectsSection() {
  const { heading, items } = portfolio.projects

  return (
    <>
      <h2 className="panel-title">{heading}</h2>
      <div className="project-grid">
        {items.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  )
}
