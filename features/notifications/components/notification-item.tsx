'use client';

import * as React from 'react';
import { AppNotification, NOTIFICATION_TYPE_CONFIG, NotificationType } from '@/types/notifications';
import { cn } from '@/lib/utils';
import { Truck, CheckCircle2, MessageSquare, RefreshCw, FileWarning, AlertTriangle, MapPin } from 'lucide-react';

interface NotificationItemProps {
  notification: AppNotification;
  onRead: (id: string) => void;
  onNavigate?: (url: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  'truck':        <Truck className="h-4 w-4" />,
  'check-circle': <CheckCircle2 className="h-4 w-4" />,
  'message':      <MessageSquare className="h-4 w-4" />,
  'refresh':      <RefreshCw className="h-4 w-4" />,
  'file-warning': <FileWarning className="h-4 w-4" />,
  'alert':        <AlertTriangle className="h-4 w-4" />,
  'map-pin':      <MapPin className="h-4 w-4" />,
};

function formatTimeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 10) return 'ahora';
  if (seconds < 60) return `hace ${seconds}s`;
  if (seconds < 3600) return `hace ${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)}h`;
  return `hace ${Math.floor(seconds / 86400)}d`;
}

export function NotificationItem({ notification, onRead, onNavigate }: NotificationItemProps) {
  const config = NOTIFICATION_TYPE_CONFIG[notification.type as NotificationType] || {
    icon: 'alert',
    color: '#6b7280',
    label: notification.type,
  };

  const isUnread = !notification.read_at;

  const handleClick = () => {
    if (isUnread) onRead(notification.id);
    if (notification.action_url && onNavigate) {
      onNavigate(notification.action_url);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full text-left flex items-start gap-3 p-4 transition-all duration-150 hover:bg-neutral-800/50",
        isUnread ? "bg-neutral-900/60" : "bg-transparent opacity-70"
      )}
    >
      {/* Icon */}
      <div
        className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: `${config.color}15`, color: config.color }}
      >
        {ICON_MAP[config.icon] || <AlertTriangle className="h-4 w-4" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ color: config.color, backgroundColor: `${config.color}15` }}
          >
            {config.label}
          </span>
          <span className="text-[10px] text-neutral-500">{formatTimeAgo(notification.created_at)}</span>
        </div>
        <p className={cn("text-sm font-medium leading-snug", isUnread ? "text-white" : "text-neutral-400")}>
          {notification.title}
        </p>
        <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{notification.body}</p>
      </div>

      {/* Unread Dot */}
      {isUnread && (
        <div className="mt-2 shrink-0">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
        </div>
      )}
    </button>
  );
}
