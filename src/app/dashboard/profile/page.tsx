import React, { Suspense } from 'react';
import { db } from '@/db';
import { siteProfile, mediaAssets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ProfileForm } from './ProfileForm';

async function ProfileContent() {
  const [profile] = await db
    .select()
    .from(siteProfile)
    .where(eq(siteProfile.id, 1))
    .limit(1);

  let portraitUrl: string | undefined;
  let cvUrl: string | undefined;

  if (profile?.portraitAssetId) {
    const [pAsset] = await db
      .select()
      .from(mediaAssets)
      .where(eq(mediaAssets.id, profile.portraitAssetId))
      .limit(1);
    portraitUrl = pAsset?.url;
  }

  if (profile?.cvAssetId) {
    const [cAsset] = await db
      .select()
      .from(mediaAssets)
      .where(eq(mediaAssets.id, profile.cvAssetId))
      .limit(1);
    cvUrl = cAsset?.url;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f4efe6' }}>
          Studio Profile &amp; Biography
        </h1>
        <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4' }}>
          Manage principal identity, narrative monograph, portrait, and CV document
        </p>
      </div>

      <ProfileForm
        initialProfile={profile}
        initialPortraitUrl={portraitUrl}
        initialCvUrl={cvUrl}
      />
    </div>
  );
}

export default function ProfileDashboardPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '2rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4' }}>
          Loading profile...
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
