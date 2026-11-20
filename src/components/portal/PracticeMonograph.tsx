'use client';

import React from 'react';
import { CAPABILITY_ROWS, STUDIO_PROFILE } from '@/data/portfolio';

interface PracticeMonographProps {
  profile?: {
    narrativeLead: string;
    narrativeParagraphs: string[];
    educationSummary: string;
    disciplines: string;
    location: string;
    timezone: string;
    availability: string;
  };
  skills?: readonly typeof CAPABILITY_ROWS[number][];
}

export const PracticeMonograph: React.FC<PracticeMonographProps> = ({
  profile,
  skills,
}) => {
  const p = profile ?? STUDIO_PROFILE;
  const s = skills ?? CAPABILITY_ROWS;
  return (
    <>
      {/* About Section — Honed Travertine Monograph */}
      <section
        id="about"
        className="scroll-mt-16 surface-travertine border-b border-[var(--museum-mortar)] py-20 md:py-24 no-print"
        style={{ backgroundColor: 'var(--museum-stone)' }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <div className="space-y-2.5">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--museum-ochre)] block">
              Creative Practice
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[var(--museum-ink)] tracking-tight">
              About
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Editorial Narrative */}
            <div className="lg:col-span-7 space-y-5 text-base text-[var(--museum-slate)] leading-relaxed max-w-[65ch]">
              <p className="text-xl sm:text-2xl font-semibold text-[var(--museum-ink)] leading-snug tracking-tight">
                {p.narrativeLead}
              </p>
              {p.narrativeParagraphs.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>

            {/* Studio Spec Placard */}
            <dl className="lg:col-span-5 bg-[var(--museum-travertine)] border border-[var(--museum-mortar)] rounded-[3px] divide-y divide-[var(--museum-mortar)]">
              <div className="p-5 space-y-1">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-[var(--museum-slate)]">
                  Where I Studied
                </dt>
                <dd className="text-sm font-semibold text-[var(--museum-ink)]">
                  {p.educationSummary}
                </dd>
              </div>
              <div className="p-5 space-y-1">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-[var(--museum-slate)]">
                  Core Disciplines
                </dt>
                <dd className="text-sm font-semibold text-[var(--museum-ink)]">
                  {p.disciplines}
                </dd>
              </div>
              <div className="p-5 space-y-1">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-[var(--museum-slate)]">
                  Based In
                </dt>
                <dd className="text-sm font-semibold text-[var(--museum-ink)]">
                  {p.location} ({p.timezone})
                </dd>
              </div>
              <div className="p-5 space-y-1">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-[var(--museum-slate)]">
                  Availability
                </dt>
                <dd className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-600 status-pulse"
                    aria-hidden="true"
                  />
                  <span>{p.availability}</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Skills Section — Board-Formed Charcoal Post-Production Ledger */}
      <section
        id="skills"
        className="scroll-mt-16 surface-charcoal border-b border-[var(--museum-steel)] py-20 md:py-24 no-print"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <div className="space-y-2.5 max-w-xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--museum-gold)] block">
              Tools &amp; Capabilities
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[var(--museum-ivory)] tracking-tight">
              Skills
            </h2>
            <p className="text-sm text-[var(--museum-ash)] leading-relaxed">
              Post-production editing suites, color finishing pipelines, and print design workflows grouped by craft.
            </p>
          </div>

          <div className="border-t border-[var(--museum-steel)] divide-y divide-[var(--museum-steel)]">
            {s.map((row) => (
              <div
                key={row.code}
                className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
              >
                <div className="md:col-span-4 space-y-1.5">
                  <span className="font-mono text-xs text-[var(--museum-gold)] tabular-nums block">
                    {row.code} · CRAFT
                  </span>
                  <h3 className="text-lg font-bold text-[var(--museum-ivory)]">
                    {row.title}
                  </h3>
                  <p className="text-xs text-[var(--museum-ash)] leading-relaxed">
                    {row.summary}
                  </p>
                </div>

                <ul className="md:col-span-8 flex flex-wrap gap-2 list-none p-0 m-0">
                  {row.tools.map((tool) => (
                    <li
                      key={tool}
                      className="px-3 py-1.5 rounded-[2px] bg-[#0F1012] border border-[var(--museum-steel)] font-mono text-xs text-[var(--museum-ivory)]"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
