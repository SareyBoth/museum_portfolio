'use client';

import React from 'react';
import { PORTAL_NAV_ITEMS, STUDIO_PROFILE } from '@/data/portfolio';

interface PortalFooterProps {
  onBackToTop: () => void;
  onExitPortal: () => void;
  profile?: {
    name: string;
    disciplines: string;
    location: string;
  };
}

export const PortalFooter: React.FC<PortalFooterProps> = ({
  onBackToTop,
  onExitPortal,
  profile,
}) => {
  const p = profile ?? STUDIO_PROFILE;
  return (
    <footer className="surface-concrete bg-[#0A0B0D] py-12 px-6 md:px-12 no-print">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="font-bold text-base text-[var(--museum-ivory)] tracking-tight uppercase block">
              {p.name}
            </span>
            <span className="font-mono text-xs text-[var(--museum-ash)] uppercase tracking-wider">
              {p.disciplines}
            </span>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-xs text-[var(--museum-ash)]"
          >
            {PORTAL_NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="min-h-[44px] inline-flex items-center hover:text-[var(--museum-ivory)] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[var(--museum-steel)] font-mono text-xs text-[var(--museum-ash)]">
          <span>
            &copy; 2026 {p.name} &middot; {p.location}.
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackToTop}
              className="min-h-[44px] inline-flex items-center hover:text-[var(--museum-ivory)] transition-colors cursor-pointer"
            >
              Back to Top ↑
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onExitPortal}
              className="min-h-[44px] inline-flex items-center text-[var(--museum-gold)] hover:text-white transition-colors cursor-pointer"
            >
              Return to 3D Gallery →
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
