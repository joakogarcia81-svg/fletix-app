'use client';

import * as React from 'react';
import { MonthlyData, ProvinceData } from '@/types/analytics';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { cn } from '@/lib/utils';

interface AnalyticsChartsProps {
  monthlyTrend: MonthlyData[];
  provinceDistribution: ProvinceData[];
}

export function AnalyticsCharts({ monthlyTrend, provinceDistribution }: AnalyticsChartsProps) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Area Chart: Revenue vs Expenses */}
      <div className="lg:col-span-2 bg-neutral-950 border border-neutral-800 rounded-3xl p-5">
        <h3 className="text-sm font-bold text-white mb-6">Evolución de Rentabilidad</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey="month" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000000}M`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '12px' }}
                formatter={(value) => formatCurrency(Number(value))}
              />
              <Area type="monotone" dataKey="revenue" name="Ingresos Brutos" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" name="Gastos Totales" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Trips by Province */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5">
        <h3 className="text-sm font-bold text-white mb-6">Viajes por Provincia</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={provinceDistribution} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} hide />
              <YAxis dataKey="province" type="category" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} width={80} />
              <Tooltip 
                cursor={{ fill: '#171717' }}
                contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '12px' }}
              />
              <Bar dataKey="trips" name="Viajes" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
