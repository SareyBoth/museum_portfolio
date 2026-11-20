# Specification: Inner Portfolio Redesign (`art_gallery`)

## Objective
Redesign the inner portfolio shell ([`src/components/portal/PortalShell.tsx`](file:///C:/Users/BeeNaa/Desktop/art_gallery/src/components/portal/PortalShell.tsx)) into a modern, museum-grade dual-surface portfolio matching the 3D Brutalist Travertine & Concrete Art Museum for **SareyBoth** (Video Editor · Photo Retoucher · Poster Designer in Phnom Penh, Cambodia), while preserving the existing 3D atrium and 2,400px scroll-to-enter animation.

## Tech Stack (Verified from `package.json`)
- Next.js `16.4.6` (App Router, `cacheComponents: true`, `partialPrefetching: true`)
- React `19.3.0`
- TypeScript `^5` (`strict: true`)
- Tailwind CSS `4.3.3` (`@tailwindcss/turbopack`)
- Three.js `^0.187.0` (preserved 3D gallery viewport)
- `lucide-react` `^1.74.0`

## Commands
- Dev server: `npm run dev`
- Type check: `npx tsc --noEmit`
- Lint: `npm run lint`
- Production build: `npm run build`
- Unit tests: `node --experimental-strip-types --test src/data/__tests__/portfolio.test.ts`
- Browser E2E verification: `python run_site_check.py`

## Project Structure
- `src/app/` — Root layout (`Geist`, `Geist Mono`), global CSS tokens (`globals.css`), and page orchestrator (`page.tsx`)
- `src/data/` — `gallery.ts` (3D spatial coordinates) and `portfolio.ts` (unified curated works, studio bio, capabilities, experience, education, contact channels)
- `src/components/gallery/` — Preserved 3D museum scene, camera state machine, and HUD
- `src/components/portal/` — Modular inner portfolio components (`PortalShell`, `PortalHeader`, `PortalHero`, `ExhibitionGrid`, `ArtworkPlate`, `PracticeMonograph`, `CareerLedgers`, `ContactSection`, `PortalFooter`, `WorkLightboxDialog`, `CvDialog`)

## Code Style & Patterns
- Typed domain models (`PortfolioWork`, `ExperienceEntry`, `EducationEntry`) with zero `any` casts in new portal modules.
- Native `<dialog>` via `showModal()` for inspection lightbox and CV sheet (`modern-web-guidance` compliant, no manual focus traps or `role="dialog"` on `<dialog>`).
- Top-level CSS tokens with `@media (prefers-reduced-motion: no-preference)` opt-in motion and explicit `color-scheme` per surface (`dark` on obsidian bands, `light` on travertine galleries).

## Testing Strategy
- Unit tests covering `'Video'` and `'Photo'` exhibition filtering, gallery-frame-to-portfolio cross-referencing, and reverse-scroll guard conditions.
- Playwright multi-viewport E2E verification (`run_site_check.py`) checking desktop (`1440x900`), tablet (`768x1024`), mobile (`390x844`), `320px` overflow check, `prefers-reduced-motion`, `<dialog>` `Escape` isolation (does not exit portal), 5 nav links, and zero console/page errors.

## Boundaries
- **Always:** Verify `npx tsc --noEmit`, `npm run lint`, and `npm run build` after changes; keep `PortalShell` reverse-scroll handoff (`scrollTop <= 0 && deltaY < -15`) intact; preserve all authentic portfolio info for SareyBoth.
- **Ask first:** Changing 3D atrium architecture, adding new npm runtime dependencies, or altering contact credentials.
- **Never:** Break the 3D museum scroll animation, invent fake client stats/reviews, leave generic icon-blob placeholders, or add `@ts-ignore`/`eslint-disable` suppressions.

## Success Criteria
- Inner portfolio visually matches the 3D travertine/concrete atrium under Option A Dual-Surface Museum Wing, with the hero displaying the archival portrait (`public/media/profile-portrait.jpg`).
- Exhibition filters are `'Video'` and `'Photo'` only; all 8 works render real visual compositions (plus interactive color-grade slider & NLE timeline inspection in `<dialog>`), supporting optional drop-in `public/media/` files.
- Exact 5 navigation links (`Projects`, `About`, `Skills`, `Experience`, `Contact / CV`), clean architectural vertical timelines under distinct `Experience` and `Education` headings (still banning `// TIMELINE A/B` boilerplate labels), and `Exit Portal` return to 3D gallery all work cleanly.
- Zero TypeScript errors, zero ESLint errors, clean `next build`, and passing `run_site_check.py` with zero console errors or horizontal overflow.
