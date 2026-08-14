-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Table: beaches (Public reference list of beaches)
CREATE TABLE IF NOT EXISTS public.beaches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Quintana Roo',
  municipality TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for geographical queries
CREATE INDEX IF NOT EXISTS beaches_geo_idx ON public.beaches USING GIST (
  ST_SetSRID(ST_MakePoint(lng, lat), 4326)
);

-- 2. Table: reports (Crowdsourced sargassum reports)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  beach_id UUID REFERENCES public.beaches(id) ON DELETE CASCADE,
  user_id UUID DEFAULT auth.uid(),
  user_name TEXT DEFAULT 'Ciudadano Anónimo',
  user_trust_score INT DEFAULT 0,
  sargazo_level TEXT NOT NULL CHECK (sargazo_level IN ('NONE', 'LOW', 'MEDIUM', 'HIGH', 'EXTREME')),
  description TEXT,
  photo_url TEXT NOT NULL,
  image_hash TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on (beach_id, created_at) for efficient filtering of recent reports
CREATE INDEX IF NOT EXISTS reports_beach_created_idx ON public.reports (beach_id, created_at DESC);

-- 3. Table: report_votes (Community verification votes)
CREATE TABLE IF NOT EXISTS public.report_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
  user_id UUID DEFAULT auth.uid(),
  is_accurate BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(report_id, user_id)
);

-- 4. Table: subscriptions (Beach alert subscriptions)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  beach_id UUID REFERENCES public.beaches(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, beach_id)
);

-- Row Level Security (RLS)
ALTER TABLE public.beaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Beaches policies (Public read)
CREATE POLICY "Public read access for beaches" ON public.beaches FOR SELECT USING (true);

-- Reports policies (Public read, authenticated insert)
CREATE POLICY "Public read access for reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reports" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete own reports" ON public.reports FOR DELETE USING (auth.uid() = user_id);

-- Votes policies
CREATE POLICY "Public read access for votes" ON public.report_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated insert for votes" ON public.report_votes FOR INSERT WITH CHECK (true);

-- Subscriptions policies
CREATE POLICY "Users view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own subscriptions" ON public.subscriptions FOR ALL USING (auth.uid() = user_id);
