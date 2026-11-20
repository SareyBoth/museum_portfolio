'use client';

import React, { useState } from 'react';
import { ToastProvider } from './ui/Toast';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import styles from './DashboardShell.module.scss';
import '@/styles/admin/admin-base.scss';

interface DashboardShellProps {
  adminEmail: string;
  unreadInquiriesCount?: number;
  children: React.ReactNode;
}

export function DashboardShell({
  adminEmail,
  unreadInquiriesCount = 0,
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <div className={`adminScope ${styles.layoutRoot}`}>
        <DashboardSidebar
          adminEmail={adminEmail}
          unreadInquiriesCount={unreadInquiriesCount}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <div className={styles.contentWrapper}>
          <DashboardHeader onOpenMobileMenu={() => setMobileOpen(true)} />
          <div className={styles.mainScrollArea}>
            <main className={styles.mainContent}>{children}</main>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
