import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const FinancialDashboard = dynamic(
  () => import('@/features/finances/components/financial-dashboard').then(mod => mod.FinancialDashboard),
  { ssr: false, loading: () => <div className="h-[600px] w-full animate-pulse bg-neutral-900 rounded-3xl mt-6 border border-neutral-800" /> }
);

export const metadata: Metadata = {
  title: 'Finanzas | Fletix',
  description: 'Control de rentabilidad, gastos operativos e ingresos',
};

export default function FinancesPage() {
  return (
    <div className="w-full pb-12">
      <FinancialDashboard />
    </div>
  );
}
