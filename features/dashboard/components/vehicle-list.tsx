'use client';

import * as React from 'react';
import { Truck, Scale, Tag, Edit, Trash2 } from 'lucide-react';
import { useUiStore } from '@/store/use-ui-store';
import { useLogisticsStore } from '@/store/use-logistics-store';
import { Vehicle } from '@/types/logistics';
import { CardModern } from '@/components/ui/card-modern';
import { SkeletonLoader } from '@/components/ui/skeleton-loader';
import { Button } from '@/components/ui/button';
import { formatTonnes } from '@/lib/formatters';

interface VehicleListProps {
  onEdit?: (vehicle: Vehicle) => void;
}

export function VehicleList({ onEdit }: VehicleListProps) {
  const { searchQuery } = useUiStore();
  const { vehiculos, deleteVehicle } = useLogisticsStore();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredVehicles = vehiculos.filter((v) => {
    const query = searchQuery.toLowerCase();
    return (
      v.patente.toLowerCase().includes(query) ||
      v.marca.toLowerCase().includes(query) ||
      v.modelo.toLowerCase().includes(query) ||
      v.tipo.toLowerCase().includes(query)
    );
  });

  if (loading) return <SkeletonLoader count={3} variant="rect" className="h-24" />;

  return (
    <div className="space-y-4">
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-neutral-200/10 rounded-xl">
          <p className="text-xs text-neutral-400">No se encontraron vehículos registrados.</p>
        </div>
      ) : (
        filteredVehicles.map((vehicle) => (
          <CardModern
            key={vehicle.id}
            glowColor="neutral"
            animated={true}
            className="border-l-2 border-l-neutral-400 dark:border-l-neutral-700"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center shrink-0 border border-neutral-200/10 text-neutral-600 dark:text-neutral-300">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
                    {vehicle.marca} {vehicle.modelo}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-neutral-400">
                    <span className="font-mono bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-200/10 text-neutral-600 dark:text-neutral-300 font-bold uppercase">
                      {vehicle.patente}
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" /> {vehicle.tipo}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-200/10">
                <div className="flex flex-col items-start sm:items-end gap-1">
                  <span className="text-[10px] text-neutral-400">Capacidad Tara</span>
                  <span className="text-xs font-black text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                    <Scale className="h-3.5 w-3.5 text-neutral-500" />
                    {formatTonnes(vehicle.capacidadKg)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {onEdit && (
                    <Button variant="outline" size="xs" onClick={() => onEdit(vehicle)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="xs"
                    onClick={() => {
                      if (confirm(`¿Eliminar vehículo patente ${vehicle.patente}?`)) {
                        deleteVehicle(vehicle.id);
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
