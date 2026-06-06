import * as React from 'react';
import { Filter, X } from 'lucide-react';
import type { MarketplaceFilters as FiltersType } from '@/actions/marketplace';

interface MarketplaceFiltersProps {
  filters: FiltersType;
  onChange: (filters: FiltersType) => void;
}

export function MarketplaceFilters({ filters, onChange }: MarketplaceFiltersProps) {
  const provinces = ['all', 'Buenos Aires', 'Santa Fe', 'Córdoba', 'Mendoza', 'Tucumán'];
  const truckTypes = ['all', 'SIDER', 'CHASIS', 'ACOPLADO', 'TOLVA', 'REFRIGERADO'];

  const handleChange = (key: keyof FiltersType, value: string | boolean | undefined) => {
    onChange({ ...filters, [key]: value === 'all' ? undefined : value });
  };

  const handleReset = () => {
    onChange({});
  };

  const hasActiveFilters = Object.keys(filters).filter(k => k !== 'query').length > 0;

  return (
    <div className="flex flex-col gap-6 p-5 rounded-2xl border border-neutral-800/60 bg-neutral-900/40 backdrop-blur-md sticky top-6">
      <div className="flex items-center justify-between border-b border-neutral-800/60 pb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </h3>
        {hasActiveFilters && (
          <button 
            onClick={handleReset}
            className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
          >
            Limpiar <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Provincia</label>
          <select 
            value={filters.province || 'all'}
            onChange={(e) => handleChange('province', e.target.value)}
            className="w-full h-10 px-3 bg-neutral-950/50 border border-neutral-800 rounded-lg text-sm text-neutral-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
          >
            <option value="all">Todas las provincias</option>
            {provinces.filter(p => p !== 'all').map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Tipo de Camión</label>
          <select 
            value={filters.truckType || 'all'}
            onChange={(e) => handleChange('truckType', e.target.value)}
            className="w-full h-10 px-3 bg-neutral-950/50 border border-neutral-800 rounded-lg text-sm text-neutral-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
          >
            <option value="all">Cualquier tipo</option>
            {truckTypes.filter(t => t !== 'all').map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="pt-4 border-t border-neutral-800/60">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                checked={filters.isPartial || false}
                onChange={(e) => handleChange('isPartial', e.target.checked ? true : undefined)}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded border border-neutral-700 bg-neutral-950 peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-colors" />
              <div className="absolute opacity-0 peer-checked:opacity-100 text-white pointer-events-none">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-neutral-200 group-hover:text-white transition-colors">Solo Cargas Parciales (LTL)</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
