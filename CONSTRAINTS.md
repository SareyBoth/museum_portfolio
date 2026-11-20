# Constraints

Last reviewed: 2026-11-18

## Floor (always enforced)
- No new suppression comments: `@ts-ignore`, `@ts-expect-error`, `eslint-disable`
- No unimplemented stubs or empty `catch {}` blocks
- No skipped or deleted tests to force green status
- No secrets, API keys, or sensitive internal paths in source
- Never weaken this file to make a check pass

## Enforced Quality Gates

| Dimension | Rule | Checked by | Runs at |
|---|---|---|---|
| Types | Zero TypeScript errors (`strict: true`) | `npx tsc --noEmit` | Every slice |
| Lint | Zero ESLint errors (`eslint-config-next`) | `npm run lint` | Every slice |
| Production Build | Clean Next.js 16 build | `npm run build` | Checkpoint & final |
| Logic Correctness | All portfolio data & state unit tests pass | `node --experimental-strip-types --test src/data/__tests__/portfolio.test.ts` | Data & final |
| Browser & A11y & Visual | Desktop (`1440x900`), Tablet (`768x1024`), Mobile (`390x844`), `320px` overflow, reduced motion, zero console errors | `python run_site_check.py` | Checkpoint & final |
| Supply Chain Security | Zero unmitigated high/critical advisories | `npm audit --audit-level=high` | Final |

## Accessibility & Performance Targets
- WCAG 2.1 AA contrast: `>= 4.5:1` normal text, `>= 3:1` large text and UI boundaries.
- Interactive targets: `>= 44px` comfortable touch targets on primary/mobile controls (`>= 24x24px` minimum everywhere).
- Native `<dialog>` top-layer modals with `overscroll-behavior: contain` and `Escape` isolation from the 3D canvas `window` key listener.
- Compositor-only animations (`transform`, `opacity`) gated behind `@media (prefers-reduced-motion: no-preference)`.
