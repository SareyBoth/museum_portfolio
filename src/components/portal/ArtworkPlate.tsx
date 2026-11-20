'use client';

import React, { useId, useState } from 'react';
import Image from 'next/image';
import type { PortfolioWork } from '@/data/portfolio';

interface ArtworkPlateProps {
  work: PortfolioWork;
  /** Optional 0..100 split wipe position for interactive Before/After inspection inside the modal */
  comparePosition?: number;
  /** Optional safe-area / Swiss grid guide overlay for poster & cinema inspection */
  showPrintGrid?: boolean;
  /** Optional NLE playhead scrub position (0..100) for video inspection */
  timelineProgress?: number;
  variant?: 'card' | 'showcase' | 'dialog';
  sizesOverride?: string;
}

export const ArtworkPlate: React.FC<ArtworkPlateProps> = ({
  work,
  comparePosition = 52,
  showPrintGrid = false,
  timelineProgress = 42,
  variant = 'card',
  sizesOverride,
}) => {
  const uid = useId().replace(/:/g, '');
  const [failedMediaSrc, setFailedMediaSrc] = useState<string | null>(null);
  const isPortrait = work.aspect === '9:16';

  const hasValidMedia = Boolean(work.mediaSrc) && failedMediaSrc !== work.mediaSrc;

  return (
    <div className="relative w-full h-full bg-[#0B0C0F] overflow-hidden select-none">
      {hasValidMedia ? (
        work.mediaType === 'video' ? (
          <video
            src={work.mediaSrc}
            poster={work.posterSrc}
            controls={variant === 'dialog'}
            muted={variant !== 'dialog'}
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={work.mediaSrc!}
            alt={work.title}
            fill
            sizes={
              sizesOverride ??
              (variant === 'dialog'
                ? '(max-width: 768px) 95vw, 800px'
                : '(max-width: 768px) 95vw, (max-width: 1200px) 45vw, 25vw')
            }
            onError={() => setFailedMediaSrc(work.mediaSrc ?? null)}
            className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.02]"
          />
        )
      ) : (
        <>
          {/* Subtle Gallery Backing Grid */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(214,199,178,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(214,199,178,0.08) 1px, transparent 1px)',
              backgroundSize: isPortrait ? '28px 28px' : '36px 36px',
            }}
            aria-hidden="true"
          />

          {work.platePreset === 'festival-key-art' && (
            <svg
              viewBox="0 0 360 640"
              className="w-full h-full block motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.02]"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={`beam-${uid}`} x1="0.2" y1="0" x2="0.8" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
                  <stop offset="55%" stopColor="#B45309" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#090A0D" stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect width="360" height="640" fill="#0B0C0F" />
              <polygon points="0,0 215,0 360,520 75,640" fill={`url(#beam-${uid})`} />
              <rect x="64" y="130" width="232" height="310" fill="none" stroke="rgba(244,239,230,0.22)" strokeWidth="1" />
              <rect x="98" y="170" width="164" height="230" fill="#141519" stroke="#F59E0B" strokeOpacity="0.5" strokeWidth="1.5" />
              <path d="M134 400 V260 A46 46 0 0 1 226 260 V400 Z" fill="#0A0B0E" stroke="#F4EFE6" strokeOpacity="0.35" strokeWidth="1" />
              <circle cx="180" cy="245" r="24" fill="#F59E0B" fillOpacity="0.85" />
              <line x1="40" y1="92" x2="320" y2="92" stroke="rgba(244,239,230,0.28)" strokeWidth="1" />
              <text x="40" y="76" fill="#F59E0B" fontSize="11" fontFamily="monospace" letterSpacing="2">
                OFFICIAL KEY ART · 2025
              </text>
              <text x="180" y="492" textAnchor="middle" fill="#F4EFE6" fontSize="26" fontWeight="800" letterSpacing="-1">
                MIDNIGHT
              </text>
              <text x="180" y="524" textAnchor="middle" fill="#D6C7B2" fontSize="22" fontWeight="500" letterSpacing="2">
                FILM FESTIVAL
              </text>
              <text x="180" y="558" textAnchor="middle" fill="rgba(244,239,230,0.5)" fontSize="10" fontFamily="monospace" letterSpacing="2">
                300 DPI CMYK · PHNOM PENH
              </text>
            </svg>
          )}

          {work.platePreset === 'risograph-waveform' && (
            <svg
              viewBox="0 0 360 640"
              className="w-full h-full block motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.02]"
              aria-hidden="true"
            >
              <rect width="360" height="640" fill="#0F1114" />
              <rect x="28" y="34" width="304" height="572" fill="none" stroke="rgba(215,255,63,0.28)" strokeWidth="1" />
              {Array.from({ length: 17 }).map((_, i) => {
                const barH = 44 + ((Math.sin(i * 0.72) + 1) * 0.5) * 210;
                const x = 52 + i * 15.5;
                const y = 265 - barH / 2;
                const isPeak = i >= 6 && i <= 10;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width="9"
                    height={barH}
                    fill={isPeak ? '#D7FF3F' : 'rgba(244,239,230,0.22)'}
                  />
                );
              })}
              <line x1="44" y1="265" x2="316" y2="265" stroke="#D7FF3F" strokeOpacity="0.4" strokeWidth="1" />
              <text x="48" y="76" fill="#D7FF3F" fontSize="11" fontFamily="monospace" letterSpacing="2">
                RISOGRAPH EDITION · A1
              </text>
              <text x="180" y="472" textAnchor="middle" fill="#F4EFE6" fontSize="26" fontWeight="800" letterSpacing="-1">
                MONOLITH
              </text>
              <text x="180" y="502" textAnchor="middle" fill="#D7FF3F" fontSize="18" fontWeight="600" letterSpacing="3">
                SOUND TOUR
              </text>
              <text x="180" y="544" textAnchor="middle" fill="rgba(244,239,230,0.5)" fontSize="10" fontFamily="monospace">
                ARCHIVAL COTTON · SPOT PANTONE
              </text>
            </svg>
          )}

          {work.platePreset === 'noir-sprocket' && (
            <svg
              viewBox="0 0 360 640"
              className="w-full h-full block motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.02]"
              aria-hidden="true"
            >
              <rect width="360" height="640" fill="#0B0B0E" />
              {Array.from({ length: 12 }).map((_, i) => (
                <g key={i}>
                  <rect x="18" y={34 + i * 50} width="12" height="22" rx="1.5" fill="rgba(244,239,230,0.24)" />
                  <rect x="330" y={34 + i * 50} width="12" height="22" rx="1.5" fill="rgba(244,239,230,0.24)" />
                </g>
              ))}
              <polygon points="52,140 308,210 308,248 52,178" fill="rgba(244,239,230,0.12)" />
              <polygon points="52,212 308,282 308,322 52,252" fill="#EC4899" fillOpacity="0.82" />
              <polygon points="52,286 308,356 308,392 52,322" fill="rgba(244,239,230,0.22)" />
              <text x="180" y="96" textAnchor="middle" fill="rgba(244,239,230,0.65)" fontSize="11" fontFamily="monospace" letterSpacing="2">
                35MM FILM ARCHIVE
              </text>
              <text x="180" y="486" textAnchor="middle" fill="#FFFFFF" fontSize="27" fontWeight="800" letterSpacing="-0.5">
                NOIR CINEMA
              </text>
              <text x="180" y="518" textAnchor="middle" fill="#EC4899" fontSize="11" fontFamily="monospace" letterSpacing="2">
                RETROSPECTIVE SERIES
              </text>
            </svg>
          )}

          {work.platePreset === 'lantern-heritage' && (
            <svg
              viewBox="0 0 360 640"
              className="w-full h-full block motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.02]"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id={`lantern-${uid}`} cx="50%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.52" />
                  <stop offset="55%" stopColor="#7C2D12" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="#090B12" stopOpacity="1" />
                </radialGradient>
              </defs>
              <rect width="360" height="640" fill="#090B12" />
              <rect width="360" height="640" fill={`url(#lantern-${uid})`} />
              <line x1="180" y1="30" x2="180" y2="165" stroke="#F59E0B" strokeOpacity="0.6" strokeWidth="1.5" />
              <ellipse cx="180" cy="245" rx="76" ry="92" fill="rgba(245,158,11,0.18)" stroke="#F59E0B" strokeWidth="1.5" />
              <ellipse cx="180" cy="245" rx="42" ry="92" fill="none" stroke="rgba(245,158,11,0.45)" strokeWidth="1" />
              <rect x="148" y="148" width="64" height="10" fill="#F59E0B" />
              <rect x="148" y="334" width="64" height="10" fill="#F59E0B" />
              <text x="180" y="458" textAnchor="middle" fill="#F4EFE6" fontSize="24" fontWeight="800">
                LANTERN
              </text>
              <text x="180" y="488" textAnchor="middle" fill="#F59E0B" fontSize="16" fontWeight="600" letterSpacing="3">
                HERITAGE PRINT
              </text>
              <text x="180" y="534" textAnchor="middle" fill="rgba(244,239,230,0.55)" fontSize="10" fontFamily="monospace" letterSpacing="1.5">
                TWILIGHT COMPOSITE · BILINGUAL GRID
              </text>
            </svg>
          )}

          {work.platePreset === 'nle-timeline' && (
            <svg
              viewBox="0 0 640 360"
              className="w-full h-full block motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.02]"
              aria-hidden="true"
            >
              <rect width="640" height="360" fill="#0A0B0E" />
              <rect x="44" y="28" width="552" height="162" fill="#13151B" stroke="rgba(244,239,230,0.22)" strokeWidth="1" />
              <rect x="44" y="46" width="552" height="126" fill="none" stroke="rgba(249,115,22,0.45)" strokeWidth="1" strokeDasharray="6 4" />
              <text x="60" y="68" fill="#F97316" fontSize="11" fontFamily="monospace">
                REC · 4K DCI PRORES 422 HQ · 2.39:1
              </text>
              <text x="320" y="118" textAnchor="middle" fill="#F4EFE6" fontSize="22" fontWeight="800" letterSpacing="-0.5">
                DIRECTOR&apos;S CUT SHOWREEL
              </text>
              <text x="320" y="144" textAnchor="middle" fill="rgba(244,239,230,0.55)" fontSize="11" fontFamily="monospace">
                TIMECODE 01:24:18:04 · 24 FPS
              </text>
              <rect x="44" y="210" width="552" height="114" fill="#111318" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <rect x="56" y="224" width="118" height="36" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.28)" />
              <rect x="180" y="224" width="142" height="36" fill="rgba(249,115,22,0.8)" stroke="#F97316" />
              <rect x="328" y="224" width="96" height="36" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.28)" />
              <rect x="430" y="224" width="154" height="36" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.28)" />
              <rect x="56" y="272" width="528" height="38" fill="rgba(56,189,248,0.12)" stroke="rgba(56,189,248,0.35)" />
              {Array.from({ length: 42 }).map((_, idx) => {
                const amp = 4 + Math.abs(Math.sin(idx * 0.55)) * 13;
                const wx = 66 + idx * 12;
                return (
                  <line
                    key={idx}
                    x1={wx}
                    y1={291 - amp}
                    x2={wx}
                    y2={291 + amp}
                    stroke="#38BDF8"
                    strokeWidth="2"
                  />
                );
              })}
              <line
                x1={56 + (timelineProgress / 100) * 528}
                y1="202"
                x2={56 + (timelineProgress / 100) * 528}
                y2="330"
                stroke="#EF4444"
                strokeWidth="2.5"
              />
              <circle cx={56 + (timelineProgress / 100) * 528} cy="202" r="4" fill="#EF4444" />
            </svg>
          )}

          {work.platePreset === 'match-cut-reel' && (
            <svg
              viewBox="0 0 640 360"
              className="w-full h-full block motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.02]"
              aria-hidden="true"
            >
              <rect width="640" height="360" fill="#0B0C10" />
              <rect x="44" y="34" width="552" height="194" fill="#12141A" stroke="rgba(255,255,255,0.15)" />
              <path
                d="M64 196 C140 196, 175 68, 250 68 C315 68, 355 186, 420 186 C485 186, 515 74, 576 74"
                fill="none"
                stroke="#EF4444"
                strokeWidth="3"
              />
              <circle cx="250" cy="68" r="5" fill="#F4EFE6" />
              <circle cx="420" cy="186" r="5" fill="#F4EFE6" />
              <line
                x1={64 + (timelineProgress / 100) * 512}
                y1="34"
                x2={64 + (timelineProgress / 100) * 512}
                y2="228"
                stroke="rgba(244,239,230,0.45)"
                strokeDasharray="4 4"
              />
              <text x="64" y="60" fill="#EF4444" fontSize="11" fontFamily="monospace">
                VELOCITY CURVE · 128 BPM TRANSIENT SYNC
              </text>
              {Array.from({ length: 16 }).map((_, i) => (
                <g key={i}>
                  <rect
                    x={44 + i * 35.2}
                    y="248"
                    width="28"
                    height="70"
                    fill={i % 4 === 1 ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.08)'}
                    stroke={i % 4 === 1 ? '#EF4444' : 'rgba(255,255,255,0.2)'}
                  />
                  <text x={50 + i * 35.2} y="308" fill="rgba(244,239,230,0.6)" fontSize="9" fontFamily="monospace">
                    F{String(i + 1).padStart(2, '0')}
                  </text>
                </g>
              ))}
            </svg>
          )}

          {work.platePreset === 'color-grade-split' && (
            <div className="relative w-full h-full">
              <svg viewBox="0 0 640 360" className="w-full h-full block" aria-hidden="true">
                <defs>
                  <linearGradient id={`graded-${uid}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#082032" />
                    <stop offset="55%" stopColor="#7C3F1D" />
                    <stop offset="100%" stopColor="#1B100A" />
                  </linearGradient>
                </defs>
                <rect width="640" height="360" fill={`url(#graded-${uid})`} />
                {/* Architectural Silhouette Subject in Tungsten/Cyan Light */}
                <path d="M210 360 L250 185 L310 155 L360 185 L400 360 Z" fill="rgba(12,18,28,0.85)" />
                <circle cx="305" cy="112" r="34" fill="#E5A93C" fillOpacity="0.88" />
                <rect x="410" y="232" width="196" height="94" fill="rgba(9,11,16,0.82)" stroke="#06B6D4" strokeOpacity="0.7" />
                <path
                  d="M422 292 Q450 250 478 286 T534 265 T592 288"
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="2"
                />
                <text x="596" y="42" textAnchor="end" fill="#06B6D4" fontSize="11" fontFamily="monospace">
                  REC.709 35MM [GRADED]
                </text>
              </svg>

              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}
              >
                <svg viewBox="0 0 640 360" className="w-full h-full block" aria-hidden="true">
                  <rect width="640" height="360" fill="#2A2D34" />
                  <path d="M210 360 L250 185 L310 155 L360 185 L400 360 Z" fill="#3B3F48" />
                  <circle cx="305" cy="112" r="34" fill="#6F7480" />
                  <text x="38" y="42" fill="rgba(244,239,230,0.75)" fontSize="11" fontFamily="monospace">
                    CAMERA LOG [FLAT RAW]
                  </text>
                </svg>
              </div>

              <div
                className="absolute top-0 bottom-0 w-px bg-[#06B6D4]"
                style={{ left: `${comparePosition}%` }}
                aria-hidden="true"
              >
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0F1012] border border-[#06B6D4] flex items-center justify-center text-[10px] font-mono text-[#06B6D4]">
                  ↔
                </div>
              </div>
            </div>
          )}

          {work.platePreset === 'retouch-frequency' && (
            <div className="relative w-full h-full">
              <svg viewBox="0 0 640 360" className="w-full h-full block" aria-hidden="true">
                <defs>
                  <radialGradient id={`studio-key-${uid}`} cx="62%" cy="38%" r="48%">
                    <stop offset="0%" stopColor="#E0A96D" stopOpacity="0.48" />
                    <stop offset="55%" stopColor="#B5835A" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#0E1218" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="640" height="360" fill="#0E1218" />
                <rect width="640" height="360" fill={`url(#studio-key-${uid})`} />
                <rect x="44" y="34" width="552" height="292" fill="none" stroke="rgba(59,130,246,0.45)" />
                {/* Sculpted Editorial Silhouette & Dodge/Burn Contour */}
                <path d="M270 326 C276 264 316 238 352 238 C388 238 428 264 434 326 Z" fill="#1B222E" stroke="rgba(224,169,109,0.55)" />
                <ellipse cx="352" cy="166" rx="44" ry="56" fill="#D4A373" fillOpacity="0.88" />
                <ellipse cx="364" cy="152" rx="18" ry="28" fill="#F2CAA0" fillOpacity="0.35" />
                <path d="M32 34 H56 M44 22 V46 M584 34 H608 M596 22 V46 M32 326 H56 M44 314 V338 M584 326 H608 M596 314 V338" stroke="#3B82F6" strokeWidth="2" />
                <text x="68" y="72" fill="#FFFFFF" fontSize="16" fontWeight="700">
                  FREQUENCY SEPARATION
                </text>
                <text x="68" y="96" fill="#60A5FA" fontSize="11" fontFamily="monospace">
                  PASS 01 · TEXTURE PRESERVED + DODGE &amp; BURN
                </text>
                {['#D4A373', '#E0A96D', '#CCA07A', '#B5835A', '#8D5B4C'].map((hex, i) => (
                  <rect key={hex} x={68 + i * 44} y="266" width="36" height="24" fill={hex} stroke="rgba(255,255,255,0.22)" />
                ))}
              </svg>

              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}
              >
                <svg viewBox="0 0 640 360" className="w-full h-full block" aria-hidden="true">
                  <rect width="640" height="360" fill="#1A1C21" />
                  <path d="M270 326 C276 264 316 238 352 238 C388 238 428 264 434 326 Z" fill="#252830" />
                  <ellipse cx="352" cy="166" rx="44" ry="56" fill="#8E7968" />
                  <text x="68" y="72" fill="rgba(244,239,230,0.72)" fontSize="11" fontFamily="monospace">
                    RAW CAPTURE [UNRETOUCHED]
                  </text>
                </svg>
              </div>

              <div
                className="absolute top-0 bottom-0 w-px bg-[#3B82F6]"
                style={{ left: `${comparePosition}%` }}
                aria-hidden="true"
              >
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0F1012] border border-[#3B82F6] flex items-center justify-center text-[10px] font-mono text-[#60A5FA]">
                  ↔
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Optional Grid Overlay (works for both procedural plates and drop-in media) */}
      {showPrintGrid && (
        <div
          className={`absolute inset-0 pointer-events-none ${
            isPortrait ? 'border-[14px] border-rose-500/20' : 'p-4 border border-amber-400/40'
          }`}
          aria-hidden="true"
        >
          <div className="w-full h-full border border-dashed border-amber-400/70 grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-amber-400/20" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
