import { site } from "../data/site"

function BrandIcon({ children, className = "h-[18px] w-[18px]" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  )
}

function GithubIcon({ className }) {
  return (
    <BrandIcon className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </BrandIcon>
  )
}

function InstagramIcon({ className }) {
  return (
    <BrandIcon className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </BrandIcon>
  )
}

function LinkedinIcon({ className }) {
  return (
    <BrandIcon className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </BrandIcon>
  )
}

const ICONS = {
  github: GithubIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
}

/**
 * Shared social links — GitHub / Instagram / LinkedIn.
 * - Single data source: site.social
 * - Inline brand SVGs (lucide-react no longer ships brand icons)
 * - variant "intro": centered row under the intro typing text
 * - variant "contact": left-aligned row filling the contact empty space
 * - Items carry data-intro-social-item so the intro typing timeline
 *   can stagger them in one by one after the text completes.
 */
export default function SocialIcons({ variant = "contact" }) {
  const isIntro = variant === "intro"
  const entries = site.social ?? []

  return (
    <div
      aria-label="Social links"
      className={`flex items-center gap-3 ${isIntro ? "justify-center" : "justify-start"}`}
    >
      {entries.map((entry) => {
        const Icon = ICONS[entry.icon] ?? GithubIcon
        return (
          <a
            key={entry.label}
            href={entry.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${entry.label} — open profile in new tab`}
            data-cursor="hover"
            {...(isIntro ? { "data-intro-social-item": "" } : {})}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border/60 bg-bg-elevated/40 text-text-faint backdrop-blur transition duration-300 hover:-translate-y-[2px] hover:border-accent/60 hover:text-text hover:shadow-[0_0_18px_rgba(107,123,255,0.25)] focus-visible:outline-offset-4"
          >
            <Icon className="h-[18px] w-[18px]" />
          </a>
        )
      })}
    </div>
  )
}
