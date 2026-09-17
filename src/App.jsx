import { useEffect } from "react"
import { ScrollTrigger } from "./animations/gsap"
import { createLenis } from "./animations/lenis"

function App() {
  useEffect(() => {
    const lenis = createLenis()

    const handleScroll = () => ScrollTrigger.update()
    lenis.on("scroll", handleScroll)

    return () => {
      lenis.off("scroll", handleScroll)
      lenis.destroy()
    }
  }, [])

  return (
    <main className="min-h-screen bg-bg text-text">
      {/* Foundation placeholder — verifies typography, colors, and smooth scroll */}
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-24 lg:px-8">
        <p className="mb-4 text-sm tracking-[0.2em] text-cyan uppercase">
          Dark Technology — Space Aesthetic
        </p>
        <h1 className="font-heading max-w-3xl text-4xl leading-[0.95] md:text-5xl lg:text-6xl">
          Foundation
          <span className="block text-accent">Ready</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-text-muted">
          Space Grotesk untuk heading, Manrope untuk body. Latar gelap,
          skala tipografi, spacing, breakpoint responsif, dan transisi halus
          sudah aktif. Lenis dan GSAP + ScrollTrigger terpasang.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <span className="rounded-full border border-border bg-bg-elevated px-4 py-2 text-sm text-text-muted">
            Lenis: smooth scroll
          </span>
          <span className="rounded-full border border-border bg-bg-elevated px-4 py-2 text-sm text-text-muted">
            GSAP + ScrollTrigger
          </span>
          <span className="rounded-full border border-border bg-bg-elevated px-4 py-2 text-sm text-text-muted">
            Tailwind CSS 4
          </span>
        </div>
      </section>

      {/* Spacer to verify Lenis smooth scroll + ScrollTrigger pin/trigger readiness */}
      <section className="mx-auto max-w-7xl px-6 pb-32 lg:px-8">
        <div className="rounded-2xl border border-border bg-bg-elevated p-8 md:p-12">
          <h2 className="font-heading text-2xl">Scroll test area</h2>
          <p className="mt-3 max-w-2xl text-text-muted">
            Area ini sengaja tinggi untuk menguji Lenis. ScrollTrigger sudah
            terhubung via <code className="rounded bg-bg-soft px-1.5 py-0.5 text-sm text-text">lenis.on(&quot;scroll&quot;, ScrollTrigger.update)</code>
            . Hero dan section portfolio akan dibangun di tahap berikutnya.
          </p>
          <div className="mt-8 h-[60vh] rounded-xl border border-dashed border-border-strong bg-bg-soft/50" />
        </div>
      </section>
    </main>
  )
}

export default App
