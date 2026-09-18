import { useEffect, useRef } from "react"
import { gsap } from "../animations/gsap"
import { prefersReducedMotion } from "../animations/intro"
import { site } from "../data/site"
import ProjectCard from "../components/ProjectCard"

const workImageEntries = import.meta.glob("../assets/images/*work*.*", {
  eager: true,
  query: "?url",
  import: "default",
})

const eduImageEntries = import.meta.glob("../assets/images/*Educational*.*", {
  eager: true,
  query: "?url",
  import: "default",
})

function getWorkImages() {
  return Object.entries(workImageEntries)
    .map(([path, url]) => ({ path, url }))
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((e) => e.url)
    .filter(Boolean)
}

function titleFromWorkPath(path) {
  const file = path.split("/").pop() || ""
  const base = file.replace(/\.[^.]+$/, "")
  const cleaned = base.replace(/^work[._]?/i, "").replace(/[_-]+/g, " ").trim()
  if (!cleaned) return "Work Project"
  return cleaned
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export default function Projects() {
  const sectionRef = useRef(null)
  const itemsRef = useRef([])

  useEffect(() => {
    const items = itemsRef.current.filter(Boolean)
    if (!items.length) return
    if (prefersReducedMotion()) {
      gsap.set(items, { clearProps: "all" })
      return
    }
    const ctx = gsap.context(() => {
      gsap.set(items, { autoAlpha: 0, y: 20, scale: 0.98 })
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        overwrite: "auto",
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%", invalidateOnRefresh: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const assign = (el) => {
    if (el && !itemsRef.current.includes(el)) itemsRef.current.push(el)
  }

  const entries = site.projects ?? []
  const hasData = entries.length > 0
  const workImages = getWorkImages()

  // If site.projects empty, build display from work* images in src/assets/images
  // This makes folder "work" images exclusive for project section as requested
  let display = []
  let placeholders = 0

  if (hasData) {
    display = entries.slice(0, 6).map((p, i) => {
      // Use work image as fallback if entry has no image
      const fallback = workImages[i % workImages.length]
      return { ...p, image: p.image ?? fallback }
    })
    placeholders = Math.max(0, 6 - display.length)
  } else {
    const eduEntry = Object.entries(eduImageEntries)[0]
    const combined = [
      ...Object.entries(workImageEntries).sort((a, b) => a[0].localeCompare(b[0])),
      ...(eduEntry ? [eduEntry] : []),
    ]
    const workEntries = combined.slice(0, 6).map(([path, url], idx) => {
      const isEdu = path.includes("Educational")
      return {
        title: isEdu ? "Educational Dashboard" : titleFromWorkPath(path),
        image: url,
        year: String(2024 + (idx % 2)),
        links: {},
      }
    })
    display = workEntries
    placeholders = Math.max(0, 6 - display.length)
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-label="Projects"
      className="relative overflow-hidden border-t border-border/60 bg-bg-elevated px-6 py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-xs tracking-[0.18em] text-text-faint">08 / PROJECTS</span>
            <h3 className="font-heading text-[0.95rem] tracking-[-0.015em] text-text">Selected Work</h3>
          </div>
          <p className="hidden text-xs tracking-[0.16em] text-text-faint uppercase sm:block">Grid — 3×2</p>
        </div>

        <div className="mt-4">
          <h4 className="font-heading text-[1.7rem] leading-none tracking-[-0.03em] text-text md:text-[2.1rem]">SELECTED</h4>
          <p className="font-heading text-[1.7rem] leading-none tracking-[-0.03em] text-text-muted md:text-[2.1rem]">WORK</p>
        </div>

        <div className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {display.map((p, idx) => (
            <ProjectCard key={`${p.title}-${idx}`} project={p} index={idx} articleRef={assign} />
          ))}

          {Array.from({ length: placeholders }).map((_, i) => {
            const idx = display.length + i
            return (
              <article
                key={`placeholder-${idx}`}
                ref={assign}
                className="flex flex-col overflow-hidden rounded-2xl border border-border/30 bg-bg-soft/40 will-change-transform"
              >
                <div className="flex aspect-[16/10] items-center justify-center bg-bg">
                  <span className="text-xs tracking-[0.12em] text-text-faint/60 uppercase">Preview</span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="font-heading text-[1.05rem] tracking-[-0.015em] text-text/40">Project — to be added</h4>
                    <span className="font-heading text-xs tracking-[0.12em] text-text-faint/40 uppercase">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="inline-flex rounded-full border border-border/20 bg-bg px-4 py-2 text-xs tracking-[0.08em] text-text-faint/50 uppercase">
                      Upcoming
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <p className="mt-6 max-w-2xl text-xs leading-5 text-text-faint">
          Grid 3×2 — {hasData ? "menampilkan hingga 6 proyek coding." : "menggunakan foto dari folder work di src/assets/images."} Tambah data di{" "}
          <code className="rounded bg-bg-soft px-1 py-0.5 text-text-muted">site.projects</code> untuk override otomatis.
        </p>
      </div>
    </section>
  )
}
