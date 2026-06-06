'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Wallet, TrendingUp, CreditCard, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Data for the Dashboard MVP
const EXPENSES_DATA = [
  { name: 'Combustible', value: 850000, color: '#f59e0b' }, // Amber
  { name: 'Peajes', value: 120000, color: '#3b82f6' }, // Blue
  { name: 'Adelantos', value: 300000, color: '#10b981' }, // Emerald
  { name: 'Viáticos', value: 150000, color: '#8b5cf6' }, // Violet
  { name: 'Mantenimiento', value: 250000, color: '#ef4444' }, // Red
];

const MONTHLY_DATA = [
  { month: 'Ene', ingresos: 4500000, gastos: 2800000 },
  { month: 'Feb', ingresos: 5200000, gastos: 3100000 },
  { month: 'Mar', ingresos: 4800000, gastos: 2900000 },
  { month: 'Abr', ingresos: 6100000, gastos: 3400000 },
  { month: 'May', ingresos: 5900000, gastos: 3200000 },
  { month: 'Jun', ingresos: 7200000, gastos: 3800000 },
];

export function FinancialDashboard() {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

  const totalIngresos = MONTHLY_DATA.reduce((acc, curr) => acc + curr.ingresos, 0);
  const totalGastos = MONTHLY_DATA.reduce((acc, curr) => acc + curr.gastos, 0);
  const margenNeto = totalIngresos - totalGastos;
  const margenPorcentaje = (margenNeto / totalIngresos) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white tracking-tight">Panel Financiero</h1>
        <button className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-sm font-bold text-white rounded-xl hover:bg-neutral-800 transition-colors pointer-events-none opacity-50">
          Exportar a Excel (Próximamente)
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-neutral-400">Ingresos Totales (6M)</p>
            <div className="p-2 bg-blue-500/10 rounded-lg"><Wallet className="h-4 w-4 text-blue-400" /></div>
          </div>
          <p className="text-2xl font-black text-white">{formatCurrency(totalIngresos)}</p>
          <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-2">
            <ArrowUpRight className="h-3 w-3" /> +12.5% vs semestre anterior
          </p>
        </div>
        
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-neutral-400">Gastos Operativos</p>
            <div className="p-2 bg-red-500/10 rounded-lg"><CreditCard className="h-4 w-4 text-red-400" /></div>
          </div>
          <p className="text-2xl font-black text-white">{formatCurrency(totalGastos)}</p>
          <p className="text-xs text-red-400 font-medium flex items-center gap-1 mt-2">
            <ArrowUpRight className="h-3 w-3" /> +5.2% vs semestre anterior
          </p>
        </div>

        <div className="bg-neutral-950 border border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-2 relative z-10">
            <p className="text-sm font-medium text-neutral-400">Margen Neto</p>
            <div className="p-2 bg-emerald-500/20 rounded-lg"><TrendingUp className="h-4 w-4 text-emerald-400" /></div>
          </div>
          <p className="text-2xl font-black text-emerald-400 relative z-10">{formatCurrency(margenNeto)}</p>
          <div className="flex items-center gap-2 mt-2 relative z-10">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-md">
              {margenPorcentaje.toFixed(1)}% Rentabilidad
            </span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart - Evolución */}
        <div className="lg:col-span-2 bg-neutral-950 border border-neutral-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-6">Evolución Ingresos vs Gastos</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="month" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000000}M`} />
                <Tooltip 
                  cursor={{ fill: '#171717' }}
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '12px' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gastos" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Distribución Gastos */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-2">Distribución de Gastos</h3>
          <div className="h-[220px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={EXPENSES_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {EXPENSES_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '12px' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Total</span>
              <span className="text-sm font-bold text-white">
                ${(EXPENSES_DATA.reduce((a, b) => a + b.value, 0) / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-4 space-y-2">
            {EXPENSES_DATA.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-neutral-300">{item.name}</span>
                </div>
                <span className="font-medium text-neutral-400">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
