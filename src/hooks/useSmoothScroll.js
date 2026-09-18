import { useEffect, useRef } from "react"
import { gsap, ScrollTrigger } from "../animations/gsap"
import { createLenis, setGlobalLenis } from "../animations/lenis"
import { prefersReducedMotion } from "../animations/intro"
import { attachVelocity } from "../animations/velocity"

/**
 * Single global Lenis + ScrollTrigger synchronisation.
 * Centralises all scroll infrastructure so no component creates its own Lenis.
 *
 * Guarantees:
 * - exactly one Lenis instance per mount
 * - ScrollTrigger updated on every Lenis scroll tick
 * - lagSmoothing disabled while smooth scroll is active (prevents jumps after tab switch)
 * - resize / orientationchange => ScrollTrigger.refresh()
 * - full cleanup on unmount: listener off, Lenis destroyed, lagSmoothing restored
 * - respects prefers-reduced-motion (disables smoothWheel, instant lerp)
 */
export function useSmoothScroll() {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Guard against duplicate init inside a single mount (defensive)
    if (lenisRef.current) return

    const reduced = prefersReducedMotion()

    const lenis = createLenis({
      // When reduced motion is requested, keep scroll instant and native
      lerp: reduced ? 1 : 0.08,
      smoothWheel: !reduced,
      smoothTouch: false,
    })
    lenisRef.current = lenis
    setGlobalLenis(lenis)

    const handleScroll = () => ScrollTrigger.update()
    lenis.on("scroll", handleScroll)

    // Subtle velocity effects — reuses same Lenis listener, no extra architecture
    const detachVelocity = attachVelocity(lenis, document)

    // Prevent GSAP's lagSmoothing from fighting Lenis after tab backgrounding
    gsap.ticker.lagSmoothing(0)

    // Ensure trigger positions are correct after Lenis attaches and fonts load
    // Use rAF so Lenis has added its classes
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())

    const handleRefresh = () => ScrollTrigger.refresh()
    const handleResize = () => {
      // Lenis auto-handles resize, but force a synchronous refresh for ScrollTrigger
      handleRefresh()
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)
    // Custom event hook for future sections to request a refresh without importing ScrollTrigger
    window.addEventListener("scroll:refresh", handleRefresh)

    return () => {
      cancelAnimationFrame(raf)
      if (typeof detachVelocity === "function") detachVelocity()
      lenis.off("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
      window.removeEventListener("scroll:refresh", handleRefresh)
      lenis.destroy()
      lenisRef.current = null
      setGlobalLenis(null)
      // Restore default lagSmoothing (GSAP default: 500ms threshold, 33ms min)
      gsap.ticker.lagSmoothing(500, 33)
    }
  }, [])

  return lenisRef
}
