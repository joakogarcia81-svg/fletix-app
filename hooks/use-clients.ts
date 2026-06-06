'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Client, ClientMetrics } from '@/types/clients';
import { useToast } from '@/components/ui/toast';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const { showToast } = useToast();

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('status', 'active')
      .order('business_name', { ascending: true });

    if (!error && data) {
      setClients(data as Client[]);
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const createClient_ = async (client: Partial<Client>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { showToast('Error de autenticación', 'error'); return false; }

    const { data: membership } = await supabase
      .from('memberships')
      .select('company_id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (!membership) { showToast('No se encontró tu empresa', 'error'); return false; }

    const { error } = await supabase.from('clients').insert({
      ...client,
      company_id: membership.company_id,
    });

    if (error) {
      showToast(error.message.includes('unique') ? 'Ese CUIT ya existe' : 'Error al guardar', 'error');
      return false;
    }

    showToast('Cliente registrado exitosamente', 'success');
    fetchClients();
    return true;
  };

  const getClientMetrics = async (clientId: string): Promise<ClientMetrics> => {
    // Fetch trips for this client
    const { data: trips } = await supabase
      .from('trips')
      .select('id, price_ars, pickup_date')
      .eq('client_id', clientId)
      .order('pickup_date', { ascending: false });

    // Fetch ratings where this client's trips were rated
    const tripIds = trips?.map(t => t.id) || [];
    let avg_rating = 0;

    if (tripIds.length > 0) {
      const { data: ratings } = await supabase
        .from('ratings')
        .select('score')
        .in('trip_id', tripIds);

      if (ratings && ratings.length > 0) {
        avg_rating = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
      }
    }

    return {
      total_trips: trips?.length || 0,
      total_revenue: trips?.reduce((sum, t) => sum + (Number(t.price_ars) || 0), 0) || 0,
      avg_rating,
      last_trip_date: trips?.[0]?.pickup_date || undefined,
    };
  };

  return { clients, isLoading, createClient: createClient_, getClientMetrics, refetch: fetchClients };
}
