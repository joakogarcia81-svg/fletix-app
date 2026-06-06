'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, DollarSign, Calendar } from 'lucide-react';
import { CardModern } from '@/components/ui/card-modern';
import { formatARSCompact } from '@/lib/formatters';

// Billing trend data (Last 6 Months in Argentina)
const trendData = [
  { label: 'Ene', value: 12400000 },
  { label: 'Feb', value: 14200000 },
  { label: 'Mar', value: 13900000 },
  { label: 'Abr', value: 16500000 },
  { label: 'May', value: 18200000 },
  { label: 'Jun', value: 21000000 },
];

export function ReportCharts() {
  const maxVal = Math.max(...trendData.map((d) => d.value));

  // Calculate SVG Line Path coordinates
  const width = 500;
  const height = 150;
  const padding = 30;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = trendData.map((d, i) => {
    const x = padding + (i / (trendData.length - 1)) * chartWidth;
    const y = padding + chartHeight - (d.value / maxVal) * chartHeight;
    return { x, y, label: d.label, val: d.value };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Line Chart */}
      <CardModern glowColor="blue" className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-black tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
              Tendencia de Ingresos (ARS)
            </h4>
            <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">
              Facturación Mensual Consolidada
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +15.4% Q2
          </span>
        </div>

        {/* SVG Line Chart */}
        <div className="relative w-full h-[160px] flex items-center justify-center">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => (
              <line
                key={idx}
                x1={padding}
                y1={padding + chartHeight * r}
                x2={width - padding}
                y2={padding + chartHeight * r}
                className="stroke-neutral-200/20 dark:stroke-neutral-800/40"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            ))}

            {/* Area Fill */}
            <motion.path
              d={areaPath}
              fill="url(#blue-gradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ duration: 0.8 }}
            />

            {/* Line Path */}
            <motion.path
              d={linePath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={3}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />

            {/* Interactive Circles */}
            {points.map((p, idx) => (
              <g key={idx} className="group/dot">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={5}
                  className="fill-blue-500 stroke-white dark:stroke-neutral-950 transition-all group-hover/dot:r-7"
                  strokeWidth={2}
                />
                <text
                  x={p.x}
                  y={height - 8}
                  textAnchor="middle"
                  className="text-[9px] fill-neutral-400 dark:fill-neutral-500 font-bold"
                >
                  {p.label}
                </text>
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  className="text-[8px] fill-neutral-800 dark:fill-neutral-100 font-black opacity-0 group-hover/dot:opacity-100 transition-opacity bg-neutral-900 px-1 py-0.5 rounded"
                >
                  {formatARSCompact(p.val)}
                </text>
              </g>
            ))}

            {/* Gradients */}
            <defs>
              <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </CardModern>

      {/* Doughnut segment breakdown */}
      <CardModern glowColor="neutral">
        <h4 className="text-xs font-black tracking-wider text-neutral-400 dark:text-neutral-500 uppercase mb-4">
          Distribución de Flota
        </h4>
        <div className="space-y-4">
          {[
            { type: 'Semirremolques Sider', count: 18, pct: 47, color: 'bg-blue-500' },
            { type: 'Tolvas Cerealeras', count: 10, pct: 26, color: 'bg-emerald-500' },
            { type: 'Chasis Acoplados', count: 6, pct: 16, color: 'bg-amber-500' },
            { type: 'Refrigerados / Mosquito', count: 4, pct: 11, color: 'bg-purple-500' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1.5 text-xs">
              <div className="flex justify-between font-semibold text-neutral-700 dark:text-neutral-300">
                <span>{item.type}</span>
                <span>
                  {item.count} ud. ({item.pct}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200/20 dark:bg-neutral-800/40 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`h-full ${item.color} rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-neutral-200/10 grid grid-cols-2 gap-2 text-[10px] text-neutral-400 font-semibold">
          <div className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-amber-500" />
            92% Eficiencia
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
            $1.4K ARS/Km prom.
          </div>
        </div>
      </CardModern>
    </div>
  );
}
