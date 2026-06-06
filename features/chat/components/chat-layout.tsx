'use client';

import * as React from 'react';
import { useLiveTracking } from '@/hooks/use-live-tracking';
import { ChatSidebar } from './chat-sidebar';
import { ChatWindow } from './chat-window';
import { TrackedTrip } from '@/types/tracking';

export function ChatLayout() {
  const { trips } = useLiveTracking(); // Usamos los viajes activos
  const [selectedTrip, setSelectedTrip] = React.useState<TrackedTrip | null>(null);

  // Sync selected trip with real-time updates
  React.useEffect(() => {
    if (selectedTrip) {
      const updatedTrip = trips.find(t => t.id === selectedTrip.id);
      if (updatedTrip && JSON.stringify(updatedTrip) !== JSON.stringify(selectedTrip)) {
        setSelectedTrip(updatedTrip);
      }
    }
  }, [trips, selectedTrip]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-neutral-950 overflow-hidden">
      {/* Mobile: Show sidebar only if no trip is selected. Desktop: Always show */}
      <div className={selectedTrip ? "hidden lg:block h-full" : "w-full lg:w-auto h-full"}>
        <ChatSidebar 
          trips={trips} 
          selectedTrip={selectedTrip} 
          onSelectTrip={setSelectedTrip} 
        />
      </div>

      {/* Mobile: Show chat only if trip is selected. Desktop: Always show */}
      <div className={!selectedTrip ? "hidden lg:flex flex-1" : "flex-1 w-full h-full"}>
        <ChatWindow 
          trip={selectedTrip} 
          onBack={() => setSelectedTrip(null)}
        />
      </div>
    </div>
  );
}
