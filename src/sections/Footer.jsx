export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-bg-elevated px-6 py-10 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-xs tracking-[0.14em] text-text-faint uppercase">
          © 2026 Stefanus Airlangga — Dark Technology
        </p>
        <p className="text-xs leading-5 text-text-faint">
          Built with React · Vite · Tailwind · GSAP · Lenis
        </p>
      </div>
    </footer>
  )
}
