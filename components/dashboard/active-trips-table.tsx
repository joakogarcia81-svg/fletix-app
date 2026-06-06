'use client';

import * as React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Truck, MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatARS } from '@/lib/formatters';

export type TripData = {
  id: string;
  code: string;
  origin: string;
  destination: string;
  status: 'pending' | 'in_transit' | 'delivered';
  driver: string;
  revenue: number;
};

const columnHelper = createColumnHelper<TripData>();

const columns = [
  columnHelper.accessor('code', {
    header: 'ID Viaje',
    cell: (info) => (
      <span className="font-mono text-xs font-bold text-white bg-neutral-800/50 px-2 py-1 rounded-md border border-neutral-700/50">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('origin', {
    header: 'Ruta',
    cell: (info) => (
      <div className="flex items-center gap-2 text-xs">
        <div className="flex flex-col gap-1 text-neutral-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-neutral-500" />
            <span className="truncate max-w-[120px]">{info.getValue()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Navigation className="h-3 w-3 text-blue-500" />
            <span className="truncate max-w-[120px] text-neutral-300">
              {info.row.original.destination}
            </span>
          </div>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('driver', {
    header: 'Chofer',
    cell: (info) => (
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
          <Truck className="h-3 w-3 text-neutral-400" />
        </div>
        <span className="text-xs font-semibold text-neutral-200">
          {info.getValue()}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Estado',
    cell: (info) => {
      const status = info.getValue();
      const maps = {
        pending: { label: 'Pendiente', classes: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
        in_transit: { label: 'En Tránsito', classes: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
        delivered: { label: 'Entregado', classes: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
      };
      const { label, classes } = maps[status];
      return (
        <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border', classes)}>
          {label}
        </span>
      );
    },
  }),
  columnHelper.accessor('revenue', {
    header: 'Tarifa',
    cell: (info) => (
      <span className="text-xs font-bold text-emerald-400">
        {formatARS(info.getValue())}
      </span>
    ),
  }),
];

interface ActiveTripsTableProps {
  data: TripData[];
  isLoading?: boolean;
}

export function ActiveTripsTable({ data, isLoading }: ActiveTripsTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full rounded-2xl border border-neutral-800/60 bg-neutral-900/40 overflow-hidden flex flex-col">
      <div className="p-5 border-b border-neutral-800/60">
        <h3 className="text-sm font-bold text-white">Viajes en Curso</h3>
        <p className="text-xs text-neutral-500">Monitoreo de despachos activos</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-neutral-800/60 bg-neutral-950/50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-neutral-500"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              // Skeleton rows
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-neutral-800/30">
                  <td className="px-5 py-4"><div className="h-6 w-16 bg-neutral-800/60 rounded-md animate-pulse" /></td>
                  <td className="px-5 py-4"><div className="h-8 w-32 bg-neutral-800/60 rounded-md animate-pulse" /></td>
                  <td className="px-5 py-4"><div className="h-6 w-24 bg-neutral-800/60 rounded-md animate-pulse" /></td>
                  <td className="px-5 py-4"><div className="h-6 w-20 bg-neutral-800/60 rounded-md animate-pulse" /></td>
                  <td className="px-5 py-4"><div className="h-6 w-20 bg-neutral-800/60 rounded-md animate-pulse" /></td>
                </tr>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-neutral-800/30 hover:bg-neutral-800/20 transition-colors group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-8 text-center text-xs text-neutral-500">
                  No hay viajes activos en este momento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
