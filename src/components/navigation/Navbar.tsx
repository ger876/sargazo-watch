'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Waves, Search, PlusCircle, Bell, User, Sparkles, Moon, Sun } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Waves className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                Sargazo<span className="text-cyan-600 dark:text-cyan-400">Watch</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                100% GRATIS
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">
              Monitoreo Ciudadano del Caribe
            </p>
          </div>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/"
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            Explorar Playas
          </Link>
          <Link
            href="/alerts"
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <Bell className="w-4 h-4 text-amber-500" />
            Alertas
          </Link>
          <Link
            href="/profile"
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <User className="w-4 h-4 text-blue-500" />
            Mi Perfil
          </Link>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Cambiar tema"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href="/upload"
            className="py-2 px-4 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Subir Reporte</span>
          </Link>
        </div>

        {/* Mobile Theme Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href="/upload"
            className="p-2.5 bg-cyan-600 text-white rounded-xl shadow-md shadow-cyan-500/20"
          >
            <PlusCircle className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};
