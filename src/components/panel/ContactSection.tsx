import { useState } from "react"
import type { FormEvent } from "react"
import { portfolio } from "../../content/portfolio"
import { PlatformIcon } from "../icons"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ContactSection() {
  const { heading, fields, recipient, sendLabel, sentNote, platforms } = portfolio.contact
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.id, ""])),
  )
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const email = values.email?.trim() ?? ""
    const name = values.name?.trim() ?? ""
    const message = values.message?.trim() ?? ""

    if (!emailPattern.test(email)) {
      setError("Enter a valid email.")
      setSent(false)
      return
    }
    if (!name || !message) {
      setError("Please fill in every field.")
      setSent(false)
      return
    }

    const href = `mailto:${recipient}?subject=${encodeURIComponent(`Hello from ${name}`)}&body=${encodeURIComponent(`${message}\n\n— ${name}\n${email}`)}`
    setError("")
    setSent(true)
    window.location.href = href
  }

  return (
    <>
      <h2 className="panel-title">{heading}</h2>
      <form className="contact-form" onSubmit={onSubmit} noValidate>
        {fields.map((field) => (
          <label key={field.id} className="field-label">
            <span className="sr-only">{field.label}</span>
            {field.type === "textarea" ? (
              <textarea
                className="field"
                name={field.id}
                placeholder={field.label}
                autoComplete={field.autoComplete}
                value={values[field.id] ?? ""}
                rows={5}
                onChange={(event) => {
                  setValues((current) => ({ ...current, [field.id]: event.target.value }))
                  setSent(false)
                }}
              />
            ) : (
              <input
                className="field"
                type={field.type}
                name={field.id}
                placeholder={field.label}
                autoComplete={field.autoComplete}
                value={values[field.id] ?? ""}
                onChange={(event) => {
                  setValues((current) => ({ ...current, [field.id]: event.target.value }))
                  setSent(false)
                }}
              />
            )}
          </label>
        ))}
        {error ? <p className="form-error">{error}</p> : null}
        <button className="send" type="submit">
          {sendLabel}
        </button>
        {sent ? <p className="form-note">{sentNote}</p> : null}
      </form>
      <ul className="platforms">
        {platforms.map((platform) => {
          const external = platform.href.startsWith("http")
          return (
            <li key={platform.id}>
              <a
                className="platform-leaf"
                href={platform.href}
                aria-label={platform.name}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                <PlatformIcon name={platform.icon} />
                <span>{platform.name}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </>
  )
}
