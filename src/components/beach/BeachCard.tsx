import React from 'react';
import { Beach } from '@/lib/types';
import { SargazoLevelBadge } from '../ui/SargazoLevelBadge';
import Link from 'next/link';
import { MapPin, Navigation, ChevronRight, Clock } from 'lucide-react';

interface BeachCardProps {
  beach: Beach;
}

export const BeachCard: React.FC<BeachCardProps> = ({ beach }) => {
  const status = beach.current_status;
  const level = status?.level || 'NO_DATA';

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Beach Image header */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={beach.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'}
            alt={beach.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>

          {/* Badge Overlay */}
          <div className="absolute top-3 right-3">
            <SargazoLevelBadge level={level} size="sm" />
          </div>

          {/* Municipality Tag */}
          <div className="absolute bottom-3 left-3 text-white">
            <h3 className="font-bold text-lg leading-tight tracking-tight drop-shadow-sm">
              {beach.name}
            </h3>
            <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              {beach.municipality}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 flex flex-col gap-3">
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
            {beach.description || 'Playa paradisíaca en el Caribe Mexicano.'}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-500" />
              {status?.lastUpdatedText || 'Sin reportes recientes'}
            </span>

            {beach.distance_km !== undefined && (
              <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                <Navigation className="w-3 h-3" />
                {beach.distance_km} km
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="p-4 pt-0">
        <Link
          href={`/beach/${beach.id}`}
          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-cyan-600 hover:text-white dark:bg-slate-800 dark:hover:bg-cyan-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1 group-hover:bg-cyan-600 group-hover:text-white"
        >
          <span>Ver estado detallado</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
