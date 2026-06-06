'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardModernProps {
  children: React.ReactNode;
  className?: string;
  hoverGlow?: boolean;
  glowColor?: 'blue' | 'red' | 'neutral';
  animated?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
}

export function CardModern({
  children,
  className,
  hoverGlow = true,
  glowColor = 'neutral',
  animated = true,
  onClick,
  style,
}: CardModernProps) {
  const glowClasses = {
    neutral:
      'hover:border-neutral-500/30 dark:hover:border-neutral-400/20 hover:shadow-neutral-500/5',
    blue: 'hover:border-blue-500/30 dark:hover:border-blue-400/20 hover:shadow-blue-500/5',
    red: 'hover:border-red-500/30 dark:hover:border-red-400/20 hover:shadow-red-500/5',
  };

  const sharedClasses = cn(
    'rounded-xl border border-neutral-200/10 dark:border-neutral-800/40',
    'bg-white/80 dark:bg-neutral-900/40 backdrop-blur-md',
    'shadow-sm hover:shadow-lg transition-all duration-300',
    hoverGlow && glowClasses[glowColor],
    className,
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={sharedClasses}
        onClick={onClick}
        style={style}
      >
        <div className="p-5">{children}</div>
      </motion.div>
    );
  }

  return (
    <div className={sharedClasses} onClick={onClick} style={style}>
      <div className="p-5">{children}</div>
    </div>
  );
}
