'use server';

import { VehicleType } from '@/types/logistics';

export interface MarketplaceLoad {
  id: string;
  origin: string;
  destination: string;
  distanceKm: number;
  tariffARS: number;
  weightKg: number;
  truckType: VehicleType | 'CUALQUIERA';
  company: {
    name: string;
    reputation: number;
    verified: boolean;
  };
  pickupDate: string;
  status: 'available' | 'negotiating' | 'taken';
  isPartial: boolean;
}

export interface MarketplaceFilters {
  query?: string;
  province?: string;
  truckType?: string;
  isPartial?: boolean;
}

const generateMockLoads = (page: number, limit: number): MarketplaceLoad[] => {
  const provinces = ['Buenos Aires', 'Santa Fe', 'Córdoba', 'Mendoza', 'Tucumán'];
  const companies = ['Cargill', 'Arcor', 'Quilmes', 'Loma Negra', 'Ternium'];
  const truckTypes: VehicleType[] = ['SIDER', 'CHASIS', 'ACOPLADO', 'TOLVA', 'REFRIGERADO'];

  return Array.from({ length: limit }).map((_, i) => {
    const seed = page * limit + i;
    const isPartial = seed % 4 === 0; // 25% partial
    const tType = truckTypes[seed % truckTypes.length];
    
    return {
      id: `mkt-load-${seed}`,
      origin: `Ciudad ${seed}, ${provinces[seed % provinces.length]}`,
      destination: `Destino ${seed + 1}, ${provinces[(seed + 1) % provinces.length]}`,
      distanceKm: 150 + (seed * 35) % 1000,
      tariffARS: 350000 + (seed * 15000) % 2000000,
      weightKg: isPartial ? 2000 + (seed * 500) % 8000 : 28000,
      truckType: tType,
      company: {
        name: companies[seed % companies.length],
        reputation: 3.5 + (seed % 15) / 10,
        verified: seed % 3 !== 0,
      },
      pickupDate: new Date(Date.now() + seed * 86400000).toISOString().split('T')[0],
      status: seed % 10 === 0 ? 'negotiating' : 'available',
      isPartial,
    };
  });
};

export async function fetchMarketplaceLoads(
  filters: MarketplaceFilters,
  page: number = 1,
  limit: number = 10
) {
  // Simulate network latency (800ms)
  await new Promise((resolve) => setTimeout(resolve, 800));

  let loads = generateMockLoads(page, limit);

  // Apply basic mock filtering
  if (filters.query) {
    const q = filters.query.toLowerCase();
    loads = loads.filter(
      (l) =>
        l.origin.toLowerCase().includes(q) ||
        l.destination.toLowerCase().includes(q) ||
        l.company.name.toLowerCase().includes(q)
    );
  }

  if (filters.province && filters.province !== 'all') {
    loads = loads.filter((l) => l.origin.includes(filters.province!) || l.destination.includes(filters.province!));
  }

  if (filters.truckType && filters.truckType !== 'all') {
    loads = loads.filter((l) => l.truckType === filters.truckType);
  }

  if (filters.isPartial !== undefined) {
    loads = loads.filter((l) => l.isPartial === filters.isPartial);
  }

  // Simulate total pages for infinite scroll ending
  const hasMore = page < 5; // Allow up to 5 pages of mock data

  return {
    data: loads,
    hasMore,
    nextPage: hasMore ? page + 1 : null,
  };
}
