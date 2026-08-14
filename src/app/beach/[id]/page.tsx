'use client';

import React, { useEffect, useState, use } from 'react';
import { Beach, Report } from '@/lib/types';
import { getBeachById, getReports, getBeaches } from '@/lib/supabase';
import { calculateBeachStatus, calculateDistanceKm, formatTimeAgo } from '@/lib/algorithms';
import { SargazoLevelBadge } from '@/components/ui/SargazoLevelBadge';
import { VerificationBar } from '@/components/report/VerificationBar';
import Link from 'next/link';
import {
  MapPin,
  ArrowLeft,
  Share2,
  Bell,
  Clock,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function BeachDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [beach, setBeach] = useState<Beach | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [nearbyCleanBeaches, setNearbyCleanBeaches] = useState<Beach[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    async function loadBeachDetails() {
      try {
        setLoading(true);
        const [fetchedBeach, fetchedReports, allBeaches] = await Promise.all([
          getBeachById(id),
          getReports(id),
          getBeaches()
        ]);

        if (fetchedBeach) {
          const status = calculateBeachStatus(fetchedReports);
          setBeach({ ...fetchedBeach, current_status: status });
          setReports(fetchedReports);

          // Find nearby clean beaches (NONE or LOW sargazo level)
          const clean = allBeaches
            .filter((b) => b.id !== id)
            .map((b) => {
              const bReports = fetchedReports.filter((r) => r.beach_id === b.id);
              const bStatus = calculateBeachStatus(bReports);
              return {
                ...b,
                current_status: bStatus,
                distance_km: calculateDistanceKm(fetchedBeach.lat, fetchedBeach.lng, b.lat, b.lng)
              };
            })
            .filter((b) => b.current_status?.level === 'NONE' || b.current_status?.level === 'LOW')
            .sort((a, b) => (a.distance_km || 999) - (b.distance_km || 999))
            .slice(0, 3);

          setNearbyCleanBeaches(clean);
        }
      } catch (e) {
        console.error('Error cargando detalle de playa', e);
      } finally {
        setLoading(false);
      }
    }
    loadBeachDetails();
  }, [id]);

  const handleShare = async () => {
    if (!beach) return;
    const shareData = {
      title: `Sargazo Watch — ${beach.name}`,
      text: `Consulta el estado actual de sargazo en ${beach.name}: ${beach.current_status?.label}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback copy
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500">Cargando estado de la playa...</p>
      </div>
    );
  }

  if (!beach) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold">Playa no encontrada</h2>
        <Link href="/" className="px-4 py-2 bg-cyan-600 text-white rounded-xl text-xs font-bold">
          Volver al Mapa
        </Link>
      </div>
    );
  }

  const status = beach.current_status;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-cyan-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Mapa</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubscribed(!subscribed)}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              subscribed
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{subscribed ? 'Suscrito a alertas' : 'Recibir alertas'}</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedShare ? '¡Enlace copiado!' : 'Compartir'}</span>
          </button>
        </div>
      </div>

      {/* Main Banner Card */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
        <div className="relative h-64 sm:h-80 w-full bg-slate-800">
          <img
            src={beach.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'}
            alt={beach.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 backdrop-blur-md">
                  {beach.municipality}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-md">
                {beach.name}
              </h1>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {beach.state}, México
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 flex flex-col items-start gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                Estado Actual Calculado
              </span>
              <SargazoLevelBadge level={status?.level} size="lg" />
              <span className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                {status?.lastUpdatedText}
              </span>
            </div>
          </div>
        </div>

        {/* Status Analysis & Trust Score */}
        <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  Confianza del algoritmo: {status?.confidenceScore}%
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ponderación basada en {reports.length} reportes recientes y votos comunitarios.
              </p>
            </div>
          </div>

          <Link
            href={`/upload?beach_id=${beach.id}`}
            className="py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/20 transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Agregar Reporte de Foto</span>
          </Link>
        </div>
      </div>

      {/* Reports Gallery / Timeline */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Reportes Fotográficos Recientes</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold">
              {reports.length}
            </span>
          </h2>
        </div>

        {reports.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3">
            <Compass className="w-10 h-10 text-slate-400" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
              No hay reportes fotográficos en las últimas 48h
            </h3>
            <p className="text-xs text-slate-500 max-w-xs">
              ¡Sé el primero en compartir una foto de {beach.name} hoy!
            </p>
            <Link
              href={`/upload?beach_id=${beach.id}`}
              className="mt-2 py-2 px-4 bg-cyan-600 text-white rounded-xl text-xs font-bold"
            >
              Subir Foto Ahora
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden p-4 flex flex-col gap-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 text-white font-bold text-xs flex items-center justify-center">
                      {report.user_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        {report.user_name}
                      </h4>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-500" />
                        {formatTimeAgo(report.created_at)}
                      </span>
                    </div>
                  </div>

                  <SargazoLevelBadge level={report.sargazo_level} size="sm" />
                </div>

                {report.photo_url && (
                  <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-800">
                    <img
                      src={report.photo_url}
                      alt="Reporte sargazo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {report.description && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    &quot;{report.description}&quot;
                  </p>
                )}

                {/* Verification Voting Bar */}
                <VerificationBar
                  reportId={report.id}
                  accurateCount={report.accurate_votes_count}
                  inaccurateCount={report.inaccurate_votes_count}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nearby Clean Beaches Section */}
      {nearbyCleanBeaches.length > 0 && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Playas cercanas más limpias sugeridas
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {nearbyCleanBeaches.map((cleanBeach) => (
              <Link
                key={cleanBeach.id}
                href={`/beach/${cleanBeach.id}`}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500 transition-all flex flex-col justify-between gap-2 shadow-xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                      {cleanBeach.name}
                    </h4>
                    <SargazoLevelBadge level={cleanBeach.current_status?.level} size="sm" />
                  </div>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-500" />
                    a {cleanBeach.distance_km} km de distancia
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Ver recomendación →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
