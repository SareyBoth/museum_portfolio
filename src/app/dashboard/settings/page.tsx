import React, { Suspense } from 'react';
import { getCurrentAdmin } from '@/lib/auth';
import { db } from '@/db';
import { adminSessions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { pingRedis } from '@/lib/redis';
import { SettingsManager } from './SettingsManager';

async function SettingsContent() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;

  const [sessions, redisHealth] = await Promise.all([
    db
      .select()
      .from(adminSessions)
      .where(eq(adminSessions.userId, admin.id))
      .orderBy(desc(adminSessions.createdAt)),
    pingRedis(),
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f4efe6' }}>
          System Settings &amp; Maintenance
        </h1>
        <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4' }}>
          Manage credentials, session tokens, cache purging, and platform health
        </p>
      </div>

      <SettingsManager
        admin={admin}
        sessions={sessions}
        redisHealth={redisHealth}
      />
    </div>
  );
}

export default function SettingsDashboardPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '2rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4' }}>
          Loading settings...
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
