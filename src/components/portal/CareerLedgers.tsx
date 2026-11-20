'use client';

import React from 'react';
import { EDUCATION_ENTRIES, EXPERIENCE_ENTRIES } from '@/data/portfolio';

interface TimelineSectionProps {
  id: string;
  eyebrow: string;
  heading: string;
  summary: string;
  withBottomBorder?: boolean;
  children: React.ReactNode;
}

const TimelineSection: React.FC<TimelineSectionProps> = ({
  id,
  eyebrow,
  heading,
  summary,
  withBottomBorder = false,
  children,
}) => (
  <section
    id={id}
    className={`scroll-mt-16 py-20 md:py-24 ${
      withBottomBorder ? 'border-b border-[var(--museum-mortar)]' : ''
    }`}
  >
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-5 min-w-0">
          <div className="space-y-2.5">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--museum-ochre)] block">
              {eyebrow}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[var(--museum-ink)] tracking-tight">
              {heading}
            </h2>
            <p className="text-sm text-[var(--museum-slate)] leading-relaxed max-w-[36ch]">
              {summary}
            </p>
          </div>

          <div
            aria-hidden="true"
            className="pt-4 border-t border-[var(--museum-mortar)] flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] text-[var(--museum-slate)]"
          >
            <span className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--museum-ink)] border border-[var(--museum-ink)] inline-flex items-center justify-center">
                <span className="w-1 h-1 rounded-[1px] bg-[var(--museum-gold)] forced-colors:bg-[CanvasText]" />
              </span>
              <span>Active</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--museum-stone)] border-[1.5px] border-[var(--museum-mortar-control)]" />
              <span>Completed</span>
            </span>
          </div>
        </div>

        <div className="lg:col-span-8 min-w-0 relative">
          {/* Continuous architectural vertical timeline spine and terminal baseline tick */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[37px] sm:top-[41px] bottom-0 left-[7px] sm:left-[8px] w-px bg-[var(--museum-mortar-control)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 w-[15px] sm:w-[17px] h-px bg-[var(--museum-mortar-control)]"
          />

          <ol role="list" className="relative space-y-8 sm:space-y-10 list-none p-0 m-0">
            {children}
          </ol>
        </div>
      </div>
    </div>
  </section>
);

interface TimelineEntryCardProps {
  index: number;
  period: string;
  title: string;
  institution: string;
  location: string;
  children: React.ReactNode;
}

const TimelineEntryCard: React.FC<TimelineEntryCardProps> = ({
  index,
  period,
  title,
  institution,
  location,
  children,
}) => {
  const isCurrent = period.toUpperCase().includes('PRESENT');
  const indexLabel = String(index + 1).padStart(2, '0');

  return (
    <li className="relative pl-7 sm:pl-12">
      {/* Square architectural node marker centered cleanly on the 1px spine */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-[30px] sm:top-[33px] w-[15px] h-[15px] sm:w-[17px] sm:h-[17px] rounded-[2px] flex items-center justify-center ${
          isCurrent
            ? 'bg-[var(--museum-ink)] border border-[var(--museum-ochre)]'
            : 'bg-[var(--museum-stone)] border-[1.5px] border-[var(--museum-mortar-control)]'
        }`}
      >
        {isCurrent && (
          <span className="w-[5px] h-[5px] sm:w-[7px] sm:h-[7px] rounded-[1px] bg-[var(--museum-gold)] forced-colors:bg-[CanvasText]" />
        )}
      </span>

      {/* Horizontal connector rule bridging the rail node to the framed milestone card */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[15px] sm:left-[17px] top-[37px] sm:top-[41px] w-[13px] sm:w-[31px] h-px bg-[var(--museum-mortar-control)]"
      />

      <article className="min-w-0 rounded-[3px] bg-[var(--museum-stone)] border border-[var(--museum-mortar-control)] p-6 sm:p-7 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pb-3.5 border-b border-[var(--museum-mortar)]">
          <div className="flex items-center gap-2 min-h-[25px] font-mono text-xs tabular-nums">
            <span className="font-bold tracking-[0.12em] text-[var(--museum-ochre)]">
              {indexLabel}
            </span>
            <span className="text-[var(--museum-mortar-control)]" aria-hidden="true">
              /
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--museum-slate)]">
              {isCurrent ? 'Active' : 'Completed'}
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[2px] border font-mono text-[11px] leading-none font-semibold tracking-wider tabular-nums ${
              isCurrent
                ? 'bg-[var(--museum-ink)] text-[var(--museum-ivory)] border-[var(--museum-ink)]'
                : 'bg-[var(--museum-travertine)] text-[var(--museum-slate)] border-[var(--museum-mortar-control)]'
            }`}
          >
            {isCurrent && (
              <span
                className="w-1.5 h-1.5 rounded-[1px] bg-[var(--museum-gold)] border border-[var(--museum-gold)] status-pulse shrink-0"
                aria-hidden="true"
              />
            )}
            <span>{period}</span>
          </span>
        </div>

        <div className="space-y-1.5 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--museum-ink)] tracking-tight leading-snug">
            {title}
          </h3>
          <p className="font-mono text-xs text-[var(--museum-slate)] leading-relaxed">
            <span className="font-semibold text-[var(--museum-ink)]">{institution}</span>
            <span className="mx-1.5 text-[var(--museum-ochre)]" aria-hidden="true">
              ·
            </span>
            <span>{location}</span>
          </p>
        </div>

        {children}
      </article>
    </li>
  );
};

interface CareerLedgersProps {
  experience?: readonly typeof EXPERIENCE_ENTRIES[number][];
  education?: readonly typeof EDUCATION_ENTRIES[number][];
}

export const CareerLedgers: React.FC<CareerLedgersProps> = ({
  experience = EXPERIENCE_ENTRIES,
  education = EDUCATION_ENTRIES,
}) => {
  return (
    <div className="surface-travertine travertine-ashlar-backdrop border-b border-[var(--museum-mortar)] no-print">
      <TimelineSection
        id="experience"
        eyebrow="Production Credits"
        heading="Experience"
        summary="Commercial video editing, color grading, retouching, and print art direction roles."
        withBottomBorder
      >
        {experience.map((entry, index) => (
          <TimelineEntryCard
            key={`${entry.period}-${entry.role}`}
            index={index}
            period={entry.period}
            title={entry.role}
            institution={entry.organization}
            location={entry.location}
          >
            <ul
              role="list"
              className="pt-3.5 px-0 pb-0 m-0 border-t border-[var(--museum-mortar)] space-y-2.5 text-sm text-[var(--museum-slate)] leading-relaxed list-none"
            >
              {entry.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span
                    className="w-1.5 h-1.5 mt-2 shrink-0 rounded-[1px] bg-[var(--museum-ochre)]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </TimelineEntryCard>
        ))}
      </TimelineSection>

      <TimelineSection
        id="education"
        eyebrow="Academic Foundation"
        heading="Education"
        summary="University studies in media systems and foundational visual arts training."
      >
        {education.map((entry, index) => (
          <TimelineEntryCard
            key={`${entry.period}-${entry.institution}`}
            index={index}
            period={entry.period}
            title={entry.degree}
            institution={entry.institution}
            location={entry.location}
          >
            <p className="pt-3.5 border-t border-[var(--museum-mortar)] text-sm text-[var(--museum-slate)] leading-relaxed max-w-[62ch]">
              {entry.focus}
            </p>
          </TimelineEntryCard>
        ))}
      </TimelineSection>
    </div>
  );
};
