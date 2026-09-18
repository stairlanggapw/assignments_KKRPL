import Lenis from "lenis"

// Factory only — do not call this outside useSmoothScroll.
// Central hook (src/hooks/useSmoothScroll.js) is the single owner of the Lenis instance.
export function createLenis(options = {}) {
  return new Lenis({
    autoRaf: true,
    lerp: 0.08,
    smoothWheel: true,
    // Native touch on mobile/tablet prevents iOS momentum conflicts and scroll jumps
    smoothTouch: false,
    ...options,
  })
}

// Module-level reference to the single live Lenis instance.
// Set by useSmoothScroll on init, cleared on cleanup — no extra instances.
let globalLenis = null

export function setGlobalLenis(lenis) {
  globalLenis = lenis
}

export function getGlobalLenis() {
  return globalLenis
}

function prefersReduced() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Smooth-scroll to an in-page anchor (e.g. "#about") through the global Lenis.
 * - Offsets for the fixed navbar (h-14 = 56px)
 * - Falls back to native scrolling when Lenis is unavailable
 * - Instant jump when prefers-reduced-motion is set
 * - Updates the URL hash without triggering a native jump
 */
export function scrollToSection(hash) {
  if (!hash || typeof document === "undefined") return
  const id = hash.startsWith("#") ? hash.slice(1) : hash
  if (!id) return
  const target = document.getElementById(id)
  if (!target) return

  const updateHash = () => {
    try {
      window.history.replaceState(null, "", `#${id}`)
    } catch {}
  }

  if (prefersReduced()) {
    target.scrollIntoView({ behavior: "auto", block: "start" })
    updateHash()
    return
  }

  if (globalLenis && typeof globalLenis.scrollTo === "function") {
    globalLenis.scrollTo(target, {
      offset: -56,
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      onComplete: updateHash,
    })
    return
  }

  // Native fallback — scroll-margin-top in CSS handles the navbar offset
  target.scrollIntoView({ behavior: "smooth", block: "start" })
  updateHash()
}
