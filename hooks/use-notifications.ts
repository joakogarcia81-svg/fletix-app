'use client';

import { useEffect, useCallback, useRef } from 'react';
import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { AppNotification } from '@/types/notifications';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/toast';

// ── Zustand Store ────────────────────────────────────────────
interface NotificationsState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  setNotifications: (notifications: AppNotification[]) => void;
  addNotification: (notification: AppNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setLoading: (loading: boolean) => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read_at).length,
    }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.read_at ? 0 : 1),
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - (state.notifications.find((n) => n.id === id && !n.read_at) ? 1 : 0)),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })),
      unreadCount: 0,
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));

// ── Hook that manages the lifecycle ──────────────────────────
export function useNotifications() {
  const store = useNotificationsStore();
  const { showToast } = useToast();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const initializedRef = useRef(false);

  const supabase = createClient();

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    store.setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      store.setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      store.setNotifications(data as AppNotification[]);
    }
    store.setLoading(false);
  }, [supabase, store]);

  // Subscribe to realtime
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    fetchNotifications();

    const setupRealtime = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const channel = supabase
        .channel(`user_notifications_${userData.user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userData.user.id}`,
          },
          (payload) => {
            const newNotification = payload.new as AppNotification;
            store.addNotification(newNotification);

            // Fire a toast automatically
            const toastType = newNotification.type === 'alerta_operativa' || newNotification.type === 'documento_vencido'
              ? 'error'
              : newNotification.type === 'viaje_asignado'
                ? 'success'
                : 'info';

            showToast(newNotification.title, toastType);
          }
        )
        .subscribe();

      channelRef.current = channel;
    };

    setupRealtime();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [supabase, fetchNotifications, store, showToast]);

  // Actions
  const markAsRead = async (id: string) => {
    store.markAsRead(id);
    await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id);
  };

  const markAllAsRead = async () => {
    store.markAllAsRead();
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', userData.user.id)
        .is('read_at', null);
    }
  };

  return {
    notifications: store.notifications,
    unreadCount: store.unreadCount,
    isLoading: store.isLoading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}
