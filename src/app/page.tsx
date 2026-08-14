'use client';

import React, { useEffect, useState } from 'react';
import { Beach, Report, SargazoLevel } from '@/lib/types';
import { getBeaches, getReports } from '@/lib/supabase';
import { calculateBeachStatus, calculateDistanceKm } from '@/lib/algorithms';
import { SARGAZO_LEVELS } from '@/lib/constants';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { BeachCard } from '@/components/beach/BeachCard';
import { SargazoLevelBadge } from '@/components/ui/SargazoLevelBadge';
import Link from 'next/link';
import {
  Map as MapIcon,
  List,
  Search,
  Filter,
  Navigation,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  PlusCircle,
  Clock,
  Compass
} from 'lucide-react';

export default function HomePage() {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<SargazoLevel | 'ALL'>('ALL');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [fetchedBeaches, fetchedReports] = await Promise.all([
          getBeaches(),
          getReports()
        ]);

        // Compute current status for each beach
        const beachesWithStatus = fetchedBeaches.map((beach) => {
          const beachReports = fetchedReports.filter((r) => r.beach_id === beach.id);
          const status = calculateBeachStatus(beachReports);
          return {
            ...beach,
            current_status: status
          };
        });

        setBeaches(beachesWithStatus);
        setReports(fetchedReports);
      } catch (e) {
        console.error('Error cargando datos de playas', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Request user GPS location
  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setLocating(false);

        // Calculate distances
        setBeaches((prev) =>
          prev
            .map((b) => ({
              ...b,
              distance_km: calculateDistanceKm(coords.lat, coords.lng, b.lat, b.lng)
            }))
            .sort((a, b) => (a.distance_km || 9999) - (b.distance_km || 9999))
        );
      },
      () => {
        setLocating(false);
      }
    );
  };

  // Filter beaches based on search & sargazo level
  const filteredBeaches = beaches.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.municipality.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel =
      selectedLevelFilter === 'ALL' || b.current_status?.level === selectedLevelFilter;

    return matchesSearch && matchesLevel;
  });

  // Calculate summary counts
  const cleanBeachesCount = beaches.filter(
    (b) => b.current_status?.level === 'NONE' || b.current_status?.level === 'LOW'
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Community Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-cyan-900 via-teal-900 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold w-fit border border-cyan-400/30">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Monitoreo Comunitario en Vivo
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              ¿Cómo está la playa hoy? 🌊
            </h1>
            <p className="text-xs md:text-sm text-slate-300">
              Consulta reportes fotográficos en tiempo real con timestamp y geolocalización aportados por ciudadanos y turistas.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{cleanBeachesCount} playas limpias hoy</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>{reports.length} reportes verificados</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGetLocation}
              disabled={locating}
              className="py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 backdrop-blur-md border border-white/20 transition-all active:scale-95"
            >
              <Navigation className={`w-4 h-4 ${locating ? 'animate-spin' : 'text-cyan-400'}`} />
              <span>{locating ? 'Ubicando...' : 'Playas Cercanas a mi GPS'}</span>
            </button>

            <Link
              href="/upload"
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Reportar mi Playa</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & View Mode Toggle */}
      <div id="search-section" className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar playa (Cancún, Playa del Carmen, Tulum, Cozumel...)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-xs"
            />
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-2xl w-fit self-end sm:self-auto">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Mapa</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Lista ({filteredBeaches.length})</span>
            </button>
          </div>
        </div>

        {/* Level Filters Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 whitespace-nowrap mr-1">
            <Filter className="w-3 h-3 text-cyan-500" />
            Nivel:
          </span>

          <button
            onClick={() => setSelectedLevelFilter('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              selectedLevelFilter === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Todas ({beaches.length})
          </button>

          {(Object.keys(SARGAZO_LEVELS) as SargazoLevel[]).map((level) => {
            const meta = SARGAZO_LEVELS[level];
            const isSelected = selectedLevelFilter === level;
            const count = beaches.filter((b) => b.current_status?.level === level).length;

            return (
              <button
                key={level}
                onClick={() => setSelectedLevelFilter(isSelected ? 'ALL' : level)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 whitespace-nowrap ${
                  isSelected
                    ? `${meta.badgeTailwind}`
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{meta.emoji}</span>
                <span>{meta.shortLabel} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'map' ? (
        <div className="w-full h-[520px] rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
          <InteractiveMap beaches={filteredBeaches} userLocation={userLocation} />
        </div>
      ) : (
        <div>
          {filteredBeaches.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3">
              <Compass className="w-12 h-12 text-slate-400" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200">No se encontraron playas</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Intenta ajustar tu búsqueda o borrar los filtros de nivel de sargazo.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBeaches.map((beach) => (
                <BeachCard key={beach.id} beach={beach} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Monetization Placeholder & Donación (100% Gratis) */}
      <div className="mt-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
          <HeartHandshake className="w-6 h-6 text-rose-500 shrink-0" />
          <span>
            <strong>Sargazo Watch es un proyecto 100% gratuito e independiente.</strong> Ayúdanos a mantener los servidores comunitarios activos.
          </span>
        </div>
        <a
          href="https://ko-fi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1.5 transition-colors"
        >
          ☕ Apoyar con un café (Ko-fi)
        </a>
      </div>
    </div>
  );
}
