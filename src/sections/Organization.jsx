import { useEffect, useRef } from "react"
import { gsap } from "../animations/gsap"
import { prefersReducedMotion } from "../animations/intro"
import { site } from "../data/site"

const MARQUEE_WORDS = ["Organization", "Archive", "Experience"]

// Abstract preview identities — CSS only, no stock imagery
const PREVIEW_ACCENTS = [
  { text: "text-accent", border: "border-accent/40", glow: "rgba(107,123,255,0.16)" },
  { text: "text-cyan", border: "border-cyan/40", glow: "rgba(34,211,238,0.14)" },
  { text: "text-text-muted", border: "border-border-strong", glow: "rgba(138,148,176,0.12)" },
]

function initials(name) {
  if (!name) return "—"
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

function isFinePointer() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false
  return window.matchMedia("(pointer: fine)").matches && window.matchMedia("(hover: hover)").matches
}

export default function Organization() {
  const sectionRef = useRef(null)
  const itemsRef = useRef([])
  const floatRef = useRef(null)
  const floatInitialsRef = useRef(null)
  const floatNameRef = useRef(null)
  const floatRoleRef = useRef(null)
  const activeFloatRef = useRef(-1)

  useEffect(() => {
    const section = sectionRef.current
    const items = itemsRef.current.filter(Boolean)
    const reduced = prefersReducedMotion()

    if (reduced) {
      if (items.length) gsap.set(items, { clearProps: "all" })
      return
    }

    // Entrance: title → marquee → rows stagger
    const ctx = gsap.context(() => {
      const head = section?.querySelector("[data-org-head]")
      const marquee = section?.querySelector("[data-org-marquee]")
      if (head) gsap.set(head, { autoAlpha: 0, y: 18 })
      if (marquee) gsap.set(marquee, { autoAlpha: 0, y: 12 })
      gsap.set(items, { autoAlpha: 0, y: 22 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 80%", invalidateOnRefresh: true },
      })
      if (head) tl.to(head, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0)
      if (marquee) tl.to(marquee, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.12)
      tl.to(items, { autoAlpha: 1, y: 0, duration: 0.65, ease: "power3.out", stagger: 0.1 }, 0.18)
    }, sectionRef)

    // Floating pointer-follow preview — desktop fine-pointer only, refs only
    const float = floatRef.current
    let detachFollow = null
    if (float && section && isFinePointer() && items.length) {
      gsap.set(float, { autoAlpha: 0, scale: 0.92, xPercent: -50, yPercent: -118 })
      const xTo = gsap.quickTo(float, "x", { duration: 0.45, ease: "power3.out" })
      const yTo = gsap.quickTo(float, "y", { duration: 0.45, ease: "power3.out" })

      const move = (e) => {
        const r = section.getBoundingClientRect()
        xTo(e.clientX - r.left)
        yTo(e.clientY - r.top)
      }

      const showFor = (idx) => {
        if (activeFloatRef.current === idx) return
        activeFloatRef.current = idx
        const entry = site.organizations[idx]
        if (entry) {
          if (floatInitialsRef.current) floatInitialsRef.current.textContent = initials(entry.name ?? entry.organization)
          if (floatNameRef.current) floatNameRef.current.textContent = entry.name ?? entry.organization
          if (floatRoleRef.current) floatRoleRef.current.textContent = `${entry.role} · ${entry.period}`
          const accent = PREVIEW_ACCENTS[idx % PREVIEW_ACCENTS.length]
          float.dataset.accent = String(idx % PREVIEW_ACCENTS.length)
          if (floatInitialsRef.current) floatInitialsRef.current.className = `font-heading text-4xl font-bold tracking-tight ${accent.text}`
        }
        gsap.to(float, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" })
      }

      const hide = () => {
        activeFloatRef.current = -1
        gsap.to(float, { autoAlpha: 0, scale: 0.94, duration: 0.25, ease: "power2.in", overwrite: "auto" })
      }

      const rowListeners = items.map((row, idx) => {
        const enter = () => showFor(idx)
        const leave = () => hide()
        row.addEventListener("pointerenter", enter)
        row.addEventListener("pointerleave", leave)
        return { row, enter, leave }
      })

      section.addEventListener("pointermove", move)
      section.addEventListener("pointerleave", hide)

      detachFollow = () => {
        rowListeners.forEach(({ row, enter, leave }) => {
          row.removeEventListener("pointerenter", enter)
          row.removeEventListener("pointerleave", leave)
        })
        section.removeEventListener("pointermove", move)
        section.removeEventListener("pointerleave", hide)
        gsap.killTweensOf(float)
      }
    }

    return () => {
      if (typeof detachFollow === "function") detachFollow()
      ctx.revert()
    }
  }, [])

  const assignItem = (el) => {
    if (el && !itemsRef.current.includes(el)) itemsRef.current.push(el)
  }

  const entries = site.organizations ?? []

  return (
    <section
      id="organization"
      ref={sectionRef}
      aria-label="Organization Experience"
      className="relative overflow-hidden border-t border-border/60 bg-bg-elevated px-6 py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div data-org-head className="flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-xs tracking-[0.18em] text-text-faint">04 / ORGANIZATION</span>
            <h3 className="font-heading text-[0.95rem] tracking-[-0.015em] text-text">Experience</h3>
          </div>
          <p className="hidden text-xs tracking-[0.16em] text-text-faint uppercase sm:block">Archive — editorial</p>
        </div>

        <div data-org-head className="mt-4">
          <h4 className="font-heading text-[1.6rem] leading-none tracking-[-0.03em] text-text md:text-[2rem]">ORGANIZATION</h4>
        </div>

        {/* Slow marquee — shared rhythm motif, decorative only */}
        <div
          data-org-marquee
          aria-hidden="true"
          className="ticker-mask pointer-events-none mt-8 overflow-hidden border-y border-border/30 py-2.5 select-none motion-reduce:hidden"
        >
          <div className="animate-ticker flex w-max items-center gap-10 text-[0.62rem] tracking-[0.3em] whitespace-nowrap text-text-faint/60 uppercase">
            {[0, 1].map((half) => (
              <div key={half} className="flex items-center gap-10">
                {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w, i) => (
                  <span key={i} className="flex items-center gap-10">
                    <span>{w}</span>
                    <span className="h-1 w-1 rounded-full bg-border-strong" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {entries.length > 0 ? (
          <div className="relative mt-4">
            {entries.map((entry, idx) => {
              const name = entry.name ?? entry.organization
              const accent = PREVIEW_ACCENTS[idx % PREVIEW_ACCENTS.length]
              return (
                <article
                  key={entry.id ?? `${name}-${entry.role}-${idx}`}
                  ref={assignItem}
                  className="group relative grid gap-4 overflow-hidden border-b border-border/40 py-7 transition-colors duration-300 first:border-t first:border-t-transparent hover:bg-bg-soft/40 md:grid-cols-[64px_1.2fr_1fr] md:items-start md:gap-8 md:py-8"
                >
                  {/* Accent line expands on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent/60 transition duration-500 group-hover:scale-x-100"
                  />

                  {/* Number — shifts to accent on hover */}
                  <div className="flex shrink-0 items-start gap-4">
                    <span className="font-heading text-xs tracking-[0.18em] text-text-faint transition duration-300 group-hover:text-accent">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden="true" className="hidden h-px w-6 translate-y-2 bg-border/60 transition duration-300 group-hover:w-10 group-hover:bg-accent/60 md:block" />
                  </div>

                  {/* Organization + role / period */}
                  <div className="min-w-0">
                    <h4 className="font-heading text-[1.25rem] leading-tight tracking-[-0.02em] text-text transition duration-300 group-hover:translate-x-[6px] md:text-[1.45rem]">
                      <span className="underline decoration-border/60 underline-offset-4 transition group-hover:decoration-text-faint">
                        {name}
                      </span>
                    </h4>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-xs tracking-[0.12em] text-cyan uppercase">{entry.role}</span>
                      <span aria-hidden="true" className="text-text-faint">
                        ·
                      </span>
                      <span className="rounded-full border border-border/60 bg-bg-soft px-3 py-1 text-xs text-text-muted">
                        {entry.period}
                      </span>
                    </div>
                  </div>

                  {/* Description — brightens on hover */}
                  <div className="min-w-0">
                    {entry.description ? (
                      <p className="max-w-xl text-sm leading-6 text-text-muted/80 transition duration-300 group-hover:text-text-muted">
                        {entry.description}
                      </p>
                    ) : null}
                    {/* Mobile inline abstract preview — always visible, no hover needed */}
                    <div
                      aria-hidden="true"
                      className="relative mt-4 flex h-28 items-center justify-center overflow-hidden rounded-xl border border-border/40 bg-bg md:hidden"
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `radial-gradient(ellipse 240px 110px at 50% 60%, ${accent.glow}, transparent 70%), linear-gradient(rgba(30,42,74,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(30,42,74,0.25) 1px, transparent 1px)`,
                          backgroundSize: "auto, 22px 22px, 22px 22px",
                        }}
                      />
                      <span className={`font-heading relative text-3xl font-bold tracking-tight ${accent.text}`}>
                        {initials(name)}
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : null}

        {/* Floating pointer-follow preview — desktop fine-pointer only */}
        <div
          ref={floatRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-10 hidden h-36 w-52 overflow-hidden rounded-xl border border-border/50 bg-bg-soft opacity-0 shadow-[0_0_32px_rgba(107,123,255,0.18)] md:block motion-reduce:hidden"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 220px 120px at 50% 65%, rgba(107,123,255,0.16), transparent 70%), linear-gradient(rgba(30,42,74,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,42,74,0.3) 1px, transparent 1px)",
              backgroundSize: "auto, 20px 20px, 20px 20px",
            }}
          />
          <div className="relative flex h-full flex-col items-center justify-center gap-1 p-4 text-center">
            <span ref={floatInitialsRef} className="font-heading text-4xl font-bold tracking-tight text-accent">
              TS
            </span>
            <span ref={floatNameRef} className="font-heading max-w-full truncate text-xs tracking-[-0.01em] text-text">
              Organization
            </span>
            <span ref={floatRoleRef} className="text-[0.6rem] tracking-[0.14em] text-text-faint uppercase">
              Role
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
