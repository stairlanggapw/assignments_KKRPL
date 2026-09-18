import { useEffect, useRef } from "react"
import { gsap } from "../animations/gsap"
import { prefersReducedMotion } from "../animations/intro"
import { site } from "../data/site"

export default function Competencies() {
  const sectionRef = useRef(null)
  const itemsRef = useRef([])

  useEffect(() => {
    const items = itemsRef.current.filter(Boolean)
    if (!items.length) return
    if (prefersReducedMotion()) {
      gsap.set(items, { clearProps: "all" })
      return
    }
    const ctx = gsap.context(() => {
      gsap.set(items, { autoAlpha: 0, y: 18 })
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        ease: "power3.out",
        stagger: 0.06,
        overwrite: "auto",
        scrollTrigger: { trigger: sectionRef.current, start: "top 84%", invalidateOnRefresh: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const assign = (el) => {
    if (el && !itemsRef.current.includes(el)) itemsRef.current.push(el)
  }

  const entries = site.competencies ?? []

  return (
    <section
      id="competencies"
      ref={sectionRef}
      aria-label="Competencies"
      className="relative overflow-hidden border-t border-border/60 bg-bg px-6 py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-xs tracking-[0.18em] text-text-faint">07 / COMPETENCIES</span>
            <h3 className="font-heading text-[0.95rem] tracking-[-0.015em] text-text">Stack</h3>
          </div>
          <p className="hidden text-xs tracking-[0.16em] text-text-faint uppercase sm:block">Editorial — no percentages</p>
        </div>

        {entries.length === 0 ? (
          <div className="mt-10 border-y border-border/30 py-10">
            <p className="text-sm tracking-[0.12em] text-text-faint uppercase">Competencies will be listed here.</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted">Interactive typography list — hover to reveal description.</p>
          </div>
        ) : (
          <div className="mt-10 border-t border-border/40">
            {entries.map((entry, idx) => (
              <div key={`${entry.name}-${idx}`} ref={assign} className="group flex items-center justify-between gap-4 border-b border-border/30 py-5 md:py-6">
                <div className="flex min-w-0 items-baseline gap-4 md:gap-6">
                  <span className="font-heading shrink-0 text-xs tracking-[0.18em] text-text-faint">{String(idx + 1).padStart(2, "0")}</span>
                  <h4 className="font-heading text-[1.7rem] leading-none tracking-[-0.04em] text-text transition duration-300 group-hover:translate-x-[3px] md:text-[2.2rem] lg:text-[2.45rem]">
                    <span className="underline decoration-transparent underline-offset-8 transition group-hover:decoration-border/60">{entry.name.toUpperCase()}</span>
                  </h4>
                </div>
                <div className="hidden shrink-0 items-center gap-3 md:flex">
                  {entry.meta ? <span className="rounded-full border border-border/40 bg-bg-elevated/30 px-3 py-1 text-xs tracking-[0.1em] text-text-muted uppercase opacity-0 transition duration-300 group-hover:opacity-100">{entry.meta}</span> : null}
                  {entry.description ? <span className="max-w-[260px] truncate text-right text-sm leading-5 text-text-muted opacity-60 transition duration-300 group-hover:opacity-100">{entry.description}</span> : null}
                </div>
                <div className="md:hidden">
                  <p className="text-xs tracking-[0.12em] text-text-faint uppercase">{entry.meta}</p>
                </div>
              </div>
            ))}
            <div className="mt-6 grid gap-2 md:hidden">
              {entries.map((entry) => (
                <p key={`m-${entry.name}`} className="text-sm leading-5 text-text-muted">
                  <span className="font-heading text-text">{entry.name}</span>
                  {entry.description ? ` — ${entry.description}` : null}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Technology ticker — decorative rhythm from real stack data */}
        {entries.length > 0 ? (
          <div
            aria-hidden="true"
            className="ticker-mask pointer-events-none mt-12 overflow-hidden border-y border-border/30 py-3 select-none motion-reduce:hidden"
          >
            <div className="animate-ticker flex w-max items-center gap-10 text-xs tracking-[0.28em] whitespace-nowrap text-text-faint/70 uppercase">
              {[0, 1].map((half) => (
                <div key={half} className="flex items-center gap-10">
                  {entries.map((entry) => (
                    <span key={`${half}-${entry.name}`} className="flex items-center gap-10">
                      <span>{entry.name}</span>
                      <span className="h-1 w-1 rounded-full bg-border-strong" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
