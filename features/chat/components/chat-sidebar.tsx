'use client';

import * as React from 'react';
import { TrackedTrip } from '@/types/tracking';
import { cn } from '@/lib/utils';
import { Search, MessageSquare } from 'lucide-react';

interface ChatSidebarProps {
  trips: TrackedTrip[];
  selectedTrip: TrackedTrip | null;
  onSelectTrip: (trip: TrackedTrip) => void;
}

export function ChatSidebar({ trips, selectedTrip, onSelectTrip }: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTrips = trips.filter(trip => 
    trip.tripId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-neutral-950 border-r border-neutral-800 w-full lg:w-[320px]">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800">
        <h2 className="text-xl font-black text-white tracking-tight mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-emerald-500" />
          Mensajes
        </h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Buscar viaje o chofer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredTrips.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm">
            No se encontraron conversaciones.
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/50">
            {filteredTrips.map((trip) => {
              const isSelected = selectedTrip?.id === trip.id;
              
              // In a real app, you would fetch the latest message and unread count per trip
              // For this layout, we'll use a placeholder
              const unreadCount = 0; 
              
              return (
                <button
                  key={trip.id}
                  onClick={() => onSelectTrip(trip)}
                  className={cn(
                    "w-full text-left p-4 hover:bg-neutral-900/50 transition-colors flex gap-3",
                    isSelected && "bg-neutral-900"
                  )}
                >
                  {/* Avatar / Icon */}
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 font-bold border border-neutral-700">
                      {trip.driverName.charAt(0)}
                    </div>
                    {/* Status dot could go here */}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-white truncate pr-2">
                        {trip.tripId}
                      </p>
                      <span className="text-[10px] text-neutral-500 flex-shrink-0">
                        {/* Placeholder time */}
                        12:45
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 truncate mb-1">
                      {trip.driverName}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      Toca para ver los mensajes
                    </p>
                  </div>

                  {/* Unread Badge */}
                  {unreadCount > 0 && (
                    <div className="flex flex-col items-end justify-center ml-2">
                      <span className="bg-emerald-500 text-neutral-950 text-[10px] font-bold h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
