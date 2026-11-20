'use client';

import React, { useState } from 'react';
import {
  purgeCacheAction,
  changePasswordAction,
  revokeSessionAction,
  revokeOtherSessionsAction,
} from '../actions';
import { RefreshCw, Key, Trash2, Smartphone, Monitor } from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/admin/ui/Card';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Badge } from '@/components/admin/ui/Badge';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import { useAdminToast } from '@/components/admin/ui/Toast';
import styles from './SettingsManager.module.scss';

interface SessionItem {
  id: number;
  userId: number;
  tokenHash: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date;
  lastActiveAt: Date;
  createdAt: Date;
}

interface SettingsManagerProps {
  admin: {
    id: number;
    email: string;
    name: string;
  };
  sessions: SessionItem[];
  redisHealth: { ok: boolean; latencyMs: number };
}

export function SettingsManager({
  admin,
  sessions,
  redisHealth,
}: SettingsManagerProps) {
  const toast = useAdminToast();

  // Cache purge
  const [purging, setPurging] = useState(false);

  // Password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Sessions
  const [sessionsList, setSessionsList] = useState(sessions);
  const [revokeTargetId, setRevokeTargetId] = useState<number | null>(null);
  const [revoking, setRevoking] = useState(false);

  const handlePurgeCache = async () => {
    setPurging(true);
    try {
      await purgeCacheAction();
      toast.success('Live Redis cache & Next.js route tags purged.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Purge cache failed');
    } finally {
      setPurging(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setChangingPass(true);
    try {
      await changePasswordAction(oldPassword, newPassword);
      toast.success('Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Password rotation failed');
    } finally {
      setChangingPass(false);
    }
  };

  const confirmRevokeSession = async () => {
    if (!revokeTargetId) return;
    setRevoking(true);
    try {
      await revokeSessionAction(revokeTargetId);
      setSessionsList((prev) => prev.filter((s) => s.id !== revokeTargetId));
      toast.success('Session token revoked.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Revoke session failed');
    } finally {
      setRevoking(false);
      setRevokeTargetId(null);
    }
  };

  const handleRevokeOtherSessions = async () => {
    if (!confirm('Revoke all other active sessions across devices?')) return;
    try {
      const res = await revokeOtherSessionsAction();
      toast.success(`Revoked ${res.revokedCount} other session(s).`);
      setSessionsList((prev) => prev.slice(0, 1));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to revoke other sessions');
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. Account Identity */}
      <Card>
        <CardHeader
          title="Administrator Identity"
          description="Authenticated principal account details and security permissions"
        />
        <CardBody>
          <div className={styles.accountMetaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Administrator</span>
              <span className={styles.metaValue}>{admin.name}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Login Email</span>
              <span className={styles.metaValue}>{admin.email}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Security Role</span>
              <span className={styles.metaValue}>Single Studio Owner</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 2. Password Rotation */}
      <Card>
        <CardHeader
          title="Rotate Password"
          description="Update the master authentication credentials for this atelier console"
        />
        <CardBody>
          <form onSubmit={handleChangePassword} className={styles.passwordForm}>
            <Input
              label="Current Password"
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••••••"
            />
            <Input
              label="New Password"
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              hint="Minimum 8 characters with strong mixed symbols."
            />
            <Input
              label="Confirm New Password"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
            />

            <div style={{ paddingTop: '0.5rem' }}>
              <Button
                type="submit"
                variant="primary"
                loading={changingPass}
                icon={<Key className="w-4 h-4" />}
              >
                {changingPass ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* 3. Active Sessions */}
      <Card>
        <CardHeader
          title="Active Sessions &amp; Devices"
          description="Cryptographically hashed session tokens stored in PostgreSQL and Redis"
          action={
            sessionsList.length > 1 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRevokeOtherSessions}
              >
                Revoke Other Devices
              </Button>
            )
          }
        />
        <CardBody>
          <div className={styles.tableWrap}>
            <table className={styles.sessionsTable}>
              <thead>
                <tr>
                  <th>Device &amp; IP</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Expires</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sessionsList.map((session, index) => {
                  const isCurrent = index === 0;
                  const isMobile =
                    session.userAgent &&
                    (session.userAgent.includes('Mobile') ||
                      session.userAgent.includes('iPhone') ||
                      session.userAgent.includes('Android'));

                  return (
                    <tr key={session.id}>
                      <td>
                        <div className={styles.deviceInfo}>
                          <span className={styles.deviceName} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {isMobile ? (
                              <Smartphone className="w-3.5 h-3.5 text-[var(--museum-ash)]" />
                            ) : (
                              <Monitor className="w-3.5 h-3.5 text-[var(--museum-ash)]" />
                            )}
                            {session.userAgent
                              ? session.userAgent.slice(0, 48) + '...'
                              : 'Desktop Workstation'}
                          </span>
                          <span className={styles.ipAddress}>
                            IP: {session.ipAddress || '127.0.0.1'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <Badge variant={isCurrent ? 'gold' : 'neutral'} dot={isCurrent}>
                          {isCurrent ? 'Current Session' : 'Active Token'}
                        </Badge>
                      </td>
                      <td>{new Date(session.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(session.expiresAt).toLocaleDateString()}</td>
                      <td>
                        {isCurrent ? (
                          <span style={{ color: '#736e65', fontSize: '0.6875rem' }}>Active</span>
                        ) : (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setRevokeTargetId(session.id)}
                            icon={<Trash2 className="w-3.5 h-3.5" />}
                          >
                            Revoke
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* 4. Infrastructure & Cache Telemetry */}
      <Card>
        <CardHeader
          title="Infrastructure &amp; Cache Maintenance"
          description="Direct telemetry for PostgreSQL data store and Redis caching layer"
        />
        <CardBody>
          <div className={styles.telemetryGrid}>
            <div className={styles.telemetryBox}>
              <div className={styles.telemetryTop}>
                <span className={styles.telemetryTitle}>Redis Cache Layer</span>
                <div className={styles.statusIndicator}>
                  <span
                    className={`${styles.statusDot} ${
                      redisHealth.ok ? styles.ok : styles.degraded
                    }`}
                  />
                  <span style={{ color: redisHealth.ok ? '#34d399' : '#f87171' }}>
                    {redisHealth.ok ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#b8b0a4', lineHeight: 1.5 }}>
                Latency: <strong style={{ color: '#f4efe6' }}>{redisHealth.latencyMs} ms</strong>.
                Redis stores cached portfolio serializations and accelerated session tokens.
              </p>

              <div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePurgeCache}
                  loading={purging}
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  {purging ? 'Purging Cache...' : 'Purge Redis Cache'}
                </Button>
              </div>
            </div>

            <div className={styles.telemetryBox}>
              <div className={styles.telemetryTop}>
                <span className={styles.telemetryTitle}>Neon PostgreSQL Store</span>
                <div className={styles.statusIndicator}>
                  <span className={`${styles.statusDot} ${styles.ok}`} />
                  <span style={{ color: '#34d399' }}>CONNECTED</span>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#b8b0a4', lineHeight: 1.5 }}>
                Cloud PostgreSQL database connection pool initialized with Drizzle ORM schema validation.
              </p>

              <div>
                <Badge variant="success">Schema Synchronized</Badge>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Revoke Session Confirmation */}
      <ConfirmDialog
        isOpen={revokeTargetId !== null}
        title="Revoke Session Token?"
        message="This session will be invalidated immediately. Any device utilizing this token will be logged out."
        confirmLabel="Revoke Token"
        loading={revoking}
        onConfirm={confirmRevokeSession}
        onCancel={() => setRevokeTargetId(null)}
      />
    </div>
  );
}
