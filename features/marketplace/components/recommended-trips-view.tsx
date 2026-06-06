'use client';

import * as React from 'react';
import { useTripMatching } from '@/hooks/use-trip-matching';
import { TripMatchCard } from './trip-match-card';
import { Loader2, Sparkles, SlidersHorizontal, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function RecommendedTripsView() {
  const { matches, isLoading } = useTripMatching();
  const router = useRouter();

  // Separar en "Match Perfecto" y "Otras opciones"
  const perfectMatches = matches.filter(m => m.score >= 90);
  const otherMatches = matches.filter(m => m.score < 90);

  return (
    <div className="w-full max-w-4xl mx-auto pb-12">
      {/* Header Estilizado */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Recomendaciones para Ti</h1>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-400">
            Cargas optimizadas para tu camión y ubicación actual.
          </p>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-bold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtros
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
          <p className="text-sm font-medium text-neutral-400">Analizando rutas y cargas disponibles...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-neutral-900/50 rounded-3xl border border-neutral-800 border-dashed">
          <div className="h-16 w-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-4 border border-neutral-800">
            <Map className="h-7 w-7 text-neutral-500 opacity-50" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Sin recomendaciones óptimas</h3>
          <p className="text-sm text-neutral-400 max-w-sm">
            Actualmente no hay cargas cercanas que coincidan exactamente con el perfil de tu camión.
          </p>
          <button className="mt-6 px-6 py-2.5 bg-white text-black font-bold rounded-xl text-sm hover:bg-neutral-200 transition-colors">
            Explorar todas las cargas
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Perfect Matches */}
          {perfectMatches.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Match Perfecto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {perfectMatches.map((match) => (
                  <TripMatchCard 
                    key={match.trip.id} 
                    match={match} 
                    onClick={() => router.push(`/trips/${match.trip.id}`)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Other Matches */}
          {otherMatches.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">
                Otras opciones interesantes
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {otherMatches.map((match) => (
                  <TripMatchCard 
                    key={match.trip.id} 
                    match={match} 
                    onClick={() => router.push(`/trips/${match.trip.id}`)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
