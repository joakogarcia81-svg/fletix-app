import { supabase } from '@/lib/supabase';
import type { Driver, Vehicle } from '@/types/logistics';

// ─── Drivers ────────────────────────────────────────────────

export async function getDrivers(): Promise<Driver[]> {
  if (!supabase) return [];
  // Future: const { data } = await supabase.from('drivers').select('*')
  return [];
}

export async function getDriverById(id: string): Promise<Driver | null> {
  if (!supabase) return null;
  void id;
  return null;
}

// ─── Vehicles ───────────────────────────────────────────────

export async function getVehicles(): Promise<Vehicle[]> {
  if (!supabase) return [];
  // Future: const { data } = await supabase.from('vehicles').select('*')
  return [];
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  if (!supabase) return null;
  void id;
  return null;
}
