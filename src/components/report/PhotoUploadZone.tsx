'use client';

import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { generateSimpleImageHash } from '@/lib/algorithms';
import { Camera, UploadCloud, MapPin, CheckCircle, Loader2, X, RefreshCw } from 'lucide-react';

interface PhotoUploadZoneProps {
  onPhotoProcessed: (data: {
    photoUrl: string;
    imageHash: string;
    lat?: number;
    lng?: number;
  }) => void;
}

export const PhotoUploadZone: React.FC<PhotoUploadZoneProps> = ({ onPhotoProcessed }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    try {
      setIsProcessing(true);
      setLocationStatus('Obteniendo ubicación GPS...');

      // Get user GPS coordinates
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            setLocationStatus('Ubicación GPS fijada ✓');
          },
          () => {
            setLocationStatus('No se pudo obtener GPS automáticamente');
          },
          { timeout: 8000 }
        );
      }

      // Compress image in browser before upload (Free Tier Optimization)
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const url = URL.createObjectURL(compressedFile);
      setPreviewUrl(url);

      // Generate simple perceptual hash
      const hash = await generateSimpleImageHash(compressedFile);

      onPhotoProcessed({
        photoUrl: url,
        imageHash: hash,
        lat: coords.lat,
        lng: coords.lng,
      });
    } catch (error) {
      console.error('Error procesando imagen', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setCoords({});
    setLocationStatus(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
        <Camera className="w-4 h-4 text-cyan-500" />
        <span>Fotografía de la playa (Requerida)</span>
      </label>

      {previewUrl ? (
        <div className="relative w-full h-64 rounded-2xl overflow-hidden border-2 border-cyan-500 shadow-md bg-slate-900 group">
          <img src={previewUrl} alt="Preview sargazo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium bg-emerald-500/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Imagen comprimida lista
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="p-2 bg-slate-800/80 hover:bg-rose-600 rounded-full transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {locationStatus && (
              <p className="text-xs text-slate-300 mt-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {locationStatus}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative w-full h-56 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center p-6 text-center group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />

          {isProcessing ? (
            <div className="flex flex-col items-center gap-2 text-cyan-600">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm font-medium">Comprimiendo imagen en el navegador...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Toca para tomar foto o subir imagen
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  JPG, PNG o WEBP (Compresión automática a &lt;1MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
