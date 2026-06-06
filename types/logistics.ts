// Fletix Logistics Type Definitions (Argentina)

export type CargoStatus = 'DISPONIBLE' | 'RESERVADO' | 'ASIGNADO' | 'CARGANDO' | 'CARGADO' | 'EN_RUTA' | 'DETENIDO' | 'ARRIBADO' | 'DESCARGANDO' | 'ENTREGADO' | 'CANCELADO';

export type VehicleType =
  | 'SIDER' // Semirremolque Sider (very common in Argentina)
  | 'CHASIS' // Chasis común
  | 'ACOPLADO' // Chasis y acoplado
  | 'MOSQUITO' // Transporte de autos
  | 'TOLVA' // Cerealera (common in Pampa húmeda)
  | 'REFRIGERADO'; // Termo / refrigerado

export interface Route {
  origen: string; // e.g. "Rosario, Santa Fe"
  destino: string; // e.g. "Buenos Aires, CABA"
  distanciaKm: number; // e.g. 300
}

export interface Driver {
  id: string;
  nombre: string;
  apellido: string;
  cuit: string; // Argentinian tax ID
  licenciaLinti: boolean; // LINTI license for interjurisdictional cargo
  telefono: string;
  reputacion: number; // Rating 1-5
}

export interface Vehicle {
  id: string;
  patente: string; // Licence plate
  marca: string; // e.g. "Scania", "Iveco"
  modelo: string;
  tipo: VehicleType;
  capacidadKg: number;
}

export interface Cargo {
  id: string;
  descripcion: string;
  tipoCarga: string; // e.g. "Granos", "Industrial", "Palletizado"
  pesoKg: number;
  volumenM3?: number;
  tarifaARS: number; // Argentinian Pesos (ARS)
  fechaSalida: string;
  fechaEntregaEstimada: string;
  estado: CargoStatus;
  ruta: Route;
  chofer?: Driver;
  vehiculo?: Vehicle;
  remitente: string; // Company posting the cargo
}

export interface DashboardStats {
  cargasActivas: number;
  ingresosMensualesARS: number;
  choferesActivos: number;
  kilometrosRecorridos: number;
  variacionCargas: number; // percentage change
  variacionIngresos: number; // percentage change
  variacionChoferes: number;
  variacionKilometros: number;
}
