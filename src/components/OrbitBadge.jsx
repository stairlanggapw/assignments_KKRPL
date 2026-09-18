import { useEffect, useRef } from "react"
import { gsap } from "../animations/gsap"
import { prefersReducedMotion } from "../animations/intro"

function supportsFinePointer() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false
  return window.matchMedia("(pointer: fine)").matches && window.matchMedia("(hover: hover)").matches
}

/**
 * Small orbital data marker — shared visual motif for text-heavy sections.
 * - Counter-rotating rings (CSS, transform-only) with orbiting dots
 * - Center monogram + cycling support word (GSAP fade, factual words only)
 * - Optional `caption` static label when no cycling words are given
 * - Optional `interactive` proximity response: center drifts toward the
 *   pointer (±2px), accent glow appears, dots brighten — refs + quickTo only
 * - Decorative: aria-hidden, hidden under reduced motion
 */
export default function OrbitBadge({ words = [], center = "●", caption = "", interactive = false }) {
  const wordRef = useRef(null)
  const badgeRef = useRef(null)
  const centerRef = useRef(null)
  const glowRef = useRef(null)
  const dotRefs = useRef([])

  useEffect(() => {
    const el = wordRef.current
    if (!el || words.length === 0) return
    el.textContent = words[0]
    if (prefersReducedMotion() || words.length < 2) return

    let i = 0
    let alive = true
    const cycle = () => {
      if (!alive) return
      i = (i + 1) % words.length
      gsap
        .timeline()
        .to(el, { autoAlpha: 0, y: -6, duration: 0.32, ease: "power2.in", overwrite: "auto" })
        .add(() => {
          if (alive) el.textContent = words[i]
        })
        .to(el, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out", overwrite: "auto" })
    }
    const id = window.setInterval(cycle, 2600)
    return () => {
      alive = false
      window.clearInterval(id)
      gsap.killTweensOf(el)
    }
    // words are static per usage — join keeps the effect stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words.join("|")])

  // Proximity interaction — center drifts toward pointer, glow breathes in
  useEffect(() => {
    if (!interactive) return
    const badge = badgeRef.current
    const core = centerRef.current
    const glow = glowRef.current
    if (!badge || !core) return
    if (prefersReducedMotion() || !supportsFinePointer()) return

    const xTo = gsap.quickTo(core, "x", { duration: 0.4, ease: "power3.out" })
    const yTo = gsap.quickTo(core, "y", { duration: 0.4, ease: "power3.out" })
    const glowTo = glow ? gsap.quickTo(glow, "opacity", { duration: 0.35, ease: "power2.out" }) : null
    const dots = dotRefs.current.filter(Boolean)
    const dotTo = dots.length
      ? (v) => dots.forEach((d) => gsap.to(d, { opacity: v, duration: 0.3, overwrite: "auto" }))
      : null

    const RADIUS = 220
    let raf = 0
    let last = null

    const tick = () => {
      raf = 0
      if (!last) return
      const r = badge.getBoundingClientRect()
      const dx = last.clientX - (r.left + r.width / 2)
      const dy = last.clientY - (r.top + r.height / 2)
      const dist = Math.hypot(dx, dy)
      if (dist > RADIUS) {
        xTo(0)
        yTo(0)
        if (glowTo) glowTo(0)
        if (dotTo) dotTo(0.55)
        return
      }
      const t = 1 - dist / RADIUS
      xTo(dist > 0 ? (dx / dist) * t * 2 : 0)
      yTo(dist > 0 ? (dy / dist) * t * 2 : 0)
      if (glowTo) glowTo(t * 0.9)
      if (dotTo) dotTo(0.55 + t * 0.45)
    }

    const move = (e) => {
      last = e
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const leave = () => {
      last = null
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
      xTo(0)
      yTo(0)
      if (glowTo) glowTo(0)
      if (dotTo) dotTo(0.55)
    }

    window.addEventListener("pointermove", move, { passive: true })
    document.documentElement.addEventListener("pointerleave", leave)
    return () => {
      window.removeEventListener("pointermove", move)
      document.documentElement.removeEventListener("pointerleave", leave)
      if (raf) cancelAnimationFrame(raf)
      gsap.killTweensOf(core)
      if (glow) gsap.killTweensOf(glow)
    }
  }, [interactive])

  if (words.length === 0 && !caption) return null

  const assignDot = (el) => {
    if (el && !dotRefs.current.includes(el)) dotRefs.current.push(el)
  }

  return (
    <div
      ref={badgeRef}
      aria-hidden="true"
      className="pointer-events-none flex flex-col items-center gap-3 select-none motion-reduce:hidden"
    >
      <div className="relative h-28 w-28">
        <div className="absolute inset-0 rounded-full border border-border/60" />
        {/* proximity glow */}
        <div
          ref={glowRef}
          className="absolute -inset-4 rounded-full opacity-0"
          style={{ background: "radial-gradient(circle, rgba(107,123,255,0.14), transparent 70%)" }}
        />
        <div className="animate-orbit absolute inset-0">
          <span ref={assignDot} className="absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan opacity-55" />
        </div>
        <div className="animate-orbit-rev absolute inset-3 rounded-full border border-dashed border-border/40">
          <span ref={assignDot} className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent opacity-55" />
        </div>
        <span
          ref={centerRef}
          className="font-heading absolute inset-0 flex items-center justify-center text-sm font-bold tracking-tight text-text will-change-transform"
        >
          {center}
        </span>
      </div>
      {words.length > 0 ? (
        <p ref={wordRef} className="h-4 text-[0.62rem] tracking-[0.22em] text-text-faint uppercase" />
      ) : (
        <p className="h-4 text-[0.62rem] tracking-[0.22em] text-text-faint uppercase">{caption}</p>
      )}
    </div>
  )
}
