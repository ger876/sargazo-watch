'use client';

import React, { useEffect, useState } from 'react';
import { Beach } from '@/lib/types';
import { getBeaches } from '@/lib/supabase';
import { Bell, BellOff, CheckCircle2, ShieldAlert, Sparkles, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function AlertsPage() {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [subscribedBeachIds, setSubscribedBeachIds] = useState<string[]>([]);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const b = await getBeaches();
        setBeaches(b);
        // Default subscribed beaches for demo
        setSubscribedBeachIds([b[0]?.id, b[1]?.id].filter(Boolean));
      } catch (e) {
        console.error('Error cargando playas', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleSubscription = (beachId: string) => {
    if (subscribedBeachIds.includes(beachId)) {
      setSubscribedBeachIds(subscribedBeachIds.filter((id) => id !== beachId));
    } else {
      setSubscribedBeachIds([...subscribedBeachIds, beachId]);
    }
  };

  const handleTogglePush = async () => {
    if (!('Notification' in window)) {
      alert('Tu navegador no soporta Notificaciones Web Push.');
      return;
    }

    if (Notification.permission === 'granted') {
      setPushEnabled(!pushEnabled);
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushEnabled(true);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-amber-500" />
          <span>Alertas de Sargazo en Tiempo Real</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Recibe notificaciones automáticas cuando una de tus playas favoritas cambie a nivel Limpio o Alto.
        </p>
      </div>

      {/* Web Push Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Notificaciones Web Push (100% Gratis)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {pushEnabled
                ? 'Las notificaciones del navegador están activas.'
                : 'Permite notificaciones en tu móvil o navegador sin pagar subscripciones.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleTogglePush}
          className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
            pushEnabled
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
          }`}
        >
          {pushEnabled ? '✓ Notificaciones Activas' : 'Activar Notificaciones'}
        </button>
      </div>

      {/* Beaches Subscriptions List */}
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
          Tus Playas Monitoreadas ({subscribedBeachIds.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {beaches.map((beach) => {
            const isSubbed = subscribedBeachIds.includes(beach.id);

            return (
              <div
                key={beach.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isSubbed
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-900 dark:text-cyan-100'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <h4 className="font-bold text-xs">{beach.name}</h4>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-cyan-500" />
                    {beach.municipality}
                  </p>
                </div>

                <button
                  onClick={() => toggleSubscription(beach.id)}
                  className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                    isSubbed
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {isSubbed ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
