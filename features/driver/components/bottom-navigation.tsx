'use client';

import * as React from 'react';
import { Home, Compass, User, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Inicio', icon: Home, href: '/home' },
    { label: 'Cargas', icon: Compass, href: '/cargas' },
    { label: 'Avisos', icon: Bell, href: '/avisos' },
    { label: 'Perfil', icon: User, href: '/perfil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/90 backdrop-blur-lg border-t border-neutral-800/60 pb-safe">
      <div className="flex items-center justify-around px-2 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/home');
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href} // Mocks routing for now
              className={cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
                isActive ? 'text-blue-500' : 'text-neutral-500 hover:text-neutral-300'
              )}
            >
              <div className={cn(
                'p-1.5 rounded-full transition-all duration-300',
                isActive && 'bg-blue-500/10'
              )}>
                <Icon className={cn('h-5 w-5', isActive && 'fill-blue-500/20')} />
              </div>
              <span className="text-[10px] font-semibold tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
