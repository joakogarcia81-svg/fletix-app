'use client';

import * as React from 'react';
import { MatchResult } from '@/lib/matching/matching-engine';
import { MapPin, Package, DollarSign, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TripMatchCardProps {
  match: MatchResult;
  onClick?: () => void;
}

export function TripMatchCard({ match, onClick }: TripMatchCardProps) {
  const { trip, score, reasons, badges, distance_to_origin_km } = match;

  // Formatting helpers
  const formatCurrency = (amount?: number) => {
    if (!amount) return 'A convenir';
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount);
  };
  const formatWeight = (kg: number) => {
    if (kg >= 1000) return `${(kg / 1000).toFixed(1)} tn`;
    return `${kg} kg`;
  };

  // Color coding based on score
  const scoreColor = score >= 90 ? 'text-emerald-500' : score >= 70 ? 'text-emerald-400' : 'text-orange-500';
  const scoreBg = score >= 90 ? 'bg-emerald-500/10' : score >= 70 ? 'bg-emerald-400/10' : 'bg-orange-500/10';

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 hover:border-neutral-700 hover:bg-neutral-800/80 transition-all duration-200 group relative overflow-hidden"
    >
      {/* Background Accent for high scores */}
      {score >= 90 && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-10 -mt-10 rounded-full" />
      )}

      {/* Top Row: Score & Badges */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className={cn("px-2.5 py-1 rounded-lg font-black text-sm flex items-center gap-1", scoreBg, scoreColor)}>
            <Zap className="h-4 w-4" fill="currentColor" />
            {score}% Match
          </div>
          {badges.map((badge, idx) => (
            <span key={idx} className="hidden sm:inline-block px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
              {badge}
            </span>
          ))}
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-white">{formatCurrency(trip.price_ars)}</p>
        </div>
      </div>

      {/* Route & Distance */}
      <div className="flex items-start gap-4 mb-5 relative z-10">
        <div className="flex flex-col items-center mt-1">
          <div className="h-3 w-3 rounded-full border-2 border-emerald-500 bg-neutral-900" />
          <div className="h-8 w-px bg-neutral-700 my-1" />
          <div className="h-3 w-3 rounded-full border-2 border-blue-500 bg-neutral-900" />
        </div>
        <div className="flex-1">
          <div className="mb-3">
            <p className="text-sm font-bold text-white leading-tight">
              {trip.origin.city || 'Origen no definido'}
              {trip.origin.province && <span className="text-neutral-500 font-normal">, {trip.origin.province}</span>}
            </p>
            <p className="text-[10px] text-neutral-400 font-medium">A {distance_to_origin_km} km de ti</p>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">
              {trip.destination.city || 'Destino no definido'}
              {trip.destination.province && <span className="text-neutral-500 font-normal">, {trip.destination.province}</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Cargo Details & Reasons */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4 border-t border-neutral-800/60 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2 text-xs font-medium text-neutral-300">
            <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5 text-neutral-500" /> {trip.cargo_type}</span>
            <span className="text-neutral-700">•</span>
            <span className="flex items-center gap-1 font-bold">{formatWeight(trip.weight_kg)}</span>
          </div>
          
          {/* Engine Reasons */}
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {reasons.slice(0, 2).map((reason, idx) => (
              <span key={idx} className="flex items-center gap-1 text-[10px] text-neutral-500">
                <CheckCircle2 className="h-3 w-3 text-emerald-500/50" />
                {reason}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex-shrink-0 flex items-center justify-end sm:justify-start">
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
            Ver detalles <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </button>
  );
}
