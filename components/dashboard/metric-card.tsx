'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  isLoading?: boolean;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  isLoading,
  className,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-5 backdrop-blur-xl',
          'flex flex-col gap-4 overflow-hidden relative',
          className
        )}
      >
        {/* Pulse Skeleton */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-neutral-800/20 to-transparent" />
        
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-neutral-800/60 rounded-full animate-pulse" />
          <div className="h-8 w-8 bg-neutral-800/60 rounded-xl animate-pulse" />
        </div>
        <div className="space-y-2 mt-2">
          <div className="h-8 w-32 bg-neutral-800/60 rounded-full animate-pulse" />
          <div className="h-3 w-40 bg-neutral-800/40 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-5 backdrop-blur-xl transition-colors hover:bg-neutral-900/60 hover:border-neutral-700/80',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          {title}
        </h3>
        <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-neutral-800/50 text-neutral-400 group-hover:text-white group-hover:bg-blue-500/20 transition-colors">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white tracking-tight">
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                'text-xs font-bold px-1.5 py-0.5 rounded-md',
                trend.value >= 0
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-red-500/10 text-red-500'
              )}
            >
              {trend.value > 0 ? '+' : ''}
              {trend.value}%
            </span>
          )}
        </div>
        {(subtitle || trend?.label) && (
          <p className="text-xs text-neutral-500 font-medium">
            {trend ? trend.label : subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
