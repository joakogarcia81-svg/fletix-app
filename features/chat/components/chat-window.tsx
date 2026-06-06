'use client';

import * as React from 'react';
import { useChat } from '@/hooks/use-chat';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { Loader2, ArrowLeft, MoreVertical, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrackedTrip } from '@/types/tracking';

interface ChatWindowProps {
  trip: TrackedTrip | null;
  onBack?: () => void;
}

export function ChatWindow({ trip, onBack }: ChatWindowProps) {
  const { messages, isLoading, currentUser, onlineUsers, sendMessage, notifyTyping, markAsRead } = useChat(trip?.id || null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark as read when opening conversation or receiving new messages
  React.useEffect(() => {
    if (trip?.id && messages.length > 0) {
      markAsRead();
    }
  }, [trip?.id, messages.length, markAsRead]);

  if (!trip) {
    return (
      <div className="flex-1 hidden lg:flex flex-col items-center justify-center bg-neutral-950 border-l border-neutral-800 text-neutral-500">
        <div className="h-16 w-16 bg-neutral-900 rounded-full flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <p>Selecciona un viaje para iniciar la conversación</p>
      </div>
    );
  }

  // Check if anyone else in the trip is typing
  const isSomeoneTyping = Object.values(onlineUsers).some(u => u.user_id !== currentUser && u.is_typing);

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-950 border-l border-neutral-800 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur z-20">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="lg:hidden p-2 -ml-2 text-neutral-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              {trip.tripId}
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 font-medium">
                {trip.status}
              </span>
            </h2>
            <div className="text-xs text-neutral-400 flex items-center gap-1 mt-1">
              <span className="truncate max-w-[150px] sm:max-w-[300px] flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {trip.origin} ➔ {trip.destination}
              </span>
            </div>
          </div>
        </div>
        <button className="p-2 text-neutral-400 hover:text-white">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 scroll-smooth"
        style={{ backgroundImage: 'radial-gradient(#262626 1px, transparent 1px)', backgroundSize: '24px 24px', backgroundColor: '#0a0a0a' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500 text-sm">
            <p className="bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
              No hay mensajes en este viaje aún.
            </p>
          </div>
        ) : (
          <div className="flex flex-col justify-end min-h-full">
            <div className="text-center my-4">
              <span className="text-[10px] font-bold text-neutral-500 bg-neutral-900 px-3 py-1 rounded-full uppercase tracking-wider">
                Inicio del viaje
              </span>
            </div>
            {messages.map((msg, index) => {
              const isOwn = msg.sender_id === currentUser;
              const showAvatar = index === 0 || messages[index - 1].sender_id !== msg.sender_id;
              
              return (
                <ChatMessage 
                  key={msg.id} 
                  message={msg} 
                  isOwn={isOwn} 
                  showAvatar={showAvatar}
                />
              );
            })}
          </div>
        )}
        
        {/* Typing Indicator Bubble */}
        {isSomeoneTyping && (
          <div className="flex w-full mb-4 justify-start animate-in fade-in slide-in-from-bottom-2">
            <div className="w-10 flex-shrink-0" />
            <div className="bg-neutral-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={sendMessage} onTyping={notifyTyping} />
    </div>
  );
}
