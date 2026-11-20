'use client';

import React from 'react';
import { ArtworkData } from '@/data/gallery';
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';

export type CameraMode = 'OVERVIEW' | 'FRAME_INSPECT' | 'PORTAL_PORTFOLIO';

interface GalleryHUDProps {
  mode: CameraMode;
  activeArtwork: ArtworkData | null;
  portalProgress: number; // 0.0 to 1.0
  hoveredTargetName?: string | null;
  onBackToOverview: () => void;
  onStepArtwork: (direction: -1 | 1) => void;
  onEnterPortal?: () => void;
  onExitPortal: () => void;
}

export const GalleryHUD: React.FC<GalleryHUDProps> = ({
  mode,
  activeArtwork,
  portalProgress,
  onBackToOverview,
  onStepArtwork,
  onExitPortal,
}) => {
  const isPortalMode = mode === 'PORTAL_PORTFOLIO';
  const isInspectMode = mode === 'FRAME_INSPECT';
  const isOverview = mode === 'OVERVIEW';

  // Smoothly fade out HUD during portal transit so controls never collide with PortalShell top navigation
  const hudHeaderOpacity = isPortalMode
    ? Math.max(0, 1 - (portalProgress - 0.4) / 0.4)
    : 1;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 select-none overflow-hidden font-sans no-print">
      {/* 1. Contextual Top Controls (Inspect & Portal Transit) */}
      {(isInspectMode || (isPortalMode && portalProgress < 0.75)) && (
        <header
          style={{
            opacity: hudHeaderOpacity,
            pointerEvents: hudHeaderOpacity > 0.1 ? 'auto' : 'none',
          }}
          className="absolute top-6 right-0 flex items-center justify-end px-6 md:px-12 transition-opacity duration-200"
        >
          <div className="flex items-center gap-2">
            {isInspectMode && (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 backdrop-blur-md border border-cyan-500/50 text-xs font-mono text-cyan-300">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>INSPECTING // {activeArtwork?.aspectRatio}</span>
                </div>
                <button
                  type="button"
                  onClick={onBackToOverview}
                  className="px-3 py-1.5 rounded bg-neutral-100 hover:bg-white text-neutral-900 text-xs font-mono font-medium tracking-wide flex items-center gap-1.5 transition-all shadow-lg active:scale-95 cursor-pointer"
                  aria-label="Back to Gallery Overview"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Gallery</span>
                  <kbd className="hidden md:inline px-1 py-0.5 text-[10px] bg-neutral-200 text-neutral-700 rounded">ESC</kbd>
                </button>
              </>
            )}

            {isPortalMode && portalProgress < 0.75 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/70 backdrop-blur-md border border-amber-500/50 text-xs font-mono text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>PORTAL TRANSIT ({Math.round(portalProgress * 100)}%)</span>
              </div>
            )}

            {isPortalMode && portalProgress < 0.65 && (
              <button
                type="button"
                onClick={onExitPortal}
                className="px-3.5 py-1.5 rounded bg-amber-500/90 hover:bg-amber-400 text-neutral-950 text-xs font-mono font-bold tracking-wide flex items-center gap-1.5 transition-all shadow-lg active:scale-95 cursor-pointer"
                aria-label="Exit Portal to Gallery"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit Portal</span>
                <kbd className="hidden md:inline px-1 py-0.5 text-[10px] bg-amber-600/40 text-neutral-900 rounded">ESC</kbd>
              </button>
            )}
          </div>
        </header>
      )}

      {/* 2. Active Artwork Caption Card (#frame-caption) in Inspect Mode */}
      {isInspectMode && activeArtwork && (
        <aside
          id="frame-caption"
          aria-labelledby="frame-caption-title"
          className="absolute bottom-6 left-6 right-6 md:left-12 md:right-auto md:w-[480px] pointer-events-auto bg-neutral-950/85 backdrop-blur-xl border border-neutral-800 rounded-xl p-5 shadow-2xl transition-all duration-300 text-neutral-200"
        >
          {/* Card Header & Category */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: activeArtwork.accentColor }}
              />
              <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
                {activeArtwork.wall === 'left' ? 'Left Wall · 9:16 Portrait' : 'Right Wall · 16:9 Landscape'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-neutral-400">
              FRAME [{activeArtwork.index + 1}/6]
            </div>
          </div>

          {/* Title & Headline */}
          <h2
            id="frame-caption-title"
            className="text-lg md:text-xl font-bold tracking-tight text-white mb-1"
          >
            {activeArtwork.title}
          </h2>
          <p className="text-xs font-mono text-cyan-400 mb-2">
            {activeArtwork.category} · {activeArtwork.year}
          </p>

          {/* Narrative & Description */}
          <p className="text-xs text-neutral-300 leading-relaxed mb-3">
            {activeArtwork.description}
          </p>

          <p className="text-[11px] text-neutral-400 italic border-l-2 border-neutral-700 pl-2.5 py-0.5 mb-4">
            Curator Note: {activeArtwork.curatorNote}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {activeArtwork.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded bg-neutral-800/80 border border-neutral-700/60 text-[10px] font-mono text-neutral-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Stepper Controls & Return */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onStepArtwork(-1)}
                className="p-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white transition-colors"
                title="Previous Frame (Left Arrow)"
                aria-label="Previous Frame"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onStepArtwork(1)}
                className="p-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white transition-colors"
                title="Next Frame (Right Arrow)"
                aria-label="Next Frame"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-neutral-400 ml-1">
                Use <kbd className="px-1 py-0.5 bg-neutral-800 rounded text-neutral-300">←</kbd> <kbd className="px-1 py-0.5 bg-neutral-800 rounded text-neutral-300">→</kbd> to step
              </span>
            </div>

            <button
              onClick={onBackToOverview}
              className="px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </aside>
      )}

      {/* 3. Overview Bottom Interaction Hint */}
      {isOverview && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center px-6 pointer-events-none">
          <div className="flex items-center text-[11px] font-mono text-neutral-400 bg-neutral-950/80 px-4 py-1.5 rounded-full border border-neutral-800/80 backdrop-blur-sm shadow-xl">
            <span>Click poster to inspect</span>
          </div>
        </div>
      )}
    </div>
  );
};
