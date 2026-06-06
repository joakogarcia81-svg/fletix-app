'use client';

import * as React from 'react';
import { MapPin, Navigation, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { CargoStatus, Route } from '@/types/logistics';
import { TripTimeline } from './trip-timeline';
import { CameraUploader } from './camera-uploader';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ActiveTripCardProps {
  tripId: string;
  status: CargoStatus;
  route: Route;
  onStatusChange: (newStatus: CargoStatus) => void;
}

export function ActiveTripCard({ tripId, status, route, onStatusChange }: ActiveTripCardProps) {
  // Determine next logical action
  const getNextAction = () => {
    switch (status) {
      case 'ASIGNADO': return { label: 'Comenzar Carga', next: 'CARGANDO' as CargoStatus, color: 'bg-blue-600 hover:bg-blue-500' };
      case 'CARGANDO': return { label: 'Finalizar Carga', next: 'CARGADO' as CargoStatus, color: 'bg-emerald-600 hover:bg-emerald-500' };
      case 'CARGADO': return { label: 'Iniciar Ruta', next: 'EN_RUTA' as CargoStatus, color: 'bg-blue-600 hover:bg-blue-500' };
      case 'EN_RUTA': return { label: 'Llegué a Destino', next: 'ARRIBADO' as CargoStatus, color: 'bg-emerald-600 hover:bg-emerald-500' };
      case 'ARRIBADO': return { label: 'Comenzar Descarga', next: 'DESCARGANDO' as CargoStatus, color: 'bg-orange-600 hover:bg-orange-500' };
      case 'DESCARGANDO': return { label: 'Finalizar Viaje', next: 'ENTREGADO' as CargoStatus, color: 'bg-teal-600 hover:bg-teal-500' };
      default: return null;
    }
  };

  const action = getNextAction();

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
      
      {/* Header Info */}
      <div className="p-5 bg-neutral-800/30">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-neutral-400">VIAJE ACTIVO</span>
          <span className="text-[10px] font-mono text-neutral-500 bg-neutral-950 px-2 py-1 rounded">{tripId}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-between h-14">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <div className="w-0.5 h-full bg-neutral-700" />
            <div className="h-3 w-3 rounded-full border-2 border-emerald-500 bg-transparent" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <p className="text-xs text-neutral-400">Origen</p>
              <h3 className="text-lg font-bold text-white leading-tight">{route.origen}</h3>
            </div>
            <div>
              <p className="text-xs text-neutral-400">Destino</p>
              <h3 className="text-lg font-bold text-white leading-tight">{route.destino}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-8 pb-4">
        <TripTimeline currentStatus={status} />
      </div>

      {/* CTA Area */}
      <div className="p-5 space-y-4">
        {status === 'CARGADO' && (
          <CameraUploader label="Subir Remito de Carga" />
        )}
        {status === 'DESCARGANDO' && (
          <CameraUploader label="Subir Remito Conformado" />
        )}

        {action ? (
          <button
            onClick={() => onStatusChange(action.next)}
            className={cn(
              "w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg text-white font-bold text-lg",
              action.color
            )}
          >
            {action.label}
            <ArrowRight className="h-5 w-5" />
          </button>
        ) : (
          <div className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold">
            <ShieldCheck className="h-5 w-5" />
            Viaje Finalizado
          </div>
        )}
      </div>

    </div>
  );
}
