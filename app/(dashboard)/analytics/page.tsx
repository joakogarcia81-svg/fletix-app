'use client';

import * as React from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { AnalyticsKPIsView } from '@/features/analytics/components/analytics-kpis';
import dynamic from 'next/dynamic';
import { BarChart2, Calendar, Download, Loader2 } from 'lucide-react';

const AnalyticsCharts = dynamic(
  () => import('@/features/analytics/components/analytics-charts').then(mod => mod.AnalyticsCharts),
  { loading: () => <div className="h-[300px] w-full animate-pulse bg-neutral-900 rounded-3xl mt-6 border border-neutral-800" /> }
);

const AnalyticsTable = dynamic(
  () => import('@/features/analytics/components/analytics-table').then(mod => mod.AnalyticsTable),
  { loading: () => <div className="h-[400px] w-full animate-pulse bg-neutral-900 rounded-3xl mt-6 border border-neutral-800" /> }
);

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-neutral-500">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-sm font-medium">Procesando métricas...</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-emerald-500" />
            Centro de Inteligencia y Analytics
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Rendimiento de flota, rentabilidad y análisis de mercado en tiempo real.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 text-sm font-bold text-white rounded-xl hover:bg-neutral-800 transition-colors">
            <Calendar className="h-4 w-4 text-neutral-400" />
            Últimos 6 Meses
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 text-sm font-bold text-white rounded-xl hover:bg-neutral-800 transition-colors pointer-events-none opacity-50">
            <Download className="h-4 w-4 text-neutral-400" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <AnalyticsKPIsView kpis={data.kpis} />

      {/* Charts (Recharts) */}
      <AnalyticsCharts 
        monthlyTrend={data.monthlyTrend} 
        provinceDistribution={data.provinceDistribution} 
      />

      {/* Recent Activity Table (TanStack) */}
      <AnalyticsTable data={data.recentTrips} />

    </div>
  );
}
