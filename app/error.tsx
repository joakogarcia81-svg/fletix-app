'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, this would send the error to Sentry or Vercel Analytics
    console.error('Aplicación falló en tiempo de ejecución:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="mx-auto w-16 h-16 bg-red-500/10 flex items-center justify-center rounded-2xl mb-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white tracking-tight">Algo salió mal</h1>
          <p className="text-neutral-400 text-sm">
            Ha ocurrido un error inesperado al procesar tu solicitud. Nuestro equipo ya ha sido notificado.
          </p>
        </div>

        {/* Displaying digest if available for tracing */}
        {error.digest && (
          <p className="text-xs font-mono text-neutral-600 bg-neutral-950 p-2 rounded-lg break-all">
            Error ID: {error.digest}
          </p>
        )}

        <Button 
          onClick={() => reset()}
          className="w-full bg-white text-black hover:bg-neutral-200 font-bold"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Intentar nuevamente
        </Button>
      </div>
    </div>
  );
}
