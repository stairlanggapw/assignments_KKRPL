import { gsap } from "./gsap"
import { prefersReducedMotion } from "./intro"

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

/**
 * Subtle velocity-based effects.
 * Reuses the existing Lenis instance — no extra scroll architecture.
 * Applied only to [data-velocity] elements (images / large decorative type),
 * never to body text / buttons / nav.
 */
export function attachVelocity(lenis, root = document) {
  if (!lenis || prefersReducedMotion()) return () => {}
  if (typeof window === "undefined") return () => {}

  const isCoarse = window.matchMedia("(pointer: coarse)").matches
  const isSmall = window.matchMedia("(max-width: 767px)").matches
  // Mobile: greatly reduce — keep only tiny translate, no skew
  const mobile = isCoarse || isSmall

  const reduceFactor = mobile ? 0.35 : 1

  const elements = Array.from(root.querySelectorAll("[data-velocity]"))
  if (!elements.length) return () => {}

  // Prepare quickTo for each element (transform only, no layout)
  const tweens = elements.map((el) => ({
    el,
    skewTo: gsap.quickTo(el, "skewY", { duration: 0.7, ease: "power3.out" }),
    scaleTo: gsap.quickTo(el, "scale", { duration: 0.7, ease: "power3.out" }),
  }))

  // Ensure neutral start — transform-only, no layout; keep existing y untouched for parallax compatibility
  tweens.forEach(({ el }) => {
    gsap.set(el, { skewY: 0, scale: 1, transformOrigin: "center center", willChange: "transform" })
  })

  let rafPending = false

  const handle = ({ velocity }) => {
    // Lenis velocity is px per frame; map to small distortion
    // Keep max distortion tiny to stay stable
    const maxSkew = mobile ? 0.7 : 1.6
    const maxScaleDelta = mobile ? 0.008 : 0.016

    // Throttle heavy work via rAF flag if needed, but Lenis already fires ~60fps
    // We keep it cheap: no DOM reads, only 5-10 elements
    const v = velocity ?? 0
    const skew = clamp(v * 0.035 * reduceFactor, -maxSkew, maxSkew)
    const scale = 1 + clamp(Math.abs(v) * 0.00012 * reduceFactor, 0, maxScaleDelta) * (v < 0 ? -0.5 : 1)

    tweens.forEach(({ skewTo, scaleTo }) => {
      skewTo(skew)
      scaleTo(scale)
    })

    // Smooth return is handled by quickTo duration; when velocity → 0, they tween back
    rafPending = false
  }

  // Wrap to avoid double call if multiple events per frame
  const onScroll = (e) => {
    if (rafPending) return
    rafPending = true
    // Use rAF to batch, but keep transform work minimal
    requestAnimationFrame(() => handle(e))
  }

  lenis.on("scroll", onScroll)

  const onResize = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      tweens.forEach(({ skewTo, scaleTo }) => {
        skewTo(0)
        scaleTo(1)
      })
    }
  }
  window.addEventListener("resize", onResize)

  return () => {
    lenis.off("scroll", onScroll)
    window.removeEventListener("resize", onResize)
    tweens.forEach(({ el }) => {
      gsap.set(el, { clearProps: "transform,willChange" })
    })
  }
}
