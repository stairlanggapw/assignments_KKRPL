import { useEffect, useRef } from "react"
import { gsap } from "../animations/gsap"
import { prefersReducedMotion } from "../animations/intro"
import { registerShootingBoostSetter, clearShootingBoostSetter } from "../animations/shootingStars"

export default function ShootingStars() {
  const containerRef = useRef(null)
  const starsRef = useRef([])
  const timeoutRef = useRef(null)
  const boostRef = useRef(false)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const container = containerRef.current
    if (!container) return

    const isMobile = window.matchMedia("(max-width: 767px)").matches
    const getInterval = () =>
      boostRef.current
        ? 2800 + Math.random() * 2200
        : isMobile
          ? 6500 + Math.random() * 4000
          : 4200 + Math.random() * 3800

    const pool = starsRef.current.filter(Boolean)
    if (pool.length === 0) return

    pool.forEach((el) => gsap.set(el, { autoAlpha: 0, x: -200, y: 0, scaleX: 1 }))

    let activeIndex = 0
    let cancelled = false

    const spawn = () => {
      if (cancelled || document.hidden) {
        schedule()
        return
      }
      const el = pool[activeIndex % pool.length]
      activeIndex += 1
      if (!el) {
        schedule()
        return
      }

      const topPct = 6 + Math.random() * 48
      const startLeft = -18 - Math.random() * 12
      const angle = -36 - Math.random() * 9
      const len = 90 + Math.random() * 50
      const dur = 0.95 + Math.random() * 0.35

      gsap.set(el, {
        top: `${topPct}%`,
        left: `${startLeft}%`,
        width: `${len}px`,
        rotation: angle,
        scaleX: 0.7,
        autoAlpha: 0,
        x: 0,
        y: 0,
      })

      const travelX = window.innerWidth + len + 260
      const travelY = 180 + Math.random() * 120

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(el, { autoAlpha: 0 })
        },
      })
      tl.to(el, { autoAlpha: 1, scaleX: 1, duration: 0.18, ease: "power2.out" }, 0)
        .to(
          el,
          {
            x: travelX,
            y: travelY,
            duration: dur,
            ease: "power1.in",
          },
          0
        )
        .to(el, { autoAlpha: 0, duration: 0.22, ease: "power2.in" }, dur - 0.22)

      schedule()
    }

    const schedule = () => {
      if (cancelled) return
      const delay = getInterval()
      timeoutRef.current = window.setTimeout(spawn, delay)
    }

    registerShootingBoostSetter((active) => {
      boostRef.current = active
    })

    timeoutRef.current = window.setTimeout(spawn, 2200 + Math.random() * 2000)

    const onVisibility = () => {
      if (document.hidden) {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      } else if (!cancelled) {
        schedule()
      }
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      cancelled = true
      clearShootingBoostSetter()
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      document.removeEventListener("visibilitychange", onVisibility)
      pool.forEach((el) => {
        try {
          gsap.killTweensOf(el)
        } catch {}
        gsap.set(el, { clearProps: "all" })
      })
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2] overflow-hidden motion-reduce:hidden"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          ref={(el) => {
            starsRef.current[i] = el
          }}
          className="absolute h-[1.5px] opacity-0 will-change-transform"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 58%, white 100%)",
            boxShadow: "0 0 8px rgba(255,255,255,0.85), 0 0 14px rgba(107,123,255,0.45)",
            borderRadius: "999px",
          }}
        />
      ))}
    </div>
  )
}
