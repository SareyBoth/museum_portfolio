'use client';

import React, { forwardRef, useId } from 'react';
import styles from './Input.module.scss';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  leadingIcon?: React.ReactNode;
  trailingAction?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      optional,
      leadingIcon,
      trailingAction,
      id,
      className,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            <span>{label}</span>
            {optional && <span className={styles.optional}>(Optional)</span>}
          </label>
        )}

        <div className={styles.inputContainer}>
          {leadingIcon && <div className={styles.leadingIcon}>{leadingIcon}</div>}
          <input
            ref={ref}
            id={inputId}
            className={[
              styles.input,
              leadingIcon ? styles.hasLeadingIcon : '',
              trailingAction ? styles.hasTrailingIcon : '',
              error ? styles.error : '',
              className || '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-invalid={!!error}
            {...props}
          />
          {trailingAction && <div className={styles.trailingAction}>{trailingAction}</div>}
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}
        {hint && !error && <p className={styles.hint}>{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, optional, id, className, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            <span>{label}</span>
            {optional && <span className={styles.optional}>(Optional)</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={[styles.textarea, error ? styles.error : '', className || '']
            .filter(Boolean)
            .join(' ')}
          aria-invalid={!!error}
          {...props}
        />

        {error && <p className={styles.errorMessage}>{error}</p>}
        {hint && !error && <p className={styles.hint}>{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, optional, id, className, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            <span>{label}</span>
            {optional && <span className={styles.optional}>(Optional)</span>}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          className={[styles.select, error ? styles.error : '', className || '']
            .filter(Boolean)
            .join(' ')}
          aria-invalid={!!error}
          {...props}
        >
          {children}
        </select>

        {error && <p className={styles.errorMessage}>{error}</p>}
        {hint && !error && <p className={styles.hint}>{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
