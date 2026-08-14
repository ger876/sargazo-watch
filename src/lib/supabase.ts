import { createClient } from '@supabase/supabase-js';
import { Beach, Report } from './types';
import { INITIAL_BEACHES, INITIAL_REPORTS } from './constants';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-supabase-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local Memory State for offline / demo mode
const localBeaches: Beach[] = [...INITIAL_BEACHES];
const localReports: Report[] = [...INITIAL_REPORTS];

/**
 * Fetches list of all beaches
 */
export async function getBeaches(): Promise<Beach[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('beaches')
        .select('*')
        .order('name');
      if (!error && data && data.length > 0) {
        return data as Beach[];
      }
    } catch (e) {
      console.warn('Supabase fetch failed, using local seed fallback', e);
    }
  }

  // Fallback to local memory storage
  return localBeaches;
}

/**
 * Fetches single beach by ID
 */
export async function getBeachById(id: string): Promise<Beach | null> {
  const beaches = await getBeaches();
  return beaches.find((b) => b.id === id) || null;
}

/**
 * Fetches recent reports for a specific beach or all beaches
 */
export async function getReports(beachId?: string): Promise<Report[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('reports').select('*').order('created_at', { ascending: false });
      if (beachId) {
        query = query.eq('beach_id', beachId);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data as Report[];
      }
    } catch (e) {
      console.warn('Supabase reports fetch error, using local fallback', e);
    }
  }

  if (beachId) {
    return localReports.filter((r) => r.beach_id === beachId);
  }
  return localReports;
}

/**
 * Creates a new sargassum report
 */
export async function createReport(report: Omit<Report, 'id' | 'created_at'>): Promise<Report> {
  const newReport: Report = {
    ...report,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
    created_at: new Date().toISOString(),
    accurate_votes_count: 0,
    inaccurate_votes_count: 0
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('reports').insert([report]).select().single();
      if (!error && data) {
        return data as Report;
      }
    } catch (e) {
      console.warn('Supabase insert report failed, saving locally', e);
    }
  }

  localReports.unshift(newReport);
  return newReport;
}

/**
 * Registers a vote (accurate / inaccurate) for a report
 */
export async function voteReport(reportId: string, isAccurate: boolean): Promise<boolean> {
  const reportIndex = localReports.findIndex((r) => r.id === reportId);
  if (reportIndex !== -1) {
    if (isAccurate) {
      localReports[reportIndex].accurate_votes_count = (localReports[reportIndex].accurate_votes_count || 0) + 1;
    } else {
      localReports[reportIndex].inaccurate_votes_count = (localReports[reportIndex].inaccurate_votes_count || 0) + 1;
    }
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('report_votes').insert([{
        report_id: reportId,
        is_accurate: isAccurate
      }]);
      return !error;
    } catch (e) {
      console.warn('Vote submission error', e);
    }
  }

  return true;
}
