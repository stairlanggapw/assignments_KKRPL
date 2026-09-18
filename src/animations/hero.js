import { gsap } from "./gsap"
import { prefersReducedMotion } from "./intro"

export function createHeroEntrance(trigger) {
  if (!trigger || prefersReducedMotion()) return null

  const typoLines = trigger.querySelectorAll("[data-hero-typo-line]")
  const portrait = trigger.querySelector("[data-hero-portrait]")
  const planet = trigger.querySelector("[data-hero-planet]")
  const bgword = trigger.querySelector("[data-hero-bgword]")
  const metas = trigger.querySelectorAll("[data-hero-meta]")
  const scroll = trigger.querySelector("[data-hero-scroll]")

  // Fallback for legacy selectors
  const legacyImage = trigger.querySelector("[data-hero-image]")
  const legacyContents = trigger.querySelectorAll("[data-hero-content]")

  const hasNewStructure = typoLines.length || portrait

  if (!hasNewStructure && !legacyImage) return null

  if (hasNewStructure) {
    if (typoLines.length) gsap.set(typoLines, { autoAlpha: 0, y: 28, filter: "blur(6px)" })
    if (bgword) gsap.set(bgword, { autoAlpha: 0 })
    if (portrait) gsap.set(portrait, { autoAlpha: 0, y: 20, scale: 0.985, filter: "blur(6px)" })
    if (planet) gsap.set(planet, { autoAlpha: 0, scale: 0.92, filter: "blur(4px)" })
    if (metas.length) gsap.set(metas, { autoAlpha: 0, y: 14 })
    if (scroll) gsap.set(scroll, { autoAlpha: 0, y: 10 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: "top 84%",
        end: "top 44%",
        scrub: false,
        invalidateOnRefresh: true,
      },
    })

    if (typoLines.length) {
      tl.to(
        typoLines,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.95,
          ease: "power3.out",
          stagger: 0.09,
          overwrite: "auto",
        },
        0
      )
    }

    if (planet) {
      tl.to(
        planet,
        {
          autoAlpha: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          overwrite: "auto",
        },
        typoLines.length ? "-=0.65" : 0
      )
    }

    if (bgword) {
      tl.to(
        bgword,
        {
          autoAlpha: 1,
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto",
        },
        0.15
      )
      // Gentle horizontal drift as the user scrolls past the hero
      gsap.to(bgword, {
        xPercent: -5,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
    }

    if (portrait) {
      tl.to(
        portrait,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.95,
          ease: "power3.out",
          overwrite: "auto",
        },
        typoLines.length ? "-=0.7" : planet ? "-=0.7" : 0
      )
    }

    if (metas.length) {
      tl.to(
        metas,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.07,
          overwrite: "auto",
        },
        portrait ? "-=0.55" : "-=0.4"
      )
    }

    if (scroll) {
      tl.to(
        scroll,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        },
        "-=0.45"
      )
    }

    return tl
  }

  // Legacy fallback — keep previous behavior for any old markup
  gsap.set(legacyImage, { autoAlpha: 0, y: 20, scale: 0.985, filter: "blur(6px)" })
  if (legacyContents.length) gsap.set(legacyContents, { autoAlpha: 0, y: 16 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: "top 84%",
      end: "top 44%",
      scrub: false,
      invalidateOnRefresh: true,
    },
  })

  tl.to(legacyImage, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    duration: 0.9,
    ease: "power3.out",
    overwrite: "auto",
  })

  if (legacyContents.length) {
    tl.to(
      legacyContents,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        ease: "power3.out",
        stagger: 0.08,
        overwrite: "auto",
      },
      "-=0.55"
    )
  }

  return tl
}
