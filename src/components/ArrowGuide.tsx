import { forwardRef } from "react"

export const ArrowGuide = forwardRef<HTMLDivElement, { gone: boolean }>(function ArrowGuide(
  { gone },
  ref,
) {
  return (
    <div ref={ref} className={gone ? "arrow is-gone" : "arrow"} aria-hidden="true">
      <div className="arrow__pulse">
        <svg className="arrow__glyph" viewBox="0 0 86 28" width="86" height="28">
          <path d="M4 14H66" />
          <path d="M56 5.5 74 14 56 22.5" />
        </svg>
      </div>
    </div>
  )
})
