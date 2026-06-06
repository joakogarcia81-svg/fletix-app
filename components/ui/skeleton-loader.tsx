'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle';
  count?: number;
}

export function SkeletonLoader({
  variant = 'rect',
  count = 1,
  className,
  ...props
}: SkeletonProps) {
  const items = Array.from({ length: count });

  const shapeClasses = {
    text: 'h-4 w-full rounded',
    rect: 'h-24 w-full rounded-lg',
    circle: 'h-12 w-12 rounded-full',
  };

  return (
    <div className="flex flex-col gap-3 w-full" {...props}>
      {items.map((_, index) => (
        <div
          key={index}
          className={cn(
            'animate-pulse bg-neutral-200/50 dark:bg-neutral-800/60',
            shapeClasses[variant],
            className,
          )}
        />
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="p-5 rounded-xl border border-neutral-200/15 dark:border-neutral-800/50 bg-white dark:bg-neutral-900/30 animate-pulse"
        >
          <div className="h-4 w-1/3 bg-neutral-200/50 dark:bg-neutral-800/60 rounded mb-4" />
          <div className="h-8 w-2/3 bg-neutral-200/50 dark:bg-neutral-800/60 rounded mb-2" />
          <div className="h-3 w-1/2 bg-neutral-200/50 dark:bg-neutral-800/60 rounded" />
        </div>
      ))}
    </div>
  );
}
