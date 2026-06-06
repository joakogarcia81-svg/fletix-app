'use client';

import * as React from 'react';
import { useTripFinancials } from '@/hooks/use-trip-financials';
import { ExpenseForm } from './expense-form';
import { Loader2, TrendingUp, TrendingDown, DollarSign, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TripFinancialsProps {
  tripId: string;
  basePriceArs: number;
}

export function TripFinancials({ tripId, basePriceArs }: TripFinancialsProps) {
  const { expenses, isLoading, summary, addExpense, deleteExpense } = useTripFinancials(tripId, basePriceArs);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

  const isProfitable = summary.gross_margin > 0;

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen (Liquidación) */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        {/* Decorative Background */}
        <div className={cn(
          "absolute top-0 right-0 w-64 h-64 blur-3xl opacity-10 rounded-full -mr-20 -mt-20 pointer-events-none",
          isProfitable ? "bg-emerald-500" : "bg-red-500"
        )} />

        <h2 className="text-lg font-black text-white tracking-tight mb-6">Liquidación del Viaje</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Tarifa Pactada</p>
            <p className="text-xl font-bold text-white">{formatCurrency(summary.revenue)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Gastos Totales</p>
            <p className="text-xl font-bold text-red-400">-{formatCurrency(summary.total_expenses)}</p>
          </div>
          <div className="space-y-1 col-span-2 md:col-span-2 border-t md:border-t-0 md:border-l border-neutral-800 pt-4 md:pt-0 md:pl-6">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Margen Bruto</p>
            <div className="flex items-center gap-3">
              <p className={cn("text-3xl font-black", isProfitable ? "text-emerald-400" : "text-red-500")}>
                {formatCurrency(summary.gross_margin)}
              </p>
              <div className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold",
                isProfitable ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              )}>
                {isProfitable ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {summary.net_margin_percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <ExpenseForm onAdd={addExpense} />
        </div>

        {/* Lista de Gastos */}
        <div className="lg:col-span-2 bg-neutral-950 border border-neutral-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">Historial de Gastos</h3>
          
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <p className="text-sm">No se han registrado gastos para este viaje.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {expenses.map(expense => (
                <div key={expense.id} className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800/50 hover:border-neutral-700 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {expense.category}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {format(new Date(expense.created_at), "dd/MM/yyyy HH:mm", { locale: es })}
                      </span>
                    </div>
                    {expense.description && (
                      <p className="text-sm text-neutral-300">{expense.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-bold text-white">
                      {formatCurrency(Number(expense.amount_ars))}
                    </p>
                    <button 
                      onClick={() => deleteExpense(expense.id)}
                      className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-md transition-colors"
                      title="Eliminar gasto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
