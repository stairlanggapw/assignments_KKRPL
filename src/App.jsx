import { useEffect, useRef } from "react"
import { gsap, ScrollTrigger } from "./animations/gsap"
import { createIntroTyping, createIntroScroll, prefersReducedMotion } from "./animations/intro"
import { createHeroEntrance } from "./animations/hero"
import { createOverlappingSections } from "./animations/overlap"
import { useSmoothScroll } from "./hooks/useSmoothScroll"
import CustomCursor from "./components/CustomCursor"
import GalaxyBackground from "./components/GalaxyBackground"
import ShootingStars from "./components/ShootingStars"
import SocialIcons from "./components/SocialIcons"
import Navbar from "./components/Navbar"
import Hero from "./sections/Hero"
import About from "./sections/About"
import Biodata from "./sections/Biodata"
import Education from "./sections/Education"
import Organization from "./sections/Organization"
import Strengths from "./sections/Strengths"
import Achievements from "./sections/Achievements"
import Competencies from "./sections/Competencies"
import Projects from "./sections/Projects"
import Contact from "./sections/Contact"
import Footer from "./sections/Footer"

function App() {
  const introRef = useRef(null)
  const nameRef = useRef(null)
  const introContentRef = useRef(null)
  const heroRef = useRef(null)
  const navWrapRef = useRef(null)
  const overlapScopeRef = useRef(null)
  const aboutWrapRef = useRef(null)
  const educationWrapRef = useRef(null)
  const organizationWrapRef = useRef(null)
  const achievementsWrapRef = useRef(null)

  // Single global Lenis instance — all scroll sync lives in the hook
  useSmoothScroll()

  useEffect(() => {
    const reduced = prefersReducedMotion()
    const introEl = introRef.current
    const nameEl = nameRef.current
    const introContentEl = introContentRef.current
    const heroEl = heroRef.current
    const navEl = navWrapRef.current

    // One scoped context for all Intro/Hero scroll animations
    // Ensures duplicate ScrollTriggers are impossible and cleanup is atomic
    const ctx = gsap.context(() => {
      if (reduced) {
        if (nameEl) gsap.set(nameEl, { clearProps: "all" })
        if (heroEl) gsap.set(heroEl, { clearProps: "all" })
        if (navEl) gsap.set(navEl, { clearProps: "all" })
        return
      }

      if (navEl) gsap.set(navEl, { autoAlpha: 0, y: -8 })

      createIntroTyping(nameEl, {
        socialItems: introEl?.querySelectorAll("[data-intro-social-item]") ?? [],
      })

      createIntroScroll({
        trigger: introEl,
        target: introContentEl ?? nameEl,
        nextTarget: heroEl,
      })

      if (navEl && introEl) {
        gsap.to(navEl, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: introEl,
            start: "55% top",
            end: "75% top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
          overwrite: "auto",
        })
      }

      createHeroEntrance(heroEl)
    }, heroRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === introEl || t.vars.trigger === heroEl) t.kill()
      })
    }
  }, [])

  useEffect(() => {
    const sections = [
      aboutWrapRef.current,
      educationWrapRef.current,
      organizationWrapRef.current,
      achievementsWrapRef.current,
    ].filter(Boolean)

    const cleanup = createOverlappingSections({
      sections,
      scope: overlapScopeRef,
    })

    return () => {
      if (typeof cleanup === "function") cleanup()
    }
  }, [])

  return (
    <main id="main-content" className="overflow-x-clip bg-bg text-text">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <CustomCursor />
      <GalaxyBackground />
      <ShootingStars />
      <div ref={navWrapRef} className="contents">
        <Navbar />
      </div>

      <section
        ref={introRef}
        aria-label="Intro"
        className="relative flex h-[100svh] min-h-[100svh] w-full items-center justify-center overflow-hidden px-6"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_700px_420px_at_50%_45%,rgba(107,123,255,0.09),transparent_62%)]"
        />

        <div ref={introContentRef} className="flex w-full flex-col items-center">
          <h1
            ref={nameRef}
            aria-label="STEFANUS AIRLANGGA P.W"
            className="font-heading w-full max-w-none px-2 text-center text-[clamp(1.25rem,5vw,4.25rem)] leading-[0.95] font-bold tracking-[-0.03em] text-text md:text-[clamp(1.5rem,4.2vw,4.25rem)] lg:text-[4.25rem]"
          >
            {/* Filled by createIntroTyping — single line, standard speed */}
            STEFANUS AIRLANGGA P.W
          </h1>
          <div className="mt-7 motion-reduce:mt-5">
            <SocialIcons variant="intro" />
          </div>
        </div>

        <p
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.68rem] tracking-[0.22em] text-text-faint uppercase motion-reduce:hidden"
        >
          Scroll
        </p>
      </section>

      <div ref={heroRef}>
        <Hero />
      </div>

      <div ref={overlapScopeRef} className="overflow-x-clip">
        <div ref={aboutWrapRef} className="relative will-change-transform">
          <About />
        </div>
        <div ref={educationWrapRef} className="relative will-change-transform">
          <Education />
        </div>
        <div ref={organizationWrapRef} className="relative will-change-transform">
          <Organization />
        </div>
        <div ref={achievementsWrapRef} className="relative will-change-transform">
          <Achievements />
        </div>
        <Biodata />
        <Strengths />
        <Competencies />
        <Projects />
        <Contact />
      </div>

      <Footer />
    </main>
  )
}

export default App
