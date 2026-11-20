import React from 'react';
import styles from './Skeleton.module.scss';

export interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, style, width, height }: SkeletonProps) {
  return (
    <div
      className={[styles.skeleton, className || ''].filter(Boolean).join(' ')}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}
