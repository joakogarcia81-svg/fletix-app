'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ChatMessage, ChatUserStatus } from '@/types/chat';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function useChat(tripId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, ChatUserStatus>>({});
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  const supabase = createClient();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial messages
  const loadMessages = useCallback(async () => {
    if (!tripId) return;
    setIsLoading(true);
    
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) setCurrentUser(userData.user.id);

    // Get messages with sender details (using a join on profiles)
    // Note: ensure your public.profiles table exists and RLS allows select
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:profiles(id, first_name, last_name)')
      .eq('trip_id', tripId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data as unknown as ChatMessage[]);
    }
    setIsLoading(false);
  }, [tripId, supabase]);

  // Setup Realtime & Presence
  useEffect(() => {
    if (!tripId) {
      setMessages([]);
      return;
    }

    loadMessages();

    // Create a channel for this specific trip conversation
    const channel = supabase.channel(`chat_trip_${tripId}`);

    // Subscribe to new messages
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `trip_id=eq.${tripId}`,
      },
      async (payload) => {
        // Fetch sender details for the new message
        const { data: senderData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('id', payload.new.sender_id)
          .single();

        const newMessage = {
          ...payload.new,
          sender: senderData || undefined,
        } as ChatMessage;

        setMessages((prev) => [...prev, newMessage]);
      }
    );

    // Subscribe to deleted messages
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `trip_id=eq.${tripId}`,
      },
      (payload) => {
        if (payload.new.deleted_at) {
          setMessages((prev) => prev.filter(m => m.id !== payload.new.id));
        }
      }
    );

    // Setup Presence
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const newOnlineUsers: Record<string, ChatUserStatus> = {};
      
      for (const [key, presences] of Object.entries(state)) {
        if (presences.length > 0) {
          const userStatus = presences[0] as unknown as ChatUserStatus;
          if (userStatus.user_id) {
            newOnlineUsers[userStatus.user_id] = userStatus;
          }
        }
      }
      setOnlineUsers(newOnlineUsers);
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          // Track current user presence
          await channel.track({
            user_id: data.user.id,
            online_at: new Date().toISOString(),
            is_typing: false,
          });
        }
      }
    });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tripId, loadMessages, supabase]);

  // Actions
  const sendMessage = async (content: string, attachmentFile?: File) => {
    if (!tripId || !currentUser) return;

    let attachment_url = null;
    let attachment_type = null;

    // Handle file upload
    if (attachmentFile) {
      const fileExt = attachmentFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${tripId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('chat_attachments')
        .upload(filePath, attachmentFile);

      if (!error && data) {
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('chat_attachments')
          .getPublicUrl(filePath);
        
        attachment_url = publicUrlData.publicUrl;
        attachment_type = attachmentFile.type.startsWith('image/') ? 'image' : 'document';
      }
    }

    // Insert message (Optimistic UI could be implemented here)
    // company_id should ideally be fetched from the trip, but we assume the backend 
    // or RLS allows us to insert if we have access to the trip. 
    // For safety, let's fetch the trip's company_id first
    const { data: tripData } = await supabase
      .from('trips')
      .select('company_id')
      .eq('id', tripId)
      .single();

    if (tripData) {
      await supabase.from('messages').insert({
        trip_id: tripId,
        company_id: tripData.company_id,
        sender_id: currentUser,
        content,
        attachment_url,
        attachment_type,
      });
    }

    // Stop typing after sending
    setTypingStatus(false);
  };

  const setTypingStatus = async (isTyping: boolean) => {
    if (channelRef.current && currentUser) {
      await channelRef.current.track({
        user_id: currentUser,
        online_at: new Date().toISOString(),
        is_typing: isTyping,
      });
    }
  };

  const notifyTyping = () => {
    setTypingStatus(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    // Auto clear typing after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      setTypingStatus(false);
    }, 2000);
  };

  const markAsRead = async () => {
    if (!tripId || !currentUser) return;
    
    const { data: tripData } = await supabase
      .from('trips')
      .select('company_id')
      .eq('id', tripId)
      .single();

    if (tripData) {
      await supabase.from('chat_reads').upsert({
        trip_id: tripId,
        company_id: tripData.company_id,
        user_id: currentUser,
        last_read_at: new Date().toISOString(),
      }, { onConflict: 'trip_id,user_id' });
    }
  };

  return {
    messages,
    isLoading,
    currentUser,
    onlineUsers,
    sendMessage,
    notifyTyping,
    markAsRead,
  };
}
