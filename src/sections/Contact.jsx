import { useEffect, useRef, useState } from "react"
import { gsap } from "../animations/gsap"
import { prefersReducedMotion } from "../animations/intro"
import { ArrowUpRight } from "lucide-react"
import SocialIcons from "../components/SocialIcons"

export default function Contact() {
  const sectionRef = useRef(null)
  const formRef = useRef(null)
  const magnetRef = useRef(null)
  const [status, setStatus] = useState({ type: "", message: "" })
  const [values, setValues] = useState({ username: "", email: "", message: "" })

  useEffect(() => {
    const form = formRef.current
    if (!form) return
    if (prefersReducedMotion()) {
      gsap.set(form.querySelectorAll("[data-contact-field]"), { clearProps: "all" })
      return
    }
    const ctx = gsap.context(() => {
      const fields = form.querySelectorAll("[data-contact-field]")
      gsap.set(fields, { autoAlpha: 0, y: 14 })
      gsap.to(fields, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.07,
        overwrite: "auto",
        scrollTrigger: { trigger: sectionRef.current, start: "top 84%", invalidateOnRefresh: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Magnetic CTA — subtle pull toward the pointer (fine pointer only, refs only)
  useEffect(() => {
    const wrap = magnetRef.current
    const btn = wrap?.querySelector("[data-magnetic]")
    if (!wrap || !btn || prefersReducedMotion()) return
    if (typeof window.matchMedia !== "function" || !window.matchMedia("(pointer: fine)").matches) return
    const xTo = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power3.out" })
    const yTo = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power3.out" })
    const move = (e) => {
      const r = wrap.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * 0.18)
      yTo((e.clientY - (r.top + r.height / 2)) * 0.28)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    wrap.addEventListener("pointermove", move)
    wrap.addEventListener("pointerleave", leave)
    return () => {
      wrap.removeEventListener("pointermove", move)
      wrap.removeEventListener("pointerleave", leave)
      gsap.killTweensOf(btn)
      gsap.set(btn, { clearProps: "transform" })
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (status.type) setStatus({ type: "", message: "" })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const username = values.username.trim()
    const email = values.email.trim()
    const message = values.message.trim()

    if (!username || !email || !message) {
      setStatus({ type: "error", message: "Lengkapi username, email, dan pesan." })
      return
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!emailOk) {
      setStatus({ type: "error", message: "Format email tidak valid." })
      return
    }
    // Demo only — no backend. Show success and reset.
    setStatus({ type: "success", message: "Pesan terkirim — demo (belum ada backend). Terima kasih!" })
    setValues({ username: "", email: "", message: "" })
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="relative overflow-hidden border-t border-border/60 bg-bg px-6 py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-xs tracking-[0.18em] text-text-faint">09 / CONTACT</span>
            <h3 id="contact-heading" className="font-heading text-[0.95rem] tracking-[-0.015em] text-text">
              Get in Touch
            </h3>
          </div>
          <p className="hidden text-xs tracking-[0.16em] text-text-faint uppercase sm:block">Minimal — 3 fields</p>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_1.45fr] lg:gap-16">
          {/* Left — editorial copy */}
          <div className="space-y-4">
            <h4 className="font-heading text-[1.7rem] leading-none tracking-[-0.03em] text-text md:text-[2.1rem]">LET&apos;S TALK</h4>
            <p className="font-heading text-[1.7rem] leading-none tracking-[-0.03em] text-text-muted md:text-[2.1rem]">MINIMAL</p>
            <div aria-hidden="true" className="h-px w-12 bg-border/60" />
            <p className="max-w-md text-sm leading-6 text-text-muted">
              Punya ide atau proyek? Kirim pesan singkat — hanya butuh username, email, dan deskripsi pesan. Tombol Contact di navigasi akan mengarah ke sini.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded-full border border-border/40 bg-bg-elevated/30 px-3 py-1 text-xs tracking-[0.1em] text-text-muted uppercase">Semarang, ID</span>
              <span className="rounded-full border border-border/30 bg-transparent px-3 py-1 text-xs tracking-[0.1em] text-text-faint uppercase">Portfolio 2026</span>
            </div>
            <div data-contact-field className="pt-3">
              <p className="text-xs tracking-[0.14em] text-text-faint uppercase">Connect —</p>
              <div className="mt-3">
                <SocialIcons variant="contact" />
              </div>
            </div>
          </div>

          {/* Right — form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-border/30 bg-bg-elevated p-5 md:p-6 lg:p-7"
          >
            <div data-contact-field className="space-y-1.5">
              <label htmlFor="contact-username" className="text-xs tracking-[0.14em] text-text-faint uppercase">
                Username
              </label>
              <input
                id="contact-username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={values.username}
                onChange={handleChange}
                placeholder="stefanus"
                className="h-11 w-full rounded-xl border border-border/40 bg-bg px-4 text-sm text-text placeholder:text-text-faint/60 focus:border-accent focus:outline-none"
              />
            </div>

            <div data-contact-field className="mt-4 space-y-1.5">
              <label htmlFor="contact-email" className="text-xs tracking-[0.14em] text-text-faint uppercase">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={values.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="h-11 w-full rounded-xl border border-border/40 bg-bg px-4 text-sm text-text placeholder:text-text-faint/60 focus:border-accent focus:outline-none"
              />
            </div>

            <div data-contact-field className="mt-4 space-y-1.5">
              <label htmlFor="contact-message" className="text-xs tracking-[0.14em] text-text-faint uppercase">
                Deskripsi Pesan
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                value={values.message}
                onChange={handleChange}
                placeholder="Ceritakan kebutuhan project..."
                className="min-h-[112px] w-full resize-none rounded-xl border border-border/40 bg-bg px-4 py-3 text-sm leading-6 text-text placeholder:text-text-faint/60 focus:border-accent focus:outline-none"
              />
            </div>

            <div ref={magnetRef} data-contact-field className="mt-6 flex items-center gap-3 p-1">
              <button
                type="submit"
                data-magnetic
                className="group inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-accent/30 bg-accent px-6 py-2.5 text-xs font-semibold tracking-[0.12em] text-white uppercase transition will-change-transform hover:border-accent hover:bg-accent-strong hover:shadow-[0_0_24px_rgba(107,123,255,0.35)] focus-visible:outline-offset-4"
              >
                Kirim Pesan <ArrowUpRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
              </button>
              <span className="hidden text-xs tracking-[0.1em] text-text-faint uppercase sm:inline">Demo — no backend</span>
            </div>

            <p aria-live="polite" className={`mt-3 min-h-[1.25rem] text-sm leading-5 ${status.type === "error" ? "text-red-400" : status.type === "success" ? "text-emerald-400" : "text-transparent"}`}>
              {status.message || "—"}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
