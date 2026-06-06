'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { useUiStore } from '@/store/use-ui-store';
import { ResumenOverview } from '@/features/dashboard/components/resumen-overview';
import { MarketplaceView } from '@/features/marketplace/components/marketplace-view';
import { CargoList } from '@/features/dashboard/components/cargo-list';
import { CargoForm } from '@/features/dashboard/components/cargo-form';
import { DriverList } from '@/features/dashboard/components/driver-list';
import { DriverForm } from '@/features/dashboard/components/driver-form';
import { VehicleList } from '@/features/dashboard/components/vehicle-list';
import { VehicleForm } from '@/features/dashboard/components/vehicle-form';
import { ReportCharts } from '@/features/dashboard/components/report-charts';
import { TrackingView } from '@/features/tracking/components/tracking-view';
import { PageHeader } from '@/components/layout/page-header';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Cargo, Driver, Vehicle } from '@/types/logistics';

export default function DashboardPage() {
  const { activeView } = useUiStore();

  // Modals state
  const [cargoModal, setCargoModal] = React.useState<{ open: boolean; data: Cargo | null }>({
    open: false,
    data: null,
  });
  const [driverModal, setDriverModal] = React.useState<{ open: boolean; data: Driver | null }>({
    open: false,
    data: null,
  });
  const [vehicleModal, setVehicleModal] = React.useState<{ open: boolean; data: Vehicle | null }>({
    open: false,
    data: null,
  });

  return (
    <div className="space-y-6">
      {/* Dynamic Views */}
      {activeView === 'resumen' && (
        <ResumenOverview />
      )}

      {activeView === 'marketplace' && (
        <MarketplaceView />
      )}

      {activeView === 'cargas' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <PageHeader
              title="Lista de Cargas"
              description="Buscar y filtrar despachos interjurisdiccionales."
            />
            <Button size="sm" onClick={() => setCargoModal({ open: true, data: null })}>
              <Plus className="h-4 w-4 mr-1" /> Registrar Carga
            </Button>
          </div>
          <CargoList onEdit={(c) => setCargoModal({ open: true, data: c })} />
        </div>
      )}

      {activeView === 'choferes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <PageHeader
              title="Panel de Choferes"
              description="Gestión y control de licencias LINTI nacionales."
            />
            <Button size="sm" onClick={() => setDriverModal({ open: true, data: null })}>
              <Plus className="h-4 w-4 mr-1" /> Agregar Chofer
            </Button>
          </div>
          <DriverList onEdit={(d) => setDriverModal({ open: true, data: d })} />
        </div>
      )}

      {activeView === 'vehiculos' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <PageHeader
              title="Control de Flota"
              description="Administración de unidades tractoras, chasis y semirremolques."
            />
            <Button size="sm" onClick={() => setVehicleModal({ open: true, data: null })}>
              <Plus className="h-4 w-4 mr-1" /> Registrar Unidad
            </Button>
          </div>
          <VehicleList onEdit={(v) => setVehicleModal({ open: true, data: v })} />
        </div>
      )}

      {activeView === 'reportes' && (
        <div className="space-y-4">
          <PageHeader
            title="Informes y Estadísticas"
            description="Analítica en tiempo real de facturación y capacidad de flota."
          />
          <ReportCharts />
        </div>
      )}

      {activeView === 'tracking' && (
        <TrackingView />
      )}

      {/* Dialog Modals */}
      <Dialog
        isOpen={cargoModal.open}
        onClose={() => setCargoModal({ open: false, data: null })}
        title={cargoModal.data ? 'Editar Despacho' : 'Registrar Nuevo Despacho'}
      >
        <CargoForm
          cargo={cargoModal.data}
          onSuccess={() => setCargoModal({ open: false, data: null })}
        />
      </Dialog>

      <Dialog
        isOpen={driverModal.open}
        onClose={() => setDriverModal({ open: false, data: null })}
        title={driverModal.data ? 'Modificar Ficha Chofer' : 'Registrar Nuevo Chofer'}
      >
        <DriverForm
          driver={driverModal.data}
          onSuccess={() => setDriverModal({ open: false, data: null })}
        />
      </Dialog>

      <Dialog
        isOpen={vehicleModal.open}
        onClose={() => setVehicleModal({ open: false, data: null })}
        title={vehicleModal.data ? 'Modificar Datos Unidad' : 'Registrar Nueva Unidad'}
      >
        <VehicleForm
          vehicle={vehicleModal.data}
          onSuccess={() => setVehicleModal({ open: false, data: null })}
        />
      </Dialog>
    </div>
  );
}
