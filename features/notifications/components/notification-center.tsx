'use client';

import * as React from 'react';
import { useNotifications } from '@/hooks/use-notifications';
import { NotificationItem } from './notification-item';
import { Bell, Check, Loader2, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { NotificationType, NOTIFICATION_TYPE_CONFIG } from '@/types/notifications';

const FILTER_TABS: { id: 'all' | NotificationType; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'viaje_asignado', label: 'Viajes' },
  { id: 'mensaje_nuevo', label: 'Mensajes' },
  { id: 'alerta_operativa', label: 'Alertas' },
  { id: 'documento_vencido', label: 'Documentos' },
];

export function NotificationCenter() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const [activeFilter, setActiveFilter] = React.useState<'all' | NotificationType>('all');
  const router = useRouter();

  const filteredNotifications = activeFilter === 'all'
    ? notifications
    : notifications.filter((n) => n.type === activeFilter);

  return (
    <div className="flex flex-col h-full bg-neutral-950">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-neutral-800">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Notificaciones</h1>
            <p className="text-sm text-neutral-500 mt-1">
              {unreadCount > 0 
                ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer`
                : 'Estás al día'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
              Marcar todas como leídas
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
                activeFilter === tab.id
                  ? "bg-white text-black shadow-sm"
                  : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/50">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 text-neutral-500 animate-spin" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
            <div className="h-16 w-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-4 border border-neutral-800">
              <Bell className="h-7 w-7 opacity-40" />
            </div>
            <p className="text-sm font-medium">No hay notificaciones</p>
            <p className="text-xs text-neutral-600 mt-1">
              {activeFilter !== 'all' ? 'Prueba cambiando el filtro' : 'Cuando tengas actividad nueva aparecerá aquí'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={markAsRead}
              onNavigate={(url) => router.push(url)}
            />
          ))
        )}
      </div>
    </div>
  );
}
