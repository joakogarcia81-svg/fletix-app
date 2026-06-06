'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-md border border-neutral-200/20 bg-transparent" />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex items-center justify-center w-9 h-9 rounded-md border border-neutral-200/10 hover:border-neutral-200/20 bg-neutral-900/5 dark:bg-neutral-100/5 hover:bg-neutral-900/10 dark:hover:bg-neutral-100/10 text-neutral-800 dark:text-neutral-200 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-neutral-500"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ y: -10, opacity: 0, rotate: -40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 10, opacity: 0, rotate: 40 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Sun className="h-[18px] w-[18px] text-yellow-400" />
          ) : (
            <Moon className="h-[18px] w-[18px] text-blue-600" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
