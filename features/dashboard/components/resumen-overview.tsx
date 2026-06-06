'use client';

import * as React from 'react';
import { Route, Truck, Users, DollarSign } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/metric-card';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { ActiveTripsTable, TripData } from '@/components/dashboard/active-trips-table';
import { MapPlaceholder, RecentActivity, ActivityEvent } from '@/components/dashboard/operative-widgets';
import { useLogisticsStore } from '@/store/use-logistics-store';
import { formatARS } from '@/lib/formatters';

export function ResumenOverview() {
  const [isLoading, setIsLoading] = React.useState(true);
  const { cargas, choferes, vehiculos } = useLogisticsStore();

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Compute metrics from store (using actual Cargo type fields)
  const activeTripsCount = cargas.filter((c) => c.estado === 'EN_RUTA').length;
  const availableTrucks = vehiculos.length;
  const activeDrivers = choferes.filter((d) => d.licenciaLinti).length;
  const totalRevenue = cargas.reduce((acc, c) => acc + c.tarifaARS, 0);

  const mockChartData = [
    { name: 'Lun', revenue: 120000, km: 450 },
    { name: 'Mar', revenue: 210000, km: 820 },
    { name: 'Mie', revenue: 180000, km: 600 },
    { name: 'Jue', revenue: 320000, km: 1100 },
    { name: 'Vie', revenue: 450000, km: 1500 },
    { name: 'Sab', revenue: 390000, km: 1300 },
    { name: 'Dom', revenue: 250000, km: 900 },
  ];

  // Map store Cargo type to TripData type for the table
  const statusMap: Record<string, 'pending' | 'in_transit' | 'delivered'> = {
    DISPONIBLE: 'pending',
    RESERVADO: 'pending',
    ASIGNADO: 'pending',
    CARGANDO: 'in_transit',
    CARGADO: 'in_transit',
    EN_RUTA: 'in_transit',
    DETENIDO: 'in_transit',
    ARRIBADO: 'in_transit',
    DESCARGANDO: 'in_transit',
    ENTREGADO: 'delivered',
    CANCELADO: 'delivered',
  };

  const tableData: TripData[] = cargas.slice(0, 5).map((c) => ({
    id: c.id,
    code: c.id,
    origin: c.ruta.origen,
    destination: c.ruta.destino,
    status: statusMap[c.estado] || 'pending',
    driver: c.chofer ? `${c.chofer.nombre} ${c.chofer.apellido}` : 'Sin Asignar',
    revenue: c.tarifaARS,
  }));

  const mockActivity: ActivityEvent[] = [
    { id: '1', type: 'success', message: 'Camión AD345FG llegó a Buenos Aires', time: 'Hace 5 min' },
    { id: '2', type: 'info', message: 'Nuevo despacho asignado a Juan C. Pérez', time: 'Hace 12 min' },
    { id: '3', type: 'warning', message: 'Demora reportada en Ruta 9 (Rosario)', time: 'Hace 45 min' },
    { id: '4', type: 'success', message: 'Descarga finalizada en Córdoba Capital', time: 'Hace 1 hora' },
    { id: '5', type: 'info', message: 'Mantenimiento programado: Scania R450', time: 'Hace 2 horas' },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Viajes Activos"
          value={activeTripsCount}
          icon={Route}
          trend={{ value: 12.5, label: 'vs. semana pasada' }}
          isLoading={isLoading}
        />
        <MetricCard
          title="Camiones Disp."
          value={availableTrucks}
          icon={Truck}
          subtitle={`${vehiculos.length} en flota`}
          isLoading={isLoading}
        />
        <MetricCard
          title="Choferes Habilitados"
          value={activeDrivers}
          icon={Users}
          trend={{ value: -2.1, label: 'vs. ayer' }}
          isLoading={isLoading}
        />
        <MetricCard
          title="Ganancias Mes"
          value={formatARS(totalRevenue)}
          icon={DollarSign}
          trend={{ value: 8.4, label: 'crecimiento mensual' }}
          isLoading={isLoading}
        />
      </div>

      {/* Main Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart data={mockChartData} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity data={mockActivity} isLoading={isLoading} />
        </div>
      </div>

      {/* Table & Map Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActiveTripsTable data={tableData} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          <MapPlaceholder isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
