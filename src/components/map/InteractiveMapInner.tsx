'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Beach, SargazoLevel } from '@/lib/types';
import { SARGAZO_LEVELS } from '@/lib/constants';
import { SargazoLevelBadge } from '../ui/SargazoLevelBadge';
import Link from 'next/link';
import { Navigation, MapPin, Eye } from 'lucide-react';

interface InteractiveMapInnerProps {
  beaches: Beach[];
  selectedBeachId?: string;
  userLocation?: { lat: number; lng: number } | null;
  onSelectBeach?: (beach: Beach) => void;
}

// Custom HTML Pin Marker with sargazo status color
const createCustomIcon = (level?: SargazoLevel | 'NO_DATA') => {
  const color = level && level !== 'NO_DATA' ? SARGAZO_LEVELS[level].colorHex : '#9ca3af';
  const html = `
    <div style="
      background-color: ${color};
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background-color: white;
        border-radius: 50%;
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

// Component to dynamically re-center map when props change
const MapRecenter = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

export const InteractiveMapInner: React.FC<InteractiveMapInnerProps> = ({
  beaches,
  selectedBeachId,
  userLocation,
  onSelectBeach,
}) => {
  const defaultCenter: [number, number] = [20.6231, -87.0736]; // Playa del Carmen / Riviera Maya center
  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : defaultCenter;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800">
      <MapContainer
        center={center}
        zoom={9}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[350px]"
      >
        {/* OpenStreetMap Tiles - 100% Free, no API Key */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={center} />

        {/* User GPS location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              html: `
                <div style="
                  background-color: #3b82f6;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 0 12px rgba(59,130,246,0.8);
                "></div>
              `,
              className: 'user-location-marker',
              iconSize: [20, 20],
            })}
          >
            <Popup>
              <div className="p-2 text-center text-xs font-semibold text-blue-600">
                📍 Tu ubicación actual
              </div>
            </Popup>
          </Marker>
        )}

        {/* Beach markers */}
        {beaches.map((beach) => {
          const level = beach.current_status?.level || 'NO_DATA';
          const icon = createCustomIcon(level);

          return (
            <Marker
              key={beach.id}
              position={[beach.lat, beach.lng]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onSelectBeach) onSelectBeach(beach);
                },
              }}
            >
              <Popup>
                <div className="flex flex-col bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg">
                  {beach.image_url && (
                    <div className="relative h-28 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <img
                        src={beach.image_url}
                        alt={beach.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <SargazoLevelBadge level={level} size="sm" />
                      </div>
                    </div>
                  )}

                  <div className="p-3 flex flex-col gap-1.5">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                      {beach.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-500" />
                      {beach.municipality}
                    </p>

                    {beach.distance_km !== undefined && (
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        a {beach.distance_km} km de ti
                      </span>
                    )}

                    <Link
                      href={`/beach/${beach.id}`}
                      className="mt-2 w-full py-1.5 px-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Ver Detalles y Reportes
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
