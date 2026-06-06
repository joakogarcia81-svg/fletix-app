import { RecommendedTripsView } from '@/features/marketplace/components/recommended-trips-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Viajes Recomendados | Fletix',
  description: 'Descubre cargas optimizadas para tu camión y ubicación actual',
};

export default function RecommendedTripsPage() {
  return (
    <div className="w-full">
      <RecommendedTripsView />
    </div>
  );
}
