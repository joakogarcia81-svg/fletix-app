'use client';

import * as React from 'react';
import { FleetDashboard } from '@/features/fleet/components/fleet-dashboard';
import { TruckList } from '@/features/fleet/components/truck-list';
import { TruckForm } from '@/features/fleet/components/truck-form';
import { Dialog } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export default function FleetPage() {
  const [formOpen, setFormOpen] = React.useState(false);

  return (
    <div className="w-full pb-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Gestión de Flota</h1>
          <p className="text-sm text-neutral-500 mt-1">Control operativo y disponibilidad de tus vehículos.</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black text-sm font-bold hover:bg-neutral-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.08)]"
        >
          <Plus className="h-4 w-4" />
          Nuevo Vehículo
        </button>
      </div>

      {/* Dashboard KPIs */}
      <FleetDashboard />

      {/* Truck List Table */}
      <TruckList />

      {/* Create Truck Modal */}
      <Dialog isOpen={formOpen} onClose={() => setFormOpen(false)} title="" className="max-w-xl">
        <TruckForm onSuccess={() => { setFormOpen(false); window.location.reload(); }} onClose={() => setFormOpen(false)} />
      </Dialog>
    </div>
  );
}
