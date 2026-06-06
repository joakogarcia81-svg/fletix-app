'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import { OperationalStatus, STATUS_CONFIG } from '@/types/fleet';
import { useToast } from '@/components/ui/toast';
import { Loader2, Truck, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TruckFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const TRUCK_TYPES = ['Sider', 'Chasis', 'Tolva', 'Furgón', 'Plataforma', 'Tanque', 'Refrigerado', 'Carretón'];

export function TruckForm({ onSuccess, onClose }: TruckFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [form, setForm] = React.useState({
    patent: '',
    brand: '',
    model: '',
    year: '',
    type: 'Sider',
    capacity_kg: '',
    operational_status: 'disponible' as OperationalStatus,
  });

  const supabase = createClient();
  const { showToast } = useToast();

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patent || !form.capacity_kg) return;

    setIsSubmitting(true);

    // Get user's company
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showToast('Error de autenticación', 'error');
      setIsSubmitting(false);
      return;
    }

    const { data: membershipData } = await supabase
      .from('memberships')
      .select('company_id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    const companyId = membershipData?.company_id;
    if (!companyId) {
      showToast('No se encontró tu empresa', 'error');
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from('trucks').insert({
      company_id: companyId,
      patent: form.patent.toUpperCase(),
      brand: form.brand || null,
      model: form.model || null,
      year: form.year ? parseInt(form.year) : null,
      type: form.type,
      capacity_kg: parseFloat(form.capacity_kg),
      operational_status: form.operational_status,
      status: 'active',
    });

    if (error) {
      showToast(error.message.includes('unique') ? 'Esa patente ya existe' : 'Error al guardar', 'error');
    } else {
      showToast('Vehículo registrado exitosamente', 'success');
      onSuccess();
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <Truck className="h-5 w-5 text-emerald-500" />
          </div>
          <h2 className="text-lg font-black text-white">Alta de Vehículo</h2>
        </div>
        <button type="button" onClick={onClose} className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Patente */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Patente *</label>
        <input
          type="text"
          required
          maxLength={10}
          value={form.patent}
          onChange={(e) => handleChange('patent', e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white font-bold uppercase text-lg tracking-wider focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          placeholder="AA 123 BB"
        />
      </div>

      {/* Marca / Modelo / Año */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Marca</label>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            placeholder="Ej: Scania"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Modelo</label>
          <input
            type="text"
            value={form.model}
            onChange={(e) => handleChange('model', e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            placeholder="Ej: R450"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Año</label>
          <input
            type="number"
            min={1990}
            max={2030}
            value={form.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            placeholder="2024"
          />
        </div>
      </div>

      {/* Tipo y Capacidad */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Tipo de Unidad *</label>
          <select
            value={form.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-emerald-500"
          >
            {TRUCK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Capacidad (kg) *</label>
          <input
            type="number"
            required
            min={0}
            step={100}
            value={form.capacity_kg}
            onChange={(e) => handleChange('capacity_kg', e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            placeholder="28000"
          />
        </div>
      </div>

      {/* Estado Operativo Inicial */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Estado Operativo Inicial</label>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(STATUS_CONFIG) as [OperationalStatus, typeof STATUS_CONFIG[OperationalStatus]][]).map(([status, config]) => (
            <button
              key={status}
              type="button"
              onClick={() => handleChange('operational_status', status)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                form.operational_status === status
                  ? `${config.bg} ${config.color} border-current shadow-sm`
                  : "bg-neutral-900 text-neutral-500 border-neutral-800 hover:border-neutral-700"
              )}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !form.patent || !form.capacity_kg}
        className={cn(
          "w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
          isSubmitting || !form.patent || !form.capacity_kg
            ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
            : "bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.08)]"
        )}
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
        Registrar Vehículo
      </button>
    </form>
  );
}
