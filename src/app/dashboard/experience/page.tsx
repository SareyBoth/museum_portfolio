import React, { Suspense } from 'react';
import { db } from '@/db';
import { experience } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { ExperienceManager } from './ExperienceManager';

async function ExperienceContent() {
  const allExp = await db.select().from(experience).orderBy(asc(experience.sortOrder));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f4efe6' }}>
          Career Ledger &amp; Experience
        </h1>
        <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4' }}>
          Production tenure, commercial commissions, and agency editing roles
        </p>
      </div>

      <ExperienceManager initialExperience={allExp} />
    </div>
  );
}

export default function ExperienceDashboardPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '2rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4' }}>
          Loading experience...
        </div>
      }
    >
      <ExperienceContent />
    </Suspense>
  );
}
