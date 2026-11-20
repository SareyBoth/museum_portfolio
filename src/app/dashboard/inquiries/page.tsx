import React, { Suspense } from 'react';
import { db } from '@/db';
import { contactInquiries } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { InquiriesInbox } from './InquiriesInbox';

async function InquiriesContent() {
  const allInquiries = await db
    .select()
    .from(contactInquiries)
    .orderBy(desc(contactInquiries.createdAt));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f4efe6' }}>
          Client Inquiries &amp; Dispatch Ledger
        </h1>
        <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4' }}>
          Manage, inspect, and reply to client inquiries dispatched from the public portal
        </p>
      </div>

      <InquiriesInbox initialInquiries={allInquiries} />
    </div>
  );
}

export default function InquiriesDashboardPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '2rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4' }}>
          Loading inquiries...
        </div>
      }
    >
      <InquiriesContent />
    </Suspense>
  );
}
