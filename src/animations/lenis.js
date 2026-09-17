import Lenis from "lenis"

export function createLenis(options = {}) {
  return new Lenis({
    autoRaf: true,
    lerp: 0.08,
    smoothWheel: true,
    ...options,
  })
}
