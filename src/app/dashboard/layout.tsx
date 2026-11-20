import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { db } from '@/db';
import { contactInquiries } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { DashboardShell } from '@/components/admin/DashboardShell';

async function DashboardAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/login?next=/dashboard');
  }

  let unreadCount = 0;
  try {
    const [unreadRes] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(contactInquiries)
      .where(eq(contactInquiries.status, 'new'));
    unreadCount = unreadRes?.count ?? 0;
  } catch {
    // non-fatal if DB query falls through
  }

  return (
    <DashboardShell
      adminEmail={admin.email}
      unreadInquiriesCount={unreadCount}
    >
      {children}
    </DashboardShell>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#060709] font-mono text-xs text-[#b8b0a4]">
          Authenticating dashboard...
        </div>
      }
    >
      <DashboardAuthWrapper>{children}</DashboardAuthWrapper>
    </Suspense>
  );
}
