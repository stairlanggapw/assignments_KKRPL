import { gsap } from "./gsap"

export function prefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export const INTRO_TYPING_TEXT = "STEFANUS AIRLANGGA P.W"

/**
 * Typing animation for intro — single line, standard speed.
 * - Splits INTRO_TYPING_TEXT into per-char spans (aria-hidden).
 * - Uses GSAP stagger 0.065s per char (standard).
 * - Social items (if given) fade in one by one after typing completes.
 * - Respects prefers-reduced-motion: shows full text instantly.
 * - One-shot only, no loop. Returns GSAP timeline for cleanup.
 * - Container stays as `target` for existing ScrollTrigger scrub (createIntroScroll).
 */
export function createIntroTyping(target, { text = INTRO_TYPING_TEXT, charStagger = 0.065, socialItems = [] } = {}) {
  if (!target) return null

  const socials = Array.from(socialItems).filter(Boolean)

  // Reduced motion: instant full text, no animation
  if (prefersReducedMotion()) {
    target.textContent = text
    target.setAttribute("aria-label", text)
    gsap.set(target, { clearProps: "all" })
    if (socials.length) gsap.set(socials, { clearProps: "all" })
    return null
  }

  // Build accessible structure: aria-label on container, chars aria-hidden
  target.setAttribute("aria-label", text)
  target.innerHTML = ""

  const line = document.createElement("span")
  line.className = "inline-block whitespace-nowrap"
  line.setAttribute("aria-hidden", "true")

  const chars = []
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const span = document.createElement("span")
    span.textContent = ch === " " ? "\u00A0" : ch
    span.setAttribute("data-char", "")
    // keep spaces measurable even when invisible
    span.style.display = "inline-block"
    if (ch === " ") span.style.width = "0.32em"
    chars.push(span)
    line.appendChild(span)
  }

  target.appendChild(line)

  gsap.set(chars, { autoAlpha: 0 })

  const tl = gsap.timeline({ delay: 0.2, overwrite: "auto" })

  tl.to(chars, {
    autoAlpha: 1,
    duration: 0.18,
    ease: "power2.out",
    stagger: charStagger,
    overwrite: "auto",
  })

  // Social icons enter one by one after the typing completes
  if (socials.length) {
    gsap.set(socials, { autoAlpha: 0, y: 12 })
    tl.to(socials, {
      autoAlpha: 1,
      y: 0,
      duration: 0.45,
      ease: "power3.out",
      stagger: 0.12,
      overwrite: "auto",
    })
  }

  return tl
}

/**
 * Cinematic, restrained entrance for the intro name.
 * - No ScrollTrigger creation here — pure entrance tween.
 * - Respects prefers-reduced-motion (caller should skip if true).
 * - Returns a GSAP tween/timeline for optional cleanup.
 * - Kept for backward compatibility; now delegates to typing if target contains typing text.
 */
export function createIntroEntrance(target) {
  if (!target || prefersReducedMotion()) return null

  // If target already holds typing text or is empty, use typing instead of legacy fade
  const currentText = (target.textContent || "").trim().toUpperCase()
  if (!currentText || currentText.includes("STEFANUS")) {
    return createIntroTyping(target)
  }

  // Legacy fallback — pure fade/blur
  gsap.set(target, { autoAlpha: 0, y: 18, filter: "blur(8px)" })

  const tween = gsap.to(target, {
    autoAlpha: 1,
    y: 0,
    filter: "blur(0px)",
    duration: 1.35,
    ease: "power3.out",
    delay: 0.2,
    overwrite: "auto",
  })

  return tween
}

/**
 * Scroll-driven transition: intro name fades / lifts as user begins to scroll.
 * Creates a single ScrollTrigger tied to `trigger` element.
 * - scrub:true for direct scroll linking (cinematic, not autoplay)
 * - All ScrollTriggers created inside the provided gsap.context are auto-killed on ctx.revert()
 */
export function createIntroScroll({ trigger, target, nextTarget } = {}) {
  if (!trigger || !target || prefersReducedMotion()) return null

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: "top top",
      end: "+=70%",
      scrub: 0.7,
      invalidateOnRefresh: true,
      // Do not pin — pinning + Lenis can cause scroll-lock bugs on mobile; a scrub fade is sufficient for Task 2
    },
  })

  tl.to(
    target,
    {
      y: -36,
      autoAlpha: 0,
      scale: 0.985,
      filter: "blur(4px)",
      ease: "none",
      overwrite: "auto",
    },
    0
  )

  if (nextTarget) {
    gsap.set(nextTarget, { autoAlpha: 0, y: 24 })
    tl.to(
      nextTarget,
      {
        autoAlpha: 1,
        y: 0,
        ease: "none",
        overwrite: "auto",
      },
      0.15
    )
  }

  return tl
}
