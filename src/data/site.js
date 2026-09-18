export const site = {
  name: "Stefanus Airlangga",
  shortName: "SA",
  role: "Frontend Engineer",
  focus: "Interactive & Motion",
  description: "Interactive portfolio — dark technology + space aesthetic",
  location: "Semarang, ID",
  availability: "Available for new work",
  year: "2026",
  cv: {
    href: "/cv.pdf",
    download: "CV_Stefanus_Airlangga.pdf",
    label: "Download CV",
  },
  nav: [
    { label: "About", href: "#about" },
    { label: "Work", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ],
  social: [
    { label: "GitHub", href: "https://github.com/stairlanggapw", icon: "github" },
    {
      label: "Instagram",
      href: "https://www.instagram.com/ssteff30?stkn=MTZidHFid3YyczVjbg==",
      icon: "instagram",
    },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/stefanus-airlangga", icon: "linkedin" },
  ],
  about: {
    eyebrow: "About — Editorial",
    headline: "Building at the edge of technology and space.",
    paragraphs: [
      "I focus on interactive, motion-driven interfaces — where cinematic timing meets precise engineering. The work is rooted in minimal, technology-inspired systems that feel calm on the surface and deliberate underneath.",
      "This portfolio is framed around the existing Hero direction: dark, space-inspired, and editorial. No excess, no generic cards — just centered composition, large type, and controlled detail.",
    ],
  },
  // Biodata — DEMO placeholders (isPlaceholder: true).
  // Replace with the owner's real information later. Shape:
  // { isPlaceholder, name, role, age, location, education, focus,
  //   interests[], status, year, personality, statement, traits[] }
  biodata: {
    isPlaceholder: true,
    name: "Stefanus Airlangga",
    role: "Frontend Developer",
    age: "17",
    location: "Central Java, Indonesia",
    education: "Software Engineering Student",
    focus: "Frontend Development",
    interests: ["Interactive UI", "Motion Design", "Creative Technology"],
    status: "Student / Developer",
    year: "2026",
    personality: "Curious, detail-oriented, and interested in creating digital experiences.",
    statement:
      "I enjoy turning ideas into interactive digital experiences through code, design, and motion.",
    traits: ["Curious", "Creative", "Detail-Oriented", "Problem Solver"],
  },
  // Education — verifiable entries only.
  // Each entry: { year, institution, program, description? }
  education: [
    { year: "2016 — 2022", institution: "SD Marsudirini", program: "Sekolah Dasar" },
    { year: "2022 — 2025", institution: "SMPN 23 Semarang", program: "Sekolah Menengah Pertama" },
    { year: "2025 — 2028", institution: "SMKN 3 Kendal", program: "Software Engineering" },
  ],
  // Organization — DEMO placeholders (isPlaceholder: true).
  // Replace with the owner's real experience later. Each real entry:
  // { name, role, period, description?, image?, isPlaceholder: false }
  organizations: [
    {
      id: 1,
      name: "Technology Student Community",
      role: "Member",
      period: "2024 — 2025",
      description:
        "A student community focused on technology, collaboration, and learning through practical projects.",
      isPlaceholder: true,
    },
    {
      id: 2,
      name: "School Creative Team",
      role: "Frontend / Design Member",
      period: "2025 — 2026",
      description:
        "Collaborative activities involving digital design, presentation, and creative technology projects.",
      isPlaceholder: true,
    },
    {
      id: 3,
      name: "Project Development Team",
      role: "Frontend Contributor",
      period: "2026 — Present",
      description:
        "A collaborative project environment focused on building digital products and improving development skills.",
      isPlaceholder: true,
    },
  ],
  // Strengths — DEMO placeholders (isPlaceholder: true).
  // Replace with the owner's real strengths later. Each real entry:
  // { title, label?, description?, detail?, isPlaceholder: false }
  strengths: [
    {
      id: 1,
      title: "Creative",
      label: "CREATIVE",
      description:
        "Enjoys exploring different ways to turn simple ideas into clear and engaging digital experiences.",
      detail:
        "Comfortable experimenting with typography, interface composition, visual hierarchy, and interaction.",
      isPlaceholder: true,
    },
    {
      id: 2,
      title: "Curious",
      label: "CURIOUS",
      description:
        "Enjoys learning how new technologies work and experimenting with different approaches to frontend development.",
      detail:
        "Often explores new tools, animation techniques, design patterns, and development workflows.",
      isPlaceholder: true,
    },
    {
      id: 3,
      title: "Adaptive",
      label: "ADAPTIVE",
      description:
        "Able to adjust to new requirements, different project situations, and changing technical challenges.",
      detail:
        "Comfortable learning unfamiliar tools and changing implementation strategies when needed.",
      isPlaceholder: true,
    },
    {
      id: 4,
      title: "Problem Solver",
      label: "PROBLEM SOLVER",
      description:
        "Approaches technical problems by breaking them into smaller and more understandable parts.",
      detail:
        "Focuses on finding practical solutions while keeping the implementation clean and maintainable.",
      isPlaceholder: true,
    },
  ],
  // Achievements — DEMO placeholders (isPlaceholder: true).
  // Replace with the owner's real achievements later. Each real entry:
  // { year, title, category?, description?, result?, isPlaceholder: false }
  achievements: [
    {
      id: 1,
      year: "2026",
      title: "Frontend Innovation Challenge",
      category: "Frontend Development",
      description:
        "Designed and developed an interactive web experience focused on modern interface design, motion, and responsive frontend implementation.",
      result: "Final Project Showcase",
      isPlaceholder: true,
    },
    {
      id: 2,
      year: "2025",
      title: "Creative Digital Experience",
      category: "UI / UX",
      description:
        "Created a digital interface concept combining visual hierarchy, interaction, and motion-driven presentation.",
      result: "Selected Concept",
      isPlaceholder: true,
    },
    {
      id: 3,
      year: "2025",
      title: "School Technology Project",
      category: "Web Development",
      description:
        "Built a collaborative web project that explored practical frontend development, interface structure, and user interaction.",
      result: "Project Presentation",
      isPlaceholder: true,
    },
    {
      id: 4,
      year: "2024",
      title: "Frontend Development Milestone",
      category: "Learning Achievement",
      description:
        "Completed a series of self-directed frontend projects covering responsive layouts, JavaScript interaction, and component-based development.",
      result: "Personal Milestone",
      isPlaceholder: true,
    },
  ],
  // Projects — portfolio list. Do not invent. Each: { title, description?, stack?, image?, year?, type?, links?: { demo?, repo? } }
  projects: [],
  // Competencies — editorial list, no percentages.
  // Each entry: { name, description?, meta? }  meta e.g. category or stack
  // Do not invent skill levels. Keep factual.
  competencies: [
    { name: "HTML", description: "Semantic, accessible markup", meta: "Markup" },
    { name: "CSS", description: "Modern layout, Tailwind, motion", meta: "Styling" },
    { name: "JavaScript", description: "ESNext, interaction logic", meta: "Core" },
    { name: "React", description: "Component architecture, hooks", meta: "Frontend" },
    { name: "PHP", description: "Server-side fundamentals", meta: "Backend" },
    { name: "Laravel", description: "MVC, routing, Eloquent", meta: "Framework" },
    { name: "UI/UX", description: "Editorial, system-driven design", meta: "Design" },
    { name: "Figma", description: "Prototyping, design systems", meta: "Tooling" },
  ],
}
