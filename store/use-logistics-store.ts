import { create } from 'zustand';
import type { Cargo, Driver, Vehicle } from '@/types/logistics';

interface LogisticsState {
  cargas: Cargo[];
  choferes: Driver[];
  vehiculos: Vehicle[];

  // Cargo Actions
  addCargo: (cargo: Omit<Cargo, 'id'>) => void;
  updateCargo: (id: string, cargo: Partial<Cargo>) => void;
  deleteCargo: (id: string) => void;

  // Driver Actions
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  updateDriver: (id: string, driver: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;

  // Vehicle Actions
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
}

const initialCargas: Cargo[] = [
  {
    id: 'CRG-8901',
    descripcion: 'Pallets de Supermercado (Arroz/Aceite)',
    tipoCarga: 'Palletizado / Industrial',
    pesoKg: 14000,
    tarifaARS: 850000,
    fechaSalida: '2026-05-25',
    fechaEntregaEstimada: '2026-05-26',
    estado: 'EN_RUTA',
    remitente: 'Molinos Río de la Plata',
    ruta: {
      origen: 'Rosario, SF',
      destino: 'Buenos Aires, CABA',
      distanciaKm: 300,
    },
  },
  {
    id: 'CRG-8902',
    descripcion: 'Bobinas de Acero Industrial',
    tipoCarga: 'Pesada / Siderúrgica',
    pesoKg: 22000,
    tarifaARS: 1450000,
    fechaSalida: '2026-05-26',
    fechaEntregaEstimada: '2026-05-28',
    estado: 'ASIGNADO',
    remitente: 'Ternium Argentina',
    ruta: {
      origen: 'San Nicolás, BA',
      destino: 'Córdoba, CD',
      distanciaKm: 580,
    },
  },
  {
    id: 'CRG-8903',
    descripcion: 'Cerveza en Cajones y Barriles',
    tipoCarga: 'Consumo Masivo',
    pesoKg: 18000,
    tarifaARS: 1200000,
    fechaSalida: '2026-05-28',
    fechaEntregaEstimada: '2026-05-29',
    estado: 'DISPONIBLE',
    remitente: 'Cervecería Quilmes',
    ruta: {
      origen: 'Quilmes, BA',
      destino: 'Mendoza, MZ',
      distanciaKm: 1050,
    },
  },
];

const initialChoferes: Driver[] = [
  {
    id: 'DRV-1001',
    nombre: 'Juan Carlos',
    apellido: 'Pérez',
    cuit: '20-30456789-2',
    licenciaLinti: true,
    telefono: '11-4567-8901',
    reputacion: 4.8,
  },
  {
    id: 'DRV-1002',
    nombre: 'Eduardo',
    apellido: 'Rodríguez',
    cuit: '20-25890123-9',
    licenciaLinti: true,
    telefono: '341-987-6543',
    reputacion: 4.5,
  },
  {
    id: 'DRV-1003',
    nombre: 'Miguel Ángel',
    apellido: 'Gómez',
    cuit: '23-28456123-4',
    licenciaLinti: false,
    telefono: '351-123-4567',
    reputacion: 3.9,
  },
];

const initialVehiculos: Vehicle[] = [
  {
    id: 'VEH-2001',
    patente: 'AD345FG',
    marca: 'Scania',
    modelo: 'R450',
    tipo: 'SIDER',
    capacidadKg: 28000,
  },
  {
    id: 'VEH-2002',
    patente: 'AA789KL',
    marca: 'Iveco',
    modelo: 'Stralis',
    tipo: 'TOLVA',
    capacidadKg: 30000,
  },
  {
    id: 'VEH-2003',
    patente: 'FGH456',
    marca: 'Mercedes-Benz',
    modelo: 'Atego',
    tipo: 'CHASIS',
    capacidadKg: 14000,
  },
];

const generateId = (prefix: string) => `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

export const useLogisticsStore = create<LogisticsState>((set) => ({
  cargas: initialCargas,
  choferes: initialChoferes,
  vehiculos: initialVehiculos,

  // Cargo Actions
  addCargo: (cargo) =>
    set((state) => ({
      cargas: [...state.cargas, { ...cargo, id: generateId('CRG') }],
    })),
  updateCargo: (id, updatedCargo) =>
    set((state) => ({
      cargas: state.cargas.map((c) => (c.id === id ? { ...c, ...updatedCargo } : c)),
    })),
  deleteCargo: (id) =>
    set((state) => ({
      cargas: state.cargas.filter((c) => c.id !== id),
    })),

  // Driver Actions
  addDriver: (driver) =>
    set((state) => ({
      choferes: [...state.choferes, { ...driver, id: generateId('DRV') }],
    })),
  updateDriver: (id, updatedDriver) =>
    set((state) => ({
      choferes: state.choferes.map((d) => (d.id === id ? { ...d, ...updatedDriver } : d)),
    })),
  deleteDriver: (id) =>
    set((state) => ({
      choferes: state.choferes.filter((d) => d.id !== id),
    })),

  // Vehicle Actions
  addVehicle: (vehicle) =>
    set((state) => ({
      vehiculos: [...state.vehiculos, { ...vehicle, id: generateId('VEH') }],
    })),
  updateVehicle: (id, updatedVehicle) =>
    set((state) => ({
      vehiculos: state.vehiculos.map((v) => (v.id === id ? { ...v, ...updatedVehicle } : v)),
    })),
  deleteVehicle: (id) =>
    set((state) => ({
      vehiculos: state.vehiculos.filter((v) => v.id !== id),
    })),
}));
