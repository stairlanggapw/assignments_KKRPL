import { gsap } from "./gsap"
import { prefersReducedMotion } from "./intro"
import { setShootingBoost } from "./shootingStars"

/**
 * Cinematic overlapping for selected sections.
 * - Only on desktop (min-width 768px), reduced-motion disabled.
 * - Uses pin + translateY/scale/borderRadius, preserves document flow.
 * - Reverse & resize safe: pinSpacing + invalidateOnRefresh + anticipatePin.
 * - Sections remain accessible: pinned section stays interactive until fully covered.
 */
export function createOverlappingSections({ sections, scope }) {
  if (!sections?.length || prefersReducedMotion()) return () => {}
  if (typeof window === "undefined") return () => {}

  // Quick bail for mobile — GSAP matchMedia will handle, but double-guard for SSR
  const isDesktop = window.matchMedia("(min-width: 768px)").matches
  if (!isDesktop) return () => {}

  const mm = gsap.matchMedia(scope)

  mm.add(
    {
      isDesktop: "(min-width: 768px)",
      isReduced: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { isDesktop: desktop, isReduced } = context.conditions || {}
      if (isReduced || !desktop) return () => {}

      const triggers = []

      sections.forEach((section, i) => {
        if (!section) return
        const isLast = i === sections.length - 1
        if (isLast) return // last section does not pin, only revealed

        const next = sections[i + 1]
        if (!next) return

        // Ensure stacking order — later sections above earlier
        section.style.zIndex = String(10 + i)
        next.style.zIndex = String(10 + i + 1)

        // Initial state for next section: slightly below and scaled, rounded
        gsap.set(next, {
          yPercent: 0, // will be animated via ScrollTrigger
          scale: 1,
          borderRadius: 0,
          transformOrigin: "center top",
          willChange: "transform",
        })

        // Pin current section; as user scrolls, next slides over it
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `bottom top+=1`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: false,
            invalidateOnRefresh: true,
            // markers: false,
          },
        })

        // Subtle scale down of pinned section as it gets covered
        tl.to(
          section,
          {
            scale: 0.97,
            borderRadius: "24px",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
          0
        )

        // Next section slides up to overlap — cinematic translate + scale + radius
        gsap.set(next, { yPercent: 18, scale: 0.985, borderRadius: "24px" })

        const overlap = gsap.to(next, {
          yPercent: 0,
          scale: 1,
          borderRadius: "0px",
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: "top top",
            scrub: 0.9,
            invalidateOnRefresh: true,
            onEnter: () => setShootingBoost(true),
            onLeave: () => setShootingBoost(false),
            onEnterBack: () => setShootingBoost(true),
            onLeaveBack: () => setShootingBoost(false),
          },
        })

        triggers.push(tl, overlap)
      })

      return () => {
        try {
          setShootingBoost(false)
        } catch {}
        triggers.forEach((t) => {
          try {
            t.kill()
          } catch {}
        })
        sections.forEach((s) => {
          if (!s) return
          gsap.set(s, { clearProps: "transform,borderRadius,willChange,zIndex" })
        })
      }
    },
    scope
  )

  return () => {
    mm.revert()
  }
}
