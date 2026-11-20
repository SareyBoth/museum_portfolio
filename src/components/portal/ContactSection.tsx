'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, Mail, Phone, Send } from 'lucide-react';
import { CONTACT_CHANNELS } from '@/data/portfolio';

interface ContactSectionProps {
  onOpenCv: () => void;
  contacts?: readonly typeof CONTACT_CHANNELS[number][];
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenCv,
  contacts = CONTACT_CHANNELS,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyStatusText, setCopyStatusText] = useState('');
  const copyTimerRef = useRef<number | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formService, setFormService] = useState('Video Editing');
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formErrorMsg, setFormErrorMsg] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setFormErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          service: formService,
          message: formMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormStatus('error');
        setFormErrorMsg(data.error || 'Failed to send message');
        return;
      }

      setFormStatus('success');
      setFormName('');
      setFormEmail('');
      setFormMessage('');
    } catch {
      setFormStatus('error');
      setFormErrorMsg('Network error. Please try direct email instead.');
    }
  };

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopy = async (id: string, label: string, value: string) => {
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      setCopyStatusText(`${label} copied to clipboard.`);
      copyTimerRef.current = window.setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch {
      setCopiedId(null);
      setCopyStatusText(`Unable to copy automatically — use the direct ${label} link.`);
    }
  };

  return (
    <section
      id="contact"
      className="scroll-mt-16 surface-concrete museum-grid-backdrop border-b border-[var(--museum-steel)] py-20 md:py-24 no-print"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        <div className="space-y-2.5 max-w-xl">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--museum-gold)] block">
            Commissions &amp; Inquiries
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[var(--museum-ivory)] tracking-tight">
            Contact / CV
          </h2>
          <p className="text-sm text-[var(--museum-ash)] leading-relaxed">
            Available for commercial video editing commissions, DaVinci Resolve grading, photo retouching, and poster design.
          </p>
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          {copyStatusText}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Direct Channels */}
          <div className="lg:col-span-7 border-t border-[var(--museum-steel)] divide-y divide-[var(--museum-steel)]">
            {contacts.map((channel) => {
              const Icon =
                channel.id === 'email' ? Mail : channel.id === 'telegram' ? Send : Phone;
              const isCopied = copiedId === channel.id;

              return (
                <div
                  key={channel.id}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <a
                    href={channel.href}
                    target={channel.external ? '_blank' : undefined}
                    rel={channel.external ? 'noopener noreferrer' : undefined}
                    className="group flex-1 min-w-0 min-h-[44px] py-2 flex items-center justify-between gap-4 no-underline"
                  >
                    <div className="min-w-0">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--museum-ash)] block">
                        {channel.label}
                      </span>
                      <span className="text-base font-semibold text-[var(--museum-ivory)] group-hover:text-[var(--museum-gold)] transition-colors truncate block">
                        {channel.value}
                      </span>
                    </div>
                    <Icon
                      className="w-4 h-4 shrink-0 text-[var(--museum-ash)] group-hover:text-[var(--museum-gold)] transition-colors"
                      aria-hidden="true"
                    />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopy(channel.id, channel.label, channel.copyValue)}
                    aria-label={`Copy ${channel.label}`}
                    className="min-w-[44px] min-h-[44px] px-3 rounded-[2px] bg-[#16171B] hover:bg-[#1F2127] border border-[var(--museum-steel-control)] font-mono text-[11px] text-[var(--museum-ash)] hover:text-[var(--museum-ivory)] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Curriculum Vitae Card */}
          <div className="lg:col-span-5 p-6 sm:p-7 rounded-[3px] bg-[#16171B] border border-[var(--museum-steel)] space-y-5">
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase text-[var(--museum-gold)] tracking-wider block font-semibold">
                Curriculum Vitae · 2026
              </span>
              <h3 className="text-xl font-bold text-[var(--museum-ivory)]">
                Creative Resume
              </h3>
              <p className="text-xs text-[var(--museum-ash)] leading-relaxed">
                Complete summary of commercial video editing credits, color grading pipelines, poster exhibitions, and software proficiency.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={onOpenCv}
                className="min-h-[44px] px-5 py-2.5 rounded-[2px] bg-[var(--museum-travertine)] hover:bg-white text-[var(--museum-ink)] font-mono text-xs font-semibold transition-colors cursor-pointer"
              >
                Preview CV Modal ↗
              </button>
              <a
                href="mailto:hengratanak00@gmail.com?subject=CV%20Request%20-%20SareyBoth"
                className="min-h-[44px] px-5 py-2.5 rounded-[2px] bg-[#0F1012] hover:bg-[#1E2026] border border-[var(--museum-steel-control)] text-[var(--museum-ivory)] font-mono text-xs font-semibold inline-flex items-center transition-colors no-underline"
              >
                Request PDF ↓
              </a>
            </div>
          </div>
        </div>

        {/* Send Inquiry Form */}
        <div className="pt-8 border-t border-[var(--museum-steel)]">
          <div className="max-w-2xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[var(--museum-ivory)]">
                Send an Inquiry
              </h3>
              <p className="text-xs text-[var(--museum-ash)] font-mono">
                Direct inquiry dispatched to studio ledger
              </p>
            </div>

            {formStatus === 'success' ? (
              <div className="p-4 rounded-[2px] bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs text-emerald-400 space-y-2">
                <p className="font-semibold">Message delivered to studio records.</p>
                <p className="text-emerald-400/80">Thank you for reaching out. A response will follow shortly.</p>
                <button
                  type="button"
                  onClick={() => setFormStatus('idle')}
                  className="mt-2 text-xs underline cursor-pointer text-emerald-300"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="inquiry-name" className="block font-mono text-xs text-[var(--museum-ash)] uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      id="inquiry-name"
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Your name"
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-[2px] bg-[#16171B] border border-[var(--museum-steel-control)] text-[var(--museum-ivory)] font-mono text-xs placeholder:text-[var(--museum-ash)]/40 focus:outline-none focus:border-[var(--museum-gold)] transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="inquiry-email" className="block font-mono text-xs text-[var(--museum-ash)] uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      id="inquiry-email"
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-[2px] bg-[#16171B] border border-[var(--museum-steel-control)] text-[var(--museum-ivory)] font-mono text-xs placeholder:text-[var(--museum-ash)]/40 focus:outline-none focus:border-[var(--museum-gold)] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="inquiry-service" className="block font-mono text-xs text-[var(--museum-ash)] uppercase tracking-wider">
                    Service / Discipline
                  </label>
                  <select
                    id="inquiry-service"
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-[2px] bg-[#16171B] border border-[var(--museum-steel-control)] text-[var(--museum-ivory)] font-mono text-xs focus:outline-none focus:border-[var(--museum-gold)] transition-colors"
                  >
                    <option value="Video Editing">Commercial Video Editing</option>
                    <option value="Color Grading">DaVinci Resolve Color Grading</option>
                    <option value="Photo Retouching">Photo Retouching & Finishing</option>
                    <option value="Poster Design">Poster & Key Art Design</option>
                    <option value="Other">Other Collaboration</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="inquiry-message" className="block font-mono text-xs text-[var(--museum-ash)] uppercase tracking-wider">
                    Project Details
                  </label>
                  <textarea
                    id="inquiry-message"
                    required
                    rows={4}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Brief description of scope, timeline, deliverables..."
                    className="w-full px-3.5 py-2.5 rounded-[2px] bg-[#16171B] border border-[var(--museum-steel-control)] text-[var(--museum-ivory)] font-mono text-xs placeholder:text-[var(--museum-ash)]/40 focus:outline-none focus:border-[var(--museum-gold)] transition-colors resize-y"
                  />
                </div>

                {formErrorMsg && (
                  <div className="px-3.5 py-2 rounded-[2px] bg-red-500/10 border border-red-500/30 font-mono text-xs text-red-400">
                    {formErrorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="min-h-[44px] px-6 py-2.5 rounded-[2px] bg-[var(--museum-travertine)] hover:bg-white text-[var(--museum-ink)] font-mono font-semibold text-xs tracking-wider transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === 'submitting' ? 'Transmitting...' : 'Send Inquiry →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
