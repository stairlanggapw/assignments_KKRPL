import { gsap } from "./gsap"
import { prefersReducedMotion } from "./intro"

export const MASK_SIZE = 180

function isFinePointer() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return true
  return window.matchMedia("(pointer: fine)").matches
}

function getResponsiveRadius(container) {
  const base = MASK_SIZE / 2
  if (!container) return base
  // Keep mask proportional on smaller containers — single variable, no hardcoded breakpoints
  const maxByContainer = container.clientWidth * 0.36
  return Math.min(base, maxByContainer, 140)
}

/**
 * Pointer-driven circular reveal for DualImageMask.
 * - Uses refs + GSAP, no React state per mousemove
 * - Single quickTo pair for x/y + single tween for radius
 * - Subtle stretch on fast movement (restrained)
 * - Cleans up all listeners / tweens / tickers
 */
export function createMaskController(container, overlay) {
  if (!container || !overlay) return () => {}

  // Reduced motion or coarse pointer → static fallback (only base visible)
  if (prefersReducedMotion() || !isFinePointer()) {
    overlay.style.display = "none"
    return () => {
      overlay.style.display = ""
    }
  }

  const state = {
    x: container.clientWidth / 2,
    y: container.clientHeight / 2,
    r: 0,
    rx: 0,
    ry: 0,
  }

  // Smooth position interpolation — single efficient mechanism, no timeline per mousemove
  const xTo = gsap.quickTo(state, "x", { duration: 0.42, ease: "power3.out" })
  const yTo = gsap.quickTo(state, "y", { duration: 0.42, ease: "power3.out" })

  let lastX = state.x
  let stretchX = 0
  let stretchY = 0

  const applyClip = () => {
    // Slight elliptical stretch based on velocity — restrained
    const rx = state.r + stretchX
    const ry = state.r + stretchY
    // Use ellipse for subtle stretch, fallback to circle (ellipse handles circle as equal axes)
    const clip = `ellipse(${rx}px ${ry}px at ${state.x}px ${state.y}px)`
    overlay.style.clipPath = clip
    overlay.style.webkitClipPath = clip
  }

  const ticker = () => {
    // Derive stretch from positional velocity (current vs last)
    const vx = state.x - lastX
    lastX = state.x
    // restrained: max ~14px stretch
    const targetStretchX = Math.max(-14, Math.min(14, vx * 0.45))
    // vertical stretch opposite to keep area roughly constant
    const targetStretchY = -targetStretchX * 0.35
    stretchX += (targetStretchX - stretchX) * 0.18
    stretchY += (targetStretchY - stretchY) * 0.18
    state.rx = state.r + stretchX
    state.ry = state.r + stretchY
    applyClip()
  }

  // Initial hidden state
  overlay.style.clipPath = `circle(0px at ${state.x}px ${state.y}px)`
  overlay.style.webkitClipPath = `circle(0px at ${state.x}px ${state.y}px)`
  overlay.style.willChange = "clip-path"

  let bounds = container.getBoundingClientRect()
  const updateBounds = () => {
    bounds = container.getBoundingClientRect()
  }

  const handleEnter = (e) => {
    updateBounds()
    const x = e.clientX - bounds.left
    const y = e.clientY - bounds.top
    // Place immediately near pointer for enter, then animate radius
    xTo(x)
    yTo(y)
    state.x = x
    state.y = y
    lastX = x
    const targetR = getResponsiveRadius(container)
    gsap.to(state, {
      r: targetR,
      duration: 0.62,
      ease: "power3.out",
      overwrite: "auto",
    })
    // Start ticker-driven clip updates
    gsap.ticker.add(ticker)
  }

  const handleMove = (e) => {
    const x = e.clientX - bounds.left
    const y = e.clientY - bounds.top
    xTo(x)
    yTo(y)
  }

  const handleLeave = () => {
    gsap.to(state, {
      r: 0,
      duration: 0.48,
      ease: "power3.inOut",
      overwrite: "auto",
      onComplete: () => {
        gsap.ticker.remove(ticker)
        stretchX = 0
        stretchY = 0
      },
    })
  }

  const handleResize = () => {
    updateBounds()
    applyClip()
  }

  container.addEventListener("pointerenter", handleEnter)
  container.addEventListener("pointermove", handleMove)
  container.addEventListener("pointerleave", handleLeave)
  window.addEventListener("resize", handleResize)
  window.addEventListener("orientationchange", handleResize)

  // Touch fallback: hide overlay (base only) — no tap reveal needed per spec simplest path
  const isTouch = !isFinePointer()

  return () => {
    container.removeEventListener("pointerenter", handleEnter)
    container.removeEventListener("pointermove", handleMove)
    container.removeEventListener("pointerleave", handleLeave)
    window.removeEventListener("resize", handleResize)
    window.removeEventListener("orientationchange", handleResize)
    gsap.ticker.remove(ticker)
    gsap.killTweensOf(state)
    overlay.style.clipPath = ""
    overlay.style.webkitClipPath = ""
    overlay.style.willChange = ""
    // Ensure overlay hidden after leave if still visible
    if (isTouch) overlay.style.display = ""
  }
}
