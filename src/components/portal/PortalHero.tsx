'use client';

import React from 'react';
import Image from 'next/image';
import { STUDIO_PROFILE } from '@/data/portfolio';

interface PortalHeroProps {
  onOpenCv: () => void;
  profile?: {
    name: string;
    monogram: string;
    disciplines: string;
    location: string;
    timezone: string;
    availability: string;
    portraitSrc: string;
    portraitAlt: string;
    portraitPlaque: string;
    heroLead: string;
    heroSpecs: string;
    showAvailability: boolean;
  };
}

export const PortalHero: React.FC<PortalHeroProps> = ({ onOpenCv, profile }) => {
  const p = profile ?? STUDIO_PROFILE;

  return (
    <section
      id="top"
      className="scroll-mt-16 surface-concrete museum-grid-backdrop relative border-b border-[var(--museum-steel)] no-print"
    >
      {/* Warm skylight wash echoing the 3D atrium ceiling */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 45% at 75% 18%, rgba(229, 169, 60, 0.08), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-16 md:py-16 space-y-10">
        {/* Top Exhibition Telemetry Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--museum-steel)] font-mono text-xs text-[var(--museum-ash)] tabular-nums">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 status-pulse" aria-hidden="true" />
            <span className="text-[var(--museum-ivory)] font-medium uppercase tracking-wider">
              {p.location}
            </span>
            <span className="text-white/25" aria-hidden="true">
              ·
            </span>
            <span>{p.availability}</span>
          </div>
          <div className="text-[var(--museum-ash)]">{p.heroSpecs}</div>
        </div>

        {/* Asymmetric 12-Col Museum Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Statement + Actions + Disciplines Ledger */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--museum-gold)]">
                Inner Exhibition Wing · Portfolio Monograph
              </p>
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black text-[var(--museum-ivory)] tracking-[-0.04em] leading-[0.95]">
                {p.name}.
                <span className="block text-2xl sm:text-4xl xl:text-[2.75rem] text-[var(--museum-stone-mid)] font-medium tracking-tight mt-3 leading-[1.12]">
                  {p.disciplines}
                </span>
              </h1>
              <p className="text-base sm:text-lg text-[var(--museum-ash)] leading-relaxed max-w-[62ch]">
                {p.heroLead}
              </p>
            </div>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-wrap items-center gap-3.5">
              <a
                href="#projects"
                className="min-h-[44px] px-6 py-3 rounded-[2px] bg-[var(--museum-travertine)] hover:bg-white text-[var(--museum-ink)] font-mono font-semibold text-xs tracking-wider inline-flex items-center gap-2 transition-colors active:translate-y-px no-underline"
              >
                Explore Selected Works ↓
              </a>
              <button
                type="button"
                onClick={onOpenCv}
                className="min-h-[44px] px-6 py-3 rounded-[2px] bg-transparent hover:bg-white/[0.06] border border-[var(--museum-steel-control)] hover:border-[var(--museum-gold)] font-mono font-semibold text-xs text-[var(--museum-ivory)] inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                Preview CV ↗
              </button>
            </div>

            {/* Clean Architectural Discipline Ledger */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[var(--museum-steel)]">
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] text-[var(--museum-gold)] tabular-nums block">
                  01 · Motion
                </span>
                <h2 className="text-sm font-semibold text-[var(--museum-ivory)]">
                  Video Editing
                </h2>
                <p className="text-xs text-[var(--museum-ash)] leading-relaxed">
                  Commercial pacing, velocity speed ramps, and beat-synced sound design.
                </p>
              </div>
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] text-[var(--museum-gold)] tabular-nums block">
                  02 · Print
                </span>
                <h2 className="text-sm font-semibold text-[var(--museum-ivory)]">
                  Poster Design
                </h2>
                <p className="text-xs text-[var(--museum-ash)] leading-relaxed">
                  Swiss grid festival key art, bilingual typography, and 300 DPI prepress.
                </p>
              </div>
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] text-[var(--museum-gold)] tabular-nums block">
                  03 · Finishing
                </span>
                <h2 className="text-sm font-semibold text-[var(--museum-ivory)]">
                  Color &amp; Retouching
                </h2>
                <p className="text-xs text-[var(--museum-ash)] leading-relaxed">
                  DaVinci Resolve 35mm LUTs and frequency-separation portrait work.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Studio Portrait Plinth */}
          <div className="lg:col-span-5">
            <div className="bg-[#16171B] border border-[var(--museum-steel)] p-4 sm:p-5 rounded-[3px] shadow-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 font-mono text-[11px] text-[var(--museum-ash)]">
                <span>{p.portraitPlaque}</span>
                <span className="shrink-0 text-[var(--museum-gold)]">PHNOM PENH · KH</span>
              </div>

              {/* Matte-Black Steel Mount */}
              <div
                className="w-full bg-[#090A0D] border border-white/10 p-3 sm:p-4"
                style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}
              >
                <div
                  className="w-full max-w-[360px] mx-auto aspect-[4/5] overflow-hidden border border-white/15 bg-[#090A0D]"
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '360px',
                    margin: '0 auto',
                    aspectRatio: '4 / 5',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={p.portraitSrc}
                    alt={p.portraitAlt}
                    width={360}
                    height={450}
                    sizes="(max-width: 464px) calc(100vw - 6.5rem), 360px"
                    loading="eager"
                    priority
                    className="object-cover object-top"
                    style={{
                      width: '100%',
                      height: '100%',
                      maxWidth: '360px',
                      aspectRatio: '4 / 5',
                      objectFit: 'cover',
                      objectPosition: 'top',
                      display: 'block',
                    }}
                  />
                </div>
              </div>

              {/* Museum Portrait Placard Footer */}
              <div className="pt-1 space-y-1.5 min-w-0">
                <p className="font-semibold text-sm text-[var(--museum-ivory)]">
                  {p.name}
                </p>
                <p className="font-mono text-[11px] text-[var(--museum-ash)] leading-relaxed">
                  {p.disciplines}
                </p>
                <p className="font-mono text-[11px] text-[var(--museum-ash)] pt-2.5 border-t border-[var(--museum-steel)]">
                  {p.timezone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
