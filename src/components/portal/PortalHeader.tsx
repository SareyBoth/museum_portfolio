'use client';

import React, { useEffect } from 'react';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { PORTAL_NAV_ITEMS, STUDIO_PROFILE } from '@/data/portfolio';

interface PortalHeaderProps {
  onExitPortal: () => void;
  isMenuOpen: boolean;
  onMenuOpenChange: (isOpen: boolean) => void;
  profile?: {
    name: string;
    monogram: string;
    disciplines: string;
  };
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  onExitPortal,
  isMenuOpen,
  onMenuOpenChange,
  profile,
}) => {
  const p = profile ?? STUDIO_PROFILE;
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (
        e.key === 'Escape' &&
        !e.defaultPrevented &&
        !document.querySelector('dialog[open]')
      ) {
        e.stopPropagation();
        onMenuOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleEsc, true);
    return () => window.removeEventListener('keydown', handleEsc, true);
  }, [isMenuOpen, onMenuOpenChange]);

  return (
    <header className="sticky top-0 z-50 w-full surface-concrete border-b border-[var(--museum-steel)] bg-[#0F1012] no-print">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 md:px-12 flex items-center justify-between gap-3">
        {/* Studio Monogram & Name */}
        <a
          href="#top"
          className="flex items-center gap-2.5 sm:gap-3 text-[var(--museum-ivory)] no-underline group min-h-[44px] min-w-0"
        >
          <span className="w-8 h-8 shrink-0 rounded-[2px] bg-[#16171B] border border-[var(--museum-steel-control)] flex items-center justify-center font-mono font-bold text-xs text-[var(--museum-gold)] group-hover:border-[var(--museum-gold)] transition-colors">
            {p.monogram}
          </span>
          <span className="flex flex-col min-w-0">
            <span className="font-semibold text-xs sm:text-sm tracking-tight text-[var(--museum-ivory)] leading-tight uppercase truncate">
              {p.name}
            </span>
            <span className="hidden sm:block font-mono text-[10px] text-[var(--museum-ash)] uppercase tracking-wider truncate">
              {p.disciplines}
            </span>
          </span>
        </a>

        {/* Primary 5 Navigation Links (preserved order, single-line across tablet & desktop) */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center md:gap-4 lg:gap-7 font-mono text-xs text-[var(--museum-ash)]"
        >
          {PORTAL_NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="min-h-[44px] px-1 inline-flex items-center whitespace-nowrap hover:text-[var(--museum-ivory)] transition-colors relative after:absolute after:left-0 after:right-0 after:bottom-2 after:h-px after:bg-[var(--museum-gold)] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Museum Return & Mobile Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              onMenuOpenChange(false);
              onExitPortal();
            }}
            className="min-h-[44px] px-3 sm:px-3.5 rounded-[2px] bg-[#16171B] hover:bg-[#1E2026] border border-[var(--museum-steel-control)] hover:border-[var(--museum-gold)] font-mono text-xs text-[var(--museum-ivory)] flex items-center gap-2 transition-colors cursor-pointer active:translate-y-px whitespace-nowrap"
            aria-label="Exit Portal and return to 3D Gallery"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[var(--museum-gold)]" aria-hidden="true" />
            <span className="hidden sm:inline">Exit Portal</span>
            <span className="sm:hidden">Exit</span>
            <kbd className="hidden lg:inline px-1.5 py-0.5 text-[9px] bg-white/10 text-[var(--museum-ash)] rounded-[2px]">
              ESC
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => onMenuOpenChange(!isMenuOpen)}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[2px] bg-[#16171B] border border-[var(--museum-steel-control)] text-[var(--museum-ivory)] cursor-pointer"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="portal-mobile-nav"
          >
            {isMenuOpen ? (
              <X className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Menu className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Drawer */}
      {isMenuOpen && (
        <nav
          id="portal-mobile-nav"
          aria-label="Mobile"
          className="md:hidden w-full bg-[#0F1012] border-t border-[var(--museum-steel)] px-6 py-3 flex flex-col divide-y divide-white/[0.06] font-mono text-xs"
        >
          {PORTAL_NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => onMenuOpenChange(false)}
              className="min-h-[44px] flex items-center justify-between text-[var(--museum-ash)] hover:text-[var(--museum-ivory)] transition-colors"
            >
              <span>{item.label}</span>
              <span className="text-[var(--museum-gold)]" aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};
