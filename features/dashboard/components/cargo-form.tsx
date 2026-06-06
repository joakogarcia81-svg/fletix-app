'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLogisticsStore } from '@/store/use-logistics-store';
import { Cargo, CargoStatus } from '@/types/logistics';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const cargoSchema = z.object({
  descripcion: z.string().min(3, 'Mínimo 3 caracteres'),
  tipoCarga: z.string().min(2, 'Especificar tipo de carga'),
  pesoKg: z.number().min(1, 'Debe ser mayor a 0'),
  tarifaARS: z.number().min(1, 'Debe ser mayor a 0'),
  fechaSalida: z.string().min(1, 'Fecha requerida'),
  fechaEntregaEstimada: z.string().min(1, 'Fecha requerida'),
  estado: z.enum(['DISPONIBLE', 'RESERVADO', 'ASIGNADO', 'CARGANDO', 'CARGADO', 'EN_RUTA', 'DETENIDO', 'ARRIBADO', 'DESCARGANDO', 'ENTREGADO', 'CANCELADO']),
  remitente: z.string().min(2, 'Especificar remitente'),
  origen: z.string().min(2, 'Especificar origen'),
  destino: z.string().min(2, 'Especificar destino'),
  distanciaKm: z.number().min(1, 'Debe ser mayor a 0'),
});

type CargoFormValues = z.infer<typeof cargoSchema>;

interface CargoFormProps {
  cargo?: Cargo | null;
  onSuccess: () => void;
}

export function CargoForm({ cargo, onSuccess }: CargoFormProps) {
  const { addCargo, updateCargo } = useLogisticsStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CargoFormValues>({
    resolver: zodResolver(cargoSchema),
    defaultValues: cargo
      ? {
          descripcion: cargo.descripcion,
          tipoCarga: cargo.tipoCarga,
          pesoKg: cargo.pesoKg,
          tarifaARS: cargo.tarifaARS,
          fechaSalida: cargo.fechaSalida,
          fechaEntregaEstimada: cargo.fechaEntregaEstimada,
          estado: cargo.estado,
          remitente: cargo.remitente,
          origen: cargo.ruta.origen,
          destino: cargo.ruta.destino,
          distanciaKm: cargo.ruta.distanciaKm,
        }
      : {
          descripcion: '',
          tipoCarga: '',
          pesoKg: 0,
          tarifaARS: 0,
          fechaSalida: '',
          fechaEntregaEstimada: '',
          estado: 'DISPONIBLE',
          remitente: '',
          origen: '',
          destino: '',
          distanciaKm: 0,
        },
  });

  const onSubmit = (data: CargoFormValues) => {
    const payload = {
      descripcion: data.descripcion,
      tipoCarga: data.tipoCarga,
      pesoKg: data.pesoKg,
      tarifaARS: data.tarifaARS,
      fechaSalida: data.fechaSalida,
      fechaEntregaEstimada: data.fechaEntregaEstimada,
      estado: data.estado,
      remitente: data.remitente,
      ruta: {
        origen: data.origen,
        destino: data.destino,
        distanciaKm: data.distanciaKm,
      },
    };

    if (cargo) {
      updateCargo(cargo.id, payload);
    } else {
      addCargo(payload);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
      <div>
        <label className="block text-neutral-400 font-semibold mb-1">Descripción</label>
        <Input {...register('descripcion')} placeholder="e.g. Pallets de Harina" />
        {errors.descripcion && (
          <span className="text-red-500 mt-1 block">{errors.descripcion.message}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Tipo de Carga</label>
          <Input {...register('tipoCarga')} placeholder="e.g. Alimento / Palletizado" />
          {errors.tipoCarga && (
            <span className="text-red-500 mt-1 block">{errors.tipoCarga.message}</span>
          )}
        </div>
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Remitente (Empresa)</label>
          <Input {...register('remitente')} placeholder="e.g. Molinos Cañuelas" />
          {errors.remitente && (
            <span className="text-red-500 mt-1 block">{errors.remitente.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Peso (Kg)</label>
          <Input type="number" {...register('pesoKg', { valueAsNumber: true })} />
          {errors.pesoKg && (
            <span className="text-red-500 mt-1 block">{errors.pesoKg.message}</span>
          )}
        </div>
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Tarifa (ARS)</label>
          <Input type="number" {...register('tarifaARS', { valueAsNumber: true })} />
          {errors.tarifaARS && (
            <span className="text-red-500 mt-1 block">{errors.tarifaARS.message}</span>
          )}
        </div>
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Estado</label>
          <select
            {...register('estado')}
            className="flex h-9 w-full rounded-lg border border-neutral-200/10 dark:border-neutral-800/60 bg-neutral-950/5 dark:bg-neutral-950/40 px-3 py-1 text-neutral-800 dark:text-neutral-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-500 transition-all"
          >
            <option value="DISPONIBLE">DISPONIBLE</option>
            <option value="RESERVADO">RESERVADO</option>
            <option value="ASIGNADO">ASIGNADO</option>
            <option value="CARGANDO">CARGANDO</option>
            <option value="CARGADO">CARGADO</option>
            <option value="EN_RUTA">EN RUTA</option>
            <option value="DETENIDO">DETENIDO</option>
            <option value="ARRIBADO">ARRIBADO</option>
            <option value="DESCARGANDO">DESCARGANDO</option>
            <option value="ENTREGADO">ENTREGADO</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Origen</label>
          <Input {...register('origen')} placeholder="e.g. Rosario, SF" />
          {errors.origen && (
            <span className="text-red-500 mt-1 block">{errors.origen.message}</span>
          )}
        </div>
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Destino</label>
          <Input {...register('destino')} placeholder="e.g. Salta, SA" />
          {errors.destino && (
            <span className="text-red-500 mt-1 block">{errors.destino.message}</span>
          )}
        </div>
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Distancia (Km)</label>
          <Input type="number" {...register('distanciaKm', { valueAsNumber: true })} />
          {errors.distanciaKm && (
            <span className="text-red-500 mt-1 block">{errors.distanciaKm.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Fecha Salida</label>
          <Input type="date" {...register('fechaSalida')} />
          {errors.fechaSalida && (
            <span className="text-red-500 mt-1 block">{errors.fechaSalida.message}</span>
          )}
        </div>
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Entrega Estimada</label>
          <Input type="date" {...register('fechaEntregaEstimada')} />
          {errors.fechaEntregaEstimada && (
            <span className="text-red-500 mt-1 block">{errors.fechaEntregaEstimada.message}</span>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" className="w-full sm:w-auto">
          {cargo ? 'Actualizar Carga' : 'Registrar Carga'}
        </Button>
      </div>
    </form>
  );
}
