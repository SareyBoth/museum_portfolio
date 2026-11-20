import React from 'react';
import styles from './Card.module.scss';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <div className={[styles.card, className || ''].filter(Boolean).join(' ')}>{children}</div>;
}

export interface CardHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, description, action, className }: CardHeaderProps) {
  return (
    <div className={[styles.header, className || ''].filter(Boolean).join(' ')}>
      <div className={styles.titleArea}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={[styles.body, className || ''].filter(Boolean).join(' ')}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={[styles.footer, className || ''].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
