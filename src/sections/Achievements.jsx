import { useCallback, useEffect, useRef, useState } from "react"
import { gsap } from "../animations/gsap"
import { prefersReducedMotion } from "../animations/intro"
import { site } from "../data/site"
import { ArrowLeft, ArrowRight } from "lucide-react"

const AUTOPLAY_MS = 6000

function supportsFinePointer() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false
  return window.matchMedia("(pointer: fine)").matches && window.matchMedia("(hover: hover)").matches
}

export default function Achievements() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const contentRefs = useRef([])
  const progressRef = useRef(null)
  const timerRef = useRef(null)
  const pausedRef = useRef(false)
  const animatingRef = useRef(false)
  const indexRef = useRef(0)

  const entries = site.achievements ?? []
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
      tl.to(parts, { autoAlpha: 0, y: -14, duration: 0.26, ease: "power2.in", stagger: 0.035, overwrite: "auto" })
        .add(() => {
          indexRef.current = wrapped
          setIndex(wrapped)
        })
        .to(parts, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.06, overwrite: "auto" })
      if (progress) {
        tl.to(
          progress,
          { scaleX: (wrapped + 1) / total, duration: 0.5, ease: "power3.out", overwrite: "auto" },
          "-=0.4"
        )
      }
    },
    [total, startAutoplay]
  )

  useEffect(() => {
    goToRef.current = goTo
  }, [goTo])

  const goNext = useCallback(() => goTo(indexRef.current + 1), [goTo])
  const goPrev = useCallback(() => goTo(indexRef.current - 1), [goTo])

  // Section entrance — short stagger, no drama
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const head = section.querySelectorAll("[data-ach-head]")
      const stage = stageRef.current
      const nav = section.querySelector("[data-ach-nav]")
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
  }, [])

  // Autoplay lifecycle
  useEffect(() => {
    startAutoplay()
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [startAutoplay])

  // Pointer micro-interaction — refs + quickTo only, fine pointer, no reduced motion
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || prefersReducedMotion() || !supportsFinePointer()) return
    const year = stage.querySelector("[data-ach-active-year]")
    const title = stage.querySelector("[data-ach-active-title]")
    if (!year || !title) return

    const yearXTo = gsap.quickTo(year, "x", { duration: 0.5, ease: "power3.out" })
    const yearYTo = gsap.quickTo(year, "y", { duration: 0.5, ease: "power3.out" })
    const titleXTo = gsap.quickTo(title, "x", { duration: 0.6, ease: "power3.out" })
    const titleYTo = gsap.quickTo(title, "y", { duration: 0.6, ease: "power3.out" })

    let raf = 0
    let last = null
    const tick = () => {
      raf = 0
      if (!last) return
      const r = stage.getBoundingClientRect()
      const px = (last.clientX - r.left) / r.width - 0.5
      const py = (last.clientY - r.top) / r.height - 0.5
      yearXTo(px * 8)
      yearYTo(py * 6)
      titleXTo(px * -5)
      titleYTo(py * -4)
      stage.style.setProperty("--glow-x", `${((px + 0.5) * 100).toFixed(1)}%`)
      stage.style.setProperty("--glow-y", `${((py + 0.5) * 100).toFixed(1)}%`)
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
      yearXTo(0)
      yearYTo(0)
      titleXTo(0)
      titleYTo(0)
    }
    stage.addEventListener("pointermove", move)
    stage.addEventListener("pointerleave", leave)
    return () => {
      stage.removeEventListener("pointermove", move)
      stage.removeEventListener("pointerleave", leave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [total])

  if (total === 0) return null

  const active = entries[index] ?? entries[0]

  return (
    <section
      id="achievements"
      ref={sectionRef}
      aria-label="Achievements"
      aria-roledescription="carousel"
      className="relative overflow-hidden border-t border-border/60 bg-bg-elevated px-6 py-16 lg:px-8 lg:py-24"
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
          ARCHIVE
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <div data-ach-head className="flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-xs tracking-[0.18em] text-text-faint">06 / ACHIEVEMENTS</span>
            <h3 className="font-heading text-[0.95rem] tracking-[-0.015em] text-text">Selected Milestones</h3>
          </div>
          <p className="hidden text-xs tracking-[0.16em] text-text-faint uppercase sm:block">Archive — interactive</p>
        </div>

        {/* STAGE — one active achievement */}
        <div
          ref={stageRef}
          aria-live="polite"
          className="relative mt-10 grid gap-8 md:grid-cols-[0.85fr_1.35fr_0.7fr] md:gap-10 lg:gap-14"
        >
          {/* pointer glow — position via CSS vars */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 motion-reduce:hidden"
            style={{
              background:
                "radial-gradient(ellipse 420px 260px at var(--glow-x, 50%) var(--glow-y, 40%), rgba(107,123,255,0.08), transparent 65%)",
            }}
          />

          {/* LEFT — large year */}
          <div className="flex flex-col justify-start">
            <p
              ref={assignContent}
              data-ach-active-year
              className="font-heading text-[3.4rem] leading-none tracking-[-0.05em] text-text will-change-transform sm:text-[4.2rem] lg:text-[5rem]"
            >
              {active.year}
            </p>
            <p ref={assignContent} className="font-heading mt-3 text-xs tracking-[0.18em] text-cyan uppercase">
              {active.category}
            </p>
          </div>

          {/* CENTER — title + description */}
          <div className="flex min-w-0 flex-col justify-start">
            <h4
              ref={assignContent}
              data-ach-active-title
              className="font-heading max-w-xl text-[1.7rem] leading-[0.95] tracking-[-0.03em] text-text will-change-transform sm:text-[2.2rem] lg:text-[2.6rem]"
            >
              {active.title}
            </h4>
            <p ref={assignContent} className="mt-4 max-w-xl text-sm leading-6 text-text-muted md:text-[0.95rem]">
              {active.description}
            </p>
          </div>

          {/* RIGHT — result + orbital marker */}
          <div className="flex flex-col items-start justify-start gap-5 md:items-end md:text-right">
            <div ref={assignContent}>
              <p className="text-[0.62rem] tracking-[0.18em] text-text-faint uppercase">Result</p>
              <p className="font-heading mt-2 inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs tracking-[0.12em] text-accent uppercase">
                {active.result}
              </p>
            </div>
            <div aria-hidden="true" className="relative hidden h-16 w-16 md:block motion-reduce:hidden">
              <div className="absolute inset-0 rounded-full border border-border/50" />
              <div className="animate-orbit absolute inset-0">
                <span className="absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/80" />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM — counter, indicators, progress, navigation */}
        <div data-ach-nav className="mt-12 border-t border-border/40 pt-6">
          <div className="flex items-center justify-between gap-6">
            <p className="font-heading text-xs tracking-[0.18em] text-text-faint" aria-live="polite">
              {String(index + 1).padStart(2, "0")} <span className="text-text-faint/50">/ {String(total).padStart(2, "0")}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous achievement"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border/60 bg-bg-soft px-4 py-2 text-xs tracking-[0.12em] text-text-muted uppercase transition hover:border-border-strong hover:text-text focus-visible:outline-offset-4"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="ml-1.5 hidden sm:inline">Prev</span>
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next achievement"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border/60 bg-bg-soft px-4 py-2 text-xs tracking-[0.12em] text-text-muted uppercase transition hover:border-border-strong hover:text-text focus-visible:outline-offset-4"
              >
                <span className="mr-1.5 hidden sm:inline">Next</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Clickable indicators + progress line */}
          <div className="mt-5 flex items-center gap-4" role="tablist" aria-label="Achievements">
            {entries.map((entry, i) => (
              <button
                key={entry.id ?? `${entry.year}-${i}`}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Achievement ${String(i + 1).padStart(2, "0")}: ${entry.title}`}
                onClick={() => goTo(i)}
                className="group flex min-h-[44px] flex-1 items-center gap-3 focus-visible:outline-offset-4"
              >
                <span
                  className={`font-heading text-xs tracking-[0.14em] transition duration-300 ${
                    i === index ? "text-accent" : "text-text-faint/60 group-hover:text-text-muted"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative h-px flex-1 bg-border/40">
                  <span
                    className={`absolute inset-y-0 left-0 h-px transition-all duration-500 ${
                      i < index ? "w-full bg-accent/50" : i === index ? "w-full bg-accent" : "w-0 bg-accent"
                    }`}
                  />
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full transition duration-300 ${
                    i === index ? "bg-accent" : "bg-border-strong group-hover:bg-text-faint"
                  }`}
                />
              </button>
            ))}
          </div>
          {/* Overall progress fill */}
          <div aria-hidden="true" className="mt-3 h-px w-full bg-border/30">
            <div
              ref={progressRef}
              className="h-px origin-left bg-gradient-to-r from-accent to-cyan"
              style={{ transform: `scaleX(${(index + 1) / total})` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
