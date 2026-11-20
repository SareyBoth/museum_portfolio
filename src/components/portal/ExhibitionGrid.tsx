'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  WORK_CATEGORIES,
  type PortfolioWork,
  type WorkFilter,
} from '@/data/portfolio';
import { ArtworkPlate } from './ArtworkPlate';

interface ExhibitionGridProps {
  selectedFilter: WorkFilter;
  onSelectFilter: (filter: WorkFilter) => void;
  works: readonly PortfolioWork[];
  onSelectWork: (work: PortfolioWork) => void;
}

export const ExhibitionGrid: React.FC<ExhibitionGridProps> = ({
  selectedFilter,
  onSelectFilter,
  works,
  onSelectWork,
}) => {
  return (
    <section
      id="projects"
      className="scroll-mt-16 surface-travertine travertine-ashlar-backdrop border-b border-[var(--museum-mortar)] py-20 md:py-24 no-print"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        {/* Gallery Wing Heading & Discipline Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[var(--museum-mortar)]">
          <div className="space-y-2.5 max-w-xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--museum-ochre)] block">
              Selected Works · Travertine Gallery
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[var(--museum-ink)] tracking-tight">
              Posters &amp; video edits.
            </h2>
            <p className="text-sm text-[var(--museum-slate)] leading-relaxed">
              Curated archive pairing widescreen 16:9 cinema timelines and color grades with vertical 9:16 key art posters and studio retouching.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter exhibition works by discipline"
            className="self-start md:self-auto flex flex-wrap items-center gap-1.5 p-1.5 rounded-[3px] bg-[var(--museum-stone)] border border-[var(--museum-mortar-control)]"
          >
            {WORK_CATEGORIES.map((category) => {
              const active = selectedFilter === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onSelectFilter(category)}
                  aria-pressed={active}
                  className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-[2px] border font-mono text-xs transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--museum-ink)] border-[var(--museum-ink)] text-[var(--museum-ivory)] font-semibold'
                      : 'border-transparent text-[var(--museum-slate)] hover:text-[var(--museum-ink)] hover:bg-black/5'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Discipline-Specific Museum Grid (3-col cinema strip for Video; 4-col poster gallery + full-width feature for Photo) */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            selectedFilter === 'Video' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
          } gap-6`}
        >
          {works.map((work, index) => {
            const isPortrait = work.aspect === '9:16';
            const isPhotoFeature = selectedFilter === 'Photo' && !isPortrait;
            const isVideoTabletSpan =
              selectedFilter === 'Video' &&
              works.length % 2 === 1 &&
              index === works.length - 1;
            const sizesOverride = isPhotoFeature
              ? '(max-width: 1024px) 92vw, 710px'
              : isVideoTabletSpan
                ? '(max-width: 1024px) 92vw, 31vw'
                : undefined;

            return (
              <article
                key={work.id}
                className={`exhibition-card group relative flex flex-col justify-between bg-[var(--museum-stone)] border border-[var(--museum-mortar-control)] hover:border-[var(--museum-ink)] focus-within:ring-2 focus-within:ring-[var(--museum-ochre)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--museum-travertine)] rounded-[3px] overflow-hidden motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 shadow-sm hover:shadow-xl ${
                  isPhotoFeature
                    ? 'md:col-span-2 lg:col-span-4 lg:flex-row'
                    : isVideoTabletSpan
                      ? 'md:col-span-2 lg:col-span-1'
                      : ''
                }`}
              >
                {/* Framed Matte-Black Museum Artwork Mount */}
                <div
                  className={`p-3 bg-[#141518] border-b border-[var(--museum-steel)] w-full ${
                    isPhotoFeature
                      ? 'lg:w-7/12 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-4 flex items-center'
                      : ''
                  }`}
                >
                  <div
                    className={`relative w-full overflow-hidden border border-white/10 bg-[#090A0D] ${
                      isPortrait ? 'aspect-[9/16]' : 'aspect-[16/9]'
                    }`}
                  >
                    <ArtworkPlate work={work} variant="card" sizesOverride={sizesOverride} />
                  </div>
                </div>

                {/* Museum Wall Placard */}
                <div
                  className={`p-5 flex-1 min-w-0 flex flex-col justify-between gap-4 w-full ${
                    isPhotoFeature ? 'lg:w-5/12 lg:flex-none lg:p-8 lg:gap-6' : ''
                  }`}
                >
                  <div className={`space-y-2 ${isPhotoFeature ? 'lg:space-y-3' : ''}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-[var(--museum-slate)] tabular-nums">
                      <span className="font-semibold text-[var(--museum-ochre)]">
                        {work.plaqueNumber} · {work.year}
                      </span>
                      {work.galleryArtworkId ? (
                        <span className="px-1.5 py-0.5 bg-[#141518]/10 text-[var(--museum-ink)] rounded-[2px] text-[10px]">
                          3D Atrium Frame
                        </span>
                      ) : (
                        <span>{work.aspect}</span>
                      )}
                    </div>

                    <h3
                      className={`font-bold text-[var(--museum-ink)] group-hover:text-[var(--museum-ochre)] transition-colors leading-snug ${
                        isPhotoFeature ? 'text-base lg:text-2xl' : 'text-base'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onSelectWork(work)}
                        className="text-left cursor-pointer after:absolute after:inset-0 focus-visible:outline-none"
                      >
                        {work.title}
                      </button>
                    </h3>

                    <p
                      className={`text-[var(--museum-slate)] leading-relaxed ${
                        isPhotoFeature
                          ? 'text-xs lg:text-sm line-clamp-2 lg:line-clamp-none'
                          : 'text-xs line-clamp-2'
                      }`}
                    >
                      {work.desc}
                    </p>

                    {isPhotoFeature && (
                      <p className="hidden lg:block pt-2 font-mono text-[11px] text-[var(--museum-slate)] leading-relaxed">
                        {work.deliverables}
                      </p>
                    )}
                  </div>

                  <div
                    className={`pt-3 border-t border-[var(--museum-mortar)] flex items-center justify-between gap-2 w-full ${
                      isPhotoFeature ? 'lg:pt-4' : ''
                    }`}
                  >
                    <span className="font-mono text-[11px] text-[var(--museum-slate)] truncate">
                      {isPhotoFeature
                        ? work.tools.join(' · ')
                        : work.tools.slice(0, 2).join(' · ')}
                    </span>
                    <span
                      className="shrink-0 font-mono text-[11px] font-semibold text-[var(--museum-ink)] inline-flex items-center gap-1 group-hover:text-[var(--museum-ochre)] transition-colors"
                      aria-hidden="true"
                    >
                      <span>Inspect</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
