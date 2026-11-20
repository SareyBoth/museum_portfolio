# Design System: SareyBoth — Museum Exhibition Wing

## 1. Visual Theme & Atmosphere
- **Direction:** Option A — Dual-Surface Museum Wing. Stepping through the 3D Brutalist Atrium OLED portal leads into an architectural monograph & exhibition wing that directly echoes the physical gallery's materials: board-formed concrete charcoal (`#0F1012` / `#16171B`) paired with warm porous travertine stone gallery walls (`#EFE9DF` / `#D6C7B2` / `#B8AA94`).
- **Density:** Art Gallery Airy (3/10) — generous spatial rhythm, one clear exhibition zone at a time, crisp 1px anodized-steel hairlines rather than nested boxes.
- **Variance:** Offset Asymmetric (7/10) — editorial left-to-right splits, true-ratio `9:16` portrait posters paired alongside `16:9` widescreen cinema frames, clean architectural vertical timelines for Experience & Education instead of uniform SaaS card rows.
- **Motion:** Measured Architectural Glide (5/10) — compositor-only `transform` and `opacity`, native top-layer `@starting-style` modal transitions, strict `@media (prefers-reduced-motion)` compliance.

## 2. Color Palette & Roles (Dual-Surface Museum System)

### Dark Concrete Surfaces (Opening Threshold, Cinema Screening Room & Footer)
- **Concrete Obsidian (`#0F1012`)** — Primary dark architectural ground (`color-scheme: dark`).
- **Board-Formed Charcoal (`#16171B`)** — Elevated dark frame/panel fill.
- **Matte Steel Hairline (`rgba(214, 199, 178, 0.16)`)** — Crisp 1px architectural divider on dark surfaces.
- **Limestone Ivory (`#F4EFE6`)** — Primary text on dark concrete surfaces (>15:1 contrast).
- **Weathered Ash (`#B8B0A4`)** — Secondary metadata & technical captions on dark surfaces (>7.5:1 contrast).

### Warm Travertine Surfaces (Curated Exhibition Wing, Monograph & Career Ledgers)
- **Warm Travertine Paper (`#EFE9DF`)** — Primary warm limestone gallery ground (`color-scheme: light`).
- **Honed Travertine Stone (`#E4DBCD`)** — Secondary exhibition plinth / placard surface.
- **Mortar Seam Border (`rgba(28, 29, 31, 0.14)`)** — Crisp 1px structural hairline on travertine surfaces.
- **Anodized Ink (`#141518`)** — Primary text on travertine surfaces (>14:1 contrast).
- **Mineral Slate (`#524E48`)** — Secondary technical metadata & descriptions on travertine surfaces (>6.5:1 contrast).

### Calibrated Accents
- **Museum Tungsten Gold (`#D9942A` on light / `#E5A93C` on dark)** — Single primary editorial accent (saturation < 76%) matching the 3D gallery's grazing wall lights (`#F59E0B`).
- **Portal Telemetry Cyan (`#38BDF8`)** — Reserved exclusively for 3D OLED portal return cue / timecode active readouts.

## 3. Typography Rules
- **Display & Body:** `Geist` (`var(--font-geist-sans)`) — Tight tracking (`-0.03em`) on headings, weight & spatial hierarchy, `65ch` max measure on narrative prose.
- **Technical Metadata & Placards:** `Geist Mono` (`var(--font-geist-mono)`) with `font-variant-numeric: tabular-nums` for FPS, aspect ratios (`9:16`, `16:9`), DPI specs, frame indices, and date spans.
- **Banned:** `Inter`, generic serifs (`Times New Roman`, `Georgia`), pure black (`#000000`) body surfaces, purple/violet neon glows, `01 // DISCIPLINE` or `// TIMELINE A/B` boilerplate labels.

## 4. Component Stylings
- **Corners & Frames:** Crisp architectural corners (`2px`–`4px` radius) and anodized steel bezels (`1px solid`), replacing generic `rounded-xl` SaaS boxes.
- **Buttons:** Tactile hover step & active press without neon outer glows; `min-block-size: 44px` on touch/primary controls; clear `:focus-visible` outline (`2px solid` with `3px` offset).
- **Hero Portrait:** Opening threshold displays the archival portrait (`public/media/profile-portrait.jpg`) in an architectural frame.
- **Exhibition Plates & Filters:** Exhibition filters are `'Video'` and `'Photo'` only; true-ratio `aspect-[9/16]` and `aspect-[16/9]` artwork frames rendered via bespoke layered media/SVG/Canvas plates (or drop-in `public/media/` assets), with wall-placard metadata placed cleanly below the frame.
- **Career Timelines:** Experience & Education use clean architectural vertical timelines with distinct `Experience` and `Education` headings (still banning `// TIMELINE A/B` boilerplate labels).
- **Modals:** Native `<dialog>` opened via `showModal()`, centered in the top layer with blurred backdrop (`overscroll-behavior: contain`), native focus containment, and `closedby="any"` + pointer boundary light-dismiss fallback.

## 5. Layout & Responsive Principles
- CSS Grid containment (`max-w-7xl` / `1280px` equal edges, `px-6 md:px-12`).
- Single-column collapse below `768px`; zero horizontal overflow down to `320px`.
- Dual-surface rhythm alternating **Concrete Obsidian** (Hero threshold) → **Warm Travertine** (Exhibition Wing & Monograph) → **Board-Formed Charcoal** (Craft Ledger / Screening Room) → **Warm Travertine** (Career & Academic Index) → **Concrete Obsidian** (Contact & Footer).

## 6. Anti-Patterns (Banned)
- No emojis in UI chrome or labels.
- No generic icon-in-circle placeholder thumbnails.
- No `// LABEL` or `// TIMELINE A/B` AI boilerplate headings.
- No uniform 3-card equal feature rows in the hero.
- No fabricated metrics or unverified statistics.
- No disabling focus outlines without high-contrast `:focus-visible` replacement.
