'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Phone,
  Star,
  FileText,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2,
} from 'lucide-react';
import { useUiStore } from '@/store/use-ui-store';
import { useLogisticsStore } from '@/store/use-logistics-store';
import { Driver } from '@/types/logistics';
import { CardModern } from '@/components/ui/card-modern';
import { SkeletonLoader } from '@/components/ui/skeleton-loader';
import { Button } from '@/components/ui/button';

interface DriverListProps {
  onEdit?: (driver: Driver) => void;
}

export function DriverList({ onEdit }: DriverListProps) {
  const { searchQuery } = useUiStore();
  const { choferes, deleteDriver } = useLogisticsStore();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredDrivers = choferes.filter((d) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${d.nombre} ${d.apellido}`.toLowerCase();
    return fullName.includes(query) || d.cuit.includes(query) || d.telefono.includes(query);
  });

  if (loading) return <SkeletonLoader count={3} variant="rect" className="h-24" />;

  return (
    <div className="space-y-4">
      {filteredDrivers.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-neutral-200/10 rounded-xl">
          <p className="text-xs text-neutral-400">No se encontraron choferes registrados.</p>
        </div>
      ) : (
        filteredDrivers.map((driver) => (
          <CardModern
            key={driver.id}
            glowColor={driver.licenciaLinti ? 'neutral' : 'red'}
            animated={true}
            className="border-l-2 border-l-neutral-400 dark:border-l-neutral-700"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center shrink-0 border border-neutral-200/10 text-neutral-600 dark:text-neutral-300">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
                    {driver.apellido}, {driver.nombre}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-neutral-400">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" /> CUIT: {driver.cuit}
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {driver.telefono}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-200/10">
                <div className="flex flex-col items-start sm:items-end gap-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    {driver.reputacion.toFixed(1)} / 5.0
                  </div>

                  {driver.licenciaLinti ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-500">
                      <CheckCircle className="h-2.5 w-2.5" /> LINTI Habilitado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border border-red-500/20 bg-red-500/5 text-red-500">
                      <AlertTriangle className="h-2.5 w-2.5" /> LINTI Pendiente / Invalida
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {onEdit && (
                    <Button variant="outline" size="xs" onClick={() => onEdit(driver)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="xs"
                    onClick={() => {
                      if (confirm(`¿Eliminar al chofer ${driver.nombre} ${driver.apellido}?`)) {
                        deleteDriver(driver.id);
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardModern>
        ))
      )}
    </div>
  );
}
