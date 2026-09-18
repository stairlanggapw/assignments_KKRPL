import { useEffect, useRef, useMemo } from "react"
import { createMaskController } from "../animations/imageMask"
import heroPrimary from "../assets/images/hero.png"
import photo1 from "../assets/images/Photo1.png"
import photo2 from "../assets/images/photo2.png"

// Hero uses photos from src/assets/images — secondary prefers photo2, then hero-secondary
const secondaryModules = import.meta.glob("../assets/images/hero-secondary.png", {
  eager: true,
  query: "?url",
  import: "default",
})

function resolveSecondary() {
  // Prefer hero-secondary.png if exists, otherwise use photo2.png from assets
  const keys = Object.keys(secondaryModules)
  if (keys.length) {
    const val = secondaryModules[keys[0]]
    if (typeof val === "string" && val.length) return val
  }
  // Fallback to assets photo — ensures assets/images is used for hero
  return photo2 || null
}

function resolvePrimary() {
  // Prefer Photo1.png (higher-res portrait) if available, fallback to hero.png
  // This ensures assets/images photos are used for hero section
  return photo1 || heroPrimary
}

export default function DualImageMask() {
  const containerRef = useRef(null)
  const overlayRef = useRef(null)

  const primarySrc = useMemo(() => resolvePrimary(), [])
  const secondarySrc = useMemo(() => resolveSecondary(), [])

  useEffect(() => {
    const container = containerRef.current
    const overlay = overlayRef.current
    if (!container || !overlay) return
    if (!secondarySrc) {
      // No secondary available — keep overlay hidden, no mask interaction
      overlay.style.display = "none"
      return
    }
    overlay.style.display = ""
    const cleanup = createMaskController(container, overlay)
    return cleanup
  }, [secondarySrc])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ touchAction: "pan-y" }}
    >
      <img
        src={primarySrc}
        alt="Portrait of Stefanus Airlangga"
        width={640}
        height={760}
        decoding="async"
        loading="eager"
        fetchPriority="high"
        className="h-auto w-full object-cover"
        style={{ aspectRatio: "640 / 760" }}
        draggable={false}
      />

      {/* Secondary — revealed only through circular mask */}
      {secondarySrc ? (
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{
            clipPath: "circle(0px at 50% 50%)",
            WebkitClipPath: "circle(0px at 50% 50%)",
          }}
        >
          <img
            src={secondarySrc}
            alt=""
            width={640}
            height={760}
            decoding="async"
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ aspectRatio: "640 / 760" }}
            draggable={false}
            onError={(e) => {
              const parent = e.currentTarget.parentElement
              if (parent) parent.style.display = "none"
            }}
          />
        </div>
      ) : (
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden overflow-hidden"
          style={{
            clipPath: "circle(0px at 50% 50%)",
            WebkitClipPath: "circle(0px at 50% 50%)",
          }}
        />
      )}
    </div>
  )
}
