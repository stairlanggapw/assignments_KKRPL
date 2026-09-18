import { Download } from "lucide-react"
import { site } from "../data/site"
import { scrollToSection } from "../animations/lenis"

export default function Navbar() {
  const handleNavClick = (e, href) => {
    if (!href || !href.startsWith("#")) return
    e.preventDefault()
    scrollToSection(href)
  };

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-transparent bg-bg/0 px-6 backdrop-blur-[0px] lg:px-8"
    >
      <a
        href="#main-content"
        onClick={(e) => handleNavClick(e, "#main-content")}
        aria-label="Stefanus Airlangga — go to main content"
        className="pointer-events-auto rounded-full bg-transparent px-1 py-1 font-heading text-[0.95rem] font-semibold tracking-[-0.02em] text-text focus-visible:outline-offset-4"
      >
        <span className="inline">STEFANUS</span>
        <span className="hidden font-body text-sm font-normal tracking-normal text-text-muted sm:inline">
          {" "}
          — Airlangga
        </span>
      </a>

      <div className="pointer-events-auto hidden items-center gap-6 md:flex" aria-label="Sections">
        {site.nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            data-cursor="hover"
            className="rounded-full px-2 py-1 text-xs tracking-[0.16em] text-text-faint uppercase transition hover:text-text focus-visible:outline-offset-4"
          >
            {item.label}
          </a>
        ))}
      </div>

      <div className="pointer-events-auto flex items-center gap-2">
        <a
          href={site.cv.href}
          download={site.cv.download}
          aria-label="Download CV PDF — langsung download"
          data-cursor="hover"
          className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-border bg-bg-elevated/60 px-4 py-2 text-xs tracking-[0.14em] text-text-muted uppercase backdrop-blur transition hover:border-border-strong hover:text-text focus-visible:outline-offset-4"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">{site.cv.label}</span>
          <span className="sm:hidden">CV</span>
        </a>
      </div>
    </nav>
  )
}
