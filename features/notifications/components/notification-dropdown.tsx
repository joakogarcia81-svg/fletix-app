'use client';

import * as React from 'react';
import { useNotifications } from '@/hooks/use-notifications';
import { NotificationItem } from './notification-item';
import { Bell, Check, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function NotificationDropdown() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape key
  React.useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const recentNotifications = notifications.slice(0, 8);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-lg text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-transparent hover:border-neutral-200/10 transition-all duration-200",
          isOpen && "bg-neutral-900 text-neutral-200 border-neutral-800"
        )}
        aria-label="Notificaciones"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-in zoom-in duration-200">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[380px] max-h-[520px] bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Notificaciones</h3>
              {unreadCount > 0 && (
                <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} nueva{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded-lg hover:bg-emerald-500/10 transition-colors flex items-center gap-1"
                >
                  <Check className="h-3 w-3" />
                  Leer todas
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-neutral-500 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[400px] overflow-y-auto divide-y divide-neutral-800/50">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 text-neutral-500 animate-spin" />
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                <div className="h-12 w-12 bg-neutral-900 rounded-full flex items-center justify-center mb-3">
                  <Bell className="h-5 w-5 opacity-50" />
                </div>
                <p className="text-sm">No hay notificaciones</p>
              </div>
            ) : (
              recentNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                  onNavigate={(url) => {
                    setIsOpen(false);
                    router.push(url);
                  }}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-neutral-800 p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/notifications');
                }}
                className="w-full text-center py-2 text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl transition-colors"
              >
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
