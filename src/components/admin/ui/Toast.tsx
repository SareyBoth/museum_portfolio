'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import styles from './Toast.module.scss';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  show: (type: ToastType, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (type: ToastType, message: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setToasts((prev) => [...prev, { id, type, message }]);

      setTimeout(() => {
        dismiss(id);
      }, 4000);
    },
    [dismiss]
  );

  const success = useCallback((msg: string) => show('success', msg), [show]);
  const error = useCallback((msg: string) => show('error', msg), [show]);
  const info = useCallback((msg: string) => show('info', msg), [show]);

  return (
    <ToastContext.Provider value={{ show, success, error, info }}>
      {children}
      <div className={styles.container} aria-live="polite" role="region">
        {toasts.map((toast) => {
          const Icon =
            toast.type === 'success'
              ? CheckCircle2
              : toast.type === 'error'
                ? AlertCircle
                : Info;

          return (
            <div
              key={toast.id}
              className={[styles.toast, styles[toast.type]].join(' ')}
              role="status"
            >
              <div className={styles.icon}>
                <Icon className="w-4 h-4" />
              </div>
              <div className={styles.message}>{toast.message}</div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className={styles.closeButton}
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useAdminToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if invoked outside provider
    return {
      show: () => {},
      success: (msg: string) => console.log('[Toast Success]', msg),
      error: (msg: string) => console.error('[Toast Error]', msg),
      info: (msg: string) => console.log('[Toast Info]', msg),
    };
  }
  return context;
}
