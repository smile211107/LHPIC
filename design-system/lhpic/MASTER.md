# Design System Master File - LHPIC (Le Hong Phong Informatics Club)

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** LHPIC - Câu lạc bộ Tin học THPT Chuyên Lê Hồng Phong
**Generated:** 2026-11-04
**Category:** Academic / Informatics & Competitive Programming Club
**Vibe:** Dynamic, modern, academic, clean, approachable for secondary students & parents

---

## Global Rules

### Color Palette

| Role | Hex | Tailwind Equivalent | CSS Variable |
|------|-----|---------------------|--------------|
| Primary (Deep Navy) | `#0F172A` / `#1E293B` | `slate-900` / `slate-800` | `--color-primary` |
| Primary Blue Accent | `#2563EB` | `blue-600` | `--color-blue-accent` |
| Secondary / Brand Accent (Brick Red / Terracotta) | `#C2410C` / `#EA580C` | `orange-700` / `orange-600` | `--color-secondary` |
| Background | `#F8FAFC` | `slate-50` | `--color-background` |
| Surface / Card | `#FFFFFF` | `white` | `--color-card` |
| Text Foreground | `#0F172A` | `slate-900` | `--color-foreground` |
| Muted Foreground | `#475569` | `slate-600` | `--color-muted-foreground` |
| Subtle Border | `#E2E8F0` | `slate-200` | `--color-border` |
| Accent Green (Status: Ongoing) | `#16A34A` | `green-600` | `--color-success` |
| Accent Amber (Status: Upcoming) | `#D97706` | `amber-600` | `--color-warning` |
| Accent Slate (Status: Finished) | `#64748B` | `slate-500` | `--color-muted` |

### Typography

- **Heading Font:** Plus Jakarta Sans (`font-heading`)
- **Body Font:** Inter / Plus Jakarta Sans (`font-sans`)
- **Code/Monospace Font:** JetBrains Mono (`font-mono`)
- **Google Fonts:**
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  ```

---

## Anti-Patterns (Do NOT Use)

- ❌ **Emojis as icons** — Always use SVG icons (Lucide Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have `cursor-pointer`
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Layout-shifting hovers** — Keep hover effects subtle (`transform: translateY(-2px)`, `transition-all duration-200`)
- ❌ **Horizontal scroll on mobile** — Container widths strictly bounded with `max-w-7xl px-4 sm:px-6 lg:px-8`
