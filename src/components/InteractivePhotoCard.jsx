import { useEffect, useRef } from "react"
import { gsap } from "../animations/gsap"
import { prefersReducedMotion } from "../animations/intro"

const PROXIMITY = 170
const MAX_TILT = 5
const MAX_MAGNET = 8
const MAX_IMG_SHIFT = 5

function supportsFinePointer() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false
  return window.matchMedia("(pointer: fine)").matches && window.matchMedia("(hover: hover)").matches
}

/**
 * Magnetic photo card — layered pointer interaction, refs + quickTo only.
 * - Proximity magnetic pull (±8px), 3D tilt (±5deg) when inside
 * - Cursor spotlight via CSS vars, image parallax opposite (±5px)
 * - Border glow response, ambient orbital detail
 * - ScrollTrigger mask entrance; static fallback on touch / reduced motion
 */
export default function InteractivePhotoCard({ image, alt = "", className = "" }) {
  const rootRef = useRef(null)
  const cardRef = useRef(null)
  const imgRef = useRef(null)
  const glowRef = useRef(null)
  const spotRef = useRef(null)
  const activeRef = useRef(false)

  useEffect(() => {
    const root = rootRef.current
    const card = cardRef.current
    const img = imgRef.current
    const glow = glowRef.current
    const spot = spotRef.current
    if (!root || !card || !img) return

    // Static fallback — content stays fully visible, no interaction
    if (prefersReducedMotion() || !supportsFinePointer()) return

    gsap.set(card, { autoAlpha: 0, y: 40 })
    gsap.set(card, { clipPath: "inset(8% 6% 8% 6% round 18px)" })
    gsap.set(img, { scale: 1.18 })

    const rotXTo = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" })
    const rotYTo = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" })
    const posXTo = gsap.quickTo(card, "x", { duration: 0.4, ease: "power3.out" })
    const posYTo = gsap.quickTo(card, "y", { duration: 0.4, ease: "power3.out" })
    const imgXTo = gsap.quickTo(img, "x", { duration: 0.6, ease: "power3.out" })
    const imgYTo = gsap.quickTo(img, "y", { duration: 0.6, ease: "power3.out" })
    const glowTo = glow ? gsap.quickTo(glow, "opacity", { duration: 0.3, ease: "power2.out" }) : null
    const spotTo = spot ? gsap.quickTo(spot, "opacity", { duration: 0.3, ease: "power2.out" }) : null

    let engaged = false
    let raf = 0
    let lastEvent = null

    const resetAll = () => {
      rotXTo(0)
      rotYTo(0)
      posXTo(0)
      posYTo(0)
      imgXTo(0)
      imgYTo(0)
      if (glowTo) glowTo(0)
      if (spotTo) spotTo(0)
    }

    const tick = () => {
      raf = 0
      const e = lastEvent
      if (!e || !activeRef.current) return

      const r = card.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      const maxDist = Math.hypot(r.width, r.height) / 2 + PROXIMITY

      if (dist > maxDist) {
        if (engaged) {
          engaged = false
          resetAll()
        }
        return
      }
      engaged = true

      const t = 1 - dist / maxDist
      const nx = dist > 0 ? dx / dist : 0
      const ny = dist > 0 ? dy / dist : 0
      posXTo(nx * t * MAX_MAGNET)
      posYTo(ny * t * MAX_MAGNET)

      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom

      if (inside) {
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        rotYTo((px - 0.5) * 2 * MAX_TILT)
        rotXTo(-(py - 0.5) * 2 * MAX_TILT)
        imgXTo(-(px - 0.5) * 2 * MAX_IMG_SHIFT)
        imgYTo(-(py - 0.5) * 2 * MAX_IMG_SHIFT)
        card.style.setProperty("--mouse-x", `${(px * 100).toFixed(1)}%`)
        card.style.setProperty("--mouse-y", `${(py * 100).toFixed(1)}%`)
        if (glowTo) glowTo(1)
        if (spotTo) spotTo(1)
      } else {
        rotXTo(0)
        rotYTo(0)
        imgXTo(0)
        imgYTo(0)
        if (glowTo) glowTo(t * 0.6)
        if (spotTo) spotTo(0)
      }
    }

    const onMove = (e) => {
      lastEvent = e
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onLeave = () => {
      engaged = false
      lastEvent = null
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
      resetAll()
    }

    // Scrolling with a stationary pointer would leave a stale offset — settle home
    const onScroll = () => {
      if (engaged) {
        engaged = false
        resetAll()
      }
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 82%", invalidateOnRefresh: true },
        onComplete: () => {
          activeRef.current = true
        },
      })
      tl.to(card, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0)
        .to(card, { clipPath: "inset(0% 0% 0% 0% round 18px)", duration: 0.9, ease: "power3.out" }, 0)
        .to(img, { scale: 1.08, duration: 1, ease: "power3.out" }, 0)
    }, root)

    window.addEventListener("pointermove", onMove, { passive: true })
    root.addEventListener("pointerleave", onLeave)
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      activeRef.current = false
      window.removeEventListener("pointermove", onMove)
      root.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
      ctx.revert()
    }
  }, [])

  return (
    <div ref={rootRef} className={`relative [perspective:1000px] ${className}`}>
      <div
        ref={cardRef}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <img
          ref={imgRef}
          src={image}
          alt={alt}
          width={640}
          height={800}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-full w-full scale-[1.08] object-cover object-top grayscale will-change-transform"
        />
        {/* cool tone + glow — monochrome treatment */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-accent/10 mix-blend-overlay" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 320px 240px at 70% 20%, rgba(34,211,238,0.10), transparent 65%)" }}
        />
        {/* cursor spotlight — position driven by CSS vars, no re-renders */}
        <div
          ref={spotRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{
            background:
              "radial-gradient(circle 240px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(107,123,255,0.16), rgba(34,211,238,0.05) 42%, transparent 65%)",
          }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 ring-1 ring-white/[0.06] ring-inset" />
        {/* border + depth response */}
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[18px] border border-accent/40 opacity-0 shadow-[0_20px_60px_-16px_rgba(107,123,255,0.35)]"
        />
      </div>
      {/* ambient orbital detail */}
      <div aria-hidden="true" className="absolute -top-6 -right-4 hidden h-20 w-20 sm:block motion-reduce:hidden">
        <div className="absolute inset-0 rounded-full border border-border/40" />
        <div className="animate-orbit absolute inset-0">
          <span className="absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/80" />
        </div>
      </div>
    </div>
  )
}
