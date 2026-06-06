'use client';

import * as React from 'react';
import { useFleet } from '@/hooks/use-fleet';
import { Search, Filter, MoreHorizontal, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_CONFIG, OperationalStatus } from '@/types/fleet';

export const TruckList = React.memo(function TruckListComponent() {
  const { trucks, isLoading, updateStatus } = useFleet();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTrucks = trucks.filter(t => 
    t.patent.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.default_driver?.profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-neutral-900 rounded-3xl" />;
  }

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden">
      {/* Header & Controls */}
      <div className="p-5 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-black text-white">Directorio de Vehículos</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Buscar patente, marca, chofer..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 text-sm text-white rounded-xl pl-9 pr-4 py-2 w-full sm:w-64 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <button className="p-2 border border-neutral-800 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="text-xs uppercase bg-neutral-900/50 border-b border-neutral-800 text-neutral-500">
            <tr>
              <th className="px-6 py-4 font-bold">Vehículo</th>
              <th className="px-6 py-4 font-bold">Tipo / Capacidad</th>
              <th className="px-6 py-4 font-bold">Estado Operativo</th>
              <th className="px-6 py-4 font-bold">Chofer Asignado</th>
              <th className="px-6 py-4 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {filteredTrucks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                  No se encontraron vehículos.
                </td>
              </tr>
            ) : (
              filteredTrucks.map(truck => {
                const statusConf = STATUS_CONFIG[truck.operational_status];
                
                return (
                  <tr key={truck.id} className="hover:bg-neutral-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-neutral-800 flex items-center justify-center font-bold text-white border border-neutral-700 uppercase">
                          {truck.patent.slice(0, 3)}
                        </div>
                        <div>
                          <p className="font-bold text-white uppercase">{truck.patent}</p>
                          <p className="text-xs text-neutral-500">
                            {truck.brand || 'Marca S/D'} {truck.model} {truck.year ? `(${truck.year})` : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{truck.type}</p>
                      <p className="text-xs text-neutral-500">{(truck.capacity_kg / 1000).toFixed(1)} tn</p>
                    </td>
                    <td className="px-6 py-4">
                      {/* Interactive Status Selector */}
                      <select 
                        value={truck.operational_status}
                        onChange={(e) => updateStatus(truck.id, e.target.value as OperationalStatus)}
                        className={cn(
                          "text-xs font-bold px-2.5 py-1 rounded-lg border border-transparent hover:border-neutral-700 cursor-pointer appearance-none transition-colors",
                          statusConf.bg, statusConf.color
                        )}
                      >
                        {Object.entries(STATUS_CONFIG).map(([val, conf]) => (
                          <option key={val} value={val} className="bg-neutral-900 text-white font-medium">
                            {conf.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {truck.default_driver ? (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                            <User className="h-3 w-3 text-neutral-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">
                              {truck.default_driver.profile?.first_name} {truck.default_driver.profile?.last_name}
                            </p>
                            <p className="text-[10px] text-neutral-500">CUIT: {truck.default_driver.cuit}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-500 italic">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-neutral-500 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});
