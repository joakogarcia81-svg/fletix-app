import * as React from 'react';
import { CheckCircle2, Circle, Navigation } from 'lucide-react';
import { CargoStatus } from '@/types/logistics';
import { cn } from '@/lib/utils';

interface TripTimelineProps {
  currentStatus: CargoStatus;
}

const timelineSteps: { label: string; status: CargoStatus }[] = [
  { label: 'Asignado', status: 'ASIGNADO' },
  { label: 'Cargando', status: 'CARGANDO' },
  { label: 'En Ruta', status: 'EN_RUTA' },
  { label: 'Descargando', status: 'DESCARGANDO' },
  { label: 'Entregado', status: 'ENTREGADO' },
];

export function TripTimeline({ currentStatus }: TripTimelineProps) {
  // Determine current active index based on logic
  let activeIndex = 0;
  if (currentStatus === 'ENTREGADO') activeIndex = 4;
  else if (currentStatus === 'DESCARGANDO' || currentStatus === 'ARRIBADO') activeIndex = 3;
  else if (currentStatus === 'EN_RUTA' || currentStatus === 'DETENIDO' || currentStatus === 'CARGADO') activeIndex = 2;
  else if (currentStatus === 'CARGANDO') activeIndex = 1;
  else activeIndex = 0;

  return (
    <div className="py-4">
      <div className="flex justify-between relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-800 -translate-y-1/2 z-0" />
        
        {/* Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -translate-y-1/2 z-0 transition-all duration-500" 
          style={{ width: `${(activeIndex / (timelineSteps.length - 1)) * 100}%` }}
        />

        {timelineSteps.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                  isCompleted ? "bg-blue-500" : isCurrent ? "bg-blue-500 ring-4 ring-blue-500/20" : "bg-neutral-800"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-white" />
                ) : isCurrent ? (
                  <Navigation className="h-3 w-3 text-white fill-current" />
                ) : (
                  <Circle className="h-2 w-2 fill-neutral-500 text-neutral-500" />
                )}
              </div>
              <span 
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider absolute -bottom-5 whitespace-nowrap transition-colors",
                  isCompleted || isCurrent ? "text-neutral-200" : "text-neutral-600"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
