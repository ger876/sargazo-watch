'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Beach } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface InteractiveMapProps {
  beaches: Beach[];
  selectedBeachId?: string;
  userLocation?: { lat: number; lng: number } | null;
  onSelectBeach?: (beach: Beach) => void;
}

const DynamicMap = dynamic(
  () => import('./InteractiveMapInner').then((mod) => mod.InteractiveMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[350px] bg-slate-100 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
        <span className="text-sm font-medium">Cargando mapa interactivo...</span>
      </div>
    ),
  }
);

export const InteractiveMap: React.FC<InteractiveMapProps> = (props) => {
  return <DynamicMap {...props} />;
};
