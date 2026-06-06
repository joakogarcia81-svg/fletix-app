'use client';

import * as React from 'react';
import { Truck, Clock, Navigation, MapPin, Gauge, ChevronRight } from 'lucide-react';
import { TrackedTrip, TRACKING_STATUS_COLORS } from '@/types/tracking';
import { cn } from '@/lib/utils';

interface TrackingSidebarProps {
  trips: TrackedTrip[];
  selectedTrip: TrackedTrip | null;
  onSelectTrip: (trip: TrackedTrip) => void;
  lastUpdate: Date | null;
  isConnected: boolean;
}

function formatTimeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 10) return 'ahora';
  if (seconds < 60) return `hace ${seconds}s`;
  if (seconds < 3600) return `hace ${Math.floor(seconds / 60)}m`;
  return `hace ${Math.floor(seconds / 3600)}h`;
}

export function TrackingSidebar({ trips, selectedTrip, onSelectTrip, lastUpdate, isConnected }: TrackingSidebarProps) {
  const enRutaCount = trips.filter(t => t.status === 'EN_RUTA').length;
  const detenidoCount = trips.filter(t => t.status === 'DETENIDO').length;

  return (
    <div className="flex flex-col h-full bg-neutral-950 border-r border-neutral-800">
      {/* Header */}
      <div className="p-5 border-b border-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-white tracking-tight">Tracking en Vivo</h2>
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "h-2 w-2 rounded-full",
              isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
            )} />
            <span className="text-[10px] font-bold text-neutral-500 uppercase">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-neutral-900 rounded-xl p-3 text-center border border-neutral-800">
            <p className="text-xl font-black text-white">{trips.length}</p>
            <p className="text-[10px] font-bold text-neutral-500 uppercase">Total</p>
          </div>
          <div className="bg-emerald-500/5 rounded-xl p-3 text-center border border-emerald-500/20">
            <p className="text-xl font-black text-emerald-500">{enRutaCount}</p>
            <p className="text-[10px] font-bold text-emerald-500/60 uppercase">En Ruta</p>
          </div>
          <div className="bg-orange-500/5 rounded-xl p-3 text-center border border-orange-500/20">
            <p className="text-xl font-black text-orange-500">{detenidoCount}</p>
            <p className="text-[10px] font-bold text-orange-500/60 uppercase">Detenido</p>
          </div>
        </div>
      </div>

      {/* Trip List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {trips.map((trip) => {
          const isSelected = selectedTrip?.id === trip.id;
          const statusColor = TRACKING_STATUS_COLORS[trip.status] || '#6b7280';

          return (
            <button
              key={trip.id}
              onClick={() => onSelectTrip(trip)}
              className={cn(
                "w-full text-left p-4 rounded-2xl border transition-all duration-200",
                isSelected
                  ? "bg-neutral-800/80 border-neutral-700 shadow-lg"
                  : "bg-neutral-900/50 border-neutral-800/50 hover:bg-neutral-800/40 hover:border-neutral-700"
              )}
            >
              {/* Top Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${statusColor}15`, border: `1px solid ${statusColor}30` }}
                  >
                    <Truck className="h-4 w-4" style={{ color: statusColor }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{trip.tripId}</p>
                    <p className="text-[10px] text-neutral-500">{trip.truckPatent} · {trip.truckType}</p>
                  </div>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider"
                  style={{ color: statusColor, backgroundColor: `${statusColor}15` }}
                >
                  {trip.status.replace('_', ' ')}
                </span>
              </div>

              {/* Route */}
              <div className="flex items-center gap-2 mb-3 text-xs text-neutral-400">
                <MapPin className="h-3 w-3 text-blue-500 flex-shrink-0" />
                <span className="truncate">{trip.origin}</span>
                <ChevronRight className="h-3 w-3 text-neutral-600 flex-shrink-0" />
                <span className="truncate">{trip.destination}</span>
              </div>

              {/* Bottom Stats */}
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-3">
                  {trip.location?.speed != null && (
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Gauge className="h-3 w-3" />
                      {trip.location.speed} km/h
                    </span>
                  )}
                  {trip.eta && (
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Clock className="h-3 w-3" />
                      ETA {trip.eta}
                    </span>
                  )}
                </div>
                {trip.location && (
                  <span className="text-neutral-600">
                    {formatTimeAgo(trip.location.updated_at)}
                  </span>
                )}
              </div>

              {/* Distance Bar */}
              {trip.distanceRemaining != null && trip.status === 'EN_RUTA' && (
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-neutral-500">Restante</span>
                    <span className="text-neutral-300 font-bold">{Math.round(trip.distanceRemaining)} km</span>
                  </div>
                  <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.max(5, 100 - (trip.distanceRemaining / 500) * 100)}%`,
                        backgroundColor: statusColor,
                      }}
                    />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {lastUpdate && (
        <div className="p-3 border-t border-neutral-800 text-center">
          <p className="text-[10px] text-neutral-600">
            Última actualización: {lastUpdate.toLocaleTimeString('es-AR')}
          </p>
        </div>
      )}
    </div>
  );
}
