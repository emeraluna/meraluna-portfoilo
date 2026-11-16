import { portfolio } from "../../content/portfolio"

export function AboutSection() {
  const { heading, paragraphs } = portfolio.about

  return (
    <>
      <h2 className="panel-title">{heading}</h2>
      <div className="about">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </>
  )
}
