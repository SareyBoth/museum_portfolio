import React, { Suspense } from 'react';
import { db } from '@/db';
import { projects, mediaAssets } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { ProjectsManager } from './ProjectsManager';

async function ProjectsContent() {
  const [allProjects, allMedia] = await Promise.all([
    db.select().from(projects).orderBy(asc(projects.sortOrder)),
    db.select().from(mediaAssets),
  ]);

  const mediaMap = Object.fromEntries(allMedia.map((m) => [m.id, m]));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f4efe6' }}>
          Portfolio Works &amp; Projects
        </h1>
        <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4' }}>
          Manage 16:9 cinema edits and 9:16 vertical poster key art works
        </p>
      </div>

      <ProjectsManager initialProjects={allProjects} mediaMap={mediaMap} />
    </div>
  );
}

export default function ProjectsDashboardPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '2rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4' }}>
          Loading projects...
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
