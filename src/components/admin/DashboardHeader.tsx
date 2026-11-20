'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ExternalLink } from 'lucide-react';
import styles from './DashboardHeader.module.scss';

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Executive Overview',
  '/dashboard/profile': 'Studio Profile & Bio',
  '/dashboard/projects': 'Portfolio Works & Projects',
  '/dashboard/skills': 'Skills & Craft Tools',
  '/dashboard/experience': 'Career Ledger',
  '/dashboard/education': 'Academic Credentials',
  '/dashboard/inquiries': 'Inquiries Inbox',
  '/dashboard/media': 'R2 Media Library',
  '/dashboard/settings': 'Settings & Security',
};

interface DashboardHeaderProps {
  onOpenMobileMenu: () => void;
}

export function DashboardHeader({ onOpenMobileMenu }: DashboardHeaderProps) {
  const pathname = usePathname();
  const currentTitle = ROUTE_TITLES[pathname] || 'Admin Console';

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className={styles.mobileMenuBtn}
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
          <Link href="/dashboard" className={styles.breadcrumbRoot}>
            Atelier
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{currentTitle}</span>
        </nav>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.statusPill}>
          <span className={styles.statusDot} aria-hidden="true" />
          <span>Postgres Live</span>
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.quickLink}
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
}
