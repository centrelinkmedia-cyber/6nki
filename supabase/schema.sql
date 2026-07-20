-- ==============================================================================
-- ENKI CREATOR OPERATING SYSTEM - SUPABASE SCHEMA (v2.6.18 - Harmonic Release)
-- Corporate Architecture / Esoteric Substructure
-- ==============================================================================

-- Enable required Postgres extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. PROFILES & CREATOR ACCOUNTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  headline TEXT,
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  creator_categories TEXT[] DEFAULT '{}', -- e.g., {'Music', 'Voice Acting', 'Film'}
  primary_discipline TEXT NOT NULL DEFAULT 'Music',
  location TEXT DEFAULT 'Erie, PA / Remote Node',
  nki_balance NUMERIC(12, 2) DEFAULT 500.00, -- Initial grant for new creators
  ascension_tier TEXT DEFAULT 'Apprentice' CHECK (ascension_tier IN ('Apprentice', 'Artisan', 'Luminary', 'Architect')),
  resonance_score INTEGER DEFAULT 432, -- Harmonic frequency metric
  portfolio_items JSONB DEFAULT '[]'::jsonb, -- Array of media works
  social_links JSONB DEFAULT '{}'::jsonb,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. ENKI STUDIOS (LIVE CREATIVE AUDIO & STRATEGY ROOMS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.studios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  discipline TEXT NOT NULL DEFAULT 'Music Production', -- e.g., 'Voice Acting Auditions', 'Writer Room', 'Creative Strategy'
  audio_preset TEXT DEFAULT 'Lossless 48kHz / 432Hz Master',
  room_mode TEXT DEFAULT 'Open' CHECK (room_mode IN ('Open', 'Audition', 'Masterclass', 'Private Strategy')),
  status TEXT DEFAULT 'live' CHECK (status IN ('live', 'scheduled', 'offline')),
  listener_count INTEGER DEFAULT 1,
  recording_enabled BOOLEAN DEFAULT FALSE,
  active_asset_url TEXT, -- Shared PDF/Audio/Image in room
  active_asset_title TEXT,
  livekit_room_name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- ==============================================================================
-- 3. STUDIO MEMBERS (REAL-TIME PARTICIPANTS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.studio_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  studio_id UUID NOT NULL REFERENCES public.studios(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'listener' CHECK (role IN ('host', 'speaker', 'listener')),
  is_muted BOOLEAN DEFAULT TRUE,
  hand_raised BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(studio_id, user_id)
);

-- ==============================================================================
-- 4. STUDIO ROOM CHAT & SHARED ASSETS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.studio_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  studio_id UUID NOT NULL REFERENCES public.studios(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'asset', 'system', 'tip')),
  asset_url TEXT,
  asset_title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. NKI INTERNAL ECONOMY & TRANSACTIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.nki_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('reward', 'tip', 'purchase', 'bounty', 'system_grant', 'collaboration_escrow')),
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. MARKETPLACE & NEXUS EXCHANGE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., 'Voiceover Service', 'Logic Pro Stem Pack', 'Screenplay Review', 'Executive Consulting'
  price_nki NUMERIC(10, 2) NOT NULL,
  delivery_days INTEGER DEFAULT 3,
  tags TEXT[] DEFAULT '{}',
  preview_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. THE ASCENSION (CREATOR GROWTH & MASTERCLASS MODULES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.ascension_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  discipline TEXT NOT NULL,
  tier_required TEXT DEFAULT 'Apprentice',
  description TEXT NOT NULL,
  instructor_name TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 45,
  nki_reward NUMERIC(8, 2) DEFAULT 150.00,
  content_url TEXT,
  philosophical_note TEXT, -- Esoteric underlying principle
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ascension_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.ascension_modules(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, module_id)
);

-- ==============================================================================
-- 8. COLLABORATIONS & BOUNTIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.collaborations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  initiator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  discipline_required TEXT NOT NULL,
  bounty_nki NUMERIC(10, 2) DEFAULT 0,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nki_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, authenticated update self
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Studios: Public read, authenticated create
CREATE POLICY "Studios viewable by everyone" ON public.studios FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create studios" ON public.studios FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update own studio" ON public.studios FOR UPDATE USING (auth.uid() = host_id);

-- Studio Members: Public read, authenticated join/leave
CREATE POLICY "Studio members viewable by everyone" ON public.studio_members FOR SELECT USING (true);
CREATE POLICY "Users can manage own studio membership" ON public.studio_members FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- INITIAL SEED DATA (CORPORATE & ESOTERIC HYBRID DEMO CREATORS)
-- ==============================================================================
INSERT INTO public.profiles (id, username, full_name, headline, bio, primary_discipline, creator_categories, nki_balance, ascension_tier, resonance_score, is_verified)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'elena_vance', 'Elena Vance', 'Chief Sound Architect & Acoustic Systems Director', 'Synthesizing 432Hz harmonic frequencies with neural acoustic modeling. Former head of audio labs at Apple. Exploring sacred geometry in spatial audio.', 'Music', ARRAY['Music', 'Entrepreneurship'], 14250.00, 'Architect', 528, true),
  ('00000000-0000-0000-0000-000000000002', 'marcus_kane', 'Marcus Kane', 'Principal Voice Director & Transmedia Narrator', 'Voice of 14 major cinematic franchises. Specialist in vocal resonance, emotional frequency transmission, and dialectic engineering.', 'Voice Acting', ARRAY['Voice Acting', 'Film'], 8920.00, 'Luminary', 432, true),
  ('00000000-0000-0000-0000-000000000003', 'sylvia_chen', 'Dr. Sylvia Chen', 'World-Building Director & Speculative Fiction Architect', 'Weaving ancient Sumerian mythos into futuristic interactive cinema. PhD in Comparative Mythology & Computational Linguistics.', 'Writing', ARRAY['Writing', 'Film', 'Education'], 11400.00, 'Architect', 618, true),
  ('00000000-0000-0000-0000-000000000004', 'dario_rossi', 'Dario Rossi', 'Creative Technologist & Visual Futurist', 'Building generative visual systems governed by Fibonacci ratios. Designing the interface between human intuition and quantum hardware.', 'Design', ARRAY['Design', 'Entrepreneurship'], 6700.00, 'Artisan', 432, true),
  ('00000000-0000-0000-0000-000000000005', 'aria_solaris', 'Aria Solaris', 'Electronic Composer & Acoustic Strategist', 'Translating planetary orbital ratios into harmonic ambient compositions for focus, corporate innovation, and deep meditation.', 'Music', ARRAY['Music', 'Education'], 9350.00, 'Luminary', 528, true)
ON CONFLICT DO NOTHING;

-- Seed Active Studios
INSERT INTO public.studios (id, title, description, host_id, discipline, audio_preset, room_mode, status, listener_count, active_asset_title)
VALUES
  ('11111111-1111-1111-1111-111111111101', 'Spatial Acoustic Engineering: 432Hz Harmonic Masterclass', 'Analyzing the neurological impact of mathematical frequency ratios on vocal clarity and musical emotion in commercial production.', '00000000-0000-0000-0000-000000000001', 'Music Production', 'Lossless 48kHz / 432Hz Master', 'Masterclass', 'live', 247, 'Frequency_Spectrum_Analysis_v4.pdf'),
  ('11111111-1111-1111-1111-111111111102', 'Sci-Fi Cinematic Voice Acting Auditions: Project ENKI', 'Open auditions for the lead AI intelligence and ancient holographic archivist characters for our upcoming transmedia series.', '00000000-0000-0000-0000-000000000002', 'Voice Acting Auditions', 'Studio Condenser / Low-Latency', 'Audition', 'live', 134, 'Script_Excerpts_Project_Enki.pdf'),
  ('11111111-1111-1111-1111-111111111103', 'Architects of Myth: Transmedia Writer Roundtable', 'Structuring complex corporate worlds that secretly harbor ancient esoteric knowledge. A deep-dive into narrative resonance.', '00000000-0000-0000-0000-000000000003', 'Writer Room', 'Voice Optimized 32kHz', 'Open', 'live', 89, 'Sumerian_Archetypes_and_Modern_Tech.pdf')
ON CONFLICT DO NOTHING;
