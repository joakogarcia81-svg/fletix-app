export interface Client {
  id: string;
  company_id: string;
  business_name: string;
  cuit: string;
  phone?: string;
  email?: string;
  location?: {
    address?: string;
    city?: string;
    province?: string;
  };
  industry?: string;
  notes?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface ClientMetrics {
  total_trips: number;
  total_revenue: number;
  avg_rating: number;
  last_trip_date?: string;
}

export const INDUSTRIES = [
  'Alimentos',
  'Bebidas',
  'Construcción',
  'Electrónica',
  'Farmacéutica',
  'Agroindustria',
  'Química',
  'Textil',
  'Metalúrgica',
  'Automotriz',
  'Logística',
  'Retail',
  'Otro',
];
