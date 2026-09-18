import { useCallback, useEffect, useRef, useState } from "react"
import { gsap } from "../animations/gsap"
import { prefersReducedMotion } from "../animations/intro"
import { site } from "../data/site"

const AUTOPLAY_MS = 5000

function supportsFinePointer() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false
  return window.matchMedia("(pointer: fine)").matches && window.matchMedia("(hover: hover)").matches
}

export default function Strengths() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const contentRefs = useRef([])
  const progressRef = useRef(null)
  const timerRef = useRef(null)
  const pausedRef = useRef(false)
  const animatingRef = useRef(false)
  const indexRef = useRef(0)

  const entries = site.strengths ?? []
  const total = entries.length
  const [index, setIndex] = useState(0)

  const assignContent = (el) => {
    if (el && !contentRefs.current.includes(el)) contentRefs.current.push(el)
  }

  // Interval-safe indirection — always calls the latest navigator
  const goToRef = useRef((_next) => {})

  const startAutoplay = useCallback(() => {
    if (prefersReducedMotion() || total <= 1) return
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = window.setInterval(() => {
      if (pausedRef.current || document.hidden || animatingRef.current) return
      goToRef.current(indexRef.current + 1)
    }, AUTOPLAY_MS)
  }, [total])

  const goTo = useCallback(
    (next) => {
      if (total === 0) return
      const wrapped = ((next % total) + total) % total
      if (wrapped === indexRef.current || animatingRef.current) return

      // Restart autoplay on manual navigation
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
      startAutoplay()

      if (prefersReducedMotion()) {
        indexRef.current = wrapped
        setIndex(wrapped)
        return
      }

      animatingRef.current = true
      const parts = contentRefs.current.filter(Boolean)
      const progress = progressRef.current
      const tl = gsap.timeline({
        onComplete: () => {
          animatingRef.current = false
        },
      })
      tl.to(parts, { autoAlpha: 0, y: -12, duration: 0.24, ease: "power2.in", stagger: 0.03, overwrite: "auto" })
        .add(() => {
          indexRef.current = wrapped
          setIndex(wrapped)
        })
        .to(parts, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out", stagger: 0.055, overwrite: "auto" })
      if (progress) {
        tl.to(
          progress,
          { scaleX: (wrapped + 1) / total, duration: 0.5, ease: "power3.out", overwrite: "auto" },
          "-=0.35"
        )
      }
    },
    [total, startAutoplay]
  )

  useEffect(() => {
    goToRef.current = goTo
  }, [goTo])

  // Section entrance — short stagger, no drama
  useEffect(() => {
    const section = sectionRef.current
    if (!section || total === 0) return
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const head = section.querySelectorAll("[data-str-head]")
      const stage = stageRef.current
      const nav = section.querySelector("[data-str-nav]")
      if (head.length) gsap.set(head, { autoAlpha: 0, y: 18 })
      if (stage) gsap.set(stage, { autoAlpha: 0, y: 24 })
      if (nav) gsap.set(nav, { autoAlpha: 0, y: 14 })
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 80%", invalidateOnRefresh: true },
      })
      if (head.length) tl.to(head, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }, 0)
      if (stage) tl.to(stage, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.15)
      if (nav) tl.to(nav, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.3)
    }, sectionRef)
    return () => ctx.revert()
  }, [total])

  // Autoplay lifecycle
  useEffect(() => {
    startAutoplay()
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [startAutoplay])

  // Pointer micro-interaction — active title drifts 2-4px toward pointer
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || total === 0 || prefersReducedMotion() || !supportsFinePointer()) return
    const title = stage.querySelector("[data-str-active-title]")
    if (!title) return

    const xTo = gsap.quickTo(title, "x", { duration: 0.5, ease: "power3.out" })
    const yTo = gsap.quickTo(title, "y", { duration: 0.5, ease: "power3.out" })
    let raf = 0
    let last = null
    const tick = () => {
      raf = 0
      if (!last) return
      const r = stage.getBoundingClientRect()
      xTo(((last.clientX - r.left) / r.width - 0.5) * 7)
      yTo(((last.clientY - r.top) / r.height - 0.5) * 5)
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
    }
    stage.addEventListener("pointermove", move)
    stage.addEventListener("pointerleave", leave)
    return () => {
      stage.removeEventListener("pointermove", move)
      stage.removeEventListener("pointerleave", leave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [total, index])

  if (total === 0) return null

  const active = entries[index] ?? entries[0]

  return (
    <section
      id="strengths"
      ref={sectionRef}
      aria-label="Strengths"
      className="relative overflow-hidden border-t border-border/60 bg-bg px-6 py-16 lg:px-8 lg:py-24"
      onPointerEnter={() => {
        pausedRef.current = true
      }}
      onPointerLeave={() => {
        pausedRef.current = false
      }}
    >
      {/* Background word — depth layer only */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-10 overflow-hidden select-none motion-reduce:hidden">
        <p
          className="font-heading text-center text-[20vw] leading-none font-bold tracking-[-0.04em] whitespace-nowrap text-transparent opacity-50 md:text-[13vw]"
          style={{ WebkitTextStroke: "1px rgba(138,148,176,0.12)" }}
        >
          STRENGTH
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <div data-str-head className="flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-xs tracking-[0.18em] text-text-faint">05 / STRENGTHS</span>
            <h3 className="font-heading text-[0.95rem] tracking-[-0.015em] text-text">What I Bring</h3>
          </div>
          <p className="hidden text-xs tracking-[0.16em] text-text-faint uppercase sm:block">Interactive — one focus</p>
        </div>

        {/* STAGE — one dominant strength */}
        <div ref={stageRef} aria-live="polite" className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
          <div className="min-w-0">
            <p ref={assignContent} className="font-heading text-xs tracking-[0.18em] text-cyan uppercase">
              {String(index + 1).padStart(2, "0")} — Focus
            </p>
            <h4
              ref={assignContent}
              data-str-active-title
              className="font-heading mt-3 text-[2.6rem] leading-[0.9] font-bold tracking-[-0.04em] break-words text-text will-change-transform sm:text-[3.4rem] lg:text-[4.2rem]"
            >
              {(active.label ?? active.title ?? "").toUpperCase()}
            </h4>
            <div
              ref={assignContent}
              aria-hidden="true"
              className="mt-5 h-px w-24 origin-left bg-accent/60"
            />
          </div>
          <div className="flex min-w-0 flex-col justify-end gap-4">
            <p ref={assignContent} className="max-w-md text-sm leading-6 text-text-muted md:text-[0.95rem]">
              {active.description}
            </p>
            {active.detail ? (
              <div ref={assignContent}>
                <p className="text-[0.62rem] tracking-[0.18em] text-text-faint uppercase">Approach</p>
                <p className="mt-1.5 max-w-md text-sm leading-6 text-text-faint">{active.detail}</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* NAV — all strengths, hover or tap to activate */}
        <div data-str-nav className="mt-12 border-t border-border/40">
          {entries.map((entry, i) => (
            <button
              key={entry.id ?? `${entry.title}-${i}`}
              type="button"
              onClick={() => goTo(i)}
              onPointerEnter={() => goTo(i)}
              onFocus={() => goTo(i)}
              aria-label={`Show strength: ${entry.title}`}
              aria-current={i === index}
              className="group flex min-h-[48px] w-full items-baseline gap-4 border-b border-border/30 py-4 text-left focus-visible:outline-offset-4 md:gap-6"
            >
              <span
                className={`font-heading shrink-0 text-xs tracking-[0.18em] transition duration-300 ${
                  i === index ? "text-accent" : "text-text-faint/60 group-hover:text-text-muted"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`font-heading tracking-[-0.02em] transition-all duration-300 ${
                  i === index
                    ? "translate-x-[4px] text-[1.25rem] text-text md:text-[1.5rem]"
                    : "text-[1.05rem] text-text-faint/60 group-hover:translate-x-[2px] group-hover:text-text-muted md:text-[1.2rem]"
                }`}
              >
                {(entry.label ?? entry.title ?? "").toUpperCase()}
              </span>
            </button>
          ))}
        </div>

        {/* Counter + progress (navigation, not skill rating) */}
        <div className="mt-6 flex items-center gap-4">
          <p className="font-heading shrink-0 text-xs tracking-[0.18em] text-text-faint" aria-live="polite">
            {String(index + 1).padStart(2, "0")} <span className="text-text-faint/50">/ {String(total).padStart(2, "0")}</span>
          </p>
          <div aria-hidden="true" className="h-px flex-1 bg-border/30">
            <div
              ref={progressRef}
              className="h-px origin-left bg-gradient-to-r from-accent to-cyan"
              style={{ transform: `scaleX(${(index + 1) / total})` }}
            />
          </div>
        </div>

        {/* Trait strip — visual summary, not navigation */}
        <div aria-hidden="true" className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 select-none">
          {entries.map((entry, i) => (
            <span key={`trait-${entry.id ?? i}`} className="flex items-center gap-5">
              <span
                className={`font-heading text-xs tracking-[0.22em] uppercase transition duration-300 ${
                  i === index ? "text-text" : "text-text-faint/50"
                }`}
              >
                {(entry.label ?? entry.title ?? "").toUpperCase()}
              </span>
              {i < entries.length - 1 ? <span className="h-3 w-px bg-border/60" /> : null}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
