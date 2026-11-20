import React, { Suspense } from 'react';
import { db } from '@/db';
import { skills } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { SkillsManager } from './SkillsManager';

async function SkillsContent() {
  const allSkills = await db.select().from(skills).orderBy(asc(skills.sortOrder));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f4efe6' }}>
          Skills &amp; Technical Tools
        </h1>
        <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4' }}>
          Craft competencies, editing software toolchains, and post-production capabilities
        </p>
      </div>

      <SkillsManager initialSkills={allSkills} />
    </div>
  );
}

export default function SkillsDashboardPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '2rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4' }}>
          Loading skills...
        </div>
      }
    >
      <SkillsContent />
    </Suspense>
  );
}
