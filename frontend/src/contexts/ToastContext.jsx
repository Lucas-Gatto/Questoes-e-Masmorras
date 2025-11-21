import React, { createContext, useEffect, useMemo, useState } from 'react';
import { toast } from './toastService.js';

const ToastContext = createContext({});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsub = toast.subscribe(({ message, options }) => {
      const id = Math.random().toString(36).slice(2);
      const type = options?.type || 'info';
      const duration = options?.duration || 3000;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setToasts([]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const original = window.alert;
    window.alert = (message) => {
      try {
        toast.show(String(message), { type: 'info' });
      } catch (_) {
        original(message);
      }
    };
    return () => {
      window.alert = original;
    };
  }, []);

  const value = useMemo(() => ({}), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container" style={{ position: 'fixed', top: 16, right: 16, zIndex: 10000, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            aria-live="polite"
            className={`toast-item ${t.type}`}
            style={{
              backgroundColor: t.type === 'error' ? '#dc3545' : t.type === 'success' ? '#198754' : t.type === 'warning' ? '#ffc107' : '#0d6efd',
              color: 'white',
              padding: '10px 14px',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              maxWidth: '360px'
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};