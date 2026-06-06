'use client';

import * as React from 'react';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Zustand Toast Store ─────────────────────────────────────
export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
}

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  showToast: (message, type = 'info') => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

// ─── UI Components ──────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, dismissToast } = useToast();

  const icons = {
    success: <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />,
    info: <Info className="h-4 w-4 text-blue-500 shrink-0" />,
  };

  const borders = {
    success: 'border-l-emerald-500',
    error: 'border-l-red-500',
    info: 'border-l-blue-500',
  };

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              layout
              className={cn(
                'pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200/10 dark:border-neutral-800/60',
                'bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md shadow-2xl border-l-4',
                borders[t.type]
              )}
            >
              <div className="flex items-center gap-2.5">
                {icons[t.type]}
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 leading-snug">
                  {t.message}
                </span>
              </div>
              <button
                onClick={() => dismissToast(t.id)}
                className="p-0.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
