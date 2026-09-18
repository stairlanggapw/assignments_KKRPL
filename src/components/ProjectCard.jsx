import { useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { gsap } from "../animations/gsap"
import { prefersReducedMotion } from "../animations/intro"

function supportsFinePointer() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false
  return window.matchMedia("(pointer: fine)").matches && window.matchMedia("(hover: hover)").matches
}

/**
 * Project card with cursor-following border light.
 * - One small accent segment travels the card perimeter, positioned from
 *   per-card pointer coordinates stored in CSS vars (--mx/--my).
 * - Only the hovered card reacts: listeners live on the card itself,
 *   coordinates are card-relative, no React state, no global listeners.
 * - Content, layout, typography and existing hover behavior are unchanged.
 * - Touch / reduced-motion: static border only, beam hidden.
 */
export default function ProjectCard({ project: p, index: idx, articleRef }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card || prefersReducedMotion() || !supportsFinePointer()) return

    // Per-card interpolators — created once, reused on every move.
    // No new tween per event, no React state, no global listeners.
    const mxTo = gsap.quickTo(card, "--mx", { duration: 0.28, ease: "power3.out" })
    const myTo = gsap.quickTo(card, "--my", { duration: 0.28, ease: "power3.out" })

    let raf = 0
    let last = null

    const tick = () => {
      raf = 0
      if (!last) return
      const r = card.getBoundingClientRect()
      mxTo(`${(last.clientX - r.left).toFixed(1)}px`)
      myTo(`${(last.clientY - r.top).toFixed(1)}px`)
    }

    // Snap vars to the entry point so interpolation starts from the cursor,
    // then every move glides behind it with a short premium trail.
    const enter = (e) => {
      const r = card.getBoundingClientRect()
      card.style.setProperty("--mx", `${e.clientX - r.left}px`)
      card.style.setProperty("--my", `${e.clientY - r.top}px`)
      last = e
      if (!raf) raf = requestAnimationFrame(tick)
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
    }

    card.addEventListener("pointerenter", enter)
    card.addEventListener("pointermove", move)
    card.addEventListener("pointerleave", leave)
    return () => {
      card.removeEventListener("pointerenter", enter)
      card.removeEventListener("pointermove", move)
      card.removeEventListener("pointerleave", leave)
      if (raf) cancelAnimationFrame(raf)
      gsap.killTweensOf(card)
    }
  }, [])

  const setRefs = (el) => {
    cardRef.current = el
    if (articleRef) articleRef(el)
  }

  return (
    <article
      key={`${p.title}-${idx}`}
      ref={setRefs}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/30 bg-bg-soft will-change-transform transition hover:border-border/50 motion-reduce:hover:border-accent/60"
    >
      {/* Traveling light border — decorative ring segment following the pointer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl p-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:hidden bg-[radial-gradient(140px_circle_at_var(--mx,50%)_var(--my,50%),rgba(107,123,255,0.9),rgba(34,211,238,0.35)_42%,transparent_70%)] [-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [-webkit-mask-composite:xor] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"
      />
      <div className="relative aspect-[16/10] overflow-hidden bg-bg">
        {p.image ? (
          <img
            src={p.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-bg">
            <span className="text-xs tracking-[0.12em] text-text-faint uppercase">No preview</span>
          </div>
        )}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 ring-1 ring-white/[0.04]" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="font-heading min-w-0 flex-1 truncate text-[1.05rem] leading-tight tracking-[-0.015em] text-text">
            {p.title}
          </h4>
          <span className="shrink-0 font-heading text-xs tracking-[0.12em] text-text-faint uppercase">
            {p.year ?? String(idx + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="mt-3">
          {p.links?.demo || p.links?.repo ? (
            <a
              href={p.links.demo ?? p.links.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-bg px-4 py-2 text-xs tracking-[0.08em] text-text uppercase transition hover:border-border-strong hover:bg-bg-soft/40"
            >
              View Project <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="inline-flex rounded-full border border-border/30 bg-bg px-4 py-2 text-xs tracking-[0.08em] text-text-faint uppercase">
              View
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
