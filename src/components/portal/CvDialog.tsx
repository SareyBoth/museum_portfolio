'use client';

import React, { useEffect, useId, useRef } from 'react';
import { Download, FileText, Printer, X } from 'lucide-react';
import {
  EDUCATION_ENTRIES,
  EXPERIENCE_ENTRIES,
  STUDIO_PROFILE,
} from '@/data/portfolio';

interface CvDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: {
    name: string;
    disciplines: string;
    location: string;
    cvSummary: string;
    cvSoftwareLine: string;
  };
  experience?: readonly typeof EXPERIENCE_ENTRIES[number][];
  education?: readonly typeof EDUCATION_ENTRIES[number][];
  cvUrl?: string;
}

export const CvDialog: React.FC<CvDialogProps> = ({
  isOpen,
  onClose,
  profile,
  experience = EXPERIENCE_ENTRIES,
  education = EDUCATION_ENTRIES,
  cvUrl,
}) => {
  const p = profile ?? STUDIO_PROFILE;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        closeBtnRef.current?.focus();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

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
      className="museum-dialog w-[calc(100vw-2rem)] max-w-2xl max-h-[90dvh] rounded-[3px] shadow-2xl overflow-hidden"
    >
      <div className="flex flex-col max-h-[90dvh] cv-printable">
        <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5 border-b border-[var(--museum-steel)] bg-[#16171B]">
          <div>
            <span className="font-mono text-xs text-[var(--museum-gold)] uppercase font-semibold block mb-1">
              CURRICULUM VITAE · 2026
            </span>
            <h2 id={titleId} className="text-2xl font-bold text-[var(--museum-ivory)]">
              {p.name}
            </h2>
            <p className="font-mono text-xs text-[var(--museum-ash)]">
              {p.disciplines} · {p.location}
            </p>
          </div>

          <div className="flex items-center gap-2 no-print">
            {cvUrl && (
              <a
                href={cvUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-3.5 rounded-[2px] bg-[var(--museum-gold)]/20 hover:bg-[var(--museum-gold)]/30 border border-[var(--museum-gold)]/50 text-[var(--museum-gold)] font-mono text-xs inline-flex items-center gap-1.5 cursor-pointer no-underline"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Download PDF</span>
              </a>
            )}
            <button
              type="button"
              onClick={() => window.print()}
              className="min-h-[44px] px-3.5 rounded-[2px] bg-[#0F1012] hover:bg-white/10 border border-[var(--museum-steel-control)] text-[var(--museum-ivory)] font-mono text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[var(--museum-gold)]" aria-hidden="true" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="min-h-[44px] px-3.5 rounded-[2px] bg-[#0F1012] hover:bg-white/15 border border-[var(--museum-steel-control)] text-[var(--museum-ivory)] font-mono text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Close</span>
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto overscroll-contain p-6 space-y-6 text-sm text-[var(--museum-ash)] leading-relaxed bg-[#0F1012]">
          {cvUrl && (
            <section className="space-y-2 p-4 rounded-[2px] bg-[#16171B] border border-[var(--museum-steel)]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase text-[var(--museum-gold)] font-semibold inline-flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Official PDF Document
                </span>
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[var(--museum-gold)] hover:underline"
                >
                  Open in New Tab ↗
                </a>
              </div>
              <div className="aspect-[4/3] w-full rounded-[2px] overflow-hidden border border-white/10 bg-[#0A0B0E]">
                <iframe
                  src={`${cvUrl}#toolbar=0`}
                  title="PDF CV Preview"
                  className="w-full h-full border-0"
                />
              </div>
            </section>
          )}

          <section className="space-y-1.5">
            <h3 className="font-mono text-xs uppercase text-[var(--museum-gold)] font-semibold">
              Creative Profile
            </h3>
            <p className="text-[var(--museum-ivory)]">{p.cvSummary}</p>
          </section>

          <section className="space-y-1.5 pt-4 border-t border-[var(--museum-steel)]">
            <h3 className="font-mono text-xs uppercase text-[var(--museum-gold)] font-semibold">
              Production Software
            </h3>
            <p className="font-mono text-xs text-[var(--museum-ivory)] leading-relaxed">
              {p.cvSoftwareLine}
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[var(--museum-steel)]">
            <h3 className="font-mono text-xs uppercase text-[var(--museum-gold)] font-semibold">
              Experience
            </h3>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={`${exp.period}-${exp.role}`} className="space-y-0.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-semibold text-[var(--museum-ivory)]">{exp.role}</span>
                    <span className="font-mono text-xs text-[var(--museum-gold)] tabular-nums">
                      {exp.period}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[var(--museum-ash)]">
                    {exp.organization} · {exp.location}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3 pt-4 border-t border-[var(--museum-steel)]">
            <h3 className="font-mono text-xs uppercase text-[var(--museum-gold)] font-semibold">
              Education
            </h3>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={`${edu.period}-${edu.institution}`} className="space-y-0.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-semibold text-[var(--museum-ivory)]">{edu.degree}</span>
                    <span className="font-mono text-xs text-[var(--museum-gold)] tabular-nums">
                      {edu.period}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[var(--museum-ash)]">
                    {edu.institution} · {edu.location}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-1.5 pt-4 border-t border-[var(--museum-steel)]">
            <h3 className="font-mono text-xs uppercase text-[var(--museum-gold)] font-semibold">
              Direct Channels
            </h3>
            <p className="font-mono text-xs text-[var(--museum-ivory)]">
              Email: hengratanak00@gmail.com · Telegram: @Ratan4k_Heng · Phone: +855 85 743 431
            </p>
          </section>
        </div>
      </div>
    </dialog>
  );
};
