'use client';

import * as React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { MarketplaceFilters } from './marketplace-filters';
import { MarketplaceCard, MarketplaceCardSkeleton } from './marketplace-card';
import { useIntersection } from '@/hooks/use-intersection';
import { fetchMarketplaceLoads, type MarketplaceFilters as FiltersType, type MarketplaceLoad } from '@/actions/marketplace';

export function MarketplaceView() {
  const [filters, setFilters] = React.useState<FiltersType>({});
  const [searchInput, setSearchInput] = React.useState('');
  
  const [loads, setLoads] = React.useState<MarketplaceLoad[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = React.useState(false);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, query: searchInput || undefined }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Initial fetch and filter changes
  React.useEffect(() => {
    let active = true;
    setIsLoading(true);
    setPage(1);
    
    fetchMarketplaceLoads(filters, 1, 6).then((res) => {
      if (active) {
        setLoads(res.data);
        setHasMore(res.hasMore);
        setIsLoading(false);
      }
    });

    return () => { active = false; };
  }, [filters]);

  // Infinite Scroll Trigger
  const [bottomRef, isIntersecting] = useIntersection({ threshold: 0.5 });

  React.useEffect(() => {
    if (isIntersecting && hasMore && !isLoading && !isFetchingNextPage) {
      setIsFetchingNextPage(true);
      const nextPage = page + 1;
      
      fetchMarketplaceLoads(filters, nextPage, 6).then((res) => {
        setLoads(prev => [...prev, ...res.data]);
        setHasMore(res.hasMore);
        setPage(nextPage);
        setIsFetchingNextPage(false);
      });
    }
  }, [isIntersecting, hasMore, isLoading, isFetchingNextPage, filters, page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <PageHeader
          title="Mercado de Cargas"
          description="Encuentra viajes disponibles publicados por dadores de carga verificados."
        />
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-500" />
          </div>
          <input
            type="text"
            placeholder="Buscar por origen, destino o empresa..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-neutral-900/40 border border-neutral-800/60 rounded-xl text-sm text-neutral-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none backdrop-blur-md"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sidebar: Filters */}
        <div className="w-full lg:w-64 shrink-0">
          <MarketplaceFilters filters={filters} onChange={setFilters} />
        </div>

        {/* Right Content: Feed */}
        <div className="flex-1 w-full min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <MarketplaceCardSkeleton key={i} />
              ))}
            </div>
          ) : loads.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loads.map((load) => (
                  <MarketplaceCard key={load.id} load={load} />
                ))}
              </div>
              
              {/* Infinite Scroll Sentinel */}
              <div ref={bottomRef as React.RefObject<HTMLDivElement>} className="py-8 flex justify-center items-center">
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-2 text-neutral-500 text-sm font-semibold">
                    <Loader2 className="h-4 w-4 animate-spin" /> Cargando más viajes...
                  </div>
                ) : !hasMore ? (
                  <span className="text-neutral-500 text-sm font-medium">No hay más viajes disponibles.</span>
                ) : null}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-neutral-900/20 border border-neutral-800/40 rounded-2xl border-dashed">
              <Search className="h-10 w-10 text-neutral-600 mb-4" />
              <h3 className="text-lg font-bold text-neutral-200 mb-1">No se encontraron viajes</h3>
              <p className="text-sm text-neutral-500 max-w-sm">
                Intenta ajustar los filtros o el término de búsqueda para encontrar cargas disponibles.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
