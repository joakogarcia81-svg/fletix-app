import * as React from 'react';
import { BottomNavigation } from '@/features/driver/components/bottom-navigation';

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-blue-500/30 pb-[80px]">
      {/* 
        This wrapper forces the app to behave like a mobile app. 
        On desktop, it centers the view like a phone simulator.
      */}
      <div className="mx-auto max-w-md w-full min-h-screen bg-neutral-950 relative shadow-2xl overflow-x-hidden">
        {/* Main Content Area */}
        <main className="w-full min-h-[calc(100vh-80px)]">
          {children}
        </main>
        
        <BottomNavigation />
      </div>
    </div>
  );
}
