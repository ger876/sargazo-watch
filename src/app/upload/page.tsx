'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Beach, SargazoLevel } from '@/lib/types';
import { getBeaches, createReport } from '@/lib/supabase';
import { SARGAZO_LEVELS } from '@/lib/constants';
import { PhotoUploadZone } from '@/components/report/PhotoUploadZone';
import { SargazoLevelBadge } from '@/components/ui/SargazoLevelBadge';
import Link from 'next/link';
import {
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Share2,
  Loader2,
  ShieldCheck,
  Send,
  AlertTriangle
} from 'lucide-react';

function UploadFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedBeachId = searchParams.get('beach_id') || '';

  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [selectedBeachId, setSelectedBeachId] = useState(preselectedBeachId);
  const [selectedLevel, setSelectedLevel] = useState<SargazoLevel>('LOW');
  const [description, setDescription] = useState('');
  const [photoData, setPhotoData] = useState<{
    photoUrl: string;
    imageHash: string;
    lat?: number;
    lng?: number;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReportId, setSuccessReportId] = useState<string | null>(null);

  useEffect(() => {
    async function loadBeaches() {
      const b = await getBeaches();
      setBeaches(b);
      if (!selectedBeachId && b.length > 0) {
        setSelectedBeachId(b[0].id);
      }
    }
    loadBeaches();
  }, [selectedBeachId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBeachId) return;
    if (!photoData?.photoUrl) {
      alert('Por favor agrega una foto de la playa para validar tu reporte.');
      return;
    }

    try {
      setIsSubmitting(true);
      const selectedBeach = beaches.find((b) => b.id === selectedBeachId);

      const created = await createReport({
        beach_id: selectedBeachId,
        user_name: 'Ciudadano Colaborador',
        user_trust_score: 5,
        sargazo_level: selectedLevel,
        description,
        photo_url: photoData.photoUrl,
        image_hash: photoData.imageHash,
        lat: photoData.lat || selectedBeach?.lat,
        lng: photoData.lng || selectedBeach?.lng,
      });

      setSuccessReportId(created.id);
    } catch (err) {
      console.error('Error al subir el reporte', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareReport = async () => {
    const selectedBeach = beaches.find((b) => b.id === selectedBeachId);
    const shareData = {
      title: `Reporte de Sargazo — ${selectedBeach?.name}`,
      text: `Acabo de reportar el estado del sargazo en ${selectedBeach?.name}: ${SARGAZO_LEVELS[selectedLevel].label}`,
      url: window.location.origin + `/beach/${selectedBeachId}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {}
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert('¡Enlace de reporte copiado!');
    }
  };

  if (successReportId) {
    const selectedBeach = beaches.find((b) => b.id === selectedBeachId);
    return (
      <div className="max-w-xl mx-auto py-12 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center gap-5 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            ¡Gracias por contribuir a la comunidad! 🌊
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tu reporte fotográfico ha sido publicado en el mapa en vivo y ganaste +5 puntos de confianza.
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl w-full flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">{selectedBeach?.name}</span>
          <SargazoLevelBadge level={selectedLevel} size="sm" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={handleShareReport}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Share2 className="w-4 h-4 text-cyan-500" />
            <span>Compartir en Redes</span>
          </button>

          <Link
            href={`/beach/${selectedBeachId}`}
            className="flex-1 py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-cyan-600/20 transition-all"
          >
            <span>Ver Playa en Mapa</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Nuevo Reporte Ciudadano
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sube tu foto y selecciona el nivel de sargazo observable en la orilla.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
        {/* Step 1: Beach Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-cyan-500" />
            <span>1. Selecciona la Playa</span>
          </label>
          <select
            value={selectedBeachId}
            onChange={(e) => setSelectedBeachId(e.target.value)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            required
          >
            {beaches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.municipality})
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Photo Zone */}
        <PhotoUploadZone onPhotoProcessed={setPhotoData} />

        {/* Step 3: Sargazo Level Touch Selector */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
            <span>2. Nivel de Sargazo Observado</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {(Object.keys(SARGAZO_LEVELS) as SargazoLevel[]).map((lvl) => {
              const meta = SARGAZO_LEVELS[lvl];
              const isSelected = selectedLevel === lvl;

              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1 min-h-[70px] ${
                    isSelected
                      ? `${meta.borderTailwind} ${meta.bgTailwind} shadow-md`
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <span className="text-xl">{meta.emoji}</span>
                  <span className={`text-xs font-bold ${meta.textTailwind}`}>
                    {meta.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <strong>Descripción del nivel seleccionado:</strong> {SARGAZO_LEVELS[selectedLevel].description}
          </div>
        </div>

        {/* Step 4: Optional Description */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            3. Comentarios u Observaciones (Opcional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Ej: El personal municipal está limpiando la orilla. El agua se ve más limpia mar adentro..."
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none"
          />
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isSubmitting || !photoData?.photoUrl}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2 transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Publicando reporte...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Publicar Reporte Ciudadano</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
        <span className="text-sm font-medium">Cargando formulario...</span>
      </div>
    }>
      <UploadFormContent />
    </Suspense>
  );
}
