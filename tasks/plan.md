# Implementation Plan: Inner Portfolio Redesign (Museum Exhibition Wing)

> **Status:** Draft for User Review (`tasks/plan.md`)
> **Project:** `art_gallery` — SareyBoth (Video Editor · Photo Retoucher · Poster Designer)
> **Scope:** Redesign the inner portfolio (`PortalShell.tsx` and supporting modules) into a modern museum-grade editorial portfolio that seamlessly matches the 3D Brutalist Travertine & Concrete Art Museum, while preserving the 3D atrium and scroll-to-enter animation.

---

## 1. Executive Summary & Current-State Audit

The 3D atrium (`GalleryCanvas.tsx`, `GallerySceneBuilder.ts`, `GalleryHUD.tsx`) establishes a cohesive architectural world:
- Warm porous ashlar travertine walls & pedestals (`#B8AA94` / `#D6C7B2`), board-formed concrete ceiling beams (`#313337`), polished dark concrete slab floors (`#1C1D1F`), matte-black steel bezels (`#121417`), warm skylight shafts (`#FFF5E6`), and grazing amber wall-washes (`#F59E0B`).
- Smooth 2,400px virtual scroll runway (`step = deltaY / 2400`) dollying down the center aisle into the OLED portal (`PORTAL_DATA` at `Z = -12.55`) and crossfading into `PortalShell` (`portalProgress >= 0.90 -> 0.96`).

By contrast, the current inner website ([`PortalShell.tsx`](file:///C:/Users/BeeNaa/Desktop/art_gallery/src/components/portal/PortalShell.tsx), 1,132 lines) breaks immersion and reads like a generic dark SaaS template:
1. **Material & Aesthetic Disconnect:** Generic `#09090B` + `#111114` `rounded-xl` cards with uniform radial-gradient blobs and centered Lucide icons (`Film`, `Sliders`, `ImageIcon`) instead of curated artwork compositions and architectural travertine/concrete materiality.
2. **AI-Template Tells & Structural Bloat:** Prefixes (`01 // DISCIPLINE`, `// SELECTED WORKS`, `// TIMELINE A`, `// TIMELINE B`), uniform 3-card hero strip, duplicated vertical dot-and-line timelines for Experience and Education, and a 1,132-line single-file component.
3. **Disconnected Data Model:** [`src/data/gallery.ts`](file:///C:/Users/BeeNaa/Desktop/art_gallery/src/data/gallery.ts) (`GALLERY_ARTWORKS`, 6 items) is separate from `PROJECTS_DATA` (8 items) hardcoded inside `PortalShell.tsx`. Clicking a work in the inner grid opens a modal displaying only a badge with `"9:16"` or `"16:9"` text inside a box.
4. **Platform & Accessibility Gaps:** Custom `<div role="dialog">` overlays lack focus trapping and focus restoration; no `prefers-reduced-motion` guard for `animate-pulse` and hover lifts; mobile menu lacks full accessibility semantics (`aria-expanded`, `44px+` touch targets).

---

## 2. Target Redesign Vision ("Museum Exhibition Wing")

When the visitor scrolls through the Center OLED Portal, they step into an **architectural inner exhibition wing & director's monograph** built on the exact material vocabulary of the 3D museum:
- **Material & Color System:**
  - Architectural Concrete Obsidian (`#0F1012`), Charcoal Gallery Wall (`#16171B`), Warm Porous Travertine (`#EFE9DF` / `#D6C7B2` / `#B8AA94`), Matte Anodized Steel Hairlines (`1px` architectural borders, `2px–4px` crisp museum bevels instead of pill-heavy `rounded-xl` boxes).
  - Calibrated Single Primary Accent: Museum Tungsten Gold (`#E09F3E`), with OLED Telemetry Slate (`#38BDF8`) reserved strictly for portal-threshold/timecode indicators. Zero purple/neon gradients.
- **Typography & Editorial Voice:**
  - `Geist` display/body + `Geist Mono` (`tabular-nums`) for frame indices, timecodes (`24 FPS · 4K DCI`), print specs (`300 DPI CMYK`), and dates.
  - Plain, confident human headings (removing `// TIMELINE A`, `01 // DISCIPLINE`, and generic filler copy).
- **Signature Museum-Matched Features:**
  1. **Unified Exhibition Data Contract (`src/data/portfolio.ts` + `src/data/gallery.ts`):** Every 3D wall frame maps cleanly into the inner portfolio archive alongside expanded works, with optional drop-in media paths (`public/media/...`) and high-craft interactive procedural visual plates so zero frames look empty even before client files are supplied.
  2. **Museum Hero (`#top`):** Asymmetric gallery-placard split — positioning statement + real production facts on the left; interactive curated **Featured Exhibition Frame** (framed in matte anodized steel bezel with switchable preview of the 6 atrium artworks) on the right.
  3. **Curated Works Exhibition (`#projects`):** True `9:16` portrait poster plates + `16:9` widescreen cinema frames in an asymmetric architectural grid, rendered with rich bespoke SVG/Canvas visual artwork plates (NLE timeline tracks, Log-to-Rec.709 split frame, frequency-separation reticle, risograph waveforms, cinema chiaroscuro typography) and wall-placard metadata.
  4. **Interactive Exhibition Lightbox (`<dialog>`):** Native top-layer modal featuring a **Before/After Log-to-Graded / Retouching comparison slider** (for color/photo pieces) or **NLE Timeline Scrubber visualization** (for video cuts) + production deliverables + keyboard-safe `ESC` closing that never accidentally exits the 3D portal.
  5. **Practice Monograph & Spec Ledger (`#about`, `#skills`):** Asymmetric narrative + architectural studio table (`#about`), followed by a crisp hairline-ruled 4-discipline Craft & Stack Ledger (`#skills`) with zero nested-box clutter.
  6. **Separate Career & Academic Ledgers (`#experience`, `#education`):** Architectural year-to-role index rows preserving distinct `#experience` and `#education` headings and semantic structure.
  7. **Commissions & Print-Ready CV (`#contact` + CV `<dialog>`):** Direct commission channels (`Email`, `Telegram`, `Phone`) with one-click copy feedback + a crisp, print-optimized (`@media print`) CV document modal.

---

## 3. Complete Agent Skills Execution Matrix

Every applicable skill from the agent skill library is integrated across the 6 lifecycle phases:

| Lifecycle Phase | Agent Skills Applied | Concrete Role & Deliverable in This Project |
|---|---|---|
| **0. Discovery & Alignment** | `using-agent-skills`, `interview-me`, `idea-refine` | Surface open taste/media questions (dual-surface light/dark wing vs pure dark archive; real media assets vs procedural plates; optional portal texture sync), push back on SaaS bloat, lock explicit "Not Doing" scope. |
| **1. Spec, Constraints & Plan** | `spec-driven-development`, `constraint-driven-development`, `planning-and-task-breakdown`, `documentation-and-adrs` | Produce `SPEC.md`, `CONSTRAINTS.md` (TS strict, ESLint clean, WCAG 2.1 AA, CWV targets, zero `@ts-ignore`/`eslint-disable`), `DESIGN.md`, `docs/decisions/ADR-001-museum-portfolio-architecture.md`, `tasks/plan.md`, `tasks/todo.md`. |
| **2. Research & Design Tokens** | `taste-design`, `design-taste-frontend`, `modern-web-guidance`, `source-driven-development`, `api-and-interface-design`, `context-engineering` | Synthesize `DESIGN.md` tokens; run `npx -y modern-web-guidance@latest search/retrieve` for `<dialog>`, `prefers-reduced-motion`, custom scrollbars, color tokens, and CWV; read `node_modules/next/dist/docs/` per `AGENTS.md`; define `src/data/portfolio.ts` interfaces; decompose 1,132-line `PortalShell.tsx` into modular components. |
| **3. Incremental Execution & 3D Cohesion** | `incremental-implementation`, `frontend-ui-engineering`, `threejs-fundamentals`, `threejs-interaction`, `threejs-lighting`, `threejs-materials`, `deprecation-and-migration`, `doubt-driven-development` | Build in 6 thin vertical slices; preserve `GalleryCanvas` / `GallerySceneBuilder` scroll physics & WebGL disposal; optionally align `createPortalPreviewTexture` & `GalleryHUD` accent tokens; migrate off legacy `PROJECTS_DATA`; run adversarial `doubt-driven-development` review on scroll reverse-handoff & `<dialog>` `ESC` isolation. |
| **4. Testing, Verification & Audit** | `test-driven-development`, `site-check`, `browser-testing-with-devtools`, `performance-optimization`, `security-and-hardening`, `observability-and-instrumentation` | Write unit tests (data/filtering/scroll state) + update `run_site_check.py` Playwright E2E suite; run multi-viewport verification (`1440`, `768`, `390`, `320`, reduced motion); inspect DevTools DOM/a11y tree/console/CWV (`LCP <= 2.5s`, `CLS <= 0.1`, `INP <= 200ms`); verify `rel="noopener noreferrer"` and zero `dangerouslySetInnerHTML`/`eval`; run `npm audit`. |
| **5. Polish, Review & Ship** | `code-review-and-quality`, `code-simplification`, `debugging-and-error-recovery`, `shipping-and-launch`, `git-workflow-and-versioning`, `ci-cd-and-automation`, `seo-audit` | Run 5-axis code review; simplify redundant code/helpers; run `next build` & `npm run lint` & `tsc --noEmit`; audit metadata/semantic landmarks; deliver clean atomic commits (when requested). |

*Note on non-applicable skills:* `chrome-extensions`, `react-vite-dashboard`, `remotion`, `stitch::*`, `site-md`, `agy-customizations`, and `antigravity-guide` are intentionally excluded as outside this Next.js 16 + Three.js web portfolio scope.

---

## 4. Architecture & Target File Map

```text
src/
├── app/
│   ├── globals.css                    # Museum material tokens, @media (prefers-reduced-motion), @media print CV rules
│   ├── layout.tsx                     # Metadata & Geist / Geist Mono setup (verified against Next 16 docs)
│   └── page.tsx                       # Coordinates GalleryCanvas, GalleryHUD, PortalShell & optional frame deep-link
├── data/
│   ├── gallery.ts                     # 3D wall frame coordinates, camera presets, PORTAL_DATA
│   └── portfolio.ts                   # Unified PortfolioWork, ExperienceEntry, EducationEntry, DisciplineRow & StudioProfile
└── components/
    ├── gallery/                       # Preserved 3D museum (scroll animation & WebGL scene intact)
    └── portal/
        ├── PortalShell.tsx            # Orchestrator shell (~150 lines): scroll reverse-handoff, modal state, layout
        ├── PortalHeader.tsx           # Sticky 5-link studio bar + mobile accessible drawer + Exit Portal
        ├── PortalHero.tsx             # Asymmetric exhibition hero + interactive Framed Showcase preview
        ├── ExhibitionGrid.tsx         # Filter bar + asymmetric 9:16 & 16:9 curated gallery grid
        ├── ArtworkPlate.tsx           # High-craft visual plate renderer (drop-in image/video OR bespoke canvas/SVG art)
        ├── PracticeMonograph.tsx      # About narrative + Studio Spec card + 4-row Skills Ledger
        ├── CareerLedgers.tsx          # Distinct #experience and #education architectural index sections
        ├── ContactSection.tsx         # Direct inquiry channels + copy-to-clipboard + CV trigger
        ├── PortalFooter.tsx           # Minimal architectural footer (5 links + Top + Return to 3D)
        ├── WorkLightboxDialog.tsx     # Native <dialog> inspection modal w/ Before/After slider & NLE preview
        └── CvDialog.tsx               # Native <dialog> print-ready Curriculum Vitae sheet
```

---

## 5. Architecture & Implementation Phases

### Phase 1: Specification, Constraints & Design System (`spec-driven-development`, `constraint-driven-development`, `taste-design`, `modern-web-guidance`, `source-driven-development`, `documentation-and-adrs`)
- Read Next.js `16.4.6` local docs in `node_modules/next/dist/docs/` (checking `cacheComponents` / Client Component boundaries per `AGENTS.md`).
- Run `npx -y modern-web-guidance@latest search` & `retrieve` for: native modal `<dialog>`, reduced motion, dark/light tokens, custom scrollbars, accessibility.
- Author `DESIGN.md`, `SPEC.md`, `CONSTRAINTS.md`, and `docs/decisions/ADR-001-museum-portfolio-architecture.md`.
- **Checkpoint:** Design tokens, constraints, and component interfaces reviewed and confirmed.

### Phase 2: Data Unification & Pure Logic Tests (`api-and-interface-design`, `test-driven-development`, `deprecation-and-migration`)
- Create `src/data/portfolio.ts` unifying the 6 3D museum works from `src/data/gallery.ts` (linked via `galleryArtworkId`) with the full 8-item portfolio catalog, structured `visualPreset` & optional `mediaSrc` slots, disciplines, experience, education, and contact info.
- Write unit tests (lightweight Node/TS runner or Vitest if approved) verifying category filtering, gallery-to-portal mapping integrity, and reverse-scroll threshold behavior.
- **Checkpoint:** Type-check passes (`npx tsc --noEmit`) and data contract tests pass.

### Phase 3: Tokens, Header, Hero & Exhibition Grid (`incremental-implementation`, `frontend-ui-engineering`, `design-taste-frontend`, `context-engineering`)
- Update `src/app/globals.css` with museum travertine/concrete tokens, sharp architectural hairlines, `prefers-reduced-motion` rules, and print styles.
- Build `PortalHeader.tsx` (preserving exact 5 links: `Projects`, `About`, `Skills`, `Experience`, `Contact / CV`), `PortalHero.tsx`, `ArtworkPlate.tsx`, and `ExhibitionGrid.tsx`.
- Wire into slimmed `PortalShell.tsx` with clean scroll reverse-handoff (`scrollTop <= 0 && deltaY < -15`).
- **Checkpoint:** `npm run lint` and `npm run build` succeed; hero and curated grid render cleanly at `1440px`, `768px`, and `390px`.

### Phase 4: Monograph, Ledgers, Contact & Native `<dialog>` Modals (`modern-web-guidance`, `frontend-ui-engineering`, `doubt-driven-development`, `security-and-hardening`)
- Build `PracticeMonograph.tsx` (`#about`, `#skills`), `CareerLedgers.tsx` (`#experience`, `#education`), `ContactSection.tsx` (`#contact`), and `PortalFooter.tsx`.
- Build `WorkLightboxDialog.tsx` (with interactive Log→Rec.709 / retouch comparison slider & NLE timeline preview) and `CvDialog.tsx` using native `<dialog>` `showModal()`.
- Run `doubt-driven-development` adversarial check: confirm `ESC` inside `<dialog>` closes *only* the modal and does not bubble to `GalleryCanvas`'s `window.addEventListener('keydown')` `exitPortal()`.
- **Checkpoint:** Full keyboard navigation, focus trapping, zero console errors, `npm run build` clean.

### Phase 5: Optional Museum Visual Harmony & Full Verification (`threejs-*`, `site-check`, `browser-testing-with-devtools`, `performance-optimization`, `code-review-and-quality`, `code-simplification`, `shipping-and-launch`)
- If desired, align `GallerySceneBuilder.ts` (`createPortalPreviewTexture`) & `GalleryHUD.tsx` color accents to echo the redesigned inner portfolio while preserving 100% of the 3D atrium geometry and scroll animation.
- Update `run_site_check.py` selectors to verify the redesigned inner portfolio (5 nav links, `#experience`, `#education`, `<dialog>` lightbox & CV modals, artwork plate rendering, mobile `390px`, `reduced-motion`, zero console/page errors).
- Execute `site-check` + Chrome DevTools inspection + `npm audit` + 5-axis code review + simplification pass.
- **Checkpoint:** `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `python run_site_check.py` all pass cleanly.

---

## 6. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| `<dialog>` `ESC` key bubbles to `GalleryCanvas` `window` listener and exits portal unexpectedly | High | Use `dialog.onCancel` / stop key propagation inside active modal + check `activeModal` guard in `GalleryCanvas`/parent before exiting portal. |
| Scroll reverse-handoff triggers accidentally while scrolling inside modals or mobile touch | Medium | Guard `onWheel` when any `<dialog>` is `open`; require `scrollTop <= 0 && deltaY < -15` only on outer portal scroll container. |
| Next.js 16 `cacheComponents: true` / `partialPrefetching: true` constraints | Medium | Read `node_modules/next/dist/docs/` before editing `app/` files (`AGENTS.md`). |
| Lack of real client photos/videos makes cards look generic | High | Build genuine high-DPI procedural visual artwork plates (`ArtworkPlate.tsx`) + interactive comparison/NLE inspection + clean `public/media/` drop-in slots. |
| Existing `run_site_check.py` assertions break after redesign | Low | Update `run_site_check.py` assertions in lockstep during Phase 5 while preserving the core semantic anchors (`#top`, `#projects`, `#about`, `#skills`, `#experience`, `#education`, `#contact`). |

---

## 7. Open Questions for User Confirmation

1. **Inner Surface Palette Direction:**
   - **Option A (Recommended — Dual-Surface Museum Wing):** Concrete dark opening threshold (`#0F1012`) transitioning into **Warm Limestone / Travertine exhibition galleries (`#EFE9DF` / `#D6C7B2`)** and dark screening bands — directly echoing the 3D travertine walls.
   - **Option B (Pure Dark Architectural Archive):** Keeps the entire inner website dark charcoal/obsidian (`#0C0D10` + `#16171B`) with warm travertine stone accents (`#D6C7B2`), hairline grids, and tungsten gold highlights (`#E09F3E`).
2. **Portfolio Media Assets:** Do you have actual video clips, poster JPG/PNGs, or before/after photos ready to place in `public/media/`, or should we build bespoke procedural exhibition plates + interactive Log/Rec.709 & NLE previews wired to drop-in `mediaSrc` slots?
3. **3D Portal Screen Sync:** Should we keep the 3D museum files 100% untouched, or also update the center OLED screen preview (`createPortalPreviewTexture` in `GallerySceneBuilder.ts`) to reflect the redesigned inner portfolio look?
