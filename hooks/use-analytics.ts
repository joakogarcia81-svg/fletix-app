'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AnalyticsData, AnalyticsKPIs } from '@/types/analytics';

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);

    // In a real production app, you would likely use a Postgres Function (RPC) 
    // to aggregate this data efficiently on the server.
    // For this MVP, we fetch the base data and aggregate on the client, 
    // using mocks where necessary to demonstrate the UI.

    const { data: trips } = await supabase
      .from('trips')
      .select('id, price_ars, status, pickup_date, origin, destination')
      .order('pickup_date', { ascending: false });

    const { data: trucks } = await supabase
      .from('trucks')
      .select('id, operational_status');
    
    // Simplistic aggregations for MVP demo
    const total_trips = trips?.length || 0;
    const total_revenue = trips?.reduce((sum, t) => sum + (Number(t.price_ars) || 0), 0) || 0;
    
    // Mocking expenses to 40% of revenue for demonstration if no expense data is easily available globally
    const total_expenses = total_revenue * 0.4; 
    const net_margin = total_revenue - total_expenses;

    const total_trucks = trucks?.length || 0;
    const active_trucks = trucks?.filter(t => t.operational_status === 'ocupado' || t.operational_status === 'reservado').length || 0;

    const published_loads = trips?.filter(t => t.status === 'pending').length || 0;
    const taken_loads = trips?.filter(t => t.status !== 'pending' && t.status !== 'cancelled').length || 0;

    const kpis: AnalyticsKPIs = {
      total_trips,
      total_revenue,
      total_expenses,
      net_margin,
      total_km: total_trips * 450, // Mock: avg 450km per trip
      active_trucks,
      total_trucks,
      published_loads,
      taken_loads,
    };

    // Mock Monthly Trend
    const monthlyTrend = [
      { month: 'Ene', revenue: 4500000, expenses: 2800000, trips: 15 },
      { month: 'Feb', revenue: 5200000, expenses: 3100000, trips: 18 },
      { month: 'Mar', revenue: 4800000, expenses: 2900000, trips: 16 },
      { month: 'Abr', revenue: 6100000, expenses: 3400000, trips: 22 },
      { month: 'May', revenue: 5900000, expenses: 3200000, trips: 20 },
      { month: 'Jun', revenue: total_revenue > 0 ? total_revenue : 7200000, expenses: total_expenses > 0 ? total_expenses : 3800000, trips: total_trips > 0 ? total_trips : 25 },
    ];

    // Mock Province Distribution
    const provinceDistribution = [
      { province: 'Buenos Aires', trips: 45 },
      { province: 'Córdoba', trips: 25 },
      { province: 'Santa Fe', trips: 20 },
      { province: 'Mendoza', trips: 10 },
    ];

    setData({
      kpis,
      monthlyTrend,
      provinceDistribution,
      recentTrips: trips?.slice(0, 50) || [] // Take last 50 for the table
    });

    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, isLoading, refetch: fetchAnalytics };
}
