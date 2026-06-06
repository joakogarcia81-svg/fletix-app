'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { LiveLocation, TrackedTrip } from '@/types/tracking';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ── Mock Data for Demo ──────────────────────────────────────────────
const MOCK_TRIPS: TrackedTrip[] = [
  {
    id: '1',
    tripId: 'CRG-8902',
    driverName: 'Juan Carlos Pérez',
    truckPatent: 'AD345FG',
    truckType: 'Sider',
    origin: 'Buenos Aires',
    destination: 'Rosario',
    status: 'EN_RUTA',
    eta: '14:30 hs',
    distanceRemaining: 145,
    location: {
      id: 'loc-1',
      company_id: 'mock',
      trip_id: 'CRG-8902',
      driver_id: 'drv-1',
      latitude: -33.4500,
      longitude: -60.0200,
      speed: 87,
      heading: 315,
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: '2',
    tripId: 'CRG-9104',
    driverName: 'Roberto Gómez',
    truckPatent: 'AE112CC',
    truckType: 'Tolva',
    origin: 'Córdoba',
    destination: 'Mendoza',
    status: 'EN_RUTA',
    eta: '18:45 hs',
    distanceRemaining: 410,
    location: {
      id: 'loc-2',
      company_id: 'mock',
      trip_id: 'CRG-9104',
      driver_id: 'drv-2',
      latitude: -33.0500,
      longitude: -66.3200,
      speed: 92,
      heading: 240,
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: '3',
    tripId: 'CRG-8750',
    driverName: 'Martín López',
    truckPatent: 'AB789GH',
    truckType: 'Chasis',
    origin: 'Rosario',
    destination: 'Buenos Aires',
    status: 'DETENIDO',
    eta: '16:00 hs',
    distanceRemaining: 82,
    location: {
      id: 'loc-3',
      company_id: 'mock',
      trip_id: 'CRG-8750',
      driver_id: 'drv-3',
      latitude: -33.7500,
      longitude: -59.8500,
      speed: 0,
      heading: 120,
      updated_at: new Date(Date.now() - 600_000).toISOString(),
    },
  },
  {
    id: '4',
    tripId: 'CRG-9200',
    driverName: 'Carlos Fernández',
    truckPatent: 'AC456DE',
    truckType: 'Acoplado',
    origin: 'Bahía Blanca',
    destination: 'Neuquén',
    status: 'CARGANDO',
    eta: '--:-- hs',
    distanceRemaining: 560,
    location: {
      id: 'loc-4',
      company_id: 'mock',
      trip_id: 'CRG-9200',
      driver_id: 'drv-4',
      latitude: -38.7183,
      longitude: -62.2661,
      speed: 0,
      heading: 0,
      updated_at: new Date().toISOString(),
    },
  },
];

// ── Simulated movement paths (small increments around Argentine highways) ──
const MOVEMENT_DELTAS = [
  { lat: 0.002, lng: -0.003 },
  { lat: 0.0015, lng: -0.002 },
  { lat: 0.003, lng: -0.001 },
  { lat: 0.001, lng: -0.004 },
  { lat: 0.002, lng: -0.002 },
];

interface UseLiveTrackingOptions {
  companyId?: string;
  useMockData?: boolean;
}

export function useLiveTracking({ companyId, useMockData = false }: UseLiveTrackingOptions = {}) {
  const [trips, setTrips] = useState<TrackedTrip[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef(0);

  // ── Mock Simulation ──
  const startMockSimulation = useCallback(() => {
    setTrips(MOCK_TRIPS);
    setIsConnected(true);
    setLastUpdate(new Date());

    intervalRef.current = setInterval(() => {
      tickRef.current += 1;
      const deltaIdx = tickRef.current % MOVEMENT_DELTAS.length;
      const delta = MOVEMENT_DELTAS[deltaIdx];

      setTrips((prev) =>
        prev.map((trip) => {
          if (trip.status !== 'EN_RUTA' || !trip.location) return trip;

          const speedVariation = Math.floor(Math.random() * 20) - 5;
          return {
            ...trip,
            location: {
              ...trip.location,
              latitude: trip.location.latitude + delta.lat * (Math.random() > 0.5 ? 1 : 0.5),
              longitude: trip.location.longitude + delta.lng * (Math.random() > 0.5 ? 1 : 0.5),
              speed: Math.max(60, (trip.location.speed ?? 80) + speedVariation),
              updated_at: new Date().toISOString(),
            },
            distanceRemaining: Math.max(0, (trip.distanceRemaining ?? 100) - 0.5),
          };
        })
      );
      setLastUpdate(new Date());
    }, 3000); // Update every 3 seconds
  }, []);

  // ── Supabase Realtime Subscription ──
  const startRealtimeSubscription = useCallback(() => {
    if (!companyId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`live_locations_${companyId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_locations',
          filter: `company_id=eq.${companyId}`,
        },
        (payload) => {
          const newLocation = payload.new as LiveLocation;
          setTrips((prev) =>
            prev.map((trip) =>
              trip.tripId === newLocation.trip_id
                ? { ...trip, location: newLocation }
                : trip
            )
          );
          setLastUpdate(new Date());
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;
  }, [companyId]);

  // ── Lifecycle ──
  useEffect(() => {
    if (useMockData) {
      startMockSimulation();
    } else {
      startRealtimeSubscription();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (channelRef.current) {
        const supabase = createClient();
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [useMockData, startMockSimulation, startRealtimeSubscription]);

  return { trips, isConnected, lastUpdate };
}
