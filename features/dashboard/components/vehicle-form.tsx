'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLogisticsStore } from '@/store/use-logistics-store';
import { Vehicle, VehicleType } from '@/types/logistics';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Regex matching older patent (3 letters + 3 digits) or newer Mercosur patent (2 letters + 3 digits + 2 letters)
const patentRegex = /^(?:[a-zA-Z]{3}\d{3}|[a-zA-Z]{2}\d{3}[a-zA-Z]{2})$/;

const vehicleSchema = z.object({
  patente: z
    .string()
    .trim()
    .toUpperCase()
    .regex(patentRegex, 'Patente inválida. Ejemplos válidos: AAA123 o AA123AA'),
  marca: z.string().min(2, 'La marca debe tener al menos 2 caracteres'),
  modelo: z.string().min(1, 'El modelo debe tener al menos 1 carácter'),
  tipo: z.enum(['SIDER', 'CHASIS', 'ACOPLADO', 'MOSQUITO', 'TOLVA', 'REFRIGERADO']),
  capacidadKg: z.number().min(100, 'La capacidad mínima es de 100 kg'),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSuccess: () => void;
}

export function VehicleForm({ vehicle, onSuccess }: VehicleFormProps) {
  const { addVehicle, updateVehicle } = useLogisticsStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle
      ? {
          patente: vehicle.patente,
          marca: vehicle.marca,
          modelo: vehicle.modelo,
          tipo: vehicle.tipo,
          capacidadKg: vehicle.capacidadKg,
        }
      : {
          patente: '',
          marca: '',
          modelo: '',
          tipo: 'SIDER',
          capacidadKg: 28000,
        },
  });

  const onSubmit = (data: VehicleFormValues) => {
    // Standardize to uppercase before save
    const payload = {
      ...data,
      patente: data.patente.toUpperCase(),
    };

    if (vehicle) {
      updateVehicle(vehicle.id, payload);
    } else {
      addVehicle(payload);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Patente</label>
          <Input
            {...register('patente')}
            placeholder="e.g. AA123AA o AAA123"
            className="uppercase"
          />
          {errors.patente && (
            <span className="text-red-500 mt-1 block">{errors.patente.message}</span>
          )}
        </div>
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Tipo de Carrocería</label>
          <select
            {...register('tipo')}
            className="flex h-9 w-full rounded-lg border border-neutral-200/10 dark:border-neutral-800/60 bg-neutral-950/5 dark:bg-neutral-950/40 px-3 py-1 text-neutral-800 dark:text-neutral-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-500 transition-all"
          >
            <option value="SIDER">SIDER (Semirremolque)</option>
            <option value="CHASIS">CHASIS COMÚN</option>
            <option value="ACOPLADO">ACOPLADO</option>
            <option value="MOSQUITO">MOSQUITO</option>
            <option value="TOLVA">TOLVA (Cerealera)</option>
            <option value="REFRIGERADO">REFRIGERADO</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Marca</label>
          <Input {...register('marca')} placeholder="e.g. Scania" />
          {errors.marca && <span className="text-red-500 mt-1 block">{errors.marca.message}</span>}
        </div>
        <div>
          <label className="block text-neutral-400 font-semibold mb-1">Modelo</label>
          <Input {...register('modelo')} placeholder="e.g. R450" />
          {errors.modelo && (
            <span className="text-red-500 mt-1 block">{errors.modelo.message}</span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-neutral-400 font-semibold mb-1">
          Capacidad Carga Útil (Kg)
        </label>
        <Input
          type="number"
          {...register('capacidadKg', { valueAsNumber: true })}
          placeholder="e.g. 28000"
        />
        {errors.capacidadKg && (
          <span className="text-red-500 mt-1 block">{errors.capacidadKg.message}</span>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" className="w-full sm:w-auto">
          {vehicle ? 'Actualizar Vehículo' : 'Registrar Vehículo'}
        </Button>
      </div>
    </form>
  );
}
