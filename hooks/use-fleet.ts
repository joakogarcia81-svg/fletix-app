'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Truck, OperationalStatus, FleetMetrics } from '@/types/fleet';
import { useToast } from '@/components/ui/toast';

export function useFleet() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const { showToast } = useToast();

  const fetchTrucks = useCallback(async () => {
    setIsLoading(true);
    
    // We do a join to get driver details if default_driver_id is set
    const { data, error } = await supabase
      .from('trucks')
      .select(`
        *,
        default_driver:drivers(
          id,
          cuit,
          profile:profiles(first_name, last_name)
        )
      `)
      .eq('status', 'active') // Assuming we only want logically active trucks in the fleet view
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTrucks(data as unknown as Truck[]);
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchTrucks();
  }, [fetchTrucks]);

  const updateStatus = async (id: string, newStatus: OperationalStatus) => {
    // Optimistic update
    setTrucks(prev => prev.map(t => t.id === id ? { ...t, operational_status: newStatus } : t));
    
    const { error } = await supabase
      .from('trucks')
      .update({ operational_status: newStatus })
      .eq('id', id);

    if (error) {
      // Revert if error
      showToast('Error actualizando estado', 'error');
      fetchTrucks();
      return false;
    }
    
    showToast(`Estado actualizado a ${newStatus}`, 'success');
    return true;
  };

  const metrics = useMemo<FleetMetrics>(() => {
    const total = trucks.length;
    const available = trucks.filter(t => t.operational_status === 'disponible').length;
    const occupied = trucks.filter(t => t.operational_status === 'ocupado').length;
    const maintenance = trucks.filter(t => t.operational_status === 'mantenimiento').length;
    
    // Utilization is (occupied + reservado) / (total - maintenance - fuera de servicio)
    const working = occupied + trucks.filter(t => t.operational_status === 'reservado').length;
    const fleetCapacity = total - maintenance - trucks.filter(t => t.operational_status === 'fuera de servicio').length;
    const utilization_percent = fleetCapacity > 0 ? (working / fleetCapacity) * 100 : 0;

    return { total, available, occupied, maintenance, utilization_percent };
  }, [trucks]);

  return { trucks, metrics, isLoading, updateStatus, refetch: fetchTrucks };
}
