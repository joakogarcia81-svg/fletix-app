'use client';

import * as React from 'react';
import { ExpenseCategory } from '@/types/finances';
import { Loader2, Receipt, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpenseFormProps {
  onAdd: (category: ExpenseCategory, amount: number, description?: string) => Promise<boolean>;
}

const CATEGORIES: { id: ExpenseCategory; label: string }[] = [
  { id: 'combustible', label: 'Combustible' },
  { id: 'peaje', label: 'Peaje' },
  { id: 'viatico', label: 'Viático' },
  { id: 'adelanto', label: 'Adelanto Chofer' },
  { id: 'mantenimiento', label: 'Mantenimiento' },
  { id: 'extra', label: 'Otro / Extra' },
];

export function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const [amount, setAmount] = React.useState('');
  const [category, setCategory] = React.useState<ExpenseCategory>('combustible');
  const [description, setDescription] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    setIsSubmitting(true);
    const success = await onAdd(category, Number(amount), description);
    if (success) {
      setAmount('');
      setDescription('');
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Receipt className="h-4 w-4 text-emerald-500" />
        <h3 className="text-sm font-bold text-white">Registrar Gasto</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monto */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-400">Monto (ARS)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">$</span>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Categoría */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-400">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none"
          >
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Descripción */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-neutral-400">Descripción (Opcional)</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          placeholder="Ej: Carga Shell Ruta 9, Peaje Zárate..."
          maxLength={100}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !amount}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all",
          isSubmitting || !amount
            ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
            : "bg-emerald-600 text-white hover:bg-emerald-500"
        )}
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Agregar Gasto
      </button>
    </form>
  );
}
