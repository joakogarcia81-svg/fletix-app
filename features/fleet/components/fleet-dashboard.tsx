'use client';

import * as React from 'react';
import { useFleet } from '@/hooks/use-fleet';
import { Truck, CheckCircle2, AlertTriangle, ShieldAlert, BarChart3, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import { STATUS_CONFIG, OperationalStatus } from '@/types/fleet';

export function FleetDashboard() {
  const { metrics, trucks, isLoading } = useFleet();

  if (isLoading) {
    return <div className="animate-pulse h-48 bg-neutral-900 rounded-3xl" />;
  }

  // Prepare data for the pie chart
  const statusCounts = trucks.reduce((acc, truck) => {
    acc[truck.operational_status] = (acc[truck.operational_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusCounts).map(([status, count]) => {
    const config = STATUS_CONFIG[status as OperationalStatus];
    return {
      name: config?.label || status,
      value: count,
      color: config ? (
        status === 'disponible' ? '#10b981' : 
        status === 'ocupado' ? '#3b82f6' : 
        status === 'mantenimiento' ? '#f59e0b' : 
        status === 'fuera de servicio' ? '#ef4444' : '#8b5cf6'
      ) : '#737373'
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* KPI 1: Disponibilidad */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 md:p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl rounded-full -mr-10 -mt-10 transition-colors group-hover:bg-emerald-500/10" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <p className="text-sm font-bold text-neutral-400">Disponibilidad</p>
          <div className="p-2 bg-emerald-500/10 rounded-xl"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
        </div>
        <div className="relative z-10">
          <p className="text-4xl font-black text-white">{metrics.available}</p>
          <p className="text-xs text-neutral-500 font-medium mt-1">de {metrics.total} camiones</p>
        </div>
      </div>

      {/* KPI 2: Ocupación */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 md:p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl rounded-full -mr-10 -mt-10 transition-colors group-hover:bg-blue-500/10" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <p className="text-sm font-bold text-neutral-400">En Viaje</p>
          <div className="p-2 bg-blue-500/10 rounded-xl"><Truck className="h-5 w-5 text-blue-500" /></div>
        </div>
        <div className="relative z-10">
          <p className="text-4xl font-black text-white">{metrics.occupied}</p>
          <p className="text-xs text-blue-400 font-bold flex items-center gap-1 mt-1">
            <Activity className="h-3 w-3" /> Produciendo
          </p>
        </div>
      </div>

      {/* KPI 3: Utilización (Porcentaje) */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 md:p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-2xl rounded-full -mr-10 -mt-10" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <p className="text-sm font-bold text-neutral-400">Utilización Efectiva</p>
          <div className="p-2 bg-amber-500/10 rounded-xl"><BarChart3 className="h-5 w-5 text-amber-500" /></div>
        </div>
        <div className="relative z-10">
          <p className="text-4xl font-black text-white">{metrics.utilization_percent.toFixed(0)}%</p>
          <div className="w-full bg-neutral-900 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className={cn("h-full rounded-full", metrics.utilization_percent > 70 ? "bg-emerald-500" : "bg-amber-500")} 
              style={{ width: `${metrics.utilization_percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 flex flex-col">
        <p className="text-sm font-bold text-neutral-400 mb-2">Distribución de Flota</p>
        <div className="flex-1 min-h-[100px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={45}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '12px' }}
                itemStyle={{ color: '#e5e5e5', fontSize: '12px', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
