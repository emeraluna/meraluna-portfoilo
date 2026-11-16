import { portfolio } from "../content/portfolio"
import { usePlant } from "../state/PlantContext"

export function Hero() {
  const { stage, section, showContact } = usePlant()

  return (
    <header className="hero">
      <h1 className="hero__title">
        {portfolio.hero.map((line, index) => (
          <span key={line} className={index === 0 ? "hero__lead" : "hero__aside"}>
            {line}
          </span>
        ))}
      </h1>
      {stage >= 5 ? (
        <button
          type="button"
          className="invitation"
          onClick={showContact}
          aria-current={section === "contact" ? "true" : undefined}
        >
          {portfolio.invitation}
        </button>
      ) : null}
    </header>
  )
}
