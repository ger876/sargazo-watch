import { BeachStatus, Report, SargazoLevel } from './types';
import { SARGAZO_LEVELS } from './constants';

const LEVEL_NUMERIC_MAP: Record<SargazoLevel, number> = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  EXTREME: 4
};

const NUMERIC_LEVEL_MAP: Record<number, SargazoLevel> = {
  0: 'NONE',
  1: 'LOW',
  2: 'MEDIUM',
  3: 'HIGH',
  4: 'EXTREME'
};

/**
 * Calculates the current status of a beach based on crowdsourced reports with temporal decay & trust weighting.
 */
export function calculateBeachStatus(reports: Report[]): BeachStatus {
  if (!reports || reports.length === 0) {
    return {
      level: 'NO_DATA',
      label: 'Sin datos recientes',
      colorHex: '#9ca3af',
      badgeClass: 'bg-gray-400 text-white',
      lastUpdatedText: 'Sin reportes registrados',
      reportCount24h: 0,
      confidenceScore: 0
    };
  }

  const now = Date.now();
  let totalWeightedScore = 0;
  let totalWeight = 0;
  let reports24hCount = 0;
  let latestReportDate = 0;

  for (const report of reports) {
    const reportTime = new Date(report.created_at).getTime();
    const ageHours = (now - reportTime) / (1000 * 3600);

    if (reportTime > latestReportDate) {
      latestReportDate = reportTime;
    }

    if (ageHours <= 24) {
      reports24hCount++;
    }

    // Ignore reports older than 48 hours for calculation
    if (ageHours > 48) continue;

    // Time decay weight
    let timeWeight = 0.2;
    if (ageHours <= 6) timeWeight = 1.0;
    else if (ageHours <= 12) timeWeight = 0.7;
    else if (ageHours <= 24) timeWeight = 0.4;

    // User trust weight (base trust + net votes)
    const baseTrust = Math.max(1, report.user_trust_score || 0);
    const votesNet = (report.accurate_votes_count || 0) - (report.inaccurate_votes_count || 0);
    const trustWeight = Math.max(0.5, 1 + (baseTrust / 10) + (votesNet * 0.2));

    const finalWeight = timeWeight * trustWeight;
    const numericLevel = LEVEL_NUMERIC_MAP[report.sargazo_level] ?? 0;

    totalWeightedScore += numericLevel * finalWeight;
    totalWeight += finalWeight;
  }

  if (totalWeight === 0 || (now - latestReportDate) > (48 * 3600 * 1000)) {
    return {
      level: 'NO_DATA',
      label: 'Sin datos recientes (>48h)',
      colorHex: '#9ca3af',
      badgeClass: 'bg-slate-400 text-white dark:bg-slate-600',
      lastUpdatedText: latestReportDate > 0 ? `Último reporte ${formatTimeAgo(new Date(latestReportDate).toISOString())}` : 'Sin datos',
      reportCount24h: reports24hCount,
      confidenceScore: 0
    };
  }

  const averageNumeric = Math.round(totalWeightedScore / totalWeight);
  const roundedLevel = NUMERIC_LEVEL_MAP[Math.min(4, Math.max(0, averageNumeric))] || 'LOW';
  const meta = SARGAZO_LEVELS[roundedLevel];

  // Calculate confidence score (0 to 100) based on sample size and freshness
  const hoursSinceLatest = (now - latestReportDate) / (1000 * 3600);
  const freshnessScore = Math.max(0, 100 - hoursSinceLatest * 2);
  const volumeBonus = Math.min(30, reports24hCount * 10);
  const confidenceScore = Math.min(100, Math.round(freshnessScore * 0.7 + volumeBonus));

  return {
    level: roundedLevel,
    label: meta.label,
    colorHex: meta.colorHex,
    badgeClass: meta.badgeTailwind,
    lastUpdatedText: formatTimeAgo(new Date(latestReportDate).toISOString()),
    reportCount24h: reports24hCount,
    confidenceScore
  };
}

/**
 * Calculates Haversine distance in kilometers between two GPS points
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Formats ISO timestamp to human-friendly relative time in Spanish
 */
export function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Hace un momento';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Hace ${diffDays} d`;
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

/**
 * Generates a simple perceptual hash string for client duplicate checking
 */
export async function generateSimpleImageHash(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 8;
        canvas.height = 8;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(Math.random().toString(36).substring(2, 10));
          return;
        }
        ctx.drawImage(img, 0, 0, 8, 8);
        const imgData = ctx.getImageData(0, 0, 8, 8).data;
        const grays: number[] = [];
        for (let i = 0; i < imgData.length; i += 4) {
          const avg = (imgData[i] + imgData[i + 1] + imgData[i + 2]) / 3;
          grays.push(avg);
        }
        const mean = grays.reduce((a, b) => a + b, 0) / grays.length;
        const hash = grays.map((g) => (g > mean ? '1' : '0')).join('');
        resolve(hash);
      };
      img.onerror = () => resolve(Math.random().toString(36).substring(2, 10));
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
