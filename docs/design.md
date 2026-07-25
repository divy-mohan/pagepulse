# 🎨 Design System — Page Pulse

> A minimal, technical design system for the Page Pulse dashboard.
> Optimized for data density, readability, and developer credibility.

---

## Philosophy

Page Pulse is a **developer tool**. The design draws inspiration from:
- Vercel dashboard (clean, dark-first, data-dense)
- Linear.app (sharp typography, purposeful whitespace)
- Raycast (glassmorphism accents, keyboard-first feel)

**Core principles:**
1. **Clarity over decoration** — every element earns its place
2. **Dark-first** — reduces eye strain for dev tooling contexts
3. **Data density** — show scores, metrics, and issues without hiding behind clicks
4. **Micro-animations** — subtle motion that confirms actions, not distract

---

## Typography

### Font Stack

```css
/* Primary — UI Text */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace — URLs, Code, IDs */
font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;

/* Display — Hero headings only */
font-family: 'Cal Sans', 'Inter', sans-serif;
```

### Import (Google Fonts + Bunny)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Type Scale

| Token         | Size   | Weight | Line Height | Usage                        |
|---------------|--------|--------|-------------|------------------------------|
| `display-2xl` | 48px   | 700    | 1.1         | Hero headline                |
| `display-xl`  | 36px   | 700    | 1.15        | Page titles                  |
| `display-lg`  | 30px   | 600    | 1.2         | Section headers              |
| `text-xl`     | 20px   | 600    | 1.3         | Card titles                  |
| `text-lg`     | 18px   | 500    | 1.4         | Subheadings                  |
| `text-md`     | 16px   | 400    | 1.5         | Body text (default)          |
| `text-sm`     | 14px   | 400    | 1.5         | Secondary labels, captions   |
| `text-xs`     | 12px   | 400    | 1.4         | Badges, metadata             |
| `mono-md`     | 14px   | 400    | 1.6         | URLs, request IDs, code      |
| `mono-sm`     | 12px   | 400    | 1.6         | Inline code                  |

### Typography Rules

- **Max line length:** 70ch for body text
- **Letter spacing:** `-0.01em` for headings, `0` for body, `0.05em` for uppercase labels
- **All-caps labels:** Always `text-xs` + `letter-spacing: 0.08em` + `font-weight: 600`

---

## Color Palette

### Base — Dark Theme (Default)

```css
:root {
  /* Background layers */
  --color-bg-base:       #0a0a0b;   /* Page background */
  --color-bg-subtle:     #111113;   /* Card background */
  --color-bg-muted:      #1a1a1f;   /* Input / hover state */
  --color-bg-overlay:    #222228;   /* Modals, popovers */

  /* Borders */
  --color-border:        #27272e;
  --color-border-strong: #3a3a45;

  /* Text */
  --color-text-primary:  #f0f0f5;
  --color-text-secondary:#9898a8;
  --color-text-muted:    #5a5a6a;
  --color-text-disabled: #3a3a45;

  /* Brand */
  --color-brand:         #7c6af7;   /* Indigo-violet — primary accent */
  --color-brand-light:   #9b8cff;
  --color-brand-dark:    #5b4ad4;
  --color-brand-subtle:  #1e1a3f;

  /* Semantic */
  --color-success:       #22c55e;
  --color-success-subtle:#052e16;
  --color-warning:       #f59e0b;
  --color-warning-subtle:#1c1200;
  --color-error:         #ef4444;
  --color-error-subtle:  #1f0606;
  --color-info:          #38bdf8;
  --color-info-subtle:   #042036;
}
```

### Score Color Mapping

```css
/* Score: 0–49 → Red, 50–74 → Amber, 75–89 → Green, 90–100 → Indigo */
--score-poor:       #ef4444;
--score-fair:       #f59e0b;
--score-good:       #22c55e;
--score-excellent:  #7c6af7;
```

---

## Spacing Scale

```css
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   20px;
--space-6:   24px;
--space-8:   32px;
--space-10:  40px;
--space-12:  48px;
--space-16:  64px;
--space-20:  80px;
```

---

## Border Radius

```css
--radius-sm:  4px;
--radius-md:  8px;
--radius-lg:  12px;
--radius-xl:  16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

---

## Shadows & Glow

```css
--shadow-card: 0 0 0 1px var(--color-border), 0 4px 24px rgba(0,0,0,0.4);
--shadow-modal: 0 0 0 1px var(--color-border-strong), 0 20px 60px rgba(0,0,0,0.6);
--glow-brand: 0 0 20px rgba(124, 106, 247, 0.15);
--glow-success: 0 0 20px rgba(34, 197, 94, 0.1);
```

---

## Components

### Score Ring

Circular SVG progress ring with:
- Stroke color based on score value
- Animated fill on page load (`stroke-dashoffset` transition, 800ms ease-out)
- Center label: score number in `display-xl` weight 700
- Outer label: dimension name in `text-xs` uppercase

### Audit Result Card

```
┌─────────────────────────────────────────────────┐
│  ● example.com            [CACHED] [200 OK]     │
│  https://example.com                            │
│  ─────────────────────────────────────────────  │
│  ⬤ 74   ⬤ 68   ⬤ 81   ⬤ 72                    │
│  Overall  SEO   Perf   A11y                     │
│  ─────────────────────────────────────────────  │
│  ⚠ 1 missing alt tag    ✓ HTTPS enabled         │
│  ✗ No sitemap found     ✓ robots.txt present    │
└─────────────────────────────────────────────────┘
```

### URL Input

- Full-width, monospace font
- Left icon: globe/link icon
- Placeholder: `https://yourstore.com`
- Animated border glow on focus (brand color)
- Loading spinner replaces submit button during audit

---

## Motion & Animation

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Score ring fill | `stroke-dashoffset` 0 → value | 800ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Card entrance | `opacity` 0→1, `translateY` 8px→0 | 300ms | `ease-out` |
| Button hover | `scale` 1→1.02, `box-shadow` | 150ms | `ease` |
| Error shake | `translateX` keyframes | 300ms | `ease-in-out` |
| Loading skeleton | shimmer gradient sweep | 1500ms | linear, infinite |

---

## Layout

### Dashboard Grid

```
[Navbar]
[─────────────────────────────────────────────]
[  URL Input (full width)                     ]
[─────────────────────────────────────────────]
[  Score Overview (3-col: Overall / SEO / Perf / A11y) ]
[─────────────────────────────────────────────]
[  Issues Panel    |  Technical Details        ]
[  (left col 60%)  |  (right col 40%)          ]
[─────────────────────────────────────────────]
[  Recent Audits Table                        ]
```

### Breakpoints

```css
--bp-sm:  640px;
--bp-md:  768px;
--bp-lg:  1024px;
--bp-xl:  1280px;
```

---

## Icons

Library: **Lucide React** (consistent stroke width, tree-shakable)

Key icons used:
- `Globe` — URL input
- `Zap` — Performance score
- `Search` — SEO score
- `Eye` — Accessibility score  
- `Shield` — HTTPS status
- `Clock` — Load time
- `AlertTriangle` — Warnings
- `CheckCircle` — Passed checks
- `XCircle` — Failed checks
- `RotateCw` — Cached result indicator
