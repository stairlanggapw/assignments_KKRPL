import { useEffect, useRef } from "react"
import { gsap } from "../animations/gsap"
import { prefersReducedMotion } from "../animations/intro"
import { site } from "../data/site"
import OrbitBadge from "../components/OrbitBadge"

const FOCUS_STRIP = ["FRONTEND", "UI / UX", "MOTION", "INTERACTION", "CREATIVE CODE"]

export default function Biodata() {
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const identityRef = useRef(null)
  const orbitRef = useRef(null)
  const rowsRef = useRef([])
  const statementRef = useRef(null)
  const traitsRef = useRef(null)
  const stripRef = useRef(null)
  const bgWordRef = useRef(null)

  const bio = site.biodata ?? {}
  const rows = [
    { label: "Name", value: bio.name },
    { label: "Role", value: bio.role },
    { label: "Age", value: bio.age },
    { label: "Location", value: bio.location },
    { label: "Education", value: bio.education },
    { label: "Focus", value: bio.focus },
    { label: "Interests", value: (bio.interests ?? []).join(" / ") },
    { label: "Status", value: bio.status },
  ].filter((r) => r.value)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const label = labelRef.current
    const identity = identityRef.current
      ? Array.from(identityRef.current.querySelectorAll("[data-bio-identity]"))
      : []
    const orbit = orbitRef.current
    const rowItems = rowsRef.current.filter(Boolean)
    const statement = statementRef.current
    const traits = traitsRef.current
    const strip = stripRef.current
    const bgWord = bgWordRef.current

    if (prefersReducedMotion()) {
      ;[label, orbit, statement, traits, strip, bgWord].forEach((el) => {
        if (el) gsap.set(el, { clearProps: "all" })
      })
      if (identity.length) gsap.set(identity, { clearProps: "all" })
      if (rowItems.length) gsap.set(rowItems, { clearProps: "all" })
      return
    }

    const ctx = gsap.context(() => {
      if (label) gsap.set(label, { autoAlpha: 0, y: 12 })
      if (identity.length) gsap.set(identity, { autoAlpha: 0, y: 26 })
      if (orbit) gsap.set(orbit, { autoAlpha: 0, scale: 0.94 })
      if (rowItems.length) gsap.set(rowItems, { autoAlpha: 0, y: 14 })
      if (statement) gsap.set(statement, { autoAlpha: 0, y: 18 })
      if (traits) gsap.set(traits, { autoAlpha: 0, y: 12 })
      if (strip) gsap.set(strip, { autoAlpha: 0, y: 12 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 80%", invalidateOnRefresh: true },
      })
      if (label) tl.to(label, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0)
      if (identity.length)
        tl.to(identity, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 }, 0.1)
      if (orbit) tl.to(orbit, { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power3.out" }, 0.25)
      if (rowItems.length)
        tl.to(rowItems, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.07 }, 0.35)
      if (statement) tl.to(statement, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.55)
      if (traits) tl.to(traits, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.65)
      if (strip) tl.to(strip, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.75)

      // Identity gentle scroll parallax — depth without distraction
      if (identity.length) {
        gsap.to(identity, {
          y: -12,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top 80%", end: "bottom 30%", scrub: 0.6, invalidateOnRefresh: true },
        })
      }
      // Background typography drift
      if (bgWord) {
        gsap.to(bgWord, {
          yPercent: 16,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.8, invalidateOnRefresh: true },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const assignRow = (el) => {
    if (el && !rowsRef.current.includes(el)) rowsRef.current.push(el)
  }

  const firstName = (bio.name ?? "").split(" ")[0] || "STEFANUS"
  const lastName = (bio.name ?? "").split(" ").slice(1).join(" ") || "AIRLANGGA"

  return (
    <section
      id="biodata"
      ref={sectionRef}
      aria-labelledby="biodata-heading"
      className="relative overflow-hidden border-t border-border/60 bg-bg px-6 py-16 lg:px-8 lg:py-24"
    >
      {/* Background typography — depth layer only */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-4 overflow-hidden select-none motion-reduce:hidden">
        <p
          ref={bgWordRef}
          className="font-heading text-center text-[20vw] leading-none font-bold tracking-[-0.04em] whitespace-nowrap text-transparent opacity-50 md:text-[13vw]"
          style={{ WebkitTextStroke: "1px rgba(138,148,176,0.12)" }}
        >
          IDENTITY
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        {/* HEADER */}
        <div ref={labelRef} className="flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-xs tracking-[0.18em] text-text-faint">02 / BIODATA</span>
            <h3 id="biodata-heading" className="font-heading text-[0.95rem] tracking-[-0.015em] text-text">
              Personal Identity
            </h3>
          </div>
          <p className="hidden text-xs tracking-[0.16em] text-text-faint uppercase sm:block">
            Identity system — {bio.year ?? site.year}
          </p>
        </div>

        {/* MIDDLE — identity / orbit / information */}
        <div className="mt-10 grid gap-10 border-t border-border/60 pt-8 lg:grid-cols-[1.05fr_0.65fr_1.3fr] lg:gap-12">
          {/* LEFT — large identity */}
          <div ref={identityRef} className="flex flex-col justify-start">
            <h4 data-bio-identity className="font-heading text-[2.4rem] leading-[0.88] font-bold tracking-[-0.04em] text-text sm:text-[3rem] lg:text-[3.4rem]">
              {firstName.toUpperCase()}
              <span className="block text-text-muted">{lastName.toUpperCase()}</span>
            </h4>
            <p data-bio-identity className="font-heading mt-4 text-[0.85rem] tracking-[0.08em] text-cyan uppercase">
              {bio.role}
            </p>
            <div data-bio-identity aria-hidden="true" className="mt-4 h-px w-16 bg-accent/50" />
            <p data-bio-identity className="mt-4 max-w-sm text-sm leading-6 text-text-muted">
              &ldquo;{bio.statement}&rdquo;
            </p>
          </div>

          {/* CENTER — interactive orbital identification */}
          <div ref={orbitRef} className="flex flex-col items-center justify-start gap-4 lg:pt-2">
            <OrbitBadge center="SA" caption="Identity — System" interactive />
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-cyan" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
              </span>
              <p className="text-[0.62rem] tracking-[0.18em] text-text-muted uppercase">{bio.status}</p>
            </div>
          </div>

          {/* RIGHT — editorial information rows */}
          <div className="grid content-start gap-0 border-t border-border/40 sm:grid-cols-2 sm:gap-x-8 lg:border-t-0">
            {rows.map((item) => (
              <div
                key={item.label}
                ref={assignRow}
                className="group relative border-b border-border/40 py-4 transition-colors duration-300 hover:bg-bg-elevated/40 md:py-5"
              >
                {/* accent line extends on hover */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-px w-12 origin-left scale-x-0 bg-accent/70 transition duration-400 group-hover:scale-x-100"
                />
                {/* dot appears on hover */}
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 -left-1 h-1 w-1 -translate-y-1/2 rounded-full bg-cyan opacity-0 transition duration-300 group-hover:opacity-100"
                />
                <p className="text-[0.62rem] tracking-[0.18em] text-text-faint uppercase transition duration-300 group-hover:text-text-muted">
                  {item.label}
                </p>
                <p className="font-heading mt-1.5 text-[1rem] leading-snug tracking-[-0.01em] text-text transition duration-300 group-hover:translate-x-[6px] group-hover:text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* STATEMENT */}
        <div ref={statementRef} className="mt-14 max-w-4xl">
          <p className="font-heading text-[1.6rem] leading-[1.05] tracking-[-0.02em] text-text sm:text-[2rem] md:text-[2.4rem]">
            Curious by nature.
            <span className="block text-text-muted/70">Precise by design.</span>
          </p>
        </div>

        {/* TRAITS */}
        <div ref={traitsRef} className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
          {(bio.traits ?? []).map((trait, i, arr) => (
            <span key={trait} className="flex items-center gap-5">
              <span className="font-heading text-xs tracking-[0.22em] text-text-muted uppercase transition duration-300 hover:text-text">
                {trait}
              </span>
              {i < arr.length - 1 ? (
                <span aria-hidden="true" className="h-3 w-px bg-border/60" />
              ) : null}
            </span>
          ))}
        </div>

        {/* FOCUS STRIP — slow ticker */}
        <div
          ref={stripRef}
          aria-hidden="true"
          className="ticker-mask pointer-events-none mt-10 overflow-hidden border-y border-border/30 py-2.5 select-none motion-reduce:hidden"
        >
          <div className="animate-ticker flex w-max items-center gap-10 text-[0.62rem] tracking-[0.3em] whitespace-nowrap text-text-faint/60 uppercase">
            {[0, 1].map((half) => (
              <div key={half} className="flex items-center gap-10">
                {[...FOCUS_STRIP, ...FOCUS_STRIP].map((w, i) => (
                  <span key={i} className="flex items-center gap-10">
                    <span>{w}</span>
                    <span className="h-1 w-1 rounded-full bg-border-strong" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
