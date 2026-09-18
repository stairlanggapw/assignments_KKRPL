import { ArrowDown } from "lucide-react"
import DualImageMask from "../components/DualImageMask"
import { site } from "../data/site"

export default function Hero() {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-bg px-6 pt-14 pb-6 lg:px-8 lg:pt-14"
    >
      {/* Subtle editorial glow — space feeling from darkness, not decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 720px 460px at 28% 32%, rgba(107,123,255,0.06), transparent 64%), radial-gradient(ellipse 520px 360px at 72% 78%, rgba(34,211,238,0.035), transparent 68%)",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-14 hidden h-px bg-border/30 lg:block lg:inset-x-8" />

      {/* Center composition — editorial, asymmetrical */}
      <div className="relative flex flex-1 flex-col justify-center py-6 md:py-6 lg:py-4">
        {/* Mobile: stacked, portrait first for prominence */}
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6 xl:gap-8">
          {/* TYPOGRAPHY — left, readable, not hidden behind face */}
          <div className="order-2 flex flex-col gap-5 lg:order-1 lg:gap-6">
            {/* Eyebrow */}
            <div data-hero-meta className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.62rem] tracking-[0.18em] text-text-faint uppercase">
              <span className="text-text-muted">Portfolio — {site.year}</span>
              <span aria-hidden="true" className="h-px w-6 bg-border/60" />
              <span>STEFANUS AIRLANGGA</span>
            </div>

            {/* Primary identity — large, editorial, two-level */}
            <div data-hero-typo className="flex flex-col">
              <h2
                data-hero-typo-line
                className="font-heading text-[clamp(2.6rem,7.5vw,5.2rem)] leading-[0.85] font-bold tracking-[-0.05em] text-text lg:text-[clamp(3.2rem,6.2vw,5.6rem)] xl:text-[5.8rem]"
              >
                FRONTEND
              </h2>
              <h2
                data-hero-typo-line
                className="font-heading text-[clamp(2.6rem,7.5vw,5.2rem)] leading-[0.85] font-bold tracking-[-0.05em] text-text lg:text-[clamp(3.2rem,6.2vw,5.6rem)] xl:text-[5.8rem]"
              >
                <span className="text-text">DEVELOPER</span>
              </h2>
              {/* Accent underline — restrained indigo */}
              <div data-hero-typo-line aria-hidden="true" className="mt-3 h-px w-[88px] bg-accent/40 lg:mt-4 lg:w-[96px]" />
            </div>

            {/* Secondary identity */}
            <div data-hero-meta className="flex flex-col gap-2">
              <p className="font-heading text-[0.85rem] tracking-[-0.01em] text-text md:text-[0.95rem]">
                Stefanus Airlangga <span className="font-body font-normal tracking-[0.14em] text-text-faint">— {site.location}</span>
              </p>
              <p className="max-w-[36ch] text-sm leading-6 text-text-muted">
                Creative technology & interactive experiences — building minimal, precise interfaces with cinematic motion.
              </p>
            </div>

            {/* Supporting metadata — small, editorial */}
            <div data-hero-meta className="flex flex-wrap gap-2 pt-1">
              <span className="rounded-full border border-border bg-bg-elevated/50 px-3 py-1 text-[0.68rem] tracking-[0.14em] text-text-muted uppercase">
                {site.role}
              </span>
              <span className="rounded-full border border-border/60 bg-transparent px-3 py-1 text-[0.68rem] tracking-[0.12em] text-text-faint uppercase">
                Creative Technology
              </span>
              <span className="hidden rounded-full border border-border/40 bg-transparent px-3 py-1 text-[0.68rem] tracking-[0.12em] text-text-faint uppercase sm:inline-flex">
                Interactive
              </span>
            </div>

            {/* Technical stack — real project dependencies */}
            <div
              data-hero-meta
              aria-hidden="true"
              className="pointer-events-none flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6rem] tracking-[0.28em] text-text-faint/70 uppercase select-none"
            >
              <span>React</span>
              <span className="text-border-strong">/</span>
              <span>GSAP</span>
              <span className="text-border-strong">/</span>
              <span>Lenis</span>
              <span className="text-border-strong">/</span>
              <span>UI — UX</span>
            </div>
          </div>

          {/* PORTRAIT — reduced dominance, focal but breathing room */}
          <div
            data-hero-portrait
            data-velocity
            className="order-1 relative mx-auto flex w-[min(72vw,310px)] justify-center sm:w-[min(68vw,340px)] md:w-[380px] lg:order-2 lg:mx-0 lg:ml-auto lg:w-[420px] xl:w-[440px]"
          >
            {/* Technical frame — broken corners + slow orbit, interface chrome */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 hidden select-none md:block motion-reduce:hidden"
            >
              {/* soft glow behind portrait */}
              <div
                className="absolute -inset-6"
                style={{
                  background:
                    "radial-gradient(circle 220px at 50% 42%, rgba(107,123,255,0.08), transparent 70%)",
                }}
              />
              {/* slow orbit system — square wrapper so rotation stays circular */}
              <div className="absolute top-1/2 left-1/2 aspect-square w-[118%] -translate-x-1/2 -translate-y-1/2">
                <div className="absolute inset-0 rounded-full border border-border/25" />
                <div className="animate-orbit absolute inset-0">
                  <span className="absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/80" />
                </div>
                <div className="animate-orbit-rev absolute inset-8 rounded-full border border-dashed border-border/25">
                  <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent/80" />
                </div>
              </div>
              {/* broken corner markers */}
              <span className="absolute top-0 left-0 h-5 w-5 border-t border-l border-border/50" />
              <span className="absolute top-0 right-0 h-5 w-5 border-t border-r border-border/50" />
              <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-border/50" />
              <span className="absolute right-0 bottom-0 h-5 w-5 border-r border-b border-border/50" />
              {/* coordinate labels */}
              <span className="absolute -top-1 left-6 bg-bg px-1 text-[0.55rem] tracking-[0.2em] text-text-faint/60 uppercase">
                Fig.01
              </span>
              <span className="absolute -right-1 -bottom-1 bg-bg px-1 text-[0.55rem] tracking-[0.2em] text-text-faint/60 uppercase">
                Portrait — {site.year}
              </span>
            </div>
            <div className="relative w-full lg:translate-x-2">
              <DualImageMask />
              {/* Integrate portrait with bg — no card, soft blend only */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg via-bg/45 to-transparent md:h-24"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-bg/15 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  background: "radial-gradient(ellipse 420px 320px at 50% 45%, transparent 60%, var(--color-bg) 92%)",
                }}
              />
              {/* Subtle left fade for intentional overlap with typography */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 hidden w-10 bg-gradient-to-r from-bg/20 to-transparent lg:block"
              />
            </div>

            {/* Floating meta beside portrait — desktop only, editorial tension */}
            <div
              data-hero-meta
              aria-hidden="true"
              className="pointer-events-none absolute -right-2 top-2 hidden flex-col items-end gap-1 text-right lg:flex xl:-right-4"
            >
              <span className="flex items-center gap-1.5 rounded-full border border-border/40 bg-bg-elevated/40 px-2.5 py-1 text-[0.58rem] tracking-[0.16em] text-text-faint uppercase backdrop-blur">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-cyan" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
                </span>
                Available
              </span>
            </div>
          </div>
        </div>

        {/* Central data path — hairline with nodes bridging the negative space */}
        <div
          data-hero-meta
          aria-hidden="true"
          className="pointer-events-none absolute top-2 bottom-2 left-1/2 hidden w-px -translate-x-1/2 select-none lg:block"
        >
          <span className="absolute inset-0 bg-gradient-to-b from-transparent via-border/50 to-transparent" />
          <span className="absolute top-[16%] left-1/2 -translate-x-1/2">
            <span className="animate-ping-soft block h-1.5 w-1.5 rounded-full bg-cyan" />
          </span>
          <span className="absolute top-[52%] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-border-strong" />
          <span className="absolute bottom-[20%] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent/80" />
        </div>

        {/* Negative space spacer — lets composition breathe */}
        <div aria-hidden="true" className="hidden h-4 lg:block" />
      </div>

      {/* Oversized support typography — clipped visual layer, never the message */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 overflow-hidden select-none motion-reduce:hidden"
      >
        <p
          data-hero-bgword
          className="font-heading translate-y-[18%] text-center text-[19vw] leading-[0.8] font-bold tracking-[-0.04em] whitespace-nowrap text-transparent lg:text-[14vw]"
          style={{ WebkitTextStroke: "1px rgba(138,148,176,0.16)" }}
        >
          INTERACTIVE
        </p>
      </div>

      {/* Information strip — slow editorial ticker */}
      <div
        data-hero-meta
        aria-hidden="true"
        className="ticker-mask pointer-events-none relative z-10 mt-2 hidden overflow-hidden border-y border-border/30 py-2 select-none md:block motion-reduce:hidden"
      >
        <div className="animate-ticker flex w-max items-center gap-10 text-[0.6rem] tracking-[0.3em] whitespace-nowrap text-text-faint/60 uppercase">
          {[0, 1].map((half) => (
            <div key={half} className="flex items-center gap-10">
              {["Indonesia", "Frontend", "Motion", "Interaction", site.year].map((w) => (
                <span key={`${half}-${w}`} className="flex items-center gap-10">
                  <span>{w}</span>
                  <span className="h-px w-6 bg-border/60" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar — supporting information + scroll */}
      <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-8">
        <div data-hero-meta className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.62rem] tracking-[0.18em] text-text-faint uppercase">
            <span>Indonesia</span>
            <span aria-hidden="true" className="h-px w-4 bg-border/50" />
            <span>Portfolio / {site.year}</span>
            <span aria-hidden="true" className="hidden sm:inline h-px w-4 bg-border/50" />
            <span className="hidden sm:inline">Editorial — Space</span>
          </div>
          <p className="hidden max-w-md text-xs leading-5 text-text-faint md:block">
            Focused on calm surfaces with deliberate detail — dark technology, typographic clarity, subtle motion.
          </p>
        </div>

        <div className="flex items-end justify-between gap-6 md:flex-col md:items-end">
          <div data-hero-meta className="hidden gap-3 text-[0.62rem] tracking-[0.18em] text-text-faint uppercase md:flex">
            <a href="#about" className="transition hover:text-text-muted focus-visible:outline-offset-4">
              About
            </a>
            <span aria-hidden="true" className="text-border">
              /
            </span>
            <a href="#projects" className="transition hover:text-text-muted focus-visible:outline-offset-4">
              Work
            </a>
            <span aria-hidden="true" className="text-border">
              /
            </span>
            <a href="#contact" className="transition hover:text-text-muted focus-visible:outline-offset-4">
              Contact
            </a>
          </div>

          <div data-hero-scroll className="flex items-center gap-3" aria-hidden="true">
            <div className="flex flex-col items-start gap-1 md:items-end">
              <span className="text-[0.62rem] tracking-[0.22em] text-text-faint uppercase">Scroll to explore</span>
              <span className="font-heading text-[0.62rem] tracking-[0.16em] text-text-faint/60 uppercase">01 — 09</span>
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-bg-elevated/60">
              <ArrowDown className="animate-scroll-hint h-3.5 w-3.5 text-text-faint" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
