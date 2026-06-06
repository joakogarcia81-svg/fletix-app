'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  accentColor?: 'blue' | 'red' | 'neutral';
  children?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  accentColor = 'neutral',
  children,
  className,
}: EmptyStateProps) {
  const iconColors = {
    blue: 'text-blue-500',
    red: 'text-red-500',
    neutral: 'text-neutral-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        'rounded-xl border border-dashed border-neutral-200/10 dark:border-neutral-800/40',
        'bg-white/40 dark:bg-neutral-900/20',
        className,
      )}
    >
      <div className="p-4 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/30 mb-4">
        <Icon className={cn('h-10 w-10', iconColors[accentColor])} />
      </div>
      <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">{title}</h3>
      <p className="text-xs text-neutral-400 max-w-xs mt-1.5 leading-relaxed">{description}</p>
      {children && <div className="mt-4">{children}</div>}
    </motion.div>
  );
}
