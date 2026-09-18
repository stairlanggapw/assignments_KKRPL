import { gsap, ScrollTrigger } from "./gsap"
import { prefersReducedMotion } from "./intro"

function isDesktopViewport() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return true
  return window.matchMedia("(min-width: 768px)").matches
}

/**
 * Single scroll-driven loading rail for the Education timeline.
 *
 * ONE ScrollTrigger maps timeline traversal → ONE progress value (0..1).
 * Everything derives from that value:
 * - progress track scaleY (origin top)
 * - indicator travel (always parked at the line tip)
 * - node activation (threshold = node center / rail height, measured live)
 *
 * No per-item progress triggers, no React state, fully reversible scrub.
 * Expects inside `timeline`: [data-timeline-progress], [data-timeline-thumb],
 * and any number of [data-edu-node] elements.
 */
export function createEducationTimeline({ timeline } = {}) {
  if (!timeline || prefersReducedMotion()) return () => {}
  if (typeof window === "undefined") return () => {}

  const progress = timeline.querySelector("[data-timeline-progress]")
  const indicator = timeline.querySelector("[data-timeline-thumb]")
  const nodes = Array.from(timeline.querySelectorAll("[data-edu-node]"))
  if (!progress) return () => {}

  // Desktop timelines get pinned + covered by the next section, so the fill
  // must complete before the pin engages. Mobile has no pin — track the
  // full traversal instead. Same 768px breakpoint as the overlap system.
  const desktop = isDesktopViewport()
  const start = desktop ? "top 88%" : "top 80%"
  const end = desktop ? "top 38%" : "bottom 45%"

  // Node thresholds in rail units — remeasured on every refresh so the
  // indicator and line tip always meet each node exactly, whatever the
  // entry heights are.
  let ratios = []
  const measure = () => {
    const box = timeline.getBoundingClientRect()
    const h = timeline.offsetHeight || 1
    ratios = nodes.map((n) => {
      const r = n.getBoundingClientRect()
      const p = (r.top + r.height / 2 - box.top) / h
      return Math.min(1, Math.max(0, p))
    })
  }

  gsap.set(progress, { scaleY: 0, transformOrigin: "top center" })
  if (indicator) gsap.set(indicator, { xPercent: -50, y: 0 })
  nodes.forEach((n) => n.classList.remove("is-node-active"))
  measure()

  const apply = (p) => {
    gsap.set(progress, { scaleY: p })
    if (indicator) {
      gsap.set(indicator, { y: p * Math.max(0, timeline.offsetHeight - 16) })
    }
    nodes.forEach((n, i) => {
      n.classList.toggle("is-node-active", p >= (ratios[i] ?? 1))
    })
  }

  const st = ScrollTrigger.create({
    trigger: timeline,
    start,
    end,
    scrub: 0.5,
    invalidateOnRefresh: true,
    onRefresh: measure,
    onUpdate: (self) => apply(self.progress),
  })
  apply(0)

  return () => {
    try {
      st.kill()
    } catch {}
    gsap.set(progress, { clearProps: "transform" })
    if (indicator) gsap.set(indicator, { clearProps: "transform" })
    nodes.forEach((n) => n.classList.remove("is-node-active"))
  }
}
