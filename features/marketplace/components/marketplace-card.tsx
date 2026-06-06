import * as React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Truck, Star, Building2, PackageOpen, BadgeCheck, Clock, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatARS, formatTonnes, formatDate } from '@/lib/formatters';
import type { MarketplaceLoad } from '@/actions/marketplace';

interface MarketplaceCardProps {
  load: MarketplaceLoad;
}

export function MarketplaceCard({ load }: MarketplaceCardProps) {
  const [isSaved, setIsSaved] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-5 backdrop-blur-md transition-colors hover:bg-neutral-900/80 hover:border-neutral-700/80"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3 items-center">
          <div className="h-10 w-10 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-700/50">
            <Building2 className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-neutral-200">{load.company.name}</h3>
              {load.company.verified && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}
            </div>
            <div className="flex items-center gap-1 text-xs text-neutral-500 font-medium">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <span>{load.company.reputation.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsSaved(!isSaved)}
          className={cn(
            "p-2 rounded-lg transition-colors border",
            isSaved 
              ? "bg-blue-500/10 text-blue-500 border-blue-500/20" 
              : "bg-neutral-800/50 text-neutral-400 border-transparent hover:bg-neutral-800 hover:text-white"
          )}
        >
          <Bookmark className={cn("h-4 w-4", isSaved && "fill-blue-500")} />
        </button>
      </div>

      {/* Route Timeline */}
      <div className="relative pl-3 space-y-4 mb-6">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-neutral-600 via-neutral-700/50 to-blue-500/50" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="h-2 w-2 rounded-full bg-neutral-400 ring-4 ring-neutral-900" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Origen</span>
            <span className="text-sm font-semibold text-white">{load.origin}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="h-2 w-2 rounded-full bg-blue-500 ring-4 ring-neutral-900" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Destino</span>
            <span className="text-sm font-semibold text-white">{load.destination}</span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-3 rounded-xl bg-neutral-950/50 border border-neutral-800/40">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <Clock className="h-3 w-3" /> Fecha
          </span>
          <span className="text-xs font-semibold text-neutral-200">{formatDate(load.pickupDate)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <Truck className="h-3 w-3" /> Equipo
          </span>
          <span className="text-xs font-semibold text-neutral-200">{load.truckType}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <PackageOpen className="h-3 w-3" /> Peso
          </span>
          <span className="text-xs font-semibold text-neutral-200">
            {formatTonnes(load.weightKg)}
            {load.isPartial && <span className="ml-1 text-emerald-500 text-[10px]">(LTL)</span>}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <Navigation className="h-3 w-3" /> Distancia
          </span>
          <span className="text-xs font-semibold text-neutral-200">{load.distanceKm} km</span>
        </div>
      </div>

      {/* Footer / Call to Action */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-800/60">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Tarifa Ofrecida</span>
          <span className="text-xl font-black text-emerald-400">{formatARS(load.tariffARS)}</span>
        </div>
        <button className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">
          Postularse
        </button>
      </div>
    </motion.div>
  );
}

export function MarketplaceCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-5 relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-neutral-800/20 to-transparent" />
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-neutral-800/60 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-neutral-800/60 rounded-full animate-pulse" />
          <div className="h-3 w-16 bg-neutral-800/40 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="space-y-6 pl-4 mb-6 relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-neutral-800/60" />
        <div className="h-4 w-48 bg-neutral-800/60 rounded-full animate-pulse" />
        <div className="h-4 w-40 bg-neutral-800/60 rounded-full animate-pulse" />
      </div>
      <div className="h-16 w-full rounded-xl bg-neutral-800/40 animate-pulse mb-6" />
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-neutral-800/60">
        <div className="h-8 w-24 bg-neutral-800/60 rounded-full animate-pulse" />
        <div className="h-10 w-28 bg-neutral-800/60 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
