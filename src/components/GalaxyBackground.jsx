import { useEffect, useRef } from "react"
import { prefersReducedMotion } from "../animations/intro"
import { isFinePointer } from "../animations/cursor"

const PALETTE = [
  { r: 230, g: 234, b: 242 },
  { r: 107, g: 123, b: 255 },
  { r: 34, g: 211, b: 238 },
]

function pickColor() {
  const r = Math.random()
  if (r < 0.52) return PALETTE[0]
  if (r < 0.82) return PALETTE[1]
  return PALETTE[2]
}

function getStarCount() {
  if (typeof window === "undefined") return 110
  if (window.matchMedia("(max-width: 767px)").matches) return 70
  if (window.matchMedia("(max-width: 1024px)").matches) return 100
  return 110
}

export default function GalaxyBackground() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let dpr = Math.min(window.devicePixelRatio || 1, 1.8)
    let w = 0
    let h = 0
    let stars = []
    let rafId = 0
    let running = true
    let time = 0

    let mouseX = 0
    let mouseY = 0
    let smoothMouseX = 0
    let smoothMouseY = 0
    let hasFinePointer = isFinePointer()

    const createStars = () => {
      const count = getStarCount()
      stars = Array.from({ length: count }, () => {
        const depth = Math.random()
        return {
          x: Math.random(),
          y: Math.random(),
          r: 0.6 + Math.random() * 1.25,
          baseAlpha: 0.22 + Math.random() * 0.38,
          twSpeed: 0.7 + Math.random() * 2.2,
          phase: Math.random() * Math.PI * 2,
          color: pickColor(),
          depth,
          glow: Math.random() < 0.12,
        }
      })
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.8)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + "px"
      canvas.style.height = h + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const targetCount = getStarCount()
      if (Math.abs(targetCount - stars.length) > 5) createStars()
    }

    createStars()
    resize()

    const onPointerMove = (e) => {
      if (!hasFinePointer) return
      mouseX = e.clientX / w - 0.5
      mouseY = e.clientY / h - 0.5
    }

    const onResize = () => {
      hasFinePointer = isFinePointer()
      resize()
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        if (rafId) cancelAnimationFrame(rafId)
      } else if (!running) {
        running = true
        time = performance.now() * 0.001
        loop()
      }
    }

    let scrollParallax = 0
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - h
      if (maxScroll <= 0) return
      const p = window.scrollY / maxScroll
      scrollParallax = (p - 0.5) * 6
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    const loop = () => {
      if (!running) return
      rafId = requestAnimationFrame(loop)
      time += 0.016

      smoothMouseX += (mouseX - smoothMouseX) * 0.06
      smoothMouseY += (mouseY - smoothMouseY) * 0.06

      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        const px = smoothMouseX * s.depth * 14
        const py = smoothMouseY * s.depth * 8 + scrollParallax * s.depth * 0.6
        const x = s.x * w + px
        const y = s.y * h + py
        const tw = Math.sin(time * s.twSpeed + s.phase) * 0.16
        const alpha = Math.max(0, Math.min(1, s.baseAlpha + tw))
        if (x < -10 || x > w + 10 || y < -10 || y > h + 10) continue
        ctx.beginPath()
        ctx.arc(x, y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color.r},${s.color.g},${s.color.b},${alpha})`
        if (s.glow) {
          ctx.shadowBlur = 6
          ctx.shadowColor = `rgba(${s.color.r},${s.color.g},${s.color.b},${alpha * 0.9})`
        } else {
          ctx.shadowBlur = 0
        }
        ctx.fill()
      }
      ctx.shadowBlur = 0
    }

    loop()

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("resize", onResize)
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("visibilitychange", onVisibility)
      ctx.clearRect(0, 0, w, h)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden motion-reduce:hidden"
      style={{ mixBlendMode: "screen" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ opacity: 0.7 }} />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-50"
        style={{
          background: "radial-gradient(ellipse 700px 420px at 50% 38%, transparent 60%, rgba(7,10,18,0.45) 92%)",
        }}
      />
    </div>
  )
}
