'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Search, PlusCircle, Bell, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Mapa', href: '/', icon: Map },
    { label: 'Buscar', href: '/#search-section', icon: Search },
    { label: 'Subir', href: '/upload', icon: PlusCircle, isCta: true },
    { label: 'Alertas', href: '/alerts', icon: Bell },
    { label: 'Perfil', href: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-slate-200/80 dark:border-slate-800 px-3 py-2 pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isCta) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-cyan-500/40 ring-4 ring-white dark:ring-slate-900 active:scale-95 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl transition-colors ${
                isActive
                  ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
