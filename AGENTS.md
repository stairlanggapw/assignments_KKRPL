# AGENTS.md

## 1. Project Overview

This project is an interactive personal portfolio website built with React and Vite.

The website should present the portfolio as an immersive, cinematic, technology-inspired digital experience rather than a conventional portfolio template.

The visual identity combines:

* Modern technology
* Space and futuristic aesthetics
* Minimalism
* Large typography
* Cinematic transitions
* Smooth scrolling
* Scroll-driven interactions
* Interactive cursor effects
* Strong visual hierarchy
* Generous whitespace

The project is intended to be a polished frontend portfolio that demonstrates both development skills and interaction design.

---

## 2. Primary Goals

The main goals of this project are:

1. Build a visually impressive interactive portfolio.
2. Keep the codebase modular and maintainable.
3. Use animation intentionally instead of adding unnecessary effects.
4. Ensure all animations work correctly with smooth scrolling.
5. Maintain good performance on desktop and mobile.
6. Keep content separate from presentation logic.
7. Make the code easy to understand and modify.
8. Avoid unnecessary dependencies.
9. Preserve existing working functionality when implementing new features.
10. Treat accessibility and reduced-motion support as first-class requirements.

---

## 3. Technology Stack

Use the following technology stack unless there is a strong technical reason to change it.

### Core

* React
* Vite
* JavaScript

### Styling

* Tailwind CSS
* CSS where custom animation or browser-specific behavior is required

### Animation

* GSAP
* GSAP ScrollTrigger
* Lenis

### Icons

* Lucide React

### Typography

Primary heading font:

* Space Grotesk

Secondary/body font:

* Manrope

Do not introduce another font unless explicitly requested.

Do not install an additional animation library when GSAP or CSS can already solve the problem.

---

## 4. Visual Direction

The visual direction must consistently follow a dark technology and space-inspired aesthetic.

### Color Direction

Use a dark base palette.

Preferred characteristics:

* Near-black or deep charcoal background
* White or off-white primary text
* Muted gray secondary text
* Subtle electric blue or violet accents
* Very restrained glow effects

Avoid excessive use of bright colors.

Avoid turning every element into a gradient.

### Typography

Typography should be one of the main visual elements.

Use:

* Large display typography for hero content
* Strong contrast between headings and body text
* Generous line height for readable paragraphs
* Responsive typography
* Clear hierarchy between section titles and supporting information

Do not overuse uppercase text.

Do not make every heading extremely large.

### Layout

Use:

* Large whitespace
* Strong alignment
* Asymmetrical compositions where appropriate
* Layered sections
* Editorial-style layouts
* Full-width visual areas
* Carefully controlled spacing

Avoid:

* Generic dashboard-style layouts
* Excessive card grids
* Excessive rounded cards
* Excessive shadows
* Excessive borders
* Dense interfaces
* Generic template-looking layouts

---

## 5. Portfolio Experience

The portfolio should feel like an interactive journey.

The intended high-level flow is:

1. Intro / loading experience
2. Hero section
3. About / personal information
4. Education
5. Organization experience
6. Strengths
7. Achievements
8. Competencies
9. Photo gallery
10. Portfolio projects
11. Footer / final section

The intro and hero are especially important because they establish the visual identity of the entire website.

---

## 6. Intro Experience

The first screen should initially contain only the portfolio owner's name.

Initial state:

* No navigation bar
* No project cards
* No large buttons
* No gallery
* No unnecessary UI
* Name positioned approximately at the center of the viewport
* Minimal dark background
* Modern typography
* Subtle entrance animation

The intro should transition into the hero section when the user begins scrolling.

The transition should feel intentional and cinematic.

Do not create a conventional loading spinner unless explicitly requested.

The intro should feel like an opening scene rather than a technical loading screen.

---

## 7. Hero Section

The hero section appears after the intro transition.

The hero must include:

* Navigation
* Large typography
* Personal identity / role
* Central profile image
* Scroll indicator
* Strong visual hierarchy

The profile image should be positioned as a major focal point.

The hero image must support a mask reveal animation.

The navigation should not dominate the screen.

The hero should remain visually clean even when animations are disabled.

---

## 8. Mask Reveal Animation

The profile image should use a mask or clip-path reveal animation.

Preferred implementation:

* GSAP
* ScrollTrigger
* CSS clip-path where appropriate

The reveal should progress smoothly as the user scrolls.

The animation should not:

* Flicker
* Jump
* Trigger repeatedly
* Break when scrolling quickly
* Cause horizontal overflow

Use appropriate GSAP cleanup when components unmount.

Prefer reusable animation logic instead of embedding complex animation code directly inside JSX.

---

## 9. Smooth Scrolling

Lenis is the primary smooth scrolling system.

Rules:

* Use only one smooth scrolling implementation.
* Do not introduce another smooth-scroll library.
* Keep Lenis initialization centralized.
* Properly synchronize Lenis with GSAP ScrollTrigger.
* Ensure ScrollTrigger receives correct scroll updates.
* Clean up event listeners and animation instances when necessary.

Do not create multiple Lenis instances.

Do not initialize Lenis independently inside multiple components.

The application should have a clear global scroll architecture.

---

## 10. GSAP and ScrollTrigger

GSAP is the primary animation engine.

Use ScrollTrigger for scroll-based interactions such as:

* Image reveals
* Text reveals
* Parallax movement
* Section transitions
* Overlapping sections
* Pinned sections
* Velocity-based effects
* Progress indicators

Animations should be:

* Smooth
* Purposeful
* Reversible where appropriate
* Responsive
* Performance-conscious

Avoid excessive timelines when a simpler animation can achieve the same result.

Always consider component lifecycle and cleanup.

Do not leave orphaned ScrollTriggers or event listeners.

---

## 11. Overlapping Sections

Sections may visually overlap to create depth and cinematic transitions.

Use overlapping layouts selectively.

Possible techniques:

* Transform
* TranslateY
* Scale
* Positioning
* Z-index
* Border-radius transitions
* ScrollTrigger pinning

Overlapping sections must not:

* Create unexpected horizontal scrolling
* Break mobile layouts
* Hide important content
* Prevent normal navigation
* Cause inaccessible content

Each overlapping section should remain readable and structurally understandable.

---

## 12. Velocity Scroll Effects

Velocity-based animation can be used to add subtle movement when the user scrolls quickly.

Examples:

* Slight skew
* Small translation
* Scale changes
* Direction-aware motion

Velocity effects must remain subtle.

Do not make the entire page aggressively distort during normal scrolling.

Recommended approach:

* Small movement values
* Short response time
* Smooth interpolation
* Automatic return to the default state

The website should still feel stable during slow scrolling.

---

## 13. Fluid Cursor

The desktop version should include a custom fluid cursor experience.

The cursor system should remain independent from the scroll system.

Possible states:

### Default

Small custom cursor indicator.

### Interactive element

Cursor expands or changes appearance.

### Project interaction

Cursor may display:

* View
* Open
* Explore
* Project preview

### Image or project preview

A preview image may follow the cursor with smooth interpolation.

The cursor must:

* Use GSAP or lightweight CSS where appropriate
* Avoid excessive DOM updates
* Avoid blocking pointer events
* Remain visually subtle
* Never interfere with clicking

Disable or simplify custom cursor behavior on touch devices and devices where a pointer is unavailable.

Do not depend on the custom cursor for essential navigation.

---

## 14. Reduced Motion

Respect the user's reduced-motion preference.

Use:

```css
@media (prefers-reduced-motion: reduce)
```

When reduced motion is enabled:

* Reduce or disable non-essential animation
* Avoid large movement effects
* Avoid aggressive parallax
* Avoid velocity distortion
* Simplify page transitions
* Keep content fully accessible

The website must remain completely usable without decorative animation.

---

## 15. Scrollbar

The visual design may use a hidden native scrollbar and a custom scroll indicator.

If the native scrollbar is hidden:

* Scrolling must remain fully functional.
* Provide another visual indication of scroll progress when appropriate.
* Do not remove essential navigation feedback.

Do not depend exclusively on the scrollbar for navigation.

---

## 16. Responsive Design

The website must be responsive across:

* Desktop
* Laptop
* Tablet
* Mobile

Mobile is not simply a smaller desktop layout.

For mobile:

* Simplify complex animation
* Reduce large transforms
* Disable mouse-only interactions
* Reorganize overlapping sections where necessary
* Maintain readable typography
* Maintain adequate spacing
* Prevent horizontal overflow

Always test responsive behavior after major layout changes.

---

## 17. Project Structure

Use the following structure whenever possible:

```text
src/
├── components/
│   ├── Navbar.jsx
│   ├── CustomCursor.jsx
│   ├── ImageReveal.jsx
│   ├── MagneticButton.jsx
│   ├── ScrollIndicator.jsx
│   └── SectionTitle.jsx
│
├── sections/
│   ├── Intro.jsx
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Biodata.jsx
│   ├── Education.jsx
│   ├── Organization.jsx
│   ├── Strengths.jsx
│   ├── Achievements.jsx
│   ├── Competencies.jsx
│   ├── Gallery.jsx
│   ├── Projects.jsx
│   └── Footer.jsx
│
├── animations/
│   ├── lenis.js
│   ├── hero.js
│   ├── reveal.js
│   ├── overlapping.js
│   ├── velocity.js
│   └── cursor.js
│
├── data/
│   └── portfolio.js
│
├── assets/
│   ├── images/
│   └── icons/
│
├── App.jsx
├── main.jsx
└── index.css
```

Do not create unnecessary folders.

Do not create deeply nested structures without a reason.

---

## 18. Component Rules

Components should have clear responsibilities.

For example:

* Navbar handles navigation UI.
* CustomCursor handles cursor behavior.
* ImageReveal handles image reveal behavior.
* Hero handles hero presentation.
* Projects handles project presentation.
* Animation utilities handle reusable animation logic.

Avoid creating components that are excessively large.

If a component becomes difficult to understand, consider splitting it into smaller components.

Do not create abstractions prematurely.

Only extract reusable logic when reuse or complexity justifies it.

---

## 19. Data Management

Portfolio content should be separated from presentation logic whenever practical.

Use:

```text
src/data/portfolio.js
```

for structured content such as:

* Name
* Biography
* Education
* Organizations
* Strengths
* Achievements
* Skills
* Gallery items
* Projects

Components should consume portfolio data instead of duplicating the same information across multiple files.

Do not hardcode the same content repeatedly.

---

## 20. Code Quality

Write clean, readable React code.

Rules:

* Prefer functional React components.
* Use meaningful variable and function names.
* Avoid unnecessary state.
* Avoid unnecessary re-renders.
* Avoid duplicated logic.
* Keep animation logic understandable.
* Keep components focused.
* Remove unused imports.
* Remove unused variables.
* Avoid unnecessary dependencies.
* Preserve existing functionality when adding new features.

Do not add comments to explain obvious code.

Use comments only when a technical decision is genuinely difficult to understand without context.

---

## 21. Animation Architecture

The animation system should remain modular.

Prefer:

```text
Component
   ↓
Animation Utility
   ↓
GSAP / ScrollTrigger
```

instead of putting every animation directly inside JSX.

Animation systems should be independent where possible.

For example:

```text
Lenis
  ↓
Global scroll system

ScrollTrigger
  ↓
Scroll-driven animations

CustomCursor
  ↓
Pointer interaction system
```

Do not tightly couple the cursor system to the scroll system.

Do not create independent scrolling systems for individual sections.

---

## 22. Performance

Performance is important.

Avoid:

* Excessive DOM elements
* Extremely large images
* Continuous expensive calculations
* Unnecessary state updates on every frame
* Multiple mousemove listeners doing the same work
* Excessive blur effects
* Excessive filters
* Unnecessary animation loops

Use:

* Image optimization
* Lazy loading when appropriate
* Efficient transforms
* `requestAnimationFrame` when appropriate
* GSAP utilities when appropriate
* Responsive image dimensions
* Component-level cleanup

Prefer GPU-friendly properties such as:

* transform
* opacity

Avoid animating layout-heavy properties unnecessarily.

---

## 23. Accessibility

The website must remain accessible.

Rules:

* Use semantic HTML where practical.
* Images must have meaningful alt text when needed.
* Decorative images may use empty alt attributes.
* Interactive controls must be keyboard accessible.
* Do not rely exclusively on hover.
* Maintain sufficient text contrast.
* Buttons must remain understandable without animations.
* Reduced-motion preferences must be respected.

Animations are enhancement, not a requirement for accessing content.

---

## 24. File Modification Rules

When implementing a task:

1. Modify only the files necessary for the task.
2. Do not rewrite unrelated files.
3. Do not remove working functionality.
4. Do not replace the existing architecture without a clear technical reason.
5. Check existing code before creating new utilities.
6. Reuse existing components when appropriate.
7. Avoid duplicate implementations.
8. Do not introduce a new library unless necessary.
9. Explain the reason for any newly introduced dependency.
10. Do not overwrite user-provided content without checking its purpose.

---

## 25. Dependency Rules

Before adding a new dependency:

1. Check whether the current stack already solves the problem.
2. Prefer native browser APIs or existing libraries when practical.
3. Avoid adding multiple libraries that solve the same problem.
4. Explain why the dependency is necessary.
5. Verify that the dependency is compatible with the current project.

The default animation stack is:

* GSAP
* ScrollTrigger
* Lenis
* CSS transitions

Do not introduce another animation framework unless explicitly requested.

---

## 26. Development Order

Follow this order unless a task explicitly requires another sequence:

### Phase 1: Foundation

1. React and Vite setup
2. Tailwind CSS setup
3. Typography
4. Global styling
5. Project structure
6. Data structure

### Phase 2: Intro

7. Intro screen
8. Name animation
9. Intro-to-hero transition

### Phase 3: Hero

10. Navigation
11. Hero layout
12. Profile image
13. Mask reveal
14. Scroll indicator

### Phase 4: Scroll System

15. Lenis
16. GSAP ScrollTrigger synchronization
17. Scroll utilities

### Phase 5: Main Content

18. About / Biodata
19. Education
20. Organization
21. Strengths
22. Achievements
23. Competencies

### Phase 6: Advanced Motion

24. Text reveal
25. Image reveal
26. Overlapping sections
27. Parallax effects
28. Velocity scroll

### Phase 7: Visual Content

29. Gallery
30. Project showcase
31. Interactive project previews

### Phase 8: Cursor Interaction

32. Custom cursor
33. Hover states
34. Fluid project preview

### Phase 9: Finalization

35. Responsive optimization
36. Accessibility
37. Reduced-motion support
38. Performance optimization
39. Error checking
40. Production build verification

Do not implement every phase at once.

Complete and verify each phase before moving to the next one.

---

## 27. Testing Requirements

After significant changes:

1. Run the development server.
2. Check the browser console.
3. Verify that the affected section works.
4. Check for layout overflow.
5. Test desktop behavior.
6. Test mobile behavior when relevant.
7. Verify that existing animations still work.
8. Run the production build when appropriate.

Use:

```bash
npm run dev
```

for development.

Use:

```bash
npm run build
```

to verify production builds.

Do not consider a feature complete if the build is broken.

---

## 28. Debugging Rules

When fixing a bug:

1. Reproduce the problem first.
2. Identify the root cause.
3. Make the smallest appropriate change.
4. Avoid unrelated refactoring.
5. Test the fix.
6. Check for regressions.

Do not repeatedly patch symptoms without understanding the underlying issue.

For animation bugs, specifically check:

* Multiple GSAP instances
* Duplicate ScrollTriggers
* Incorrect cleanup
* Lenis and ScrollTrigger synchronization
* Invalid DOM references
* Responsive breakpoints
* Component mounting and unmounting
* Browser resize behavior

---

## 29. Design Consistency

Every new feature should match the existing visual language.

Before adding a component, consider:

* Typography
* Spacing
* Contrast
* Motion
* Border treatment
* Radius
* Visual hierarchy
* Interaction behavior

Avoid introducing a design style that looks unrelated to the rest of the website.

The project should feel like one visual system.

---

## 30. Agent Behavior

When working on this project:

* Inspect the existing code before making changes.
* Understand the existing architecture before creating new files.
* Follow the rules in this document.
* Keep changes focused on the requested task.
* Prefer incremental implementation.
* Preserve working features.
* Do not invent missing portfolio information.
* Ask for or use provided content rather than fabricating personal achievements, education, organizations, or projects.
* Clearly identify assumptions when implementation details are not specified.
* Avoid unnecessary rewrites.
* Verify the result after significant changes.

When a request affects animation architecture, consider how it interacts with:

* Lenis
* ScrollTrigger
* React lifecycle
* Responsive behavior
* Reduced-motion support

---

## 31. Current Priority

The current implementation priority is:

1. Project foundation
2. Intro screen
3. Hero section
4. Lenis integration
5. GSAP ScrollTrigger integration
6. Mask reveal
7. Main portfolio sections
8. Overlapping sections
9. Velocity scroll
10. Gallery
11. Fluid cursor
12. Project showcase
13. Responsive optimization
14. Accessibility and performance
15. Final production verification

Do not skip foundational steps simply to implement advanced visual effects early.

The stability of the scroll and animation architecture is more important than the number of effects.

---

## 32. Final Principle

The website should feel technologically advanced through restraint.

Prefer:

* A few strong interactions
* Carefully timed motion
* Strong typography
* Controlled spacing
* Purposeful visual hierarchy

Avoid:

* Animation everywhere
* Excessive effects
* Excessive gradients
* Excessive glow
* Unnecessary 3D effects
* Decorative elements that do not support the content

Every animation should have a visual or interaction purpose.
