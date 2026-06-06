'use client';

import * as React from 'react';
import { Client, INDUSTRIES } from '@/types/clients';
import { Loader2, Building2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientFormProps {
  onSubmit: (client: Partial<Client>) => Promise<boolean>;
  onClose: () => void;
}

export function ClientForm({ onSubmit, onClose }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [form, setForm] = React.useState({
    business_name: '',
    cuit: '',
    phone: '',
    email: '',
    industry: '',
    address: '',
    city: '',
    province: '',
    notes: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.business_name || !form.cuit) return;

    setIsSubmitting(true);
    const success = await onSubmit({
      business_name: form.business_name,
      cuit: form.cuit,
      phone: form.phone || undefined,
      email: form.email || undefined,
      industry: form.industry || undefined,
      notes: form.notes || undefined,
      location: (form.address || form.city || form.province) ? {
        address: form.address,
        city: form.city,
        province: form.province,
      } : undefined,
    });

    if (success) onClose();
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl">
            <Building2 className="h-5 w-5 text-blue-400" />
          </div>
          <h2 className="text-lg font-black text-white">Nuevo Cliente</h2>
        </div>
        <button type="button" onClick={onClose} className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Razón Social & CUIT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Razón Social *</label>
          <input
            required
            type="text"
            value={form.business_name}
            onChange={(e) => handleChange('business_name', e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Ej: Transportes Pérez S.A."
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">CUIT *</label>
          <input
            required
            type="text"
            value={form.cuit}
            onChange={(e) => handleChange('cuit', e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="30-12345678-9"
          />
        </div>
      </div>

      {/* Contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Teléfono</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="+54 11 1234-5678"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="contacto@empresa.com"
          />
        </div>
      </div>

      {/* Rubro */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Rubro</label>
        <select
          value={form.industry}
          onChange={(e) => handleChange('industry', e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-blue-500"
        >
          <option value="">Seleccionar rubro...</option>
          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>

      {/* Ubicación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Dirección</label>
          <input type="text" value={form.address} onChange={(e) => handleChange('address', e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="Av. Corrientes 1234"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Ciudad</label>
          <input type="text" value={form.city} onChange={(e) => handleChange('city', e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="Buenos Aires"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Provincia</label>
          <input type="text" value={form.province} onChange={(e) => handleChange('province', e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="CABA"
          />
        </div>
      </div>

      {/* Observaciones */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Observaciones</label>
        <textarea
          value={form.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white resize-none focus:outline-none focus:border-blue-500"
          placeholder="Notas internas sobre este cliente..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !form.business_name || !form.cuit}
        className={cn(
          "w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
          isSubmitting || !form.business_name || !form.cuit
            ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
            : "bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.08)]"
        )}
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Building2 className="h-4 w-4" />}
        Registrar Cliente
      </button>
    </form>
  );
}
