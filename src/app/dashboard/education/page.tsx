import React, { Suspense } from 'react';
import { db } from '@/db';
import { education } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { EducationManager } from './EducationManager';

async function EducationContent() {
  const allEdu = await db.select().from(education).orderBy(asc(education.sortOrder));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f4efe6' }}>
          Academic Credentials &amp; Education
        </h1>
        <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4' }}>
          Degree certifications, technical media training, and institutional qualifications
        </p>
      </div>

      <EducationManager initialEducation={allEdu} />
    </div>
  );
}

export default function EducationDashboardPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '2rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4' }}>
          Loading education...
        </div>
      }
    >
      <EducationContent />
    </Suspense>
  );
}
