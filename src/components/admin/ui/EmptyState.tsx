import React from 'react';
import styles from './EmptyState.module.scss';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={[styles.emptyState, className || ''].filter(Boolean).join(' ')}>
      <div className={styles.iconWrap} aria-hidden="true">
        {icon}
      </div>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
