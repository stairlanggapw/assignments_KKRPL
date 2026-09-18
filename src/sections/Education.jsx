import { useEffect, useRef } from "react"
import { gsap, ScrollTrigger } from "../animations/gsap"
import { prefersReducedMotion } from "../animations/intro"
import { createEducationTimeline } from "../animations/educationTimeline"
import { site } from "../data/site"

export default function Education() {
  const sectionRef = useRef(null)
  const itemsRef = useRef([])
  const timelineRef = useRef(null)

  useEffect(() => {
    const items = itemsRef.current.filter(Boolean)
    const timeline = timelineRef.current
    if (prefersReducedMotion()) {
      if (items.length) {
        gsap.set(items, { clearProps: "all" })
        gsap.set(items.map((el) => el.querySelectorAll("[data-edu-year],[data-edu-content]")).flat(), {
          clearProps: "all",
        })
      }
      return
    }

    // Single loading rail — ONE ScrollTrigger maps traversal → progress.
    // Node states derive from that same value (see educationTimeline.js).
    const destroyRail = createEducationTimeline({ timeline })

    const ctx = gsap.context(() => {
      items.forEach((item) => {
        // Active-row highlight while the row is in focus (secondary effect)
        ScrollTrigger.create({
          trigger: item,
          start: "top 68%",
          end: "bottom 42%",
          toggleClass: { targets: item, className: "is-active" },
        })

        const year = item.querySelector("[data-edu-year]")
        const contents = item.querySelectorAll("[data-edu-content]")
        const line = item.querySelector("[data-edu-line]")
        gsap.set(year, { autoAlpha: 0, y: 14 })
        if (contents.length) gsap.set(contents, { autoAlpha: 0, y: 12 })
        if (line) gsap.set(line, { scaleY: 0 })
        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: "top 86%", invalidateOnRefresh: true },
        })
        if (line) tl.to(line, { scaleY: 1, duration: 0.5, ease: "power2.out", transformOrigin: "top center" })
        tl.to(year, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, line ? "-=0.25" : 0)
        if (contents.length) tl.to(contents, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.07 }, "-=0.4")
        if (year) {
          gsap.to(year, {
            y: -6,
            ease: "none",
            scrollTrigger: { trigger: item, start: "top 75%", end: "bottom 30%", scrub: 0.5, invalidateOnRefresh: true },
          })
        }
      })
    }, sectionRef)

    // Re-measure after the overlap pins settle (child effects run first)
    const raf = requestAnimationFrame(() => {
      try {
        window.dispatchEvent(new Event("scroll:refresh"))
      } catch {}
    })
    return () => {
      cancelAnimationFrame(raf)
      destroyRail()
      ctx.revert()
    }
  }, [])

  const assignItem = (el) => {
    if (el && !itemsRef.current.includes(el)) itemsRef.current.push(el)
  }

  const entries = site.education ?? []

  return (
    <section
      id="education"
      ref={sectionRef}
      aria-label="Education"
      className="relative overflow-hidden border-t border-border/60 bg-bg px-6 py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-xs tracking-[0.18em] text-text-faint">03 / EDUCATION</span>
            <h3 className="font-heading text-[0.95rem] tracking-[-0.015em] text-text">Academic Journey</h3>
          </div>
          <p className="hidden text-xs tracking-[0.16em] text-text-faint uppercase sm:block">Timeline — vertical</p>
        </div>

        <div className="mt-6">
          <h4 className="font-heading text-[1.7rem] leading-none tracking-[-0.03em] text-text md:text-[2.1rem]">EDUCATION</h4>
          <p className="font-heading text-[1.7rem] leading-none tracking-[-0.03em] text-text-muted md:text-[2.1rem]">ACADEMIC JOURNEY</p>
        </div>

        {entries.length === 0 ? (
          <div ref={timelineRef} data-timeline className="relative mt-10">
            <div aria-hidden="true" className="h-px w-full bg-border/40" />
            {/* Base rail + glowing scroll progress + traveling thumb */}
            <div aria-hidden="true" className="pointer-events-none absolute top-0 bottom-0 left-[5px] w-px bg-border/40" />
            <div
              data-timeline-progress
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 left-[5px] w-px bg-gradient-to-b from-accent via-accent/60 to-cyan shadow-[0_0_8px_rgba(107,123,255,0.7)]"
            />
            <span
              data-timeline-thumb
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-[5px] will-change-transform motion-reduce:hidden"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-cyan/80 bg-bg shadow-[0_0_14px_rgba(34,211,238,0.85)]">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
              </span>
            </span>
            <div>
              {[0, 1, 2].map((i) => (
                <div key={i} ref={assignItem} className="timeline-item relative py-7 pl-10 md:pl-14">
                  <span
                    data-edu-node
                    aria-hidden="true"
                    className="timeline-node absolute top-9 left-[5px] h-2 w-2 -translate-x-1/2 rounded-full border border-border bg-bg"
                  />
                  <p
                    data-edu-year
                    className="font-heading text-[1.8rem] leading-none tracking-[-0.04em] text-text/25 md:text-[2.1rem]"
                  >
                    —
                  </p>
                  <p className="mt-2 text-sm tracking-[0.12em] text-text-faint uppercase">
                    Academic entry — to be added
                  </p>
                  <p className="mt-1 max-w-xl text-sm leading-6 text-text-muted">
                    Institution · Program · Description will appear here as the journey continues.
                  </p>
                </div>
              ))}
            </div>
            <div aria-hidden="true" className="mt-2 h-px w-full bg-border/20" />
          </div>
        ) : (
          <div ref={timelineRef} data-timeline className="relative mt-10">
            <div aria-hidden="true" className="pointer-events-none absolute top-0 bottom-0 left-[5px] w-px bg-border md:left-[11px] lg:left-[14px]" />
            {/* Glowing scroll progress — draws itself as the timeline scrolls through */}
            <div
              data-timeline-progress
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 left-[5px] w-px bg-gradient-to-b from-accent via-accent/60 to-cyan shadow-[0_0_8px_rgba(107,123,255,0.7)] md:left-[11px] lg:left-[14px]"
            />
            {/* Traveling indicator — glowing core + ring, follows scroll position */}
            <span
              data-timeline-thumb
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-[5px] will-change-transform md:left-[11px] lg:left-[14px] motion-reduce:hidden"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-cyan/80 bg-bg shadow-[0_0_14px_rgba(34,211,238,0.85)]">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
              </span>
            </span>
            {/* Rail label — extremely subtle system caption */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-[24px] hidden -translate-y-1/2 text-[0.55rem] tracking-[0.24em] text-text-faint/50 uppercase select-none md:block lg:left-[27px]"
              style={{ writingMode: "vertical-rl" }}
            >
              Academic Progress
            </span>
            <div className="space-y-0">
              {entries.map((entry, idx) => (
                <article
                  key={`${entry.year}-${entry.institution}-${idx}`}
                  ref={assignItem}
                  className="timeline-item relative grid gap-6 border-t border-border/50 py-8 pl-8 first:border-t-0 md:grid-cols-[200px_1fr] md:gap-10 md:pl-0 lg:grid-cols-[260px_1fr] lg:py-10"
                >
                  <div aria-hidden="true" className="pointer-events-none absolute top-0 bottom-0 left-[11px] hidden md:block lg:left-[14px]">
                    <span data-edu-line className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-border" />
                    <span data-edu-node className="timeline-node absolute top-10 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-border bg-bg ring-4 ring-bg" />
                  </div>
                  {/* Mobile node — rail stays visible on small screens */}
                  <span
                    data-edu-node
                    aria-hidden="true"
                    className="timeline-node absolute top-9 left-[5px] h-2 w-2 -translate-x-1/2 rounded-full border border-border bg-bg md:hidden"
                  />
                  <div className="md:pl-10 lg:pl-14">
                    <p data-edu-year data-velocity className="font-heading text-[2rem] leading-none tracking-[-0.04em] text-text md:text-[2.35rem] lg:text-[2.75rem]">
                      {entry.year}
                    </p>
                    <p className="mt-2 hidden text-xs tracking-[0.14em] text-text-faint uppercase md:block">{String(idx + 1).padStart(2, "0")}</p>
                  </div>
                  <div className="space-y-3">
                    <h4 data-edu-content className="font-heading text-[1.15rem] leading-tight tracking-[-0.015em] text-text">
                      {entry.institution}
                    </h4>
                    <p data-edu-content className="text-sm tracking-[0.12em] text-cyan uppercase">
                      {entry.program}
                    </p>
                    {entry.description ? (
                      <p data-edu-content className="max-w-2xl text-sm leading-6 text-text-muted">
                        {entry.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
