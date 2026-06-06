'use client';

import * as React from 'react';
import { UserCircle2, BellRing } from 'lucide-react';
import { ActiveTripCard } from '@/features/driver/components/active-trip-card';
import { QuickActionsFAB } from '@/features/driver/components/quick-actions-fab';
import { CargoStatus, Route } from '@/types/logistics';

export default function DriverHomePage() {
  // Mock State for the active trip
  const [activeStatus, setActiveStatus] = React.useState<CargoStatus>('ASIGNADO');

  const mockRoute: Route = {
    origen: 'Rosario, Santa Fe',
    destino: 'Córdoba Capital',
    distanciaKm: 400
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 px-4 pt-12 pb-24">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border border-blue-500/50">
            <UserCircle2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Hola, Juan Carlos</h1>
            <p className="text-xs text-neutral-400 font-semibold">Scania R450 • AD345FG</p>
          </div>
        </div>
        <button className="relative p-2 bg-neutral-900 rounded-full border border-neutral-800">
          <BellRing className="h-5 w-5 text-neutral-300" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-neutral-900" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col space-y-6">
        <ActiveTripCard 
          tripId="CRG-8902"
          status={activeStatus}
          route={mockRoute}
          onStatusChange={(newStatus) => setActiveStatus(newStatus)}
        />
      </div>

      <QuickActionsFAB />
      
    </div>
  );
}
