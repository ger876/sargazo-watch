export type SargazoLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';

export interface Beach {
  id: string;
  name: string;
  state: string;
  municipality: string;
  lat: number;
  lng: number;
  image_url?: string;
  description?: string;
  created_at?: string;
  // Computed fields
  current_status?: BeachStatus;
  distance_km?: number;
}

export interface BeachStatus {
  level: SargazoLevel | 'NO_DATA';
  label: string;
  colorHex: string;
  badgeClass: string;
  lastUpdatedText: string;
  reportCount24h: number;
  confidenceScore: number; // 0 - 100
}

export interface Report {
  id: string;
  beach_id: string;
  user_id?: string;
  user_name: string;
  user_trust_score: number;
  sargazo_level: SargazoLevel;
  description?: string;
  photo_url: string;
  image_hash?: string;
  lat?: number;
  lng?: number;
  created_at: string;
  // Computed fields
  accurate_votes_count?: number;
  inaccurate_votes_count?: number;
  user_voted_accurate?: boolean | null;
}

export interface ReportVote {
  id: string;
  report_id: string;
  user_id: string;
  is_accurate: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  beach_id: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  trust_score: number;
  badges: string[];
  report_count: number;
}
