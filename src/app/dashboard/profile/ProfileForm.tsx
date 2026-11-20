'use client';

import React, { useState } from 'react';
import { STUDIO_PROFILE } from '@/data/portfolio';
import { R2Uploader } from '@/components/dashboard/R2Uploader';
import { updateProfileAction } from '../actions';
import { FileText, Save } from 'lucide-react';
import { Card, CardBody } from '@/components/admin/ui/Card';
import { Input, Textarea } from '@/components/admin/ui/Input';
import { Button } from '@/components/admin/ui/Button';
import { useAdminToast } from '@/components/admin/ui/Toast';
import styles from './ProfileForm.module.scss';

interface ProfileData {
  id?: number;
  name?: string;
  monogram?: string;
  disciplines?: string;
  location?: string;
  timezone?: string;
  availability?: string;
  portraitAssetId?: number | null;
  portraitSrc?: string;
  portraitAlt?: string;
  portraitPlaque?: string;
  heroLead?: string;
  heroSpecs?: string;
  educationSummary?: string;
  narrativeLead?: string;
  narrativeParagraphs?: readonly string[] | string[];
  cvAssetId?: number | null;
  cvSummary?: string;
  cvSoftwareLine?: string;
  showAvailability?: boolean;
  showContact?: boolean;
}

interface ProfileFormProps {
  initialProfile?: ProfileData | null;
  initialPortraitUrl?: string;
  initialCvUrl?: string;
}

export function ProfileForm({
  initialProfile,
  initialPortraitUrl,
  initialCvUrl,
}: ProfileFormProps) {
  const toast = useAdminToast();
  const p = initialProfile ?? STUDIO_PROFILE;

  const [name, setName] = useState(p.name ?? '');
  const [monogram, setMonogram] = useState(p.monogram ?? 'SB');
  const [disciplines, setDisciplines] = useState(p.disciplines ?? '');
  const [location, setLocation] = useState(p.location ?? '');
  const [timezone, setTimezone] = useState(p.timezone ?? '');
  const [availability, setAvailability] = useState(p.availability ?? '');
  const [portraitAssetId, setPortraitAssetId] = useState<number | null>(
    initialProfile?.portraitAssetId ?? null
  );
  const [portraitUrl, setPortraitUrl] = useState<string | undefined>(
    initialPortraitUrl ?? (typeof p.portraitSrc === 'string' ? p.portraitSrc : undefined)
  );
  const [portraitAlt, setPortraitAlt] = useState(p.portraitAlt ?? '');
  const [portraitPlaque, setPortraitPlaque] = useState(p.portraitPlaque ?? '');
  const [heroLead, setHeroLead] = useState(p.heroLead ?? '');
  const [heroSpecs, setHeroSpecs] = useState(p.heroSpecs ?? '');
  const [educationSummary, setEducationSummary] = useState(p.educationSummary ?? '');
  const [narrativeLead, setNarrativeLead] = useState(p.narrativeLead ?? '');
  const [narrativeText, setNarrativeText] = useState(
    Array.isArray(p.narrativeParagraphs)
      ? p.narrativeParagraphs.join('\n\n')
      : ''
  );
  const [cvAssetId, setCvAssetId] = useState<number | null>(
    initialProfile?.cvAssetId ?? null
  );
  const [cvUrl, setCvUrl] = useState<string | undefined>(initialCvUrl);
  const [cvSummary, setCvSummary] = useState(p.cvSummary ?? '');
  const [cvSoftwareLine, setCvSoftwareLine] = useState(p.cvSoftwareLine ?? '');
  const [showAvailability, setShowAvailability] = useState(
    initialProfile?.showAvailability ?? true
  );
  const [showContact, setShowContact] = useState(
    initialProfile?.showContact ?? true
  );

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const narrativeParagraphs = narrativeText
      .split('\n\n')
      .map((t: string) => t.trim())
      .filter(Boolean);

    try {
      await updateProfileAction({
        name,
        monogram,
        disciplines,
        location,
        timezone,
        availability,
        portraitAssetId,
        portraitAlt,
        portraitPlaque,
        heroLead,
        heroSpecs,
        educationSummary,
        narrativeLead,
        narrativeParagraphs,
        cvAssetId,
        cvSummary,
        cvSoftwareLine,
        showAvailability,
        showContact,
      });
      toast.success('Studio profile updated & cache invalidated.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* 1. Principal Identity */}
      <Card>
        <CardBody>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Principal Identity &amp; Discipline</h2>
            <p className={styles.sectionDescription}>
              Core identity records displayed across the museum portal hero, exhibition monograph, and metadata.
            </p>
          </div>

          <div className={styles.grid3}>
            <Input
              label="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Monogram"
              type="text"
              required
              maxLength={10}
              value={monogram}
              onChange={(e) => setMonogram(e.target.value)}
            />
            <Input
              label="Disciplines"
              type="text"
              required
              value={disciplines}
              onChange={(e) => setDisciplines(e.target.value)}
            />
          </div>

          <div style={{ height: '1rem' }} />

          <div className={styles.grid3}>
            <Input
              label="Location"
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              label="Timezone"
              type="text"
              required
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            />
            <Input
              label="Availability Status"
              type="text"
              required
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            />
          </div>

          <div style={{ height: '1.25rem' }} />

          <div className={styles.togglesRow}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={showAvailability}
                onChange={(e) => setShowAvailability(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Show Availability Badge on Hero</span>
            </label>

            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={showContact}
                onChange={(e) => setShowContact(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Show Direct Contact Channels</span>
            </label>
          </div>
        </CardBody>
      </Card>

      {/* 2. Media Documents (Portrait & CV) */}
      <Card>
        <CardBody>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Archival Portrait &amp; CV Document</h2>
            <p className={styles.sectionDescription}>
              High-resolution imagery and PDF credentials synced with Cloudflare R2 object storage.
            </p>
          </div>

          <div className={styles.grid2}>
            {/* Portrait */}
            <div className={styles.mediaCard}>
              <label style={{ fontFamily: 'monospace', fontSize: '0.6875rem', fontWeight: 600, color: '#b8b0a4', textTransform: 'uppercase' }}>
                Studio Portrait (R2)
              </label>
              {portraitUrl && (
                <div className={styles.previewPortraitWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={portraitUrl}
                    alt="Portrait preview"
                    className={styles.previewPortraitImg}
                  />
                </div>
              )}
              <R2Uploader
                kind="image"
                folder="portrait"
                onUploaded={(asset) => {
                  setPortraitAssetId(asset.id);
                  setPortraitUrl(asset.url);
                  toast.success('Portrait uploaded to R2.');
                }}
              />
              <Input
                label="Portrait Plaque Label"
                value={portraitPlaque}
                onChange={(e) => setPortraitPlaque(e.target.value)}
                placeholder="PRINCIPAL · STUDIO PORTRAIT"
              />
              <Input
                label="Portrait Alt Description"
                value={portraitAlt}
                onChange={(e) => setPortraitAlt(e.target.value)}
              />
            </div>

            {/* CV */}
            <div className={styles.mediaCard}>
              <label style={{ fontFamily: 'monospace', fontSize: '0.6875rem', fontWeight: 600, color: '#b8b0a4', textTransform: 'uppercase' }}>
                Curriculum Vitae (PDF)
              </label>
              {cvUrl ? (
                <div className={styles.cvLinkedBox}>
                  <div className={styles.cvLinkedStatus}>
                    <FileText className="w-4 h-4" />
                    <span>PDF Document Linked</span>
                  </div>
                  <a
                    href={cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cvUrlLink}
                  >
                    {cvUrl}
                  </a>
                </div>
              ) : null}
              <R2Uploader
                kind="cv"
                folder="cv"
                onUploaded={(asset) => {
                  setCvAssetId(asset.id);
                  setCvUrl(asset.url);
                  toast.success('CV PDF uploaded to R2.');
                }}
              />
              <Textarea
                label="CV Summary Statement"
                value={cvSummary}
                onChange={(e) => setCvSummary(e.target.value)}
                rows={3}
              />
              <Input
                label="Software Proficiency Line"
                value={cvSoftwareLine}
                onChange={(e) => setCvSoftwareLine(e.target.value)}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 3. Hero Specs & Narrative Monograph */}
      <Card>
        <CardBody>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Narrative Monograph &amp; Editorial Specs</h2>
            <p className={styles.sectionDescription}>
              Hero lead statement, technical specifications badge, and exhibition biography narrative.
            </p>
          </div>

          <div className={styles.grid2}>
            <Input
              label="Hero Specifications Badge"
              value={heroSpecs}
              onChange={(e) => setHeroSpecs(e.target.value)}
              placeholder="24 FPS · 16:9 & 9:16 Masters · 300 DPI CMYK"
            />
            <Input
              label="Education Summary Line"
              value={educationSummary}
              onChange={(e) => setEducationSummary(e.target.value)}
            />
          </div>

          <div style={{ height: '1rem' }} />

          <Textarea
            label="Hero Lead Statement"
            value={heroLead}
            onChange={(e) => setHeroLead(e.target.value)}
            rows={2}
          />

          <div style={{ height: '1rem' }} />

          <Input
            label="Narrative Monograph Headline"
            value={narrativeLead}
            onChange={(e) => setNarrativeLead(e.target.value)}
          />

          <div style={{ height: '1rem' }} />

          <Textarea
            label="Narrative Monograph Paragraphs (Double Linebreak Separator)"
            value={narrativeText}
            onChange={(e) => setNarrativeText(e.target.value)}
            rows={5}
            hint="Separate each distinct paragraph with two linebreaks (\n\n)."
          />
        </CardBody>
      </Card>

      {/* 4. Sticky Action Bar */}
      <div className={styles.stickyActionBar}>
        <div className={styles.actionMeta}>
          <span className={styles.actionTitle}>Profile Configurations</span>
          <span className={styles.actionSub}>Saves propagate immediately to live 3D gallery &amp; portfolio</span>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={saving}
          icon={<Save className="w-4 h-4" />}
        >
          {saving ? 'Publishing...' : 'Save Profile Changes'}
        </Button>
      </div>
    </form>
  );
}
