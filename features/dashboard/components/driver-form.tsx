'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLogisticsStore } from '@/store/use-logistics-store';
import { Driver } from '@/types/logistics';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// CUIT regex for XX-XXXXXXXX-X formats (20, 23, 24, 27, 30, etc.)
const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;

const driverSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  cuit: z.string().regex(cuitRegex, 'CUIT inválido. Formato requerido: XX-XXXXXXXX-X'),
  licenciaLinti: z.boolean(),
  telefono: z.string().min(6, 'Teléfono debe tener al menos 6 caracteres'),
  reputacion: z.number().min(1, 'Mínimo 1').max(5, 'Máximo 5'),
});

type DriverFormValues = z.infer<typeof driverSchema>;

interface DriverFormProps {
  driver?: Driver | null;
  onSuccess: () => void;
}

export function DriverForm({ driver, onSuccess }: DriverFormProps) {
  const { addDriver, updateDriver } = useLogisticsStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: driver
      ? {
          nombre: driver.nombre,
          apellido: driver.apellido,
          cuit: driver.cuit,
          licenciaLinti: driver.licenciaLinti,
          telefono: driver.telefono,
          reputacion: driver.reputacion,
        }
      : {
          nombre: '',
          apellido: '',
          cuit: '',
          licenciaLinti: true,
          telefono: '',
          reputacion: 5.0,
        },
  });

  const onSubmit = (data: DriverFormValues) => {
    if (driver) {
      updateDriver(driver.id, data);
    } else {
      addDriver(data);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Nombre</label>
          <Input {...register('nombre')} placeholder="e.g. Juan Carlos" />
          {errors.nombre && (
            <span className="text-red-500 mt-1 block">{errors.nombre.message}</span>
          )}
        </div>
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Apellido</label>
          <Input {...register('apellido')} placeholder="e.g. Pérez" />
          {errors.apellido && (
            <span className="text-red-500 mt-1 block">{errors.apellido.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">CUIT</label>
          <Input {...register('cuit')} placeholder="e.g. 20-30456789-2" />
          {errors.cuit && <span className="text-red-500 mt-1 block">{errors.cuit.message}</span>}
        </div>
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Teléfono</label>
          <Input {...register('telefono')} placeholder="e.g. 11-4567-8901" />
          {errors.telefono && (
            <span className="text-red-500 mt-1 block">{errors.telefono.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-center pt-2">
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Reputación Inicial</label>
          <Input
            type="number"
            step="0.1"
            {...register('reputacion', { valueAsNumber: true })}
            placeholder="5.0"
          />
          {errors.reputacion && (
            <span className="text-red-500 mt-1 block">{errors.reputacion.message}</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="licenciaLinti"
            {...register('licenciaLinti')}
            className="rounded border-neutral-200/10 dark:border-neutral-800/60 bg-neutral-950/5 dark:bg-neutral-950/40 text-neutral-800 focus:ring-0 focus:ring-offset-0 h-4 w-4"
          />
          <label
            htmlFor="licenciaLinti"
            className="text-neutral-400 font-bold select-none cursor-pointer"
          >
            Licencia LINTI Habilitada
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" className="w-full sm:w-auto">
          {driver ? 'Actualizar Chofer' : 'Registrar Chofer'}
        </Button>
      </div>
    </form>
  );
}
