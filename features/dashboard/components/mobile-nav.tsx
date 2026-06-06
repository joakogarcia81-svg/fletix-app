'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useUiStore } from '@/store/use-ui-store';
import { useMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';

export function MobileNav() {
  const isMobile = useMobile();
  const { activeView, mobileDrawerOpen, setActiveView, toggleMobileDrawer, setMobileDrawerOpen } =
    useUiStore();

  if (!isMobile) return null;

  // First 3 items for bottom bar, rest for drawer
  const bottomTabs = NAV_ITEMS.slice(0, 3);
  const drawerItems = NAV_ITEMS.slice(3);

  return (
    <>
      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-t border-neutral-200/10 z-40 flex items-center justify-around px-4 transition-colors">
        {bottomTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id && !mobileDrawerOpen;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveView(tab.id);
                setMobileDrawerOpen(false);
              }}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-lg transition-all',
                isActive
                  ? 'text-neutral-900 dark:text-white'
                  : 'text-neutral-400 dark:text-neutral-500',
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold">{tab.shortLabel}</span>
            </button>
          );
        })}

        {/* Menu Toggle */}
        <button
          onClick={toggleMobileDrawer}
          className={cn(
            'flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-lg transition-all',
            mobileDrawerOpen ? 'text-red-500' : 'text-neutral-400 dark:text-neutral-500',
          )}
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Menú</span>
        </button>
      </nav>

      {/* Slide-up Drawer Overlay */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            {/* Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-h-[70vh] bg-white dark:bg-neutral-900 rounded-t-2xl border-t border-neutral-200/10 z-50 p-6 pb-24 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black tracking-wider text-neutral-800 dark:text-neutral-200">
                  FLETIX LOGÍSTICA
                </h3>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {drawerItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={cn(
                        'flex flex-col items-start gap-2 p-4 rounded-xl border transition-all text-left',
                        isActive
                          ? 'border-blue-500 bg-blue-500/5 text-neutral-900 dark:text-white'
                          : 'border-neutral-200/10 bg-neutral-50/50 dark:bg-neutral-950/20 text-neutral-600 dark:text-neutral-400',
                      )}
                    >
                      <Icon className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-xs font-bold">{item.shortLabel}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{item.label}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
