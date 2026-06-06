'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useLiveTracking } from '@/hooks/use-live-tracking';
import { TrackingSidebar } from './tracking-sidebar';
import { TrackingDetails } from './tracking-details';
import { TrackedTrip } from '@/types/tracking';
import { Loader2, Map } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Dynamically import TrackingMap (Leaflet/Maplibre can't run server-side) ──
const TrackingMap = dynamic(
  () => import('./tracking-map').then((mod) => ({ default: mod.TrackingMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-neutral-950 rounded-2xl flex flex-col items-center justify-center gap-4 border border-neutral-800">
        <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800">
          <Map className="h-8 w-8 text-neutral-600" />
        </div>
        <div className="flex items-center gap-2 text-neutral-500 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando mapa...
        </div>
      </div>
    ),
  }
);

export function TrackingView() {
  const { trips, isConnected, lastUpdate } = useLiveTracking();
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
      {/* Sidebar: Trip List */}
      <div className="w-[380px] flex-shrink-0 hidden lg:block z-20">
        <TrackingSidebar
          trips={trips}
          selectedTrip={selectedTrip}
          onSelectTrip={setSelectedTrip}
          lastUpdate={lastUpdate}
          isConnected={isConnected}
        />
      </div>

      {/* Map Area */}
      <div className="flex-1 p-3 relative">
        <TrackingMap
          trips={trips}
          selectedTrip={selectedTrip}
          onSelectTrip={setSelectedTrip}
        />
      </div>

      {/* Right Sidebar: Details Panel */}
      {selectedTrip && (
        <div className="w-[400px] flex-shrink-0 hidden lg:block z-20 absolute right-0 top-0 bottom-0 shadow-2xl">
          <TrackingDetails 
            trip={selectedTrip} 
            onClose={() => setSelectedTrip(null)} 
          />
        </div>
      )}

      {/* Mobile Bottom Sheet (visible on small screens only) */}
      <div className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-950 border-t border-neutral-800 transition-all duration-300 rounded-t-3xl",
        selectedTrip ? "h-[85vh]" : "max-h-[40vh]"
      )}>
        <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto mt-3 mb-2" />
        {selectedTrip ? (
          <div className="h-full overflow-y-auto pb-10">
            <TrackingDetails 
              trip={selectedTrip} 
              onClose={() => setSelectedTrip(null)} 
            />
          </div>
        ) : (
          <div className="max-h-[calc(40vh-20px)] overflow-y-auto">
            <TrackingSidebar
              trips={trips}
              selectedTrip={selectedTrip}
              onSelectTrip={setSelectedTrip}
              lastUpdate={lastUpdate}
              isConnected={isConnected}
            />
          </div>
        )}
      </div>
    </div>
  );
}
