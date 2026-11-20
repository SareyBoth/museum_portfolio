import React from 'react';
import styles from './Badge.module.scss';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'gold' | 'success' | 'warning' | 'danger' | 'info';
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={[styles.badge, styles[variant], className || '']
        .filter(Boolean)
        .join(' ')}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}
