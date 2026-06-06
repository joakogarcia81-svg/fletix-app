'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Truck, MapPin, Calendar, DollarSign, Weight, Save, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

const AUTOSAVE_KEY = 'fletix_trip_draft';

const publishTripSchema = z.object({
  origen: z.string().min(2, 'Origen es requerido'),
  destino: z.string().min(2, 'Destino es requerido'),
  provincia: z.string().min(2, 'Provincia es requerida'),
  rubro: z.string().min(2, 'Rubro es requerido'),
  toneladas: z.number().min(0.1, 'Debe ser mayor a 0'),
  tarifaARS: z.number().min(1000, 'Tarifa mínima 1000 ARS'),
  fechaCarga: z.string().min(1, 'Fecha requerida'),
  fechaDescarga: z.string().min(1, 'Fecha requerida'),
  observaciones: z.string().optional(),
  tipoCamion: z.enum(['SIDER', 'CHASIS', 'ACOPLADO', 'MOSQUITO', 'TOLVA', 'REFRIGERADO']),
  cantidadCamiones: z.number().min(1, 'Mínimo 1 camión'),
  cargaParcial: z.boolean(),
  visibilidad: z.enum(['PUBLICO', 'PRIVADO']),
});

type PublishTripValues = z.infer<typeof publishTripSchema>;

const defaultValues: PublishTripValues = {
  origen: '',
  destino: '',
  provincia: '',
  rubro: '',
  toneladas: 0,
  tarifaARS: 0,
  fechaCarga: '',
  fechaDescarga: '',
  observaciones: '',
  tipoCamion: 'SIDER',
  cantidadCamiones: 1,
  cargaParcial: false,
  visibilidad: 'PUBLICO',
};

export function PublishTripForm({ onSuccess }: { onSuccess: () => void }) {
  const { showToast } = useToast();
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PublishTripValues>({
    resolver: zodResolver(publishTripSchema),
    defaultValues,
  });

  // Load from local storage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        reset(parsed);
      } catch (e) {
        console.error('Failed to parse autosave data', e);
      }
    }
    setIsHydrated(true);
  }, [reset]);

  // Autosave mechanism
  const formValues = watch();
  React.useEffect(() => {
    if (!isHydrated) return;
    
    const timeoutId = setTimeout(() => {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(formValues));
      setLastSaved(new Date());
    }, 1000); // 1s debounce

    return () => clearTimeout(timeoutId);
  }, [formValues, isHydrated]);

  const onSubmit = async (data: PublishTripValues) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Trip Published:', data);
      
      // Clear draft
      localStorage.removeItem(AUTOSAVE_KEY);
      
      showToast('Viaje publicado en el Marketplace.', 'success');
      
      onSuccess();
    } catch (error) {
      showToast('No se pudo publicar el viaje.', 'error');
    }
  };

  if (!isHydrated) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      {/* Header with Autosave Status */}
      <div className="flex items-center justify-between border-b border-neutral-800/60 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Publicar Nuevo Viaje</h2>
          <p className="text-sm text-neutral-400">Completa los detalles para ofertar la carga.</p>
        </div>
        {lastSaved && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 bg-neutral-900/50 px-3 py-1.5 rounded-full border border-neutral-800/60">
            <Save className="h-3.5 w-3.5" />
            Borrador guardado {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SECTION: Ruta */}
        <div className="space-y-4 p-5 rounded-2xl bg-neutral-900/30 border border-neutral-800/40">
          <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2 mb-2 uppercase tracking-wider">
            <MapPin className="h-4 w-4" /> 1. Ruta y Fechas
          </h3>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400">Origen</label>
            <Input {...register('origen')} placeholder="Ej. Rosario, Santa Fe" />
            {errors.origen && <span className="text-[10px] text-red-500">{errors.origen.message}</span>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400">Destino</label>
            <Input {...register('destino')} placeholder="Ej. Córdoba Capital" />
            {errors.destino && <span className="text-[10px] text-red-500">{errors.destino.message}</span>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400">Provincia (Filtro Principal)</label>
            <Input {...register('provincia')} placeholder="Ej. Santa Fe" />
            {errors.provincia && <span className="text-[10px] text-red-500">{errors.provincia.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400">Fecha Carga</label>
              <Input type="date" {...register('fechaCarga')} />
              {errors.fechaCarga && <span className="text-[10px] text-red-500">{errors.fechaCarga.message}</span>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400">Fecha Descarga</label>
              <Input type="date" {...register('fechaDescarga')} />
              {errors.fechaDescarga && <span className="text-[10px] text-red-500">{errors.fechaDescarga.message}</span>}
            </div>
          </div>
        </div>

        {/* SECTION: Detalles de Carga */}
        <div className="space-y-4 p-5 rounded-2xl bg-neutral-900/30 border border-neutral-800/40">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-2 uppercase tracking-wider">
            <Weight className="h-4 w-4" /> 2. Especificaciones
          </h3>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400">Rubro / Mercadería</label>
            <Input {...register('rubro')} placeholder="Ej. Alimentos, Siderurgia..." />
            {errors.rubro && <span className="text-[10px] text-red-500">{errors.rubro.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400">Toneladas (Tn)</label>
              <Input type="number" step="0.1" {...register('toneladas', { valueAsNumber: true })} />
              {errors.toneladas && <span className="text-[10px] text-red-500">{errors.toneladas.message}</span>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400">Cant. Camiones</label>
              <Input type="number" {...register('cantidadCamiones', { valueAsNumber: true })} />
              {errors.cantidadCamiones && <span className="text-[10px] text-red-500">{errors.cantidadCamiones.message}</span>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400">Tipo de Camión Requerido</label>
            <select
              {...register('tipoCamion')}
              className="w-full h-10 px-3 bg-neutral-950/50 border border-neutral-800 rounded-lg text-sm text-neutral-200 focus:ring-2 focus:ring-blue-500/50 outline-none"
            >
              <option value="SIDER">Sider</option>
              <option value="CHASIS">Chasis</option>
              <option value="ACOPLADO">Acoplado</option>
              <option value="TOLVA">Tolva</option>
              <option value="REFRIGERADO">Refrigerado</option>
              <option value="MOSQUITO">Mosquito (Autos)</option>
            </select>
            {errors.tipoCamion && <span className="text-[10px] text-red-500">{errors.tipoCamion.message}</span>}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-950/50 border border-neutral-800/60 mt-2">
            <span className="text-sm font-semibold text-neutral-300">¿Es carga parcial (LTL)?</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...register('cargaParcial')} className="sr-only peer" />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

      </div>

      {/* SECTION: Finanzas & Visibilidad */}
      <div className="space-y-4 p-5 rounded-2xl bg-neutral-900/30 border border-neutral-800/40">
        <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-2 uppercase tracking-wider">
          <DollarSign className="h-4 w-4" /> 3. Oferta y Visibilidad
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400">Tarifa Ofrecida (ARS)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-neutral-500 font-bold">$</span>
              <Input type="number" className="pl-8 text-emerald-400 font-bold text-lg h-12" {...register('tarifaARS', { valueAsNumber: true })} />
            </div>
            {errors.tarifaARS && <span className="text-[10px] text-red-500">{errors.tarifaARS.message}</span>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400">Privacidad del Viaje</label>
            <div className="flex p-1 bg-neutral-950/50 rounded-lg border border-neutral-800/60 h-12">
              <button
                type="button"
                onClick={() => setValue('visibilidad', 'PUBLICO')}
                className={`flex-1 rounded-md text-sm font-bold transition-all ${watch('visibilidad') === 'PUBLICO' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                Marketplace (Público)
              </button>
              <button
                type="button"
                onClick={() => setValue('visibilidad', 'PRIVADO')}
                className={`flex-1 rounded-md text-sm font-bold transition-all ${watch('visibilidad') === 'PRIVADO' ? 'bg-neutral-700 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                Flota Propia (Privado)
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-neutral-400">Observaciones (Opcional)</label>
          <textarea
            {...register('observaciones')}
            rows={2}
            className="w-full p-3 bg-neutral-950/50 border border-neutral-800/60 rounded-xl text-sm text-neutral-200 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none"
            placeholder="Requisitos especiales de carga, horarios estrictos, etc."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800/60">
        <Button type="button" variant="ghost" onClick={() => reset(defaultValues)}>
          Limpiar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[150px] font-bold text-sm bg-white text-black hover:bg-neutral-200">
          {isSubmitting ? 'Publicando...' : 'Publicar Viaje'}
        </Button>
      </div>

    </form>
  );
}
