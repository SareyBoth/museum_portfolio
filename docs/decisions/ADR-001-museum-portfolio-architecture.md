# ADR-001: Dual-Surface Museum Wing & Unified Exhibition Data Architecture

## Status
Accepted (2026-11-18)

## Context
The 3D gallery (`GallerySceneBuilder.ts`) presents a Brutalist Travertine & Board-Formed Concrete Atrium culminating in a 2,400px scroll runway through a Center OLED Portal into `PortalShell`. Previously, `PortalShell.tsx` was a 1,132-line single file using generic dark SaaS cards (`#09090B` / `#111114`), duplicating project metadata separately from `src/data/gallery.ts`, and implementing non-native `<div role="dialog">` overlays whose `Escape` behavior collided with the underlying 3D gallery `window` keydown listener.

## Decision
1. **Adopt Dual-Surface Museum Wing (Option A):** Alternate Concrete Obsidian (`#0F1012`) opening/closing bands with Warm Travertine Stone (`#EFE9DF` / `#D6C7B2`) gallery sections and Board-Formed Charcoal (`#16171B`) technical ledgers, mirroring the 3D atrium's actual physical materials.
2. **Unify Portfolio & Gallery Data (`src/data/portfolio.ts`):** Link the 6 3D wall frames (`GALLERY_ARTWORKS`) to the 8 curated portfolio pieces via `galleryArtworkId`, while providing optional `mediaSrc` drop-in asset slots paired with bespoke procedural SVG/HTML visual exhibition plates (`ArtworkPlate`).
3. **Decompose `PortalShell.tsx` into Focused Client Modules:** Separate header, hero, exhibition grid, artwork plate renderer, monograph/skills, career ledgers, contact/footer, and native `<dialog>` inspection/CV modals.
4. **Native Top-Layer `<dialog>` + ESC Isolation:** Replace custom `<div role="dialog">` overlays with semantic `<dialog>` opened via `showModal()`, guarding `GalleryCanvas` `Escape` exit while any modal is open so dismissing a modal keeps the visitor inside the portfolio.

## Alternatives Considered
- **Pure Dark Monochrome Redesign (Option B):** Clean, but misses the defining visual signature of the 3D museum — the warm porous travertine walls contrasting against dark concrete and steel.
- **Keeping `PortalShell.tsx` Monolithic:** Faster initially, but hampers maintainability, readability, and focused testing.

## Consequences
- Stronger immersion between the 3D museum exterior and the inner portfolio wing.
- Modular components (<250 lines each) that are easy to inspect, test, and update with real media later.
- Requires keeping `run_site_check.py` selectors aligned with the semantic HTML structure (`<dialog>`, `#projects`, `#about`, `#skills`, `#experience`, `#education`, `#contact`).
