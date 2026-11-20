import React, { Suspense } from 'react';
import { db } from '@/db';
import { mediaAssets, projects, siteProfile } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { MediaLibrary } from './MediaLibrary';

async function MediaContent() {
  const [allAssets, allProjects, [profile]] = await Promise.all([
    db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)),
    db.select().from(projects),
    db.select().from(siteProfile).limit(1),
  ]);

  // Calculate usage count for each media asset
  const usageCounts: Record<number, number> = {};
  for (const p of allProjects) {
    if (p.thumbnailAssetId) {
      usageCounts[p.thumbnailAssetId] = (usageCounts[p.thumbnailAssetId] || 0) + 1;
    }
    if (p.videoAssetId) {
      usageCounts[p.videoAssetId] = (usageCounts[p.videoAssetId] || 0) + 1;
    }
  }

  if (profile?.portraitAssetId) {
    usageCounts[profile.portraitAssetId] = (usageCounts[profile.portraitAssetId] || 0) + 1;
  }
  if (profile?.cvAssetId) {
    usageCounts[profile.cvAssetId] = (usageCounts[profile.cvAssetId] || 0) + 1;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f4efe6' }}>
          R2 Media Storage Library
        </h1>
        <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4' }}>
          Direct Cloudflare R2 object storage repository with presigned uploads and reference tracking
        </p>
      </div>

      <MediaLibrary initialAssets={allAssets} initialUsageCounts={usageCounts} />
    </div>
  );
}

export default function MediaDashboardPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '2rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4' }}>
          Loading media library...
        </div>
      }
    >
      <MediaContent />
    </Suspense>
  );
}
