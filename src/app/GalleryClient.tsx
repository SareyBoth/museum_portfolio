'use client';

import React, { useState, useRef, useCallback } from 'react';
import { GalleryCanvas, GalleryCanvasHandle } from '@/components/gallery/GalleryCanvas';
import { GalleryHUD, CameraMode } from '@/components/gallery/GalleryHUD';
import { PortalShell } from '@/components/portal/PortalShell';
import { ArtworkData } from '@/data/gallery';
import type { DynamicPortfolioData } from '@/lib/portfolio';

interface GalleryClientProps {
  initialData: DynamicPortfolioData;
}

export function GalleryClient({ initialData }: GalleryClientProps) {
  const canvasRef = useRef<GalleryCanvasHandle>(null);
  const isPortalModalOpenRef = useRef(false);
  const lastModalCloseAtRef = useRef(0);

  const [mode, setMode] = useState<CameraMode>('OVERVIEW');
  const [activeArtwork, setActiveArtwork] = useState<ArtworkData | null>(null);
  const [portalProgress, setPortalProgress] = useState<number>(0.0);
  const [hoveredTargetName, setHoveredTargetName] = useState<string | null>(null);

  // Center-aisle dolly finishes at progress = 1.0; crossfade begins smoothly at 0.90
  const isShellActive = portalProgress >= 0.96;
  const shellOpacity = isShellActive
    ? 1
    : Math.max(0, Math.min(1, (portalProgress - 0.90) / 0.06));

  const handleBackToOverview = useCallback(() => {
    canvasRef.current?.backToOverview();
  }, []);

  const handleStepArtwork = useCallback((direction: -1 | 1) => {
    canvasRef.current?.stepArtwork(direction);
  }, []);

  const handleEnterPortal = useCallback(() => {
    canvasRef.current?.enterPortal();
  }, []);

  const handleExitPortal = useCallback(() => {
    canvasRef.current?.exitPortal();
  }, []);

  const handleReverseScroll = useCallback((deltaY: number) => {
    canvasRef.current?.reverseScroll(deltaY);
  }, []);

  const handleInspectInMuseum = useCallback((galleryArtworkId: string) => {
    canvasRef.current?.inspectArtworkById(galleryArtworkId);
  }, []);

  const handleModalOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen && isPortalModalOpenRef.current) {
      lastModalCloseAtRef.current = performance.now();
    }
    isPortalModalOpenRef.current = isOpen;
  }, []);

  const canExitOnEscape = useCallback(() => {
    if (isPortalModalOpenRef.current) return false;
    return performance.now() - lastModalCloseAtRef.current > 200;
  }, []);

  return (
    <main className="relative w-full h-full overflow-hidden bg-[#060709]">
      {/* 1. 3D Brutalist Travertine Gallery Canvas Viewport */}
      <div className="no-print contents">
        <GalleryCanvas
          ref={canvasRef}
          paused={isShellActive && portalProgress >= 0.995}
          onModeChange={setMode}
          onActiveArtworkChange={setActiveArtwork}
          onPortalProgressChange={setPortalProgress}
          onHoveredTargetChange={setHoveredTargetName}
          canExitOnEscape={canExitOnEscape}
        />
      </div>

      {/* 2. Minimal Sharp Architectural UI Overlay */}
      <div className="contents" aria-hidden={isShellActive} inert={isShellActive}>
        <GalleryHUD
          mode={mode}
          activeArtwork={activeArtwork}
          portalProgress={portalProgress}
          hoveredTargetName={hoveredTargetName}
          onBackToOverview={handleBackToOverview}
          onStepArtwork={handleStepArtwork}
          onEnterPortal={handleEnterPortal}
          onExitPortal={handleExitPortal}
        />
      </div>

      {/* 3. Center OLED Screen Portal Experience Shell */}
      <PortalShell
        opacity={shellOpacity}
        isActive={isShellActive}
        onExitPortal={handleExitPortal}
        onReverseScroll={handleReverseScroll}
        onInspectInMuseum={handleInspectInMuseum}
        onModalOpenChange={handleModalOpenChange}
        portfolioData={initialData}
      />
    </main>
  );
}
