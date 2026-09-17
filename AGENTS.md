# AGENTS.md

## Project
Vite 8 + React 19 (JSX) + Tailwind CSS 4 portfolio. Single-package app. Entrypoints: `src/main.jsx` -> `src/App.jsx`, `index.html#root`. Styles via `src/index.css` (`@import "tailwindcss"`).

## Commands
All commands run from repo root (`C:\website\react 1\Profile` — path contains a space, quote it in shells):
- `npm run dev` — Vite dev server with HMR
- `npm run build` — production build to `dist/` (Vite/Rolldown)
- `npm run preview` — serve `dist/` locally
- `npm run lint` — `oxlint` (not ESLint). Config: `.oxlintrc.json` (`plugins: react, oxc`; `react/rules-of-hooks: error`, `react/only-export-components: warn`)
- `npx oxlint <path>` — lint single file; no `eslint` or `prettier` in repo

No test runner, typecheck, or CI workflows configured. Verify with `build` + `lint`.

## Toolchain Quirks
- **React Compiler** enabled via `@rolldown/plugin-babel` + `babel-plugin-react-compiler` (`reactCompilerPreset()`) in `vite.config.js:12`. Slows dev/build; do not remove unless intentionally disabling. Alt native option (`compiler: true` in `react()` plugin) is not used.
- **Tailwind CSS 4** via `@tailwindcss/vite` plugin (`vite.config.js:9`), not `tailwind.config.js`/`postcss.config.js`. No separate config file — utility classes resolved at build time.
- **Vite uses Rolldown** (Vite 8). Babel integration is `@rolldown/plugin-babel`, not `vite-plugin-babel`.
- **JS only** — no TypeScript. Files are `.jsx`/`.js`. `@types/react` present for editor hints only.

## Structure
- `src/App.jsx` — currently a stub (empty fragment); main app work goes here
- `src/assets/` — `hero.png`, `react.svg`, `vite.svg`
- `public/` — `favicon.svg`, `icons.svg` (served at `/`)
- `dist/` — build output, gitignored
- Deps `gsap`, `lenis`, `lucide-react` installed but unused in stub — use for animations/icons

## Conventions
- `package.json` is `"type": "module"` — use ESM imports.
- Lint before build; no auto-formatter configured.

## Git
- Repo on `main`, clean history (single commit). No branch/PR template.
