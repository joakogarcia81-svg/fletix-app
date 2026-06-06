'use client';

import * as React from 'react';
import { Share2, AlertTriangle, MessageSquare, PhoneCall } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

export function QuickActionsFAB() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { showToast } = useToast();

  const handleAction = (action: string) => {
    setIsOpen(false);
    showToast(`Acción activada: ${action}`, 'info');
  };

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end space-y-3">
      {/* Expanded Actions */}
      <div 
        className={cn(
          "flex flex-col space-y-3 transition-all duration-300 origin-bottom right-0",
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-50 translate-y-10 pointer-events-none"
        )}
      >
        <button onClick={() => handleAction('Soporte')} className="flex items-center gap-2 group">
          <span className="bg-neutral-800 text-xs font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">Soporte</span>
          <div className="bg-neutral-800 p-3 rounded-full shadow-xl border border-neutral-700 text-neutral-300">
            <MessageSquare className="h-5 w-5" />
          </div>
        </button>
        
        <button onClick={() => handleAction('Llamar Logística')} className="flex items-center gap-2 group">
          <span className="bg-neutral-800 text-xs font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">Central</span>
          <div className="bg-neutral-800 p-3 rounded-full shadow-xl border border-neutral-700 text-neutral-300">
            <PhoneCall className="h-5 w-5" />
          </div>
        </button>

        <button onClick={() => handleAction('Reportar Problema')} className="flex items-center gap-2 group">
          <span className="bg-red-500/20 text-red-500 text-xs font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">Reportar</span>
          <div className="bg-red-500 p-3 rounded-full shadow-xl text-white">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </button>
      </div>

      {/* Main Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-4 rounded-full shadow-2xl transition-all duration-300",
          isOpen ? "bg-neutral-700 text-white rotate-45" : "bg-blue-600 text-white hover:bg-blue-500"
        )}
      >
        <Share2 className="h-6 w-6" />
      </button>
    </div>
  );
}
