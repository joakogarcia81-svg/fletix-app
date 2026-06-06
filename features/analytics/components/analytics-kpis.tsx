'use client';

import * as React from 'react';
import { AnalyticsKPIs } from '@/types/analytics';
import { TrendingUp, Truck, MapPin, DollarSign, PackageOpen, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AnalyticsKPIsView({ kpis }: { kpis: AnalyticsKPIs }) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="col-span-2 lg:col-span-2 bg-neutral-950 border border-neutral-800 rounded-3xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl rounded-full -mr-10 -mt-10 group-hover:bg-emerald-500/10 transition-colors" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <p className="text-sm font-bold text-neutral-400">Margen Neto</p>
          <div className="p-2 bg-emerald-500/10 rounded-xl"><TrendingUp className="h-5 w-5 text-emerald-500" /></div>
        </div>
        <p className="text-3xl font-black text-white relative z-10">{formatCurrency(kpis.net_margin)}</p>
      </div>

      <div className="col-span-2 lg:col-span-2 bg-neutral-950 border border-neutral-800 rounded-3xl p-5 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl rounded-full -mr-10 -mt-10 group-hover:bg-blue-500/10 transition-colors" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <p className="text-sm font-bold text-neutral-400">Ingresos Brutos</p>
          <div className="p-2 bg-blue-500/10 rounded-xl"><DollarSign className="h-5 w-5 text-blue-500" /></div>
        </div>
        <p className="text-3xl font-black text-white relative z-10">{formatCurrency(kpis.total_revenue)}</p>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-neutral-400">Viajes Totales</p>
          <MapPin className="h-4 w-4 text-violet-500" />
        </div>
        <p className="text-2xl font-black text-white">{kpis.total_trips}</p>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-neutral-400">Kilómetros</p>
          <MapPin className="h-4 w-4 text-amber-500" />
        </div>
        <p className="text-2xl font-black text-white">{(kpis.total_km / 1000).toFixed(1)}k</p>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-neutral-400">Flota Activa</p>
          <Truck className="h-4 w-4 text-sky-500" />
        </div>
        <p className="text-2xl font-black text-white">{kpis.active_trucks} / {kpis.total_trucks}</p>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-neutral-400">Cargas Pub.</p>
          <PackageOpen className="h-4 w-4 text-orange-500" />
        </div>
        <p className="text-2xl font-black text-white">{kpis.published_loads}</p>
      </div>
      
       <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-neutral-400">Cargas Tom.</p>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </div>
        <p className="text-2xl font-black text-white">{kpis.taken_loads}</p>
      </div>
    </div>
  );
}
