'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Truck, Users, Landmark, AlertTriangle } from 'lucide-react';
import { CardModern } from '@/components/ui/card-modern';

interface StatItem {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ComponentType<any>;
  accent: 'blue' | 'red' | 'neutral';
}

const stats: StatItem[] = [
  {
    title: 'Viajes Activos',
    value: '24',
    change: '+12% este mes',
    isPositive: true,
    icon: Truck,
    accent: 'blue',
  },
  {
    title: 'Tarifa Facturada (ARS)',
    value: '$18.2M',
    change: '+8.4% vs prev',
    isPositive: true,
    icon: Landmark,
    accent: 'neutral',
  },
  {
    title: 'Choferes Activos',
    value: '38 / 42',
    change: '90% ocupación',
    isPositive: true,
    icon: Users,
    accent: 'neutral',
  },
  {
    title: 'Alertas de Ruta',
    value: '2',
    change: 'Demora en RN 9',
    isPositive: false,
    icon: AlertTriangle,
    accent: 'red',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function StatsGrid() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <CardModern
            key={index}
            glowColor={stat.accent}
            animated={false}
            className="relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300"
          >
            {/* Visual background gradient accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-neutral-200/5 to-transparent dark:from-neutral-800/10 pointer-events-none rounded-bl-full" />

            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  {stat.title}
                </p>
                <h4 className="text-2xl font-black mt-2 tracking-tight text-neutral-800 dark:text-neutral-50">
                  {stat.value}
                </h4>
              </div>
              <div
                className={`p-2.5 rounded-lg border ${
                  stat.accent === 'blue'
                    ? 'border-blue-500/20 bg-blue-500/5 text-blue-500'
                    : stat.accent === 'red'
                      ? 'border-red-500/20 bg-red-500/5 text-red-500'
                      : 'border-neutral-200/10 dark:border-neutral-800/60 bg-neutral-100/50 dark:bg-neutral-900/40 text-neutral-500'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-4">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  stat.isPositive
                    ? 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300'
                    : 'bg-red-500/10 text-red-500'
                }`}
              >
                {stat.change}
              </span>
            </div>
          </CardModern>
        );
      })}
    </motion.div>
  );
}
