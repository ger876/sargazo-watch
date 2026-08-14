import { Beach, Report, SargazoLevel } from './types';

export interface SargazoLevelMeta {
  level: SargazoLevel;
  label: string;
  shortLabel: string;
  description: string;
  colorHex: string;
  bgTailwind: string;
  borderTailwind: string;
  textTailwind: string;
  badgeTailwind: string;
  emoji: string;
}

export const SARGAZO_LEVELS: Record<SargazoLevel, SargazoLevelMeta> = {
  NONE: {
    level: 'NONE',
    label: 'Sin Sargazo',
    shortLabel: 'Limpio',
    description: 'Playa libre de sargazo. Agua turquesa y transparente.',
    colorHex: '#22c55e',
    bgTailwind: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    borderTailwind: 'border-emerald-500',
    textTailwind: 'text-emerald-600 dark:text-emerald-400',
    badgeTailwind: 'bg-emerald-500 text-white shadow-emerald-500/30',
    emoji: '🟢'
  },
  LOW: {
    level: 'LOW',
    label: 'Presencia Baja',
    shortLabel: 'Bajo',
    description: 'Manchas aisladas muy ligeras en la orilla. Se puede nadar.',
    colorHex: '#84cc16',
    bgTailwind: 'bg-lime-500/10 dark:bg-lime-500/20',
    borderTailwind: 'border-lime-500',
    textTailwind: 'text-lime-600 dark:text-lime-400',
    badgeTailwind: 'bg-lime-500 text-white shadow-lime-500/30',
    emoji: '🟡'
  },
  MEDIUM: {
    level: 'MEDIUM',
    label: 'Presencia Moderada',
    shortLabel: 'Moderado',
    description: 'Franja continua en la orilla. Agua algo turbia junto a la arena.',
    colorHex: '#eab308',
    bgTailwind: 'bg-amber-500/10 dark:bg-amber-500/20',
    borderTailwind: 'border-amber-500',
    textTailwind: 'text-amber-600 dark:text-amber-400',
    badgeTailwind: 'bg-amber-500 text-white shadow-amber-500/30',
    emoji: '🟠'
  },
  HIGH: {
    level: 'HIGH',
    label: 'Presencia Alta',
    shortLabel: 'Alto',
    description: 'Acumulación importante. Mal olor ligero y agua marrón en la orilla.',
    colorHex: '#f97316',
    bgTailwind: 'bg-orange-500/10 dark:bg-orange-500/20',
    borderTailwind: 'border-orange-500',
    textTailwind: 'text-orange-600 dark:text-orange-400',
    badgeTailwind: 'bg-orange-500 text-white shadow-orange-500/30',
    emoji: '🔴'
  },
  EXTREME: {
    level: 'EXTREME',
    label: 'Presencia Excesiva',
    shortLabel: 'Extremo',
    description: 'Barreras masivas de sargazo. No apta para actividades recreativas.',
    colorHex: '#dc2626',
    bgTailwind: 'bg-rose-500/10 dark:bg-rose-500/20',
    borderTailwind: 'border-rose-500',
    textTailwind: 'text-rose-600 dark:text-rose-400',
    badgeTailwind: 'bg-rose-600 text-white shadow-rose-600/30',
    emoji: '⚫'
  }
};

export const INITIAL_BEACHES: Beach[] = [
  {
    id: '11111111-1111-4111-8111-111111111101',
    name: 'Playa Delfines',
    state: 'Quintana Roo',
    municipality: 'Benito Juárez (Cancún)',
    lat: 21.0604,
    lng: -86.7779,
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Famosa playa pública del Mirador con amplio arenal.'
  },
  {
    id: '11111111-1111-4111-8111-111111111109',
    name: 'Playa Norte (Isla Mujeres)',
    state: 'Quintana Roo',
    municipality: 'Isla Mujeres',
    lat: 21.2611,
    lng: -86.7517,
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    description: 'Aguas cristalinas muy poco profundas, resguardadas del viento dominantes.'
  },
  {
    id: '11111111-1111-4111-8111-111111111114',
    name: 'Playa Mamitas',
    state: 'Quintana Roo',
    municipality: 'Solidaridad (Playa del Carmen)',
    lat: 20.6322,
    lng: -87.0631,
    image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    description: 'Playa icónica cerca de la Quinta Avenida.'
  },
  {
    id: '11111111-1111-4111-8111-111111111116',
    name: 'Punta Esmeralda',
    state: 'Quintana Roo',
    municipality: 'Solidaridad (Playa del Carmen)',
    lat: 20.6508,
    lng: -87.0458,
    image_url: 'https://images.unsplash.com/photo-1520942702018-0805f9298446?auto=format&fit=crop&w=800&q=80',
    description: 'Playa pública inclusiva con cenote de agua dulce que desemboca al mar.'
  },
  {
    id: '11111111-1111-4111-8111-111111111120',
    name: 'Playa Akumal',
    state: 'Quintana Roo',
    municipality: 'Tulum',
    lat: 20.3961,
    lng: -87.3117,
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    description: 'Bahía protegida por arrecifes, famosa para avistamiento de tortugas.'
  },
  {
    id: '11111111-1111-4111-8111-111111111122',
    name: 'Playa Paraíso (Tulum)',
    state: 'Quintana Roo',
    municipality: 'Tulum',
    lat: 20.1983,
    lng: -87.4300,
    image_url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
    description: 'Extensa franja de arena blanca junto a la zona arqueológica.'
  },
  {
    id: '11111111-1111-4111-8111-111111111127',
    name: 'El Cielo (Cozumel)',
    state: 'Quintana Roo',
    municipality: 'Cozumel',
    lat: 20.3475,
    lng: -86.9936,
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    description: 'Banco de arena protegido, célebre por sus estrellas de mar.'
  },
  {
    id: '11111111-1111-4111-8111-111111111131',
    name: 'Punta Cocos (Holbox)',
    state: 'Quintana Roo',
    municipality: 'Lázaro Cárdenas (Holbox)',
    lat: 21.5133,
    lng: -87.3917,
    image_url: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=800&q=80',
    description: 'Playa virgen y tranquila con espectaculares atardeceres.'
  },
  {
    id: '11111111-1111-4111-8111-111111111133',
    name: 'Mahahual Malecón',
    state: 'Quintana Roo',
    municipality: 'Othón P. Blanco (Mahahual)',
    lat: 18.7139,
    lng: -87.7083,
    image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
    description: 'Malecón pintoresco con barrera arrecifal que protege la playa.'
  }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: '22222222-2222-4222-8222-222222222201',
    beach_id: '11111111-1111-4111-8111-111111111101',
    user_name: 'Carlos M.',
    user_trust_score: 12,
    sargazo_level: 'LOW',
    description: 'Playa limpia esta mañana, personal limpiando pequeñas manchas en la orilla.',
    photo_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    accurate_votes_count: 5,
    inaccurate_votes_count: 0
  },
  {
    id: '22222222-2222-4222-8222-222222222202',
    beach_id: '11111111-1111-4111-8111-111111111109',
    user_name: 'Ana G.',
    user_trust_score: 25,
    sargazo_level: 'NONE',
    description: 'Playa Norte 100% libre de sargazo. El agua parece una alberca natural.',
    photo_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    accurate_votes_count: 8,
    inaccurate_votes_count: 0
  },
  {
    id: '22222222-2222-4222-8222-222222222203',
    beach_id: '11111111-1111-4111-8111-111111111114',
    user_name: 'Rodrigo V.',
    user_trust_score: 8,
    sargazo_level: 'MEDIUM',
    description: 'Arribazón moderada en la arena. Mar adentro está más limpio.',
    photo_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    accurate_votes_count: 3,
    inaccurate_votes_count: 1
  },
  {
    id: '22222222-2222-4222-8222-222222222204',
    beach_id: '11111111-1111-4111-8111-111111111122',
    user_name: 'Valeria S.',
    user_trust_score: 15,
    sargazo_level: 'HIGH',
    description: 'Bastante acumulado en la orilla de Playa Paraíso.',
    photo_url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    accurate_votes_count: 6,
    inaccurate_votes_count: 0
  },
  {
    id: '22222222-2222-4222-8222-222222222205',
    beach_id: '11111111-1111-4111-8111-111111111127',
    user_name: 'David K.',
    user_trust_score: 30,
    sargazo_level: 'NONE',
    description: 'El Cielo transparente e impecable hoy.',
    photo_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    accurate_votes_count: 12,
    inaccurate_votes_count: 0
  }
];
