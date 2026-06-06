'use client';

import * as React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// We define a simple structure based on what use-analytics returns
type TripRow = {
  id: string;
  price_ars: number;
  status: string;
  pickup_date: string;
  origin: { city: string; province: string };
  destination: { city: string; province: string };
};

const columnHelper = createColumnHelper<TripRow>();

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

const columns = [
  columnHelper.accessor(row => row.origin.city, {
    id: 'origen',
    header: 'Origen',
    cell: info => <span className="font-medium text-white">{info.getValue() || 'S/D'}</span>,
  }),
  columnHelper.accessor(row => row.destination.city, {
    id: 'destino',
    header: 'Destino',
    cell: info => <span className="font-medium text-white">{info.getValue() || 'S/D'}</span>,
  }),
  columnHelper.accessor('pickup_date', {
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          Fecha <ArrowUpDown className="h-3 w-3" />
        </button>
      )
    },
    cell: info => {
      const date = info.getValue();
      return date ? new Intl.DateTimeFormat('es-AR').format(new Date(date)) : 'S/D';
    },
  }),
  columnHelper.accessor('status', {
    header: 'Estado',
    cell: info => {
      const status = info.getValue();
      const statusMap: Record<string, { label: string; color: string }> = {
        pending: { label: 'Pendiente', color: 'text-amber-400 bg-amber-500/10' },
        assigned: { label: 'Asignado', color: 'text-blue-400 bg-blue-500/10' },
        in_transit: { label: 'En Tránsito', color: 'text-emerald-400 bg-emerald-500/10' },
        delivered: { label: 'Entregado', color: 'text-neutral-400 bg-neutral-800' },
        cancelled: { label: 'Cancelado', color: 'text-red-400 bg-red-500/10' },
      };
      const mapped = statusMap[status] || { label: status, color: 'text-neutral-400 bg-neutral-800' };
      return (
        <span className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md", mapped.color)}>
          {mapped.label}
        </span>
      );
    },
  }),
  columnHelper.accessor('price_ars', {
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            Tarifa <ArrowUpDown className="h-3 w-3" />
          </button>
        </div>
      )
    },
    cell: info => {
      const val = Number(info.getValue());
      return <div className="text-right font-bold text-white">{val ? formatCurrency(val) : '—'}</div>;
    },
  }),
];

export const AnalyticsTable = React.memo(function AnalyticsTableComponent({ data }: { data: TripRow[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="mt-6 bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden">
      <div className="p-5 border-b border-neutral-800">
        <h3 className="text-sm font-bold text-white">Últimos Viajes Registrados</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="text-xs uppercase bg-neutral-900/50 border-b border-neutral-800 text-neutral-500">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4 font-bold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-neutral-900/30 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-neutral-500">
                  No hay datos recientes disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});
