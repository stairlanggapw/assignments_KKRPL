# Personal Portfolio — Stefanus Airlangga

© stairlanggapw. All rights reserved.

A cinematic, interactive personal portfolio with a dark technology + space aesthetic. Built with React 19, Vite 8, Tailwind CSS 4, GSAP + ScrollTrigger, and Lenis smooth scrolling.

## Features

### Intro
- Single-line typing animation (`STEFANUS AIRLANGGA P.W`, standard speed, no caret)
- Social icons (GitHub, Instagram, LinkedIn) staggering in one by one after typing completes
- Scroll-scrubbed transition into the Hero; navbar fades in on scroll

### Hero (cinematic editorial)
- Oversized `FRONTEND / DEVELOPER` typography with portrait overlapping the type
- `DualImageMask` — secondary photo revealed through a pointer-controlled circular lens (interpolated, with trailing effect)
- Portrait frame (broken corners, coordinate labels), slow dual-orbit rings, central data path, outlined `INTERACTIVE` backdrop word with scroll drift, tech metadata row, slow info ticker, bobbing scroll indicator
- Staggered GSAP entrance (typography → portrait → metadata → scroll cue)

### Atmosphere
- `GalaxyBackground` — fixed canvas starfield (110 desktop / 100 tablet / 70 mobile) in white + indigo (`#6B7BFF`) + cyan (`#22D3EE`), twinkle + subtle mouse parallax, DPR-capped, pauses when tab hidden
- `ShootingStars` — random-interval meteors, frequency boosted during overlapping-section transitions
- CSS-only nebula glows (`body::before`)

### Navigation & scrolling
- Minimal fixed navbar (wordmark, About / Work / Contact, Download CV) with Lenis-powered smooth scrolling to sections (offset for fixed header, reduced-motion aware)
- Single global Lenis instance (`useSmoothScroll`) synced with ScrollTrigger; no duplicate scrollers
- Cinematic overlapping (pinned) sections on desktop: About → Education → Organization → Achievements

### Sections
- **About** — identity editorial with magnetic photo card (proximity pull, 3D tilt, cursor spotlight, image parallax, border glow), portrait crop, personal metadata, focus strip, outlined `IDENTITY` backdrop
- **Biodata** — Personal Identity System: giant name, interactive orbital badge, status pulse, hoverable info rows, statement, traits, slow focus ticker
- **Education** — real entries (SD Marsudirini, SMPN 23 Semarang, SMKN 3 Kendal); vertical loading rail driven by a single ScrollTrigger (progress fill + traveling indicator + progressive node activation, reversible scrub)
- **Organization** — 3 demo placeholders (`isPlaceholder: true`); editorial archive list with pointer-following floating preview, staggered reveal, marquee
- **Strengths** — single-focus interactive viewer (hover/tap, autoplay, progress line, trait strip)
- **Achievements** — single-focus interactive archive (prev/next, indicators, progress, autoplay, pointer micro-interaction)
- **Competencies** — editorial skill list + slow technology ticker from real data
- **Projects** — 3×2 photo grid fed by `work*` + Educational Dashboard images; per-card cursor-following border light (independent quickTo interpolators, CSS-var positioned, masked ring segment)
- **Contact** — minimal form (username / email / message, demo validation) with magnetic submit button + social icons
- **Custom cursor** — dot + ring with hover states (native cursor hidden on fine pointers only)

### Cross-cutting
- All content data-driven from `src/data/site.js` with `isPlaceholder` flags for demo content
- `prefers-reduced-motion` respected everywhere (static fallbacks, no animation loops)
- Responsive: mobile-first recomposition (no hover dependency), 44px touch targets, no horizontal overflow
- Accessibility: skip link, aria labels/live regions, keyboard focus states, semantic landmarks

## Project structure

```
src/
├── main.jsx            # entry
├── App.jsx             # intro, hero, overlapping sections, composition
├── index.css           # Tailwind 4 theme + shared keyframes/motifs
├── sections/           # Hero, About, Biodata, Education, Organization,
│                       # Strengths, Achievements, Competencies, Projects,
│                       # Contact, Footer
├── components/         # Navbar, CustomCursor, DualImageMask, GalaxyBackground,
│                       # ShootingStars, OrbitBadge, InteractivePhotoCard,
│                       # ProjectCard, SocialIcons
├── animations/         # gsap, lenis, intro, hero, overlap, reveal, cursor,
│                       # imageMask, velocity, shootingStars, educationTimeline
├── hooks/              # useSmoothScroll (single Lenis owner)
├── data/site.js        # all portfolio content (edit this to customize)
└── assets/images/      # hero portraits, work* project shots
```

## Customizing content

Edit `src/data/site.js`:

| Key             | Shape                                                        |
| --------------- | ------------------------------------------------------------ |
| `social`        | `[{ label, href, icon }]`                                    |
| `education`     | `[{ year, institution, program, description? }]` (real data) |
| `organizations` | `[{ name, role, period, description?, image?, isPlaceholder }]` |
| `strengths`     | `[{ title, label?, description?, detail?, isPlaceholder }]`  |
| `achievements`  | `[{ year, title, category?, description?, result?, isPlaceholder }]` |
| `projects`      | `[{ title, image?, year?, links?: { demo?, repo? } }]` (max 6 shown) |
| `biodata`       | `{ name, role, age, location, ..., traits[], isPlaceholder }` |
| `competencies`  | `[{ name, description?, meta? }]`                            |

Project grid images are auto-loaded from `src/assets/images/work*.*` (+ Educational Dashboard) when `projects` is empty.

## Commands

All commands run from the repo root (the path contains a space — quote it in shells):

```bash
npm install
npm run dev      # Vite dev server with HMR
npm run build    # production build to dist/
npm run preview  # serve dist/ locally
npm run lint     # oxlint (not ESLint)
```

## Technical notes

- **React Compiler** enabled via `@rolldown/plugin-babel` + `babel-plugin-react-compiler` — slows dev/build; do not remove unintentionally.
- **Tailwind CSS 4** via the `@tailwindcss/vite` plugin (no config file); theme tokens live in `src/index.css` (`@theme`).
- **No TypeScript**, no test runner. Verify with `lint` + `build`.
- Brand icons (GitHub/Instagram/LinkedIn) are inline SVGs — the installed `lucide-react` version no longer ships brand icons.
- Pointer interactions use refs + `quickTo` + CSS variables (no per-frame React state); every GSAP context, listener, timer, and interval is cleaned up on unmount.
