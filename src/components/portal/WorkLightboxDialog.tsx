'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Grid, RotateCcw, X } from 'lucide-react';
import type { PortfolioWork } from '@/data/portfolio';
import { ArtworkPlate } from './ArtworkPlate';

interface WorkLightboxDialogProps {
  work: PortfolioWork | null;
  onClose: () => void;
  onStepWork: (direction: -1 | 1) => void;
  onInspectInMuseum?: (galleryArtworkId: string) => void;
}

interface WorkLightboxBodyProps {
  work: PortfolioWork;
  titleId: string;
  onInspectInMuseum?: (galleryArtworkId: string) => void;
}

const WorkLightboxBody: React.FC<WorkLightboxBodyProps> = ({
  work,
  titleId,
  onInspectInMuseum,
}) => {
  const rangeId = useId();
  const [comparePosition, setComparePosition] = useState(52);
  const [timelineProgress, setTimelineProgress] = useState(42);
  const [showPrintGrid, setShowPrintGrid] = useState(false);

  return (
    <div className="overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-6 bg-[#0F1012]">
        {/* Visual Plate Frame */}
        <div className="bg-[#090A0D] border border-[var(--museum-steel)] p-3 sm:p-4 flex items-center justify-center">
          <div
            className={`relative w-full overflow-hidden border border-white/10 ${
              work.aspect === '9:16'
                ? 'max-w-[300px] aspect-[9/16]'
                : 'max-w-3xl aspect-[16/9]'
            }`}
          >
            <ArtworkPlate
              work={work}
              comparePosition={comparePosition}
              timelineProgress={timelineProgress}
              showPrintGrid={showPrintGrid}
              variant="dialog"
            />
          </div>
        </div>

        {/* Interactive Inspection Controls Tailored to Discipline */}
        <div className="p-4 bg-[#16171B] border border-[var(--museum-steel)] rounded-[2px] flex flex-wrap items-center justify-between gap-4">
          {work.inspectionMode === 'compare' && (
            <div className="flex-1 min-w-[200px] flex flex-wrap items-center gap-3">
              <label
                htmlFor={rangeId}
                className="font-mono text-xs text-[var(--museum-ivory)] shrink-0"
              >
                Before / After Split ({comparePosition}%)
              </label>
              <input
                id={rangeId}
                type="range"
                min={8}
                max={92}
                value={comparePosition}
                onChange={(e) => setComparePosition(Number(e.target.value))}
                className="comparison-range flex-1 min-w-[120px] cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setComparePosition(50)}
                className="min-h-[44px] px-3 rounded-[2px] bg-[#0F1012] border border-[var(--museum-steel-control)] font-mono text-xs text-[var(--museum-ash)] hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>50/50</span>
              </button>
            </div>
          )}

          {work.inspectionMode === 'timeline' && (
            <div className="flex-1 min-w-[200px] flex flex-wrap items-center gap-3">
              <label
                htmlFor={rangeId}
                className="font-mono text-xs text-[var(--museum-ivory)] shrink-0 tabular-nums"
              >
                NLE Playhead Scrub ({timelineProgress}%)
              </label>
              <input
                id={rangeId}
                type="range"
                min={4}
                max={96}
                value={timelineProgress}
                onChange={(e) => setTimelineProgress(Number(e.target.value))}
                className="comparison-range flex-1 min-w-[120px] cursor-pointer"
              />
            </div>
          )}

          {work.inspectionMode === 'print-grid' && (
            <div className="flex flex-wrap items-center justify-between flex-1 gap-3">
              <span className="font-mono text-xs text-[var(--museum-ash)]">
                Print overlay: Swiss modular columns &amp; bleed margin
              </span>
              <button
                type="button"
                onClick={() => setShowPrintGrid((prev) => !prev)}
                aria-pressed={showPrintGrid}
                className={`min-h-[44px] px-3.5 py-2 rounded-[2px] border font-mono text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                  showPrintGrid
                    ? 'bg-[var(--museum-travertine)] text-[var(--museum-ink)] border-[var(--museum-travertine)] font-semibold'
                    : 'bg-[#0F1012] text-[var(--museum-ivory)] border-[var(--museum-steel-control)]'
                }`}
              >
                <Grid className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{showPrintGrid ? 'Hide Print Grid' : 'Show Swiss Grid'}</span>
              </button>
            </div>
          )}

          {work.galleryArtworkId && onInspectInMuseum && (
            <button
              type="button"
              onClick={() => onInspectInMuseum(work.galleryArtworkId!)}
              className="min-h-[44px] px-4 py-2 rounded-[2px] bg-[#0F1012] hover:bg-white/10 border border-[var(--museum-gold)]/70 font-mono text-xs text-[var(--museum-gold)] cursor-pointer transition-colors"
            >
              View Frame in 3D Atrium →
            </button>
          )}
        </div>

        {/* Metadata & Curatorial Notes */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          <div className="md:col-span-7 space-y-3">
            <span className="font-mono text-xs text-[var(--museum-gold)] block">
              {work.category}
            </span>
            <h2 id={titleId} className="text-2xl font-bold text-[var(--museum-ivory)] tracking-tight">
              {work.title}
            </h2>
            <p className="text-sm text-[var(--museum-ash)] leading-relaxed">
              {work.desc}
            </p>
            <p className="text-xs italic text-[var(--museum-stone-mid)] border-l-2 border-[var(--museum-gold)] pl-3 py-0.5">
              Curator Note: {work.curatorNote}
            </p>
          </div>

          <div className="md:col-span-5 space-y-4 p-4 bg-[#16171B] border border-[var(--museum-steel)] rounded-[2px]">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--museum-ash)] block">
                Production Deliverables
              </span>
              <p className="font-mono text-xs text-[var(--museum-ivory)] leading-relaxed">
                {work.deliverables}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-[var(--museum-steel)]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--museum-ash)] block">
                Software &amp; Pipeline
              </span>
              <ul className="flex flex-wrap gap-1.5 list-none p-0 m-0">
                {work.tools.map((tool) => (
                  <li
                    key={tool}
                    className="font-mono text-[11px] px-2 py-0.5 rounded-[2px] bg-[#0F1012] border border-white/10 text-[var(--museum-ivory)]"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
};

export const WorkLightboxDialog: React.FC<WorkLightboxDialogProps> = ({
  work,
  onClose,
  onStepWork,
  onInspectInMuseum,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (work) {
      const openingFresh = !wasOpenRef.current;
      if (!dialog.open) {
        dialog.showModal();
      }
      if (openingFresh) {
        // Focus Close button only on initial open; preserve focus on Previous/Next when stepping
        closeBtnRef.current?.focus();
      }
      wasOpenRef.current = true;
    } else {
      wasOpenRef.current = false;
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [work]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if ('closedBy' in HTMLDialogElement.prototype) return;

    const isOutside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      );
    };

    let pressedOutside = false;
    const handlePointerDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e);
    };
    const handlePointerUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e)) {
        dialog.close();
      }
    };

    dialog.addEventListener('pointerdown', handlePointerDown);
    dialog.addEventListener('pointerup', handlePointerUp);
    return () => {
      dialog.removeEventListener('pointerdown', handlePointerDown);
      dialog.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const handleCloseEvent = () => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.returnValue = '';
    }
    wasOpenRef.current = false;
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={handleCloseEvent}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
        }
      }}
      {...({ closedby: 'any' } as Record<string, string>)}
      className="museum-dialog w-[calc(100vw-2rem)] max-w-4xl max-h-[90dvh] rounded-[3px] shadow-2xl overflow-hidden no-print"
    >
      {work && (
        <div className="flex flex-col max-h-[90dvh]">
          {/* Header Bar kept un-keyed so Previous/Next focus stays intact across steps */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-[var(--museum-steel)] bg-[#16171B]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: work.accentColor }}
                aria-hidden="true"
              />
              <span className="font-mono text-xs text-[var(--museum-ivory)] truncate tabular-nums">
                {work.plaqueNumber} · {work.specLabel} · {work.year}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onStepWork(-1)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[2px] bg-[#0F1012] hover:bg-white/10 border border-[var(--museum-steel-control)] text-[var(--museum-ivory)] cursor-pointer"
                aria-label="Previous work"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onStepWork(1)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[2px] bg-[#0F1012] hover:bg-white/10 border border-[var(--museum-steel-control)] text-[var(--museum-ivory)] cursor-pointer"
                aria-label="Next work"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="min-h-[44px] px-3 rounded-[2px] bg-[#0F1012] hover:bg-white/15 border border-[var(--museum-steel-control)] text-[var(--museum-ivory)] font-mono text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span className="hidden sm:inline">Close</span>
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <WorkLightboxBody
            key={work.id}
            work={work}
            titleId={titleId}
            onInspectInMuseum={onInspectInMuseum}
          />
        </div>
      )}
    </dialog>
  );
};
