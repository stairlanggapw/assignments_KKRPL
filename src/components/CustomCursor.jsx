import { useEffect, useRef } from "react"
import { gsap } from "../animations/gsap"
import { createCursorTweens, isFinePointer, prefersReducedMotion } from "../animations/cursor"

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const dotRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion() || !isFinePointer()) return

    const cursor = cursorRef.current
    const ring = ringRef.current
    const dot = dotRef.current
    const label = labelRef.current
    if (!cursor || !ring || !dot || !label) return

    // Hide native cursor when custom is active
    document.documentElement.classList.add("has-custom-cursor")

    // Keep cursor hidden until first move
    gsap.set(cursor, { autoAlpha: 0 })
    gsap.set(ring, { xPercent: -50, yPercent: -50, scale: 1 })
    gsap.set(dot, { xPercent: -50, yPercent: -50 })
    gsap.set(label, { autoAlpha: 0, scale: 0.9 })

    const { ringX, ringY, dotX, dotY, set } = createCursorTweens({ ring, dot, label })

    let visible = false

    const move = (x, y) => {
      ringX(x)
      ringY(y)
      dotX(x)
      dotY(y)
      if (!visible) {
        visible = true
        gsap.to(cursor, { autoAlpha: 1, duration: 0.22, overwrite: "auto" })
      }
    }

    const onPointerMove = (e) => move(e.clientX, e.clientY)

    const onPointerLeave = () => {
      visible = false
      gsap.to(cursor, { autoAlpha: 0, duration: 0.22, overwrite: "auto" })
      set.default()
    }

    const onPointerEnter = () => {
      // will become visible on next move
    }

    // State handling via delegation — no React state per move
    const interactiveSelector = 'a, button, [data-cursor="hover"]'

    const handleState = (e) => {
      const target = e.target
      if (!target.closest) {
        set.default()
        return
      }
      if (target.closest(interactiveSelector)) {
        set.hover()
      } else {
        set.default()
      }
    }

    let ticking = false
    const onMouseOver = (e) => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        handleState(e)
        ticking = false
      })
    }

    const onMouseOut = (e) => {
      // When leaving a project/hover element, re-evaluate
      const related = e.relatedTarget
      if (!related || !related.closest) {
        set.default()
        return
      }
      // Defer to next mouseover; briefly keep state
      setTimeout(() => {
        const el = document.elementFromPoint(e.clientX, e.clientY)
        if (!el) {
          set.default()
          return
        }
        if (el.closest(interactiveSelector)) set.hover()
        else set.default()
      }, 16)
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("pointerleave", onPointerLeave)
    window.addEventListener("pointerenter", onPointerEnter)
    document.addEventListener("mouseover", onMouseOver, { passive: true })
    document.addEventListener("mouseout", onMouseOut, { passive: true })

    // Fast movement handled by quickTo smoothing already

    const onResize = () => {
      if (!isFinePointer()) {
        gsap.set(cursor, { autoAlpha: 0 })
      }
    }
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerleave", onPointerLeave)
      window.removeEventListener("pointerenter", onPointerEnter)
      document.removeEventListener("mouseover", onMouseOver)
      document.removeEventListener("mouseout", onMouseOut)
      window.removeEventListener("resize", onResize)
      document.documentElement.classList.remove("has-custom-cursor")
      gsap.set(cursor, { clearProps: "all" })
      gsap.set(ring, { clearProps: "all" })
      gsap.set(dot, { clearProps: "all" })
      gsap.set(label, { clearProps: "all" })
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] hidden opacity-0 md:block"
      style={{ pointerEvents: "none" }}
    >
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-bg-elevated/0 will-change-transform"
        style={{ borderColor: "rgba(30,42,74,1)" }}
      >
        <span
          ref={labelRef}
          className="pointer-events-none select-none text-[0.55rem] font-semibold tracking-[0.14em] text-text"
        >
          VIEW
        </span>
      </div>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-text will-change-transform"
      />
    </div>
  )
}
