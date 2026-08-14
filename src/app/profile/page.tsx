'use client';

import React from 'react';
import { ShieldCheck, Award, Camera, Heart, CheckCircle2, Star, User } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const user = {
    name: 'Ciudadano Colaborador',
    trustScore: 42,
    reportsCount: 8,
    verificationsCount: 15,
    badges: [
      { name: 'Guardia Costero', icon: '🌊', desc: 'Primeros 5 reportes publicados' },
      { name: 'Ojo de Águila', icon: '📸', desc: '10+ verificaciones precisas' },
      { name: 'Pionero de Tulum', icon: '🌴', desc: 'Contribución destacada en Riviera Maya' },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Profile Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
          CC
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {user.name}
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-extrabold border border-cyan-500/20 w-fit mx-auto sm:mx-0">
              Puntaje de Confianza: {user.trustScore} pts
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Miembro activo de la comunidad Sargazo Watch desde 2026.
          </p>
        </div>
      </div>

      {/* Stats Counters Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center gap-1">
          <Camera className="w-5 h-5 text-cyan-500" />
          <span className="text-lg font-extrabold text-slate-900 dark:text-white">{user.reportsCount}</span>
          <span className="text-[10px] text-slate-500">Reportes Subidos</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center gap-1">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span className="text-lg font-extrabold text-slate-900 dark:text-white">{user.verificationsCount}</span>
          <span className="text-[10px] text-slate-500">Verificaciones</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center gap-1">
          <Star className="w-5 h-5 text-amber-500" />
          <span className="text-lg font-extrabold text-slate-900 dark:text-white">{user.badges.length}</span>
          <span className="text-[10px] text-slate-500">Insignias</span>
        </div>
      </div>

      {/* Badges Section */}
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-cyan-500" />
          <span>Insignias de Logros Desbloqueadas</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {user.badges.map((b) => (
            <div
              key={b.name}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center gap-2"
            >
              <span className="text-3xl">{b.icon}</span>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">{b.name}</h4>
              <p className="text-[10px] text-slate-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
