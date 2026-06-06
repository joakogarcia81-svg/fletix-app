'use client';

import * as React from 'react';
import { Client, ClientMetrics } from '@/types/clients';
import { useClients } from '@/hooks/use-clients';
import { Building2, Truck, DollarSign, Star, Calendar, ArrowLeft, MapPin, Phone, Mail, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientDetailProps {
  client: Client;
  onBack: () => void;
}

export function ClientDetail({ client, onBack }: ClientDetailProps) {
  const { getClientMetrics } = useClients();
  const [metrics, setMetrics] = React.useState<ClientMetrics | null>(null);

  React.useEffect(() => {
    getClientMetrics(client.id).then(setMetrics);
  }, [client.id, getClientMetrics]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Volver al listado
        </button>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-neutral-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">{client.business_name}</h1>
            <p className="text-sm text-neutral-500 font-mono">{client.cuit}</p>
          </div>
          {client.industry && (
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg ml-auto hidden sm:block">
              {client.industry}
            </span>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-neutral-500">Viajes Realizados</p>
            <Truck className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-white">{metrics?.total_trips ?? '—'}</p>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-neutral-500">Facturación Total</p>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-white">{metrics ? formatCurrency(metrics.total_revenue) : '—'}</p>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-neutral-500">Calificación</p>
            <Star className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-white">
            {metrics?.avg_rating ? `${metrics.avg_rating.toFixed(1)} ⭐` : 'Sin datos'}
          </p>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-neutral-500">Último Viaje</p>
            <Calendar className="h-4 w-4 text-violet-500" />
          </div>
          <p className="text-lg font-bold text-white">
            {metrics?.last_trip_date
              ? new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(metrics.last_trip_date))
              : 'Nunca'}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">Información de Contacto</h3>
          <div className="space-y-3">
            {client.phone && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-neutral-900 rounded-lg"><Phone className="h-4 w-4 text-neutral-400" /></div>
                <div>
                  <p className="text-neutral-500 text-xs">Teléfono</p>
                  <p className="text-white font-medium">{client.phone}</p>
                </div>
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-neutral-900 rounded-lg"><Mail className="h-4 w-4 text-neutral-400" /></div>
                <div>
                  <p className="text-neutral-500 text-xs">Email</p>
                  <p className="text-white font-medium">{client.email}</p>
                </div>
              </div>
            )}
            {client.location?.city && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-neutral-900 rounded-lg"><MapPin className="h-4 w-4 text-neutral-400" /></div>
                <div>
                  <p className="text-neutral-500 text-xs">Ubicación</p>
                  <p className="text-white font-medium">
                    {[client.location.address, client.location.city, client.location.province].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-neutral-500" /> Observaciones
          </h3>
          <p className="text-sm text-neutral-400 leading-relaxed whitespace-pre-wrap">
            {client.notes || 'Sin observaciones registradas para este cliente.'}
          </p>
        </div>
      </div>
    </div>
  );
}
