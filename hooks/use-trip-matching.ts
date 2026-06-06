'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MatchingEngine, TripOpportunity, TruckProfile, Location, MatchResult } from '@/lib/matching/matching-engine';

interface UseTripMatchingOptions {
  mockDriverLocation?: Location;
  mockTruckProfile?: TruckProfile;
}

// Mocks para la demostración rápida
const DEFAULT_MOCK_LOCATION: Location = { lat: -34.6037, lng: -58.3816, city: 'Buenos Aires' };
const DEFAULT_MOCK_TRUCK: TruckProfile = {
  id: 'mock-truck-1',
  type: 'Sider',
  capacity_kg: 28000,
  home_base: { lat: -32.9468, lng: -60.6393, city: 'Rosario' } // Rosario
};

export function useTripMatching(options?: UseTripMatchingOptions) {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const engine = useMemo(() => new MatchingEngine(), []);
  const supabase = createClient();

  useEffect(() => {
    const fetchAndMatch = async () => {
      setIsLoading(true);

      // 1. Obtener viajes disponibles (pending)
      const { data: tripsData, error } = await supabase
        .from('trips')
        .select('*')
        .eq('status', 'pending');

      if (error || !tripsData) {
        setIsLoading(false);
        return;
      }

      // Convert DB trips to TripOpportunity
      const opportunities: TripOpportunity[] = tripsData.map(t => ({
        id: t.id,
        origin: t.origin as unknown as Location,
        destination: t.destination as unknown as Location,
        cargo_type: t.cargo_type,
        weight_kg: Number(t.weight_kg),
        price_ars: t.price_ars ? Number(t.price_ars) : undefined,
      }));

      // 2. Obtener datos del chofer/camión (usando Mocks para MVP rápido si no se proveen)
      const location = options?.mockDriverLocation || DEFAULT_MOCK_LOCATION;
      const truck = options?.mockTruckProfile || DEFAULT_MOCK_TRUCK;

      // 3. Ejecutar el Motor
      const recommendations = engine.getRecommendations(opportunities, truck, location);
      
      // Si la DB está vacía, añadiremos unos Mocks inteligentes para la DEMO
      if (recommendations.length === 0) {
        const mockTrips: TripOpportunity[] = [
          {
            id: 'mock-1',
            origin: { lat: -34.5, lng: -58.4, city: 'CABA', province: 'Buenos Aires' },
            destination: { lat: -32.95, lng: -60.65, city: 'Rosario', province: 'Santa Fe' },
            cargo_type: 'Pallets Generales',
            weight_kg: 24000,
            price_ars: 950000
          },
          {
            id: 'mock-2',
            origin: { lat: -34.65, lng: -58.3, city: 'Avellaneda', province: 'Buenos Aires' },
            destination: { lat: -31.42, lng: -64.18, city: 'Córdoba', province: 'Córdoba' },
            cargo_type: 'Electrónica',
            weight_kg: 15000,
            price_ars: 1200000
          },
          {
            id: 'mock-3',
            origin: { lat: -34.4, lng: -58.7, city: 'Pilar', province: 'Buenos Aires' },
            destination: { lat: -38.0, lng: -57.5, city: 'Mar del Plata', province: 'Buenos Aires' },
            cargo_type: 'Alimentos Secos',
            weight_kg: 28000,
            price_ars: 650000
          }
        ];
        const mockMatches = engine.getRecommendations(mockTrips, truck, location);
        setMatches(mockMatches);
      } else {
        setMatches(recommendations);
      }

      setIsLoading(false);
    };

    fetchAndMatch();
  }, [engine, supabase, options?.mockDriverLocation, options?.mockTruckProfile]);

  return { matches, isLoading };
}
