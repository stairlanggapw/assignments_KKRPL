import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base "/assignments_KKRPL/" — required for GitHub Pages project site
// (https://stairlanggapw.github.io/assignments_KKRPL/). Dev server and
// `vite preview` resolve it transparently; do not change without updating
// the deployment target.
export default defineConfig({
  base: "/assignments_KKRPL/",
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
