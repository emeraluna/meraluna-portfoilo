import type { ReactNode } from "react"

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
      {children}
    </svg>
  )
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

function TypeScriptIcon() {
  return (
    <Glyph>
      <rect x="5" y="5" width="22" height="22" rx="4" {...stroke} />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fontFamily="Outfit, sans-serif"
        fontSize="11"
        fontWeight="600"
        fill="currentColor"
        stroke="none"
      >
        TS
      </text>
    </Glyph>
  )
}

function ReactIcon() {
  return (
    <Glyph>
      <circle cx="16" cy="16" r="2.1" fill="currentColor" stroke="none" />
      <ellipse cx="16" cy="16" rx="11" ry="4.2" {...stroke} />
      <ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(60 16 16)" {...stroke} />
      <ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(120 16 16)" {...stroke} />
    </Glyph>
  )
}

function NodeIcon() {
  return (
    <Glyph>
      <path d="M16 5.5 25.2 10.6v10.8L16 26.5 6.8 21.4V10.6Z" {...stroke} />
    </Glyph>
  )
}

function PythonIcon() {
  return (
    <Glyph>
      <path
        d="M12.5 7.5h6.2a4 4 0 0 1 4 4V15H15.2A4.2 4.2 0 0 0 11 19.2V22"
        {...stroke}
      />
      <path
        d="M19.5 24.5h-6.2a4 4 0 0 1-4-4V17H16.8A4.2 4.2 0 0 0 21 12.8V10"
        {...stroke}
      />
      <circle cx="13" cy="11" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="19" cy="21" r="0.9" fill="currentColor" stroke="none" />
    </Glyph>
  )
}

function PostgresIcon() {
  return (
    <Glyph>
      <ellipse cx="16" cy="9" rx="8" ry="3.1" {...stroke} />
      <path d="M8 9v13.2c0 1.7 3.6 3.1 8 3.1s8-1.4 8-3.1V9" {...stroke} />
      <path d="M8 15.2c0 1.7 3.6 3.1 8 3.1s8-1.4 8-3.1" {...stroke} />
    </Glyph>
  )
}

function AwsIcon() {
  return (
    <Glyph>
      <path
        d="M10 22h12.2a4.6 4.6 0 0 0 .6-9.1 6.2 6.2 0 0 0-11.8-1.2A4.5 4.5 0 0 0 10 22Z"
        {...stroke}
      />
    </Glyph>
  )
}

function LlmIcon() {
  return (
    <Glyph>
      <path d="M16 4.5 18.2 13 27 16l-8.8 3L16 27.5 13.8 19 5 16l8.8-3Z" {...stroke} />
    </Glyph>
  )
}

function DockerIcon() {
  return (
    <Glyph>
      <rect x="6" y="15" width="5.5" height="4.5" rx="0.8" {...stroke} />
      <rect x="13" y="15" width="5.5" height="4.5" rx="0.8" {...stroke} />
      <rect x="20" y="15" width="5.5" height="4.5" rx="0.8" {...stroke} />
      <rect x="13" y="9" width="5.5" height="4.5" rx="0.8" {...stroke} />
      <path d="M6 19.5h20" {...stroke} />
    </Glyph>
  )
}

function EmailIcon() {
  return (
    <Glyph>
      <rect x="5" y="8" width="22" height="16" rx="2" {...stroke} />
      <path d="m6 10 10 8 10-8" {...stroke} />
    </Glyph>
  )
}

function WhatsAppIcon() {
  return (
    <Glyph>
      <path
        d="M8.5 24.5 10 20.2A8.2 8.2 0 1 1 12.2 22Z"
        {...stroke}
      />
      <path
        d="M13 13.2c.3 1.4 1.6 2.6 3 3l.8-1.1 1.6.4-.3 1.6c-2.2-.2-4.6-2.2-5.6-4.4l1.5-.4.4-1.5Z"
        {...stroke}
      />
    </Glyph>
  )
}

function LinkedInIcon() {
  return (
    <Glyph>
      <rect x="6" y="6" width="20" height="20" rx="3" {...stroke} />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fontFamily="Outfit, sans-serif"
        fontSize="11"
        fontWeight="600"
        fill="currentColor"
        stroke="none"
      >
        in
      </text>
    </Glyph>
  )
}

function GitHubIcon() {
  return (
    <Glyph>
      <path
        d="M16 6.5a8 8 0 0 0-2.5 15.6v-2.2c-2.2.4-2.7-1-2.7-1-.4-.9-1-1.2-1-1.2-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .6-1.2-1.8-.2-3.6-.9-3.6-3.9 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.6 7.6 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.5 1.1.2 1.9.1 2.1.5.5.8 1.2.8 2.1 0 3-1.9 3.7-3.7 3.9.3.3.6.8.6 1.6v2.4A8 8 0 0 0 16 6.5Z"
        {...stroke}
      />
    </Glyph>
  )
}

function LeafGlyph() {
  return (
    <Glyph>
      <path
        d="M16 27C16 18 10 12 6 8c8 1 14 6 16 14 2-8 8-13 14-14-4 4-10 10-10 19"
        {...stroke}
      />
    </Glyph>
  )
}

const skillIcons: Record<string, () => ReactNode> = {
  typescript: () => <TypeScriptIcon />,
  react: () => <ReactIcon />,
  node: () => <NodeIcon />,
  python: () => <PythonIcon />,
  postgres: () => <PostgresIcon />,
  aws: () => <AwsIcon />,
  llm: () => <LlmIcon />,
  docker: () => <DockerIcon />,
}

const platformIcons: Record<string, () => ReactNode> = {
  email: () => <EmailIcon />,
  whatsapp: () => <WhatsAppIcon />,
  linkedin: () => <LinkedInIcon />,
  github: () => <GitHubIcon />,
}

export function SkillIcon({ name }: { name: string }) {
  const draw = skillIcons[name] ?? (() => <LeafGlyph />)
  return draw()
}

export function PlatformIcon({ name }: { name: string }) {
  const draw = platformIcons[name] ?? (() => <LeafGlyph />)
  return draw()
}
