'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Wrench,
  Briefcase,
  GraduationCap,
  Mail,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  X,
} from 'lucide-react';
import { LogoutButton } from '@/app/dashboard/LogoutButton';
import styles from './DashboardSidebar.module.scss';

export interface NavGroup {
  label: string;
  items: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[];
}

interface DashboardSidebarProps {
  adminEmail: string;
  unreadInquiriesCount?: number;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function DashboardSidebar({
  adminEmail,
  unreadInquiriesCount = 0,
  mobileOpen = false,
  onMobileClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    if (mobileOpen && onMobileClose) {
      onMobileClose();
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Escape key handler for drawer
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onMobileClose) {
        onMobileClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, onMobileClose]);

  const navGroups: NavGroup[] = [
    {
      label: 'Overview',
      items: [
        { href: '/dashboard', label: 'Executive Overview', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Content Engine',
      items: [
        { href: '/dashboard/profile', label: 'Profile & Bio', icon: User },
        { href: '/dashboard/projects', label: 'Works & Projects', icon: FolderKanban },
        { href: '/dashboard/skills', label: 'Skills & Tools', icon: Wrench },
        { href: '/dashboard/experience', label: 'Experience', icon: Briefcase },
        { href: '/dashboard/education', label: 'Education', icon: GraduationCap },
      ],
    },
    {
      label: 'Communications & Media',
      items: [
        {
          href: '/dashboard/inquiries',
          label: 'Inquiries Inbox',
          icon: Mail,
          badge: unreadInquiriesCount > 0 ? unreadInquiriesCount : undefined,
        },
        { href: '/dashboard/media', label: 'Media Library', icon: ImageIcon },
      ],
    },
    {
      label: 'System & Security',
      items: [
        { href: '/dashboard/settings', label: 'Settings & Audit', icon: Settings },
      ],
    },
  ];

  const renderContent = (isDrawer = false) => (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {!isDrawer && (
          <div className={styles.brandHeader}>
            <Link href="/dashboard" className={styles.brandLink}>
              <div className={styles.monogram}>SB</div>
              <div className={styles.brandText}>
                <span className={styles.brandTitle}>Atelier Admin</span>
                <span className={styles.brandSubtitle}>Management Console</span>
              </div>
            </Link>
          </div>
        )}

        <nav className={styles.navContainer} aria-label="Admin Navigation">
          {navGroups.map((group) => (
            <div key={group.label} className={styles.navGroup}>
              <div className={styles.groupLabel}>{group.label}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      styles.navItem,
                      isActive ? styles.navItemActive : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className={styles.navItemContent}>
                      <Icon className={styles.navIcon} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={styles.badgePill}>{item.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerMeta}>
          <span className={styles.adminEmail} title={adminEmail}>
            {adminEmail}
          </span>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.liveSiteLink}
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
        <LogoutButton />
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className={styles.sidebar}>{renderContent(false)}</aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <div
          className={styles.drawerOverlay}
          onClick={onMobileClose}
          aria-modal="true"
          role="dialog"
        >
          <div
            className={styles.drawer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.drawerHeader}>
              <Link href="/dashboard" className={styles.brandLink}>
                <div className={styles.monogram}>SB</div>
                <div className={styles.brandText}>
                  <span className={styles.brandTitle}>Atelier Admin</span>
                  <span className={styles.brandSubtitle}>Console</span>
                </div>
              </Link>
              <button
                type="button"
                className={styles.closeButton}
                onClick={onMobileClose}
                aria-label="Close navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
