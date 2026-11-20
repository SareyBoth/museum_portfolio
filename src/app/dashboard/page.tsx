import React, { Suspense } from 'react';
import Link from 'next/link';
import { connection } from 'next/server';
import { db } from '@/db';
import { projects, contactInquiries, mediaAssets } from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { pingRedis } from '@/lib/redis';
import {
  FolderKanban,
  Mail,
  Image as ImageIcon,
  Activity,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/admin/ui/Card';
import { Badge } from '@/components/admin/ui/Badge';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import styles from './Overview.module.scss';

async function OverviewContent() {
  await connection();
  const [
    projectCountResult,
    inquiryCountResult,
    unreadInquiriesResult,
    mediaCountResult,
    recentInquiries,
    redisHealth,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(projects),
    db.select({ count: sql<number>`count(*)::int` }).from(contactInquiries),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(contactInquiries)
      .where(eq(contactInquiries.status, 'new')),
    db.select({ count: sql<number>`count(*)::int` }).from(mediaAssets),
    db
      .select()
      .from(contactInquiries)
      .orderBy(desc(contactInquiries.createdAt))
      .limit(5),
    pingRedis(),
  ]);

  const projectCount = projectCountResult[0]?.count ?? 0;
  const inquiryCount = inquiryCountResult[0]?.count ?? 0;
  const unreadCount = unreadInquiriesResult[0]?.count ?? 0;
  const mediaCount = mediaCountResult[0]?.count ?? 0;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Executive Overview</h1>
        <p className={styles.subtitle}>
          Real-time system telemetry, content inventory &amp; inquiry queue
        </p>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        {/* Projects */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Portfolio Works</span>
            <FolderKanban className={styles.kpiIcon} />
          </div>
          <div className={styles.kpiValueArea}>
            <span className={styles.kpiValue}>{projectCount}</span>
          </div>
          <Link href="/dashboard/projects" className={styles.kpiLink}>
            <span>Manage works</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Inquiries */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Client Inquiries</span>
            <Mail className={styles.kpiIcon} />
          </div>
          <div className={styles.kpiValueArea}>
            <span className={styles.kpiValue}>{inquiryCount}</span>
            {unreadCount > 0 && (
              <Badge variant="gold" dot>
                {unreadCount} new
              </Badge>
            )}
          </div>
          <Link href="/dashboard/inquiries" className={styles.kpiLink}>
            <span>Open inbox</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Media */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>R2 Media Assets</span>
            <ImageIcon className={styles.kpiIcon} />
          </div>
          <div className={styles.kpiValueArea}>
            <span className={styles.kpiValue}>{mediaCount}</span>
          </div>
          <Link href="/dashboard/media" className={styles.kpiLink}>
            <span>Media library</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Redis Telemetry */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Cache Telemetry</span>
            <Activity className={styles.kpiIcon} />
          </div>
          <div className={styles.telemetryStatus}>
            <span
              className={`${styles.statusDot} ${
                redisHealth.ok ? styles.ok : styles.degraded
              }`}
              aria-hidden="true"
            />
            <span className={styles.statusText}>
              {redisHealth.ok ? 'Operational' : 'Degraded'}
            </span>
          </div>
          <div className={styles.latency}>
            Latency: {redisHealth.latencyMs}ms
          </div>
        </div>
      </div>

      {/* Recent Inquiries Card */}
      <Card>
        <CardHeader
          title="Recent Dispatched Inquiries"
          description="Latest inquiries received from the public museum portal contact form"
          action={
            <Link href="/dashboard/inquiries" className={styles.kpiLink}>
              <span>View all ({inquiryCount})</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          }
        />
        <CardBody>
          {recentInquiries.length === 0 ? (
            <EmptyState
              icon={<Mail className="w-6 h-6" />}
              title="No Inquiries Yet"
              description="Messages sent through the contact form on the live site will appear here with full dispatch telemetry."
            />
          ) : (
            <div className={styles.inquiryList}>
              {recentInquiries.map((inquiry) => {
                const badgeVariant =
                  inquiry.status === 'new'
                    ? 'gold'
                    : inquiry.status === 'read'
                      ? 'info'
                      : inquiry.status === 'replied'
                        ? 'success'
                        : 'neutral';

                return (
                  <div key={inquiry.id} className={styles.inquiryItem}>
                    <div className={styles.inquiryLeft}>
                      <div className={styles.inquiryClientLine}>
                        <span className={styles.clientName}>{inquiry.name}</span>
                        <span className={styles.clientEmail}>
                          &lt;{inquiry.email}&gt;
                        </span>
                        {inquiry.service && (
                          <Badge variant="neutral">{inquiry.service}</Badge>
                        )}
                      </div>
                      <p className={styles.inquiryMessage}>{inquiry.message}</p>
                    </div>

                    <div className={styles.inquiryRight}>
                      <Badge variant={badgeVariant} dot={inquiry.status === 'new'}>
                        {inquiry.status}
                      </Badge>
                      <span className={styles.timeAgo}>
                        <Clock className="w-3 h-3" />
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default function DashboardOverviewPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '2rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4' }}>
          Loading system telemetry...
        </div>
      }
    >
      <OverviewContent />
    </Suspense>
  );
}
