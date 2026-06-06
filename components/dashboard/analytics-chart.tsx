'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatARS } from '@/lib/formatters';

interface AnalyticsChartProps {
  data: { name: string; revenue: number; km: number }[];
  isLoading?: boolean;
}

export function AnalyticsChart({ data, isLoading }: AnalyticsChartProps) {
  if (isLoading) {
    return (
      <div className="w-full h-[300px] rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-5 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-neutral-800/20 to-transparent" />
        <div className="h-4 w-32 bg-neutral-800/60 rounded-full animate-pulse mb-6" />
        <div className="flex-1 w-full bg-neutral-800/30 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Rendimiento Operativo</h3>
          <p className="text-xs text-neutral-500">Ganancias vs. Kilómetros (Últimos 7 días)</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Ganancias
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Kilómetros
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#737373' }}
              dy={10}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#737373' }}
              tickFormatter={(value) => `$${value / 1000}k`}
              dx={-10}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#737373' }}
              tickFormatter={(value) => `${value}km`}
              dx={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a0a0a',
                border: '1px solid rgba(64,64,64,0.5)',
                borderRadius: '12px',
                fontSize: '12px',
              }}
              itemStyle={{ color: '#e5e5e5' }}
              formatter={(value, name) => {
                const num = typeof value === 'number' ? value : 0;
                if (name === 'revenue') return [formatARS(num), 'Ganancias'];
                return [`${num} km`, 'Kilómetros'];
              }}
              labelStyle={{ color: '#a3a3a3', marginBottom: '4px' }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRev)"
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#0a0a0a', strokeWidth: 2 }}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="km"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorKm)"
              activeDot={{ r: 6, fill: '#10b981', stroke: '#0a0a0a', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
