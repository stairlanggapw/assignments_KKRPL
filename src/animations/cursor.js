import { gsap } from "./gsap"
import { prefersReducedMotion as prefersReduced } from "./intro"

export function isFinePointer() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false
  return window.matchMedia("(pointer: fine)").matches && window.matchMedia("(hover: hover)").matches
}

export function prefersReducedMotion() {
  return prefersReduced()
}

export function createCursorTweens({ ring, dot, label }) {
  const ringX = gsap.quickTo(ring, "x", { duration: 0.38, ease: "power3.out" })
  const ringY = gsap.quickTo(ring, "y", { duration: 0.38, ease: "power3.out" })
  const dotX = gsap.quickTo(dot, "x", { duration: 0.16, ease: "power3.out" })
  const dotY = gsap.quickTo(dot, "y", { duration: 0.16, ease: "power3.out" })

  const set = {
    default() {
      gsap.to(ring, { scale: 1, borderColor: "rgba(30,42,74,1)", backgroundColor: "rgba(14,20,36,0)", duration: 0.28, ease: "power2.out", overwrite: "auto" })
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.2, overwrite: "auto" })
      gsap.to(label, { autoAlpha: 0, scale: 0.9, duration: 0.2, overwrite: "auto" })
    },
    hover() {
      gsap.to(ring, { scale: 1.7, borderColor: "rgba(107,123,255,0.9)", backgroundColor: "rgba(107,123,255,0.12)", duration: 0.28, ease: "power2.out", overwrite: "auto" })
      gsap.to(dot, { scale: 0.55, opacity: 1, duration: 0.2, overwrite: "auto" })
      gsap.to(label, { autoAlpha: 0, scale: 0.9, duration: 0.15, overwrite: "auto" })
    },
  }

  return { ringX, ringY, dotX, dotY, set }
}
