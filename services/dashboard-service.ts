import { supabase } from '@/lib/supabase';
import type { Cargo, DashboardStats } from '@/types/logistics';

// ─── Mock Data Fallback ─────────────────────────────────────

const MOCK_STATS: DashboardStats = {
  cargasActivas: 24,
  ingresosMensualesARS: 18200000,
  choferesActivos: 38,
  kilometrosRecorridos: 42850,
  variacionCargas: 12,
  variacionIngresos: 8.4,
  variacionChoferes: 2,
  variacionKilometros: 5.1,
};

// ─── Service Functions ──────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!supabase) return MOCK_STATS;

  // Future: const { data, error } = await supabase.from('dashboard_stats').select('*')
  return MOCK_STATS;
}

export async function getCargas(): Promise<Cargo[]> {
  if (!supabase) return [];

  // Future: const { data, error } = await supabase.from('cargas').select('*')
  return [];
}

export async function getCargoById(id: string): Promise<Cargo | null> {
  if (!supabase) return null;

  // Future: const { data } = await supabase.from('cargas').select('*').eq('id', id).single()
  void id;
  return null;
}
