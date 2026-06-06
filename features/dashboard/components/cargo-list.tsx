'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  CircleDollarSign,
  ArrowRight,
  ShieldCheck,
  Tag,
  Edit,
  Trash2,
} from 'lucide-react';
import { useUiStore } from '@/store/use-ui-store';
import { useLogisticsStore } from '@/store/use-logistics-store';
import { Cargo } from '@/types/logistics';
import { CardModern } from '@/components/ui/card-modern';
import { SkeletonLoader } from '@/components/ui/skeleton-loader';
import { Button } from '@/components/ui/button';
import { formatARS, formatTonnes } from '@/lib/formatters';

interface CargoListProps {
  onEdit?: (cargo: Cargo) => void;
}

export function CargoList({ onEdit }: CargoListProps) {
  const { searchQuery, selectedCargoId, setSelectedCargoId } = useUiStore();
  const { cargas, deleteCargo } = useLogisticsStore();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredCargas = cargas.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.id.toLowerCase().includes(query) ||
      c.descripcion.toLowerCase().includes(query) ||
      c.ruta.origen.toLowerCase().includes(query) ||
      c.ruta.destino.toLowerCase().includes(query) ||
      c.remitente.toLowerCase().includes(query)
    );
  });

  const statusColors: Record<string, string> = {
    DISPONIBLE: 'border-neutral-500/20 bg-neutral-500/5 text-neutral-500',
    RESERVADO: 'border-amber-500/20 bg-amber-500/5 text-amber-500',
    ASIGNADO: 'border-blue-500/20 bg-blue-500/5 text-blue-500',
    CARGANDO: 'border-purple-500/20 bg-purple-500/5 text-purple-500',
    CARGADO: 'border-purple-600/30 bg-purple-600/10 text-purple-600',
    EN_RUTA: 'border-blue-600/30 bg-blue-600/5 text-blue-600 font-bold',
    DETENIDO: 'border-orange-500/30 bg-orange-500/10 text-orange-500 font-bold',
    ARRIBADO: 'border-teal-500/30 bg-teal-500/10 text-teal-500',
    DESCARGANDO: 'border-teal-600/30 bg-teal-600/10 text-teal-600',
    ENTREGADO: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500',
    CANCELADO: 'border-red-500/20 bg-red-500/5 text-red-500',
  };

  if (loading) return <SkeletonLoader count={3} variant="rect" className="h-32" />;

  return (
    <div className="space-y-4">
      {filteredCargas.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-neutral-200/10 rounded-xl">
          <p className="text-xs text-neutral-400">
            No se encontraron cargas con los filtros actuales.
          </p>
        </div>
      ) : (
        filteredCargas.map((cargo) => (
          <div
            key={cargo.id}
            onClick={() => setSelectedCargoId(selectedCargoId === cargo.id ? null : cargo.id)}
            className="cursor-pointer"
          >
            <CardModern
              glowColor={cargo.estado === 'EN_RUTA' ? 'blue' : 'neutral'}
              className={`border-l-2 transition-all ${
                cargo.estado === 'EN_RUTA'
                  ? 'border-l-blue-500'
                  : cargo.estado === 'DISPONIBLE'
                    ? 'border-l-neutral-400'
                    : 'border-l-red-500'
              } ${selectedCargoId === cargo.id ? 'ring-1 ring-neutral-400 dark:ring-neutral-700' : ''}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black tracking-wider text-neutral-400 dark:text-neutral-500">
                      {cargo.id}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColors[cargo.estado]}`}
                    >
                      {cargo.estado.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-neutral-200/10 bg-neutral-100/5 dark:bg-neutral-900/50 text-neutral-400 flex items-center gap-1">
                      <Tag className="h-2.5 w-2.5" />
                      {cargo.tipoCarga}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
                    {cargo.descripcion}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-neutral-700 dark:text-neutral-300">
                      <MapPin className="h-3.5 w-3.5 text-blue-500" />
                      {cargo.ruta.origen}
                    </span>
                    <ArrowRight className="h-3 w-3 text-neutral-400 shrink-0" />
                    <span className="flex items-center gap-1 font-semibold text-neutral-700 dark:text-neutral-300">
                      <MapPin className="h-3.5 w-3.5 text-red-500" />
                      {cargo.ruta.destino}
                    </span>
                    <span className="text-neutral-400">({cargo.ruta.distanciaKm} km)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-neutral-200/10">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] text-neutral-400 block">Tarifa Ofrecida</span>
                    <span className="text-base font-black text-neutral-900 dark:text-neutral-50 flex items-center gap-1 lg:justify-end">
                      <CircleDollarSign className="h-4 w-4 text-emerald-500" />
                      {formatARS(cargo.tarifaARS)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400 border border-neutral-200/10 rounded-lg p-2 bg-neutral-50 dark:bg-neutral-900/30">
                    <Calendar className="h-3.5 w-3.5" />
                    <div>
                      <span className="block text-neutral-500">Salida</span>
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                        {cargo.fechaSalida}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedCargoId === cargo.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 pt-4 border-t border-neutral-200/10 text-xs text-neutral-500 flex flex-col md:flex-row md:items-end justify-between gap-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                    <div>
                      <span className="block font-semibold text-neutral-400">Remitente</span>
                      <span className="text-neutral-800 dark:text-neutral-200 font-bold flex items-center gap-1.5 mt-1">
                        <ShieldCheck className="h-4 w-4 text-blue-500" />
                        {cargo.remitente}
                      </span>
                    </div>
                    <div>
                      <span className="block font-semibold text-neutral-400">Especificaciones</span>
                      <span className="text-neutral-800 dark:text-neutral-200 font-semibold mt-1 block">
                        Peso: {formatTonnes(cargo.pesoKg)}
                      </span>
                    </div>
                    <div>
                      <span className="block font-semibold text-neutral-400">Entrega Estimada</span>
                      <span className="text-neutral-800 dark:text-neutral-200 font-semibold mt-1 block">
                        {cargo.fechaEntregaEstimada}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(cargo);
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" /> Editar
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('¿Está seguro de eliminar esta carga?')) {
                          deleteCargo(cargo.id);
                        }
                      }}
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Eliminar
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardModern>
          </div>
        ))
      )}
    </div>
  );
}
