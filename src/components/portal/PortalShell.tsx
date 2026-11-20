'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_WORK_FILTER,
  PORTFOLIO_WORKS,
  filterWorksByCategory,
  shouldReverseScrollToGallery,
  type PortfolioWork,
  type WorkFilter,
} from '@/data/portfolio';
import { PortalHeader } from './PortalHeader';
import { PortalHero } from './PortalHero';
import { ExhibitionGrid } from './ExhibitionGrid';
import { PracticeMonograph } from './PracticeMonograph';
import { CareerLedgers } from './CareerLedgers';
import { ContactSection } from './ContactSection';
import { PortalFooter } from './PortalFooter';
import { WorkLightboxDialog } from './WorkLightboxDialog';
import { CvDialog } from './CvDialog';

import type { DynamicPortfolioData } from '@/lib/portfolio';

interface PortalShellProps {
  opacity: number;
  isActive: boolean;
  onExitPortal: () => void;
  onReverseScroll: (deltaY: number) => void;
  onInspectInMuseum?: (galleryArtworkId: string) => void;
  onModalOpenChange?: (isOpen: boolean) => void;
  portfolioData?: DynamicPortfolioData;
}

export const PortalShell: React.FC<PortalShellProps> = ({
  opacity,
  isActive,
  onExitPortal,
  onReverseScroll,
  onInspectInMuseum,
  onModalOpenChange,
  portfolioData,
}) => {
  const allWorks = portfolioData?.works ?? PORTFOLIO_WORKS;
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<WorkFilter>(DEFAULT_WORK_FILTER);
  const [activeWork, setActiveWork] = useState<PortfolioWork | null>(null);
  const [isCvOpen, setIsCvOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredWorks = useMemo(
    () => filterWorksByCategory(allWorks, selectedFilter),
    [allWorks, selectedFilter]
  );

  const visibleActiveWork = isActive ? activeWork : null;
  const visibleCvOpen = isActive ? isCvOpen : false;
  const visibleMobileMenuOpen = isActive ? isMobileMenuOpen : false;

  const hasOpenDialog = Boolean(visibleActiveWork) || visibleCvOpen;
  const isOverlayBlockingEscape = hasOpenDialog || visibleMobileMenuOpen;

  useEffect(() => {
    onModalOpenChange?.(isOverlayBlockingEscape);
  }, [isOverlayBlockingEscape, onModalOpenChange]);

  useEffect(() => {
    if (isActive && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [isActive]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isActive) return;
    if (shouldReverseScrollToGallery(containerRef.current.scrollTop, e.deltaY, hasOpenDialog)) {
      setActiveWork(null);
      setIsCvOpen(false);
      setIsMobileMenuOpen(false);
      onReverseScroll(e.deltaY);
    }
  };

  const handleExit = useCallback(() => {
    setActiveWork(null);
    setIsCvOpen(false);
    setIsMobileMenuOpen(false);
    onExitPortal();
  }, [onExitPortal]);

  const handleStepWork = useCallback(
    (direction: -1 | 1) => {
      if (!visibleActiveWork) return;
      const scope = filteredWorks.some((w) => w.id === visibleActiveWork.id)
        ? filteredWorks
        : allWorks;
      const currentIdx = scope.findIndex((w) => w.id === visibleActiveWork.id);
      if (currentIdx === -1) return;
      const nextIdx = (currentIdx + direction + scope.length) % scope.length;
      setActiveWork(scope[nextIdx]);
    },
    [visibleActiveWork, filteredWorks, allWorks]
  );

  const handleInspectInMuseum = useCallback(
    (galleryArtworkId: string) => {
      setActiveWork(null);
      setIsCvOpen(false);
      setIsMobileMenuOpen(false);
      onInspectInMuseum?.(galleryArtworkId);
    },
    [onInspectInMuseum]
  );

  const handleBackToTop = useCallback(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    containerRef.current?.scrollTo({
      top: 0,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  }, []);

  const isVisible = opacity > 0.001;

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      aria-hidden={!isActive}
      inert={!isActive}
      style={{
        opacity: isVisible ? opacity : 0,
        pointerEvents: isActive ? 'auto' : 'none',
        visibility: isVisible ? 'visible' : 'hidden',
      }}
      className="portal-scroller fixed inset-0 z-40 overflow-y-auto surface-concrete motion-safe:transition-opacity motion-safe:duration-200 selection:bg-[var(--museum-gold)] selection:text-[#141518] font-sans"
    >
      <PortalHeader
        onExitPortal={handleExit}
        isMenuOpen={visibleMobileMenuOpen}
        onMenuOpenChange={setIsMobileMenuOpen}
        profile={portfolioData?.profile}
      />

      <div className="w-full">
        <PortalHero
          onOpenCv={() => setIsCvOpen(true)}
          profile={portfolioData?.profile}
        />
        <ExhibitionGrid
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
          works={filteredWorks}
          onSelectWork={setActiveWork}
        />
        <PracticeMonograph
          profile={portfolioData?.profile}
          skills={portfolioData?.skills}
        />
        <CareerLedgers
          experience={portfolioData?.experience}
          education={portfolioData?.education}
        />
        <ContactSection
          onOpenCv={() => setIsCvOpen(true)}
          contacts={portfolioData?.contacts}
        />
      </div>

      <PortalFooter
        onBackToTop={handleBackToTop}
        onExitPortal={handleExit}
        profile={portfolioData?.profile}
      />

      <WorkLightboxDialog
        work={visibleActiveWork}
        onClose={() => setActiveWork(null)}
        onStepWork={handleStepWork}
        onInspectInMuseum={onInspectInMuseum ? handleInspectInMuseum : undefined}
      />

      <CvDialog
        isOpen={visibleCvOpen}
        onClose={() => setIsCvOpen(false)}
        profile={portfolioData?.profile}
        experience={portfolioData?.experience}
        education={portfolioData?.education}
        cvUrl={portfolioData?.profile?.cvUrl}
      />
    </div>
  );
};
