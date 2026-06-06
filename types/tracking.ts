// Fletix Tracking Types

export interface LiveLocation {
  id: string;
  company_id: string;
  trip_id: string;
  driver_id: string;
  latitude: number;
  longitude: number;
  speed: number | null;
  heading: number | null;
  updated_at: string;
}

export interface TrackedTrip {
  id: string;
  tripId: string;
  driverName: string;
  truckPatent: string;
  truckType: string;
  origin: string;
  destination: string;
  status: string;
  location: LiveLocation | null;
  eta?: string;
  distanceRemaining?: number;
}

// Buenos Aires / Argentina center for default map view
export const ARGENTINA_CENTER = {
  lat: -34.6037,
  lng: -58.3816,
} as const;

export const DEFAULT_ZOOM = 6;
export const FOCUSED_ZOOM = 13;

// Status color map for map markers
export const TRACKING_STATUS_COLORS: Record<string, string> = {
  ASIGNADO: '#6366f1',    // Indigo
  CARGANDO: '#a855f7',    // Purple
  CARGADO: '#8b5cf6',     // Violet
  EN_RUTA: '#22c55e',     // Green - most important
  DETENIDO: '#f97316',    // Orange - attention
  ARRIBADO: '#14b8a6',    // Teal
  DESCARGANDO: '#06b6d4', // Cyan
  ENTREGADO: '#10b981',   // Emerald
};
