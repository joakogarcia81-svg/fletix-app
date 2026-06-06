'use client';

import * as React from 'react';
import { Menu, Search, MapPin, Plus } from 'lucide-react';
import { useUiStore } from '@/store/use-ui-store';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useMobile } from '@/hooks/use-mobile';
import { NAV_ITEMS } from '@/lib/constants';
import { Dialog } from '@/components/ui/dialog';
import { PublishTripForm } from '@/features/trips/components/publish-trip-form';
import { NotificationDropdown } from '@/features/notifications/components/notification-dropdown';

export function Topbar() {
  const isMobile = useMobile();
  const { activeView, toggleMobileDrawer, searchQuery, setSearchQuery } = useUiStore();
  const [publishOpen, setPublishOpen] = React.useState(false);

  const currentNav = NAV_ITEMS.find((item) => item.id === activeView);
  const viewLabel = currentNav?.label ?? 'Inicio';

  return (
    <>
      <header className="flex items-center justify-between px-6 h-16 border-b border-neutral-200/10 bg-white/50 dark:bg-neutral-950/40 backdrop-blur-md sticky top-0 z-20 transition-colors">
        <div className="flex items-center gap-3">
          {isMobile && (
            <button
              onClick={toggleMobileDrawer}
              className="p-1.5 rounded-lg border border-neutral-200/10 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500 dark:text-neutral-300"
              aria-label="Open navigation drawer"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 dark:text-neutral-500">
            <span>Fletix</span>
            <span>/</span>
            <span className="text-neutral-800 dark:text-neutral-200 font-bold transition-all text-sm">
              {viewLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-md justify-end md:justify-start md:ml-8">
          <div className="relative w-full max-w-[280px] hidden sm:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar cargas, patentes, choferes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-neutral-200/10 dark:border-neutral-800/60 bg-neutral-950/5 dark:bg-neutral-950/40 hover:bg-neutral-950/10 focus:bg-white dark:focus:bg-neutral-950/80 focus:border-neutral-300 dark:focus:border-neutral-700 outline-none text-neutral-800 dark:text-neutral-200 transition-all placeholder-neutral-400 dark:placeholder-neutral-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Publish Trip CTA */}
          <button
            onClick={() => setPublishOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.08)] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Publicar Viaje
          </button>
          {/* Mobile-only icon button */}
          <button
            onClick={() => setPublishOpen(true)}
            className="sm:hidden p-2 rounded-lg bg-white text-black hover:bg-neutral-200 transition-all"
            aria-label="Publicar viaje"
          >
            <Plus className="h-4 w-4" />
          </button>

          {/* Argentina Flag visual accent */}
          <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-[10px] text-blue-500 font-bold">
            <MapPin className="h-3 w-3" />
            Argentina
          </div>

          {/* Notification Bell (Realtime) */}
          <NotificationDropdown />

          <ThemeToggle />
        </div>
      </header>

      {/* Publish Trip Modal */}
      <Dialog
        isOpen={publishOpen}
        onClose={() => setPublishOpen(false)}
        title="Nuevo Viaje"
        className="max-w-3xl"
      >
        <PublishTripForm onSuccess={() => setPublishOpen(false)} />
      </Dialog>
    </>
  );
}
