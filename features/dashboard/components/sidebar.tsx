'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { useUiStore } from '@/store/use-ui-store';
import { useMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, SIDEBAR_WIDTH_OPEN, SIDEBAR_WIDTH_COLLAPSED } from '@/lib/constants';

export function Sidebar() {
  const isMobile = useMobile();
  const { sidebarOpen, activeView, toggleSidebar, setActiveView } = useUiStore();

  if (isMobile) return null; // Handled by mobile drawer / bottom nav

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_COLLAPSED }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'hidden md:flex flex-col h-screen sticky top-0 border-r border-neutral-200/10 bg-white/70 dark:bg-neutral-950/60 backdrop-blur-md z-30 transition-colors',
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-5 h-16 border-b border-neutral-200/10">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black font-extrabold text-sm shrink-0">
            F
          </div>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-neutral-50 dark:to-neutral-400"
            >
              Fletix<span className="text-red-500 font-black">.</span>
            </motion.span>
          )}
        </div>
        {sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                'flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative',
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white',
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0',
                  isActive
                    ? ''
                    : 'text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white',
                )}
              />
              {sidebarOpen && <span className="truncate">{item.shortLabel}</span>}
              {!sidebarOpen && (
                <div className="absolute left-14 bg-neutral-900 text-white text-xs py-1 px-2.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-neutral-700">
                  {item.shortLabel}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile or Toggle Button */}
      <div className="p-4 border-t border-neutral-200/10 flex flex-col gap-2">
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-400"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        {sidebarOpen && (
          <div className="flex items-center gap-3 p-1">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                Administración
              </p>
              <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-blue-500" /> Fletix SRL
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
