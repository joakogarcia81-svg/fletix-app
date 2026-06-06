'use client';

import * as React from 'react';
import { Sidebar } from '@/features/dashboard/components/sidebar';
import { Topbar } from '@/features/dashboard/components/topbar';
import { MobileNav } from '@/features/dashboard/components/mobile-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      {/* Collapsible Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto space-y-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
