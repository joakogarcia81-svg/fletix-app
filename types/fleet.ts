export type OperationalStatus = 'disponible' | 'ocupado' | 'mantenimiento' | 'fuera de servicio' | 'reservado';

export interface DriverBasic {
  id: string;
  cuit: string;
  profile?: {
    first_name: string;
    last_name: string;
  };
}

export interface Truck {
  id: string;
  company_id: string;
  patent: string;
  type: string;
  capacity_kg: number;
  status: 'active' | 'maintenance' | 'inactive'; // Logical status
  brand?: string;
  model?: string;
  year?: number;
  operational_status: OperationalStatus;
  default_driver_id?: string;
  
  // Joined relations
  default_driver?: DriverBasic;
  created_at: string;
}

export interface FleetMetrics {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
  utilization_percent: number;
}

export const STATUS_CONFIG: Record<OperationalStatus, { label: string; color: string; bg: string }> = {
  'disponible':        { label: 'Disponible', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  'ocupado':           { label: 'Ocupado',    color: 'text-blue-500',    bg: 'bg-blue-500/10' },
  'reservado':         { label: 'Reservado',  color: 'text-violet-500',  bg: 'bg-violet-500/10' },
  'mantenimiento':     { label: 'En Taller',  color: 'text-amber-500',   bg: 'bg-amber-500/10' },
  'fuera de servicio': { label: 'Inactivo',   color: 'text-red-500',     bg: 'bg-red-500/10' },
};
