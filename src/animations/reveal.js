import { gsap } from "./gsap"
import { prefersReducedMotion } from "./intro"

export function createRevealBatch(elements, options = {}) {
  if (!elements?.length || prefersReducedMotion()) {
    if (elements?.length) gsap.set(elements, { clearProps: "all" })
    return null
  }

  const { stagger = 0.07, y = 18, duration = 0.7, start = "top 82%" } = options
  const trigger = options.trigger ?? elements[0]?.closest("section") ?? elements[0]

  gsap.set(elements, { autoAlpha: 0, y })

  const tween = gsap.to(elements, {
    autoAlpha: 1,
    y: 0,
    duration,
    ease: "power3.out",
    stagger,
    overwrite: "auto",
    scrollTrigger: {
      trigger,
      start,
      invalidateOnRefresh: true,
    },
  })

  return tween
}

export function createFadeUp(target, options = {}) {
  if (!target || prefersReducedMotion()) {
    if (target) gsap.set(target, { clearProps: "all" })
    return null
  }
  const { y = 20, duration = 0.8, start = "top 85%" } = options
  const trigger = options.trigger ?? target
  gsap.set(target, { autoAlpha: 0, y })
  return gsap.to(target, {
    autoAlpha: 1,
    y: 0,
    duration,
    ease: "power3.out",
    overwrite: "auto",
    scrollTrigger: {
      trigger,
      start,
      invalidateOnRefresh: true,
    },
  })
}
