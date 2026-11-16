import { portfolio } from "../../content/portfolio"

export function ExperienceSection() {
  const { heading, items } = portfolio.experience

  return (
    <>
      <h2 className="panel-title">{heading}</h2>
      <ol className="exp-list">
        {items.map((item) => (
          <li key={item.id} className="exp-leaf">
            <img className="exp-avatar" src={item.avatar} alt="" />
            <div className="exp-leaf__body">
              <h3>{item.role}</h3>
              <p className="exp-meta">
                {item.org}
                <span aria-hidden="true"> · </span>
                {item.period}
              </p>
              <p>{item.summary}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  )
}
