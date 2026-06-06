import { TripFinancials } from '@/features/finances/components/trip-financials';
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Liquidación de Viaje | Fletix',
};

export default async function TripLiquidacionPage({ params }: { params: Promise<{ id: string }> }) {
  const tripId = (await params).id;
  
  // En producción, buscarías el viaje real aquí.
  // Para MVP usamos un valor base ficticio.
  const basePriceArs = 1500000; 

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      <div className="mb-6">
        <Link href="/finanzas" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Volver a Finanzas
        </Link>
        <h1 className="text-2xl font-black text-white tracking-tight">Liquidación de Viaje</h1>
        <p className="text-sm text-neutral-500">ID: {tripId}</p>
      </div>

      <TripFinancials tripId={tripId} basePriceArs={basePriceArs} />
    </div>
  );
}
