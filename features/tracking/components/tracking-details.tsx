'use client';

import * as React from 'react';
import { TrackedTrip, TRACKING_STATUS_COLORS } from '@/types/tracking';
import { Truck, User, MapPin, Clock, Gauge, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrackingDetailsProps {
  trip: TrackedTrip | null;
  onClose: () => void;
}

const TIMELINE_STAGES = [
  { id: 'ASIGNADO', label: 'Asignado al chofer' },
  { id: 'CARGANDO', label: 'Cargando en origen' },
  { id: 'EN_RUTA', label: 'En tránsito' },
  { id: 'DESCARGANDO', label: 'Descargando en destino' },
  { id: 'ENTREGADO', label: 'Entregado' },
];

export function TrackingDetails({ trip, onClose }: TrackingDetailsProps) {
  if (!trip) return null;

  const statusColor = TRACKING_STATUS_COLORS[trip.status] || '#6b7280';
  const currentStageIndex = TIMELINE_STAGES.findIndex(s => s.id === trip.status);

  return (
    <div className="flex flex-col h-full bg-neutral-950 border-l border-neutral-800 animate-in slide-in-from-right-8 duration-300">
      {/* Header */}
      <div className="p-5 border-b border-neutral-800 flex items-center justify-between sticky top-0 bg-neutral-950/80 backdrop-blur z-10">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">{trip.tripId}</h2>
          <div className="flex items-center gap-2 mt-1 text-xs font-medium text-neutral-400">
            <span className="flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                {trip.status === 'EN_RUTA' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: statusColor }} />
                )}
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: statusColor }} />
              </span>
              {trip.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="h-8 w-8 flex items-center justify-center rounded-full bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Route Overview */}
        <div className="p-5 border-b border-neutral-800">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="h-3 w-3 rounded-full border-2 border-blue-500 bg-neutral-950" />
              <div className="h-8 w-0.5 bg-neutral-800" />
              <div className="h-3 w-3 rounded-full border-2 border-emerald-500 bg-neutral-950" />
            </div>
            <div className="flex flex-col justify-between py-0.5 gap-4">
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase">Origen</p>
                <p className="text-sm font-semibold text-white">{trip.origin}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase">Destino</p>
                <p className="text-sm font-semibold text-white">{trip.destination}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics */}
        {trip.status === 'EN_RUTA' && trip.location && (
          <div className="p-5 border-b border-neutral-800 grid grid-cols-2 gap-3">
            <div className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <Gauge className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">Velocidad</span>
              </div>
              <p className="text-2xl font-black text-white">{trip.location.speed} <span className="text-sm font-medium text-neutral-500">km/h</span></p>
            </div>
            <div className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">Llegada est.</span>
              </div>
              <p className="text-2xl font-black text-white">{trip.eta || '--:--'}</p>
            </div>
            {trip.distanceRemaining != null && (
              <div className="col-span-2 bg-neutral-900 rounded-2xl p-4 border border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-400 uppercase">Distancia Restante</span>
                  <span className="text-sm font-black text-white">{Math.round(trip.distanceRemaining)} km</span>
                </div>
                <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: \`\${Math.max(5, 100 - (trip.distanceRemaining / 500) * 100)}%\`,
                      backgroundColor: statusColor 
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Driver & Truck Info */}
        <div className="p-5 border-b border-neutral-800">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Información del Equipo</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{trip.driverName}</p>
                <p className="text-xs text-neutral-500">Chofer Asignado</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{trip.truckPatent}</p>
                <p className="text-xs text-neutral-500">{trip.truckType}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-5">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Línea de Tiempo</h3>
          <div className="relative pl-3 space-y-6">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-neutral-800" />
            
            {TIMELINE_STAGES.map((stage, index) => {
              const isPast = currentStageIndex > index;
              const isCurrent = currentStageIndex === index;
              
              return (
                <div key={stage.id} className="relative flex items-center gap-4">
                  <div className={cn(
                    "relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                    isPast ? "bg-emerald-500 border-emerald-500" :
                    isCurrent ? "bg-neutral-950 border-white" :
                    "bg-neutral-950 border-neutral-800"
                  )}>
                    {isPast && <CheckCircle2 className="h-3 w-3 text-neutral-950" />}
                    {isCurrent && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-medium",
                      isPast || isCurrent ? "text-white" : "text-neutral-500"
                    )}>{stage.label}</p>
                    {isCurrent && (
                      <p className="text-xs text-neutral-400 mt-0.5">Estado actual</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
