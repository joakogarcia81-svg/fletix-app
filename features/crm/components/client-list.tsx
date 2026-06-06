'use client';

import * as React from 'react';
import { Client } from '@/types/clients';
import { Search, Filter, Building2, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientListProps {
  clients: Client[];
  isLoading: boolean;
  selectedId?: string;
  onSelect: (client: Client) => void;
}

export const ClientList = React.memo(function ClientListComponent({ clients, isLoading, selectedId, onSelect }: ClientListProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [industryFilter, setIndustryFilter] = React.useState('');

  const filtered = clients.filter(c => {
    const matchesSearch =
      c.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cuit.includes(searchTerm) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !industryFilter || c.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const uniqueIndustries = [...new Set(clients.map(c => c.industry).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse h-20 bg-neutral-900 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Buscar razón social, CUIT, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-sm text-white rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="bg-neutral-900 border border-neutral-800 text-sm text-white rounded-xl px-4 py-2.5 appearance-none focus:outline-none focus:border-blue-500 min-w-[160px]"
        >
          <option value="">Todos los rubros</option>
          {uniqueIndustries.map(ind => <option key={ind} value={ind!}>{ind}</option>)}
        </select>
      </div>

      {/* Client Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 text-sm bg-neutral-900/50 rounded-2xl border border-neutral-800 border-dashed">
          No se encontraron clientes.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(client => (
            <button
              key={client.id}
              onClick={() => onSelect(client)}
              className={cn(
                "w-full text-left bg-neutral-950 border rounded-2xl p-5 hover:bg-neutral-900/50 transition-all group",
                selectedId === client.id
                  ? "border-blue-500/50 bg-blue-500/5"
                  : "border-neutral-800 hover:border-neutral-700"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-neutral-800 flex items-center justify-center border border-neutral-700 shrink-0">
                    <Building2 className="h-4 w-4 text-neutral-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{client.business_name}</p>
                    <p className="text-[10px] text-neutral-500 font-mono">{client.cuit}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-600 group-hover:text-neutral-400 transition-colors shrink-0 mt-1" />
              </div>

              <div className="space-y-1.5">
                {client.industry && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md mb-2">
                    {client.industry}
                  </span>
                )}
                {client.location?.city && (
                  <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-neutral-500" />
                    {client.location.city}{client.location.province ? `, ${client.location.province}` : ''}
                  </p>
                )}
                {client.phone && (
                  <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-neutral-500" />
                    {client.phone}
                  </p>
                )}
                {client.email && (
                  <p className="text-xs text-neutral-400 flex items-center gap-1.5 truncate">
                    <Mail className="h-3 w-3 text-neutral-500" />
                    {client.email}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
