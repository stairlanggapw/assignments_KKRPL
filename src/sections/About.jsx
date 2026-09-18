import { useEffect, useRef } from "react"
import { gsap } from "../animations/gsap"
import { prefersReducedMotion } from "../animations/intro"
import { createFadeUp, createRevealBatch } from "../animations/reveal"
import { site } from "../data/site"
import OrbitBadge from "../components/OrbitBadge"
import InteractivePhotoCard from "../components/InteractivePhotoCard"
// Personal visual — cropped detail, intentionally different from the Hero portrait.
// Swap this import with a dedicated About photo when one is available.
import aboutPortrait from "../assets/images/Photo2.png"

const FOCUS_LABELS = ["FRONTEND", "INTERACTION", "MOTION", "CREATIVE CODE"]

export default function About() {
  const sectionRef = useRef(null)
  const headlineRef = useRef(null)
  const bgWordRef = useRef(null)
  const textRefs = useRef([])
  const metaRefs = useRef([])

  useEffect(() => {
    const headline = headlineRef.current
    const texts = textRefs.current.filter(Boolean)
    const metas = metaRefs.current.filter(Boolean)
    const bgWord = bgWordRef.current
    const section = sectionRef.current

    if (prefersReducedMotion()) {
      if (headline) gsap.set(headline, { clearProps: "all" })
      if (texts.length) gsap.set(texts, { clearProps: "all" })
      if (metas.length) gsap.set(metas, { clearProps: "all" })
      if (bgWord) gsap.set(bgWord, { clearProps: "all" })
      return
    }

    const ctx = gsap.context(() => {
      createFadeUp(headline, { trigger: section, y: 22, start: "top 82%" })
      createRevealBatch(texts, { trigger: section, stagger: 0.09, y: 16, start: "top 78%" })

      // Photo entrance + pointer interaction live inside InteractivePhotoCard

      // Metadata stagger + focus strip
      if (metas.length) {
        createRevealBatch(metas, { trigger: section, stagger: 0.07, y: 14, start: "top 82%" })
      }

      // Background typography — gentle parallax drift
      if (bgWord) {
        gsap.to(bgWord, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.8, invalidateOnRefresh: true },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const assignText = (el) => {
    if (el && !textRefs.current.includes(el)) textRefs.current.push(el)
  }

  const assignMeta = (el) => {
    if (el && !metaRefs.current.includes(el)) metaRefs.current.push(el)
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="relative overflow-hidden border-t border-border/60 bg-bg px-6 py-20 lg:px-8 lg:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_800px_420px_at_10%_0%,rgba(107,123,255,0.05),transparent_60%)]" />

      {/* Background typography — depth layer only */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-8 overflow-hidden select-none motion-reduce:hidden">
        <p
          ref={bgWordRef}
          className="font-heading text-center text-[22vw] leading-none font-bold tracking-[-0.04em] whitespace-nowrap text-transparent opacity-60 md:text-[16vw]"
          style={{ WebkitTextStroke: "1px rgba(138,148,176,0.13)" }}
        >
          IDENTITY
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        {/* TOP — label */}
        <div className="flex items-baseline gap-3">
          <span className="font-heading text-xs tracking-[0.18em] text-text-faint">01 / ABOUT</span>
          <p ref={assignText} className="hidden text-xs tracking-[0.16em] text-text-faint uppercase sm:block">
            {site.about.eyebrow}
          </p>
        </div>

        {/* UPPER — main statement */}
        <h2
          id="about-heading"
          ref={headlineRef}
          data-velocity
          className="font-heading mt-6 max-w-4xl text-[2rem] leading-[0.9] tracking-[-0.03em] text-text sm:text-[2.4rem] md:text-[2.8rem] lg:text-[3.3rem]"
        >
          {site.about.headline}
        </h2>

        {/* MIDDLE — image LEFT, description RIGHT */}
        <div className="mt-10 grid gap-10 border-t border-border/40 pt-8 md:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* Personal visual — magnetic photo card, not a profile card */}
          <div className="relative">
            <InteractivePhotoCard
              image={aboutPortrait}
              alt="Portrait detail of Stefanus Airlangga"
              className="w-full max-w-[340px] md:max-w-none"
            />
            {/* caption + orbit pair */}
            <div className="mt-4 flex items-start justify-between gap-6">
              <div>
                <p className="text-[0.62rem] tracking-[0.18em] text-text-faint uppercase">Portrait — Detail crop</p>
                <p className="font-heading mt-1 text-sm tracking-[-0.01em] text-text">{site.name}</p>
              </div>
              <OrbitBadge center={site.shortName} words={["IDENTITY", "TECHNOLOGY", "SPACE"]} />
            </div>
          </div>

          {/* Description + personal metadata */}
          <div className="flex flex-col gap-8">
            <div className="space-y-6">
              {site.about.paragraphs.map((para, i) => (
                <p key={i} ref={assignText} className="max-w-2xl text-[1.05rem] leading-7 text-text-muted md:text-[1.08rem]">
                  {para}
                </p>
              ))}
            </div>

            {/* Personal details — factual, from site data */}
            <div ref={assignMeta} className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border/40 pt-6 sm:grid-cols-2">
              {[
                { label: "Name", value: site.name },
                { label: "Focus", value: site.role },
                { label: "Interest", value: site.focus },
                { label: "Location", value: `${site.location} — Indonesia` },
              ].map((item) => (
                <div key={item.label} className="group">
                  <p className="text-[0.62rem] tracking-[0.18em] text-text-faint uppercase">{item.label}</p>
                  <p className="font-heading mt-1.5 text-[0.95rem] leading-snug tracking-[-0.01em] text-text transition duration-300 group-hover:translate-x-[2px]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LOWER — focus strip, categorical labels with separators */}
        <div ref={assignMeta} className="mt-12 grid grid-cols-2 border-y border-border/40 md:grid-cols-4">
          {FOCUS_LABELS.map((label, i) => (
            <div
              key={label}
              className="group flex items-baseline gap-3 border-border/30 px-4 py-5 odd:border-r md:justify-center md:px-6 md:[&:not(:last-child)]:border-r"
            >
              <span className="font-heading text-xs tracking-[0.18em] text-text-faint transition duration-300 group-hover:text-cyan">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-heading text-sm tracking-[0.06em] text-text-muted uppercase transition duration-300 group-hover:text-text">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Continuation line into Education */}
        <div aria-hidden="true" className="mt-10 flex items-center gap-3">
          <span className="h-1 w-1 rounded-full bg-cyan/70" />
          <span className="h-px flex-1 bg-gradient-to-r from-border/60 to-transparent" />
          <span className="text-[0.6rem] tracking-[0.22em] text-text-faint/70 uppercase">Journey continues</span>
        </div>
      </div>
    </section>
  )
}
