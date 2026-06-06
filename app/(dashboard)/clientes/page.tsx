'use client';

import * as React from 'react';
import { useClients } from '@/hooks/use-clients';
import { ClientList } from '@/features/crm/components/client-list';
import { ClientDetail } from '@/features/crm/components/client-detail';
import { ClientForm } from '@/features/crm/components/client-form';
import { Client } from '@/types/clients';
import { Dialog } from '@/components/ui/dialog';
import { Plus, Users } from 'lucide-react';

export default function ClientesPage() {
  const { clients, isLoading, createClient } = useClients();
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);

  return (
    <div className="w-full pb-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-500" />
            {selectedClient ? 'Ficha de Cliente' : 'CRM — Clientes y Dadores'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {selectedClient
              ? `Detalle de ${selectedClient.business_name}`
              : `${clients.length} cliente${clients.length !== 1 ? 's' : ''} registrado${clients.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {!selectedClient && (
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black text-sm font-bold hover:bg-neutral-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.08)]"
          >
            <Plus className="h-4 w-4" />
            Nuevo Cliente
          </button>
        )}
      </div>

      {/* Content: Detail or List */}
      {selectedClient ? (
        <ClientDetail client={selectedClient} onBack={() => setSelectedClient(null)} />
      ) : (
        <ClientList
          clients={clients}
          isLoading={isLoading}
          onSelect={setSelectedClient}
        />
      )}

      {/* Create Client Modal */}
      <Dialog isOpen={formOpen} onClose={() => setFormOpen(false)} title="" className="max-w-2xl">
        <ClientForm onSubmit={createClient} onClose={() => setFormOpen(false)} />
      </Dialog>
    </div>
  );
}
