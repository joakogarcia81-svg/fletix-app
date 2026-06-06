'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Map, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MapPlaceholder({ isLoading }: { isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="w-full h-[300px] rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-5 relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-neutral-800/20 to-transparent" />
        <div className="h-4 w-40 bg-neutral-800/60 rounded-full animate-pulse mb-4" />
        <div className="flex-1 rounded-xl bg-neutral-800/30 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Mapa de Operaciones</h3>
          <p className="text-xs text-neutral-500">Live tracking (Próximamente)</p>
        </div>
        <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-neutral-800/50 text-neutral-400">
          <Map className="h-4 w-4" />
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-neutral-800/40 bg-neutral-950/50 relative overflow-hidden flex items-center justify-center group">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Radial gradient mask for vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0a0a0a_100%)]" />

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative z-10 flex flex-col items-center gap-2 text-center"
        >
          <div className="h-12 w-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Map className="h-5 w-5 text-blue-500" />
          </div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Módulo GPS Desactivado
          </span>
        </motion.div>
      </div>
    </div>
  );
}

export type ActivityEvent = {
  id: string;
  type: 'success' | 'warning' | 'info';
  message: string;
  time: string;
};

export function RecentActivity({ data, isLoading }: { data: ActivityEvent[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="w-full h-[300px] rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-5 relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-neutral-800/20 to-transparent" />
        <div className="h-4 w-32 bg-neutral-800/60 rounded-full animate-pulse mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-8 w-8 bg-neutral-800/60 rounded-full animate-pulse shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-full bg-neutral-800/50 rounded-full animate-pulse" />
                <div className="h-2 w-16 bg-neutral-800/30 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const icons = {
    success: <CheckCircle className="h-4 w-4 text-emerald-500" />,
    warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    info: <Clock className="h-4 w-4 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-emerald-500/10 border-emerald-500/20',
    warning: 'bg-yellow-500/10 border-yellow-500/20',
    info: 'bg-blue-500/10 border-blue-500/20',
  };

  return (
    <div className="w-full h-[300px] rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Actividad Reciente</h3>
          <p className="text-xs text-neutral-500">Últimos eventos operativos</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        {data.map((item) => (
          <div key={item.id} className="flex gap-3 group">
            <div
              className={cn(
                'h-8 w-8 rounded-full border flex items-center justify-center shrink-0 mt-0.5',
                bgColors[item.type]
              )}
            >
              {icons[item.type]}
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-semibold text-neutral-300 group-hover:text-white transition-colors">
                {item.message}
              </p>
              <span className="text-[10px] text-neutral-500 font-medium">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
