# Task Breakdown: Inner Portfolio Redesign (`art_gallery`)

> Generated per `planning-and-task-breakdown` from `tasks/plan.md`. Do not start coding until the user approves `tasks/plan.md` and answers the open questions.

---

## Phase 1 — Specification, Constraints & Design System

### Task 1: Author Project Spec, Constraints, Design System & ADR
**Description:** Inspect Next.js 16.4.6 local docs (`node_modules/next/dist/docs/`) and retrieve `modern-web-guidance` guides (`<dialog>`, reduced motion, CSS color tokens, scrollbars, accessibility). Formalize `SPEC.md`, `CONSTRAINTS.md`, `DESIGN.md`, and `docs/decisions/ADR-001-museum-portfolio-architecture.md`.
**Skills:** `source-driven-development`, `modern-web-guidance`, `spec-driven-development`, `constraint-driven-development`, `taste-design`, `documentation-and-adrs`
**Acceptance criteria:**
- [x] `DESIGN.md` defines exact travertine/concrete palette tokens, Geist typography scale, hairline spacing rules, and banned AI tells.
- [x] `SPEC.md` and `CONSTRAINTS.md` establish measurable build, typecheck, lint, WCAG 2.1 AA, and CWV thresholds.
- [x] Retrieved `modern-web-guidance` & Next.js 16 doc findings are recorded with exact version/source citations.
**Verification:**
- [x] Manual check: all files reviewed and verified complete against skill checklists.
**Dependencies:** User confirmation of `tasks/plan.md` open questions.
**Files likely touched:** `SPEC.md`, `CONSTRAINTS.md`, `DESIGN.md`, `docs/decisions/ADR-001-museum-portfolio-architecture.md`
**Estimated scope:** Medium (4 doc files)

---

## Phase 2 — Data Contract & Tests

### Task 2: Unify Museum & Portfolio Data Schema (`src/data/portfolio.ts`) + Unit Tests
**Description:** Define typed interfaces linking the 6 3D museum artworks (`GALLERY_ARTWORKS`) with the full 8-item portfolio catalog, discipline rows, experience/education entries, and optional `public/media/` asset slots. Add unit tests for filtering and gallery-ID cross-linking.
**Skills:** `api-and-interface-design`, `test-driven-development`, `deprecation-and-migration`
**Acceptance criteria:**
- [x] All 6 `GALLERY_ARTWORKS` entries map cleanly to matching portfolio works via `galleryArtworkId`.
- [x] Pure helper functions (`filterWorksByCategory`, `findLinkedArtwork`) have deterministic passing unit tests.
- [x] No hardcoded `PROJECTS_DATA` remains inside UI components once wired.
**Verification:**
- [x] Tests pass: unit test runner executes with 0 failures (`node --test src/data/__tests__/portfolio.test.ts`, 6/6 pass).
- [x] Typecheck passes: `npx tsc --noEmit`.
**Dependencies:** Task 1
**Files likely touched:** `src/data/portfolio.ts`, `src/data/gallery.ts`, `src/data/__tests__/portfolio.test.ts` (or node `--test`)
**Estimated scope:** Small (2-3 files)

## Checkpoint 1: Foundation & Contract Ready
- [x] `DESIGN.md`, `SPEC.md`, `CONSTRAINTS.md` written and aligned
- [x] `npx tsc --noEmit` passes with zero errors
- [x] Portfolio data unit tests pass

---

## Phase 3 — Tokens, Shell, Header, Hero & Exhibition Grid

### Task 3: Design System CSS Tokens & Reduced-Motion / Print Rules
**Description:** Update `src/app/globals.css` with museum travertine, board-formed concrete, steel hairline, and accent tokens, top-level `@media (prefers-reduced-motion: reduce)` handling, custom scrollbar refinement, and `@media print` CV styles.
**Skills:** `modern-web-guidance`, `taste-design`, `design-taste-frontend`, `incremental-implementation`
**Acceptance criteria:**
- [x] Semantic CSS tokens match `DESIGN.md` with sufficient WCAG contrast (`>= 4.5:1` body, `>= 3:1` large text and controls).
- [x] Reduced-motion disables pulsing and transform transitions smoothly.
- [x] Existing 3D canvas full-viewport layout rules remain intact.
**Verification:**
- [x] Build succeeds: `npm run build`
- [x] Lint passes: `npm run lint` (0 errors)
**Dependencies:** Task 1
**Files likely touched:** `src/app/globals.css`, `src/app/layout.tsx`
**Estimated scope:** Small (1-2 files)

### Task 4: Sticky Exhibition Header & Architectural Hero (`PortalHeader`, `PortalHero`)
**Description:** Implement the sticky 5-link studio navigation bar (`Projects`, `About`, `Skills`, `Experience`, `Contact / CV`), accessible mobile drawer (`44px+` touch targets, `aria-expanded`), and asymmetric museum-placard Hero featuring an interactive Framed Artwork Preview synced with museum pieces.
**Skills:** `frontend-ui-engineering`, `design-taste-frontend`, `incremental-implementation`
**Acceptance criteria:**
- [x] Header renders the exact 5 navigation links in order plus `Exit Portal` control without colliding with `GalleryHUD`.
- [x] Hero fills the opening viewport cleanly on `1440x900`, `768x1024`, and `390x844` without horizontal overflow or generic AI labels (`01 // DISCIPLINE`).
- [x] Interactive Framed Showcase switches cleanly between highlighted museum pieces.
**Verification:**
- [x] Typecheck & build succeed: `npx tsc --noEmit && npm run build`
- [x] Manual/Playwright check at 1440, 768, 390.
**Dependencies:** Task 2, Task 3
**Files likely touched:** `src/components/portal/PortalHeader.tsx`, `src/components/portal/PortalHero.tsx`
**Estimated scope:** Small (2 files)

### Task 5: Curated Exhibition Grid & Bespoke Artwork Plates (`ArtworkPlate`, `ExhibitionGrid`)
**Description:** Build `ArtworkPlate.tsx` (rendering either real `public/media/` image/video when provided OR bespoke layered SVG/Canvas artwork compositions matching each work's medium) and `ExhibitionGrid.tsx` (discipline filter + asymmetric mixed `9:16` / `16:9` gallery wall grid with clean wall-placard typography).
**Skills:** `design-taste-frontend`, `frontend-ui-engineering`, `performance-optimization`, `incremental-implementation`
**Acceptance criteria:**
- [x] Zero generic icon-in-circle placeholders remain in project cards.
- [x] Both `9:16` portrait posters and `16:9` widescreen video/retouch frames maintain true aspect ratios without distortion or overflow at `320px`, `390px`, `768px`, and `1440px`.
- [x] Category filters (`All`, `Video Edits`, `Poster Design`, `Photo Retouching`) update displayed works and preserve keyboard accessibility.
**Verification:**
- [x] Build & lint succeed: `npm run lint && npm run build`
- [x] Filter behavior covered by tests.
**Dependencies:** Task 2, Task 3
**Files likely touched:** `src/components/portal/ArtworkPlate.tsx`, `src/components/portal/ExhibitionGrid.tsx`
**Estimated scope:** Small (2 files)

## Checkpoint 2: Core Exhibition Experience Verified
- [x] `npm run lint && npx tsc --noEmit && npm run build` green
- [x] Header, Hero, and Exhibition Grid visually verified in headless Chromium

---

## Phase 4 — Monograph, Career Ledgers, Contact & Native `<dialog>` Modals

### Task 6: Studio Monograph (`#about`, `#skills`), Career Ledgers (`#experience`, `#education`), Contact & Footer
**Description:** Implement `PracticeMonograph.tsx` (asymmetric narrative + studio spec table + 4-row hairline-ruled Craft Ledger), `CareerLedgers.tsx` (distinct `#experience` and `#education` architectural index sections), `ContactSection.tsx` (commission channels with copy feedback + CV trigger), and `PortalFooter.tsx`.
**Skills:** `frontend-ui-engineering`, `design-taste-frontend`, `security-and-hardening`, `incremental-implementation`
**Acceptance criteria:**
- [x] `#about`, `#skills`, `#experience`, `#education`, and `#contact` anchor IDs all resolve from header/footer links.
- [x] No generic vertical dot-timeline cards or `// TIMELINE A/B` labels remain; Experience and Education maintain distinct `<h2>` headings.
- [x] External links include `rel="noopener noreferrer"`; footer reproduces the 5 links plus Top and Return to 3D Gallery controls.
**Verification:**
- [x] Build & lint pass: `npm run lint && npm run build`
- [x] Anchor navigation tested in browser.
**Dependencies:** Task 2, Task 3
**Files likely touched:** `src/components/portal/PracticeMonograph.tsx`, `src/components/portal/CareerLedgers.tsx`, `src/components/portal/ContactSection.tsx`, `src/components/portal/PortalFooter.tsx`
**Estimated scope:** Medium (4 files)

### Task 7: Native `<dialog>` Modals (`WorkLightboxDialog`, `CvDialog`) & `PortalShell` Orchestration
**Description:** Refactor `PortalShell.tsx` to compose all modular sections (~150 lines) and implement native `<dialog>` (`showModal()`) modals: `WorkLightboxDialog.tsx` (with interactive Before/After split slider & NLE timeline scrub preview) and `CvDialog.tsx` (print-friendly CV view). Run `doubt-driven-development` adversarial check on `ESC` isolation and reverse-scroll boundaries.
**Skills:** `modern-web-guidance`, `frontend-ui-engineering`, `context-engineering`, `doubt-driven-development`, `code-simplification`
**Acceptance criteria:**
- [x] Both modals use native `<dialog>` via React refs (`showModal()` / `close()`), restoring focus to the triggering element on close.
- [x] Pressing `ESC` inside an open modal closes only the modal and NEVER triggers `GalleryCanvas` `exitPortal()`.
- [x] Reverse-scroll (`scrollTop <= 0 && deltaY < -4` via `shouldReverseScrollToGallery`) returns smoothly to the 3D atrium only when no modal is open.
- [x] Legacy monolithic JSX in `PortalShell.tsx` is fully replaced cleanly.
**Verification:**
- [x] Build & typecheck pass: `npx tsc --noEmit && npm run build`
- [x] Keyboard `Escape`, focus preservation across lightbox stepping, mobile drawer Escape isolation, and `Exit Portal` tested in Playwright (wheel reverse-scroll rule covered by unit test).
**Dependencies:** Tasks 4, 5, 6
**Files likely touched:** `src/components/portal/WorkLightboxDialog.tsx`, `src/components/portal/CvDialog.tsx`, `src/components/portal/PortalShell.tsx`, `src/app/page.tsx`
**Estimated scope:** Medium (4 files)

## Checkpoint 3: Feature Complete & Adversarially Reviewed
- [x] `doubt-driven-development` & `code-reviewer` adversarial review completed for scroll-handoff, focus preservation, and `<dialog>` ESC handling
- [x] All sections and modals interactive and keyboard-accessible

---

## Phase 5 — Museum Harmony, Full Browser Audit & Ship Gate

### Task 8: Optional 3D Portal Preview Alignment & End-to-End Site Check
**Description:** Harmonized `GalleryHUD.tsx` and `GalleryCanvas.tsx` (reduced-motion support, `ArrowLeft`/`ArrowRight` entry from OVERVIEW, `inspectArtworkById` deep-link, exit damping fix, Escape isolation) while preserving `GallerySceneBuilder.ts` 3D geometry, materials, and lighting. Verified end-to-end against a clean local production server on `127.0.0.1:3015`.
**Skills:** `threejs-fundamentals`, `threejs-interaction`, `site-check`, `browser-testing-with-devtools`, `performance-optimization`, `debugging-and-error-recovery`
**Acceptance criteria:**
- [x] 3D museum geometry, lighting, and 2,400px scroll animation remain intact (`site-check` Chromium GPU audit: 8/8 shots green, 0 problems, 0 overflow, 0 blank canvases).
- [x] Full portal Playwright verification passes across `1440x900`, `768x1024`, `390x844`, `320x640`, and `prefers-reduced-motion` with 0 console/page errors and 0 horizontal overflow (Playwright WebKit `webkit-2388` binary not installed locally).
- [ ] Chrome DevTools MCP accessibility tree and CWV trace (not executed; verified via Playwright DOM/focus/computed-style checks and `site-check` WebGL report instead).
**Verification:**
- [x] `verify_portal.py` (`10/10` checks) + `site-check` Chromium (`8/8` shots) both exit `0`
- [x] Visual inspection of all updated screenshots in `shots_verify/` and `sitecheck_shots/sheet.jpg`
**Dependencies:** Task 7
**Files likely touched:** `src/components/gallery/GalleryHUD.tsx`, `src/components/gallery/GalleryCanvas.tsx`
**Estimated scope:** Small (1-3 files)

### Task 9: Final 5-Axis Code Review, Simplification & Release Readiness
**Description:** Conduct 5-axis code review (`code-review-and-quality`), run `code-simplification` cleanup pass, verify `npm audit` (`security-and-hardening`), confirm zero `CONSTRAINTS.md` floor violations (`@ts-ignore`, `eslint-disable`, stubs), and run final production build.
**Skills:** `code-review-and-quality`, `code-simplification`, `security-and-hardening`, `shipping-and-launch`, `seo-audit`, `git-workflow-and-versioning`
**Acceptance criteria:**
- [x] Zero TypeScript errors, zero ESLint errors (1 pre-existing warning in untouched `GallerySceneBuilder.ts`), clean production `npm run build`.
- [x] Zero suppression comments (`ZERO_SUPPRESSIONS` verified across `src/`) or dead code left behind.
- [x] All deliverables and visual screenshots verified post-final-edit.
**Verification:**
- [x] `npx tsc --noEmit` + `npm run lint` + `node --test src/data/__tests__/portfolio.test.ts` + `npm run build` + `verify_portal.py` + `site-check --browser chromium` all exit `0`
**Dependencies:** Task 8
**Files likely touched:** Minor cleanup across `src/` completed prior to final verification pass
**Estimated scope:** Small
