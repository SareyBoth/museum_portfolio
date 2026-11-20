'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Badge } from '@/components/admin/ui/Badge';
import styles from './LoginForm.module.scss';
import '@/styles/admin/admin-base.scss';

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed. Please verify credentials.');
        setLoading(false);
        return;
      }

      window.location.href = redirectTo || '/dashboard';
    } catch {
      setError('Network communication failed. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <div className={`adminScope ${styles.loginWrapper}`}>
      {/* Left Brand Panel (Desktop) */}
      <div className={styles.brandPanel}>
        <div className={styles.brandHeader}>
          <div className={styles.monogram}>SB</div>
          <div className={styles.brandMeta}>
            <span className={styles.brandName}>SareyBoth</span>
            <span className={styles.brandDiscipline}>Video Editor · Photo Retoucher</span>
          </div>
        </div>

        <div className={styles.brandCenter}>
          <h1 className={styles.headline}>Studio Control &amp; Content Architecture</h1>
          <p className={styles.lead}>
            Curated Brutalist portfolio administrative gateway. Real-time telemetry,
            works inventory, and client inquiries dispatch pipeline.
          </p>

          <div className={styles.brandBadges}>
            <Badge variant="gold" dot>
              Encrypted Session
            </Badge>
            <Badge variant="neutral">Single-Owner Gateway</Badge>
            <Badge variant="neutral">Phnom Penh, KH</Badge>
          </div>
        </div>

        <div className={styles.brandFooter}>
          <span>Atelier Architecture v1.0</span>
          <span>© {new Date().getFullYear()} SareyBoth</span>
        </div>
      </div>

      {/* Right Authentication Panel */}
      <div className={styles.authPanel}>
        <div className={styles.cardContainer}>
          <div className={styles.topNavigation}>
            <Link href="/" className={styles.backLink}>
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to live gallery</span>
            </Link>

            <Badge variant="neutral" dot>
              Admin Gateway
            </Badge>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Studio Access</h2>
              <p className={styles.cardSubtitle}>
                Enter authorized credentials to unlock management console
              </p>
            </div>

            {error && (
              <div className={styles.errorBanner} role="alert">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Administrator Email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chansareyboth@gmail.com"
                leadingIcon={<Mail className="w-4 h-4" />}
                disabled={loading}
              />

              <Input
                label="Master Password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                leadingIcon={<Lock className="w-4 h-4" />}
                trailingAction={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.togglePassBtn}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                disabled={loading}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                {loading ? 'Authenticating...' : 'Enter Studio Console →'}
              </Button>
            </form>

            <p className={styles.securityNote}>
              Protected by scrypt cryptographic key derivation and secure session rotation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
