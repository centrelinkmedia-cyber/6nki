export type CreatorCategory = 
  | 'Music' 
  | 'Voice Acting' 
  | 'Film' 
  | 'Writing' 
  | 'Design' 
  | 'Entrepreneurship' 
  | 'Creative Collaboration' 
  | 'Business Consulting' 
  | 'Education' 
  | 'Creator Development';

export type AscensionTier = 'Apprentice' | 'Artisan' | 'Luminary' | 'Architect';

export interface PortfolioItem {
  id: string;
  title: string;
  type: 'audio' | 'video' | 'script' | 'design' | 'article';
  url: string;
  previewUrl?: string;
  description: string;
  discipline: CreatorCategory;
  resonanceScore?: number;
  duration?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  banner_url: string;
  creator_categories: CreatorCategory[];
  primary_discipline: CreatorCategory;
  location: string;
  nki_balance: number;
  ascension_tier: AscensionTier;
  resonance_score: number;
  portfolio_items: PortfolioItem[];
  social_links: {
    website?: string;
    twitter?: string;
    github?: string;
    imdb?: string;
    spotify?: string;
  };
  is_verified: boolean;
  created_at: string;
}

export type StudioRole = 'host' | 'speaker' | 'listener';
export type StudioMode = 'Open' | 'Audition' | 'Masterclass' | 'Private Strategy';

export interface StudioMember {
  id: string;
  studio_id: string;
  user_id: string;
  role: StudioRole;
  is_muted: boolean;
  hand_raised: boolean;
  joined_at: string;
  profile?: UserProfile;
}

export interface StudioMessage {
  id: string;
  studio_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'asset' | 'system' | 'tip';
  asset_url?: string;
  asset_title?: string;
  created_at: string;
  sender?: UserProfile;
}

export interface Studio {
  id: string;
  title: string;
  description: string;
  host_id: string;
  discipline: string;
  audio_preset: string;
  room_mode: StudioMode;
  status: 'live' | 'scheduled' | 'offline';
  listener_count: number;
  recording_enabled: boolean;
  active_asset_url?: string;
  active_asset_title?: string;
  livekit_room_name: string;
  created_at: string;
  host?: UserProfile;
  members?: StudioMember[];
}

export interface NkiTransaction {
  id: string;
  sender_id?: string;
  receiver_id?: string;
  amount: number;
  transaction_type: 'reward' | 'tip' | 'purchase' | 'bounty' | 'system_grant' | 'collaboration_escrow';
  memo: string;
  created_at: string;
  sender_name?: string;
  receiver_name?: string;
}

export interface MarketplaceListing {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  category: string;
  price_nki: number;
  delivery_days: number;
  tags: string[];
  preview_url?: string;
  status: 'active' | 'paused' | 'completed';
  created_at: string;
  creator?: UserProfile;
}

export interface AscensionModule {
  id: string;
  title: string;
  discipline: CreatorCategory;
  tier_required: AscensionTier;
  description: string;
  instructor_name: string;
  duration_minutes: number;
  nki_reward: number;
  content_url: string;
  philosophical_note: string;
  completed?: boolean;
}

export interface Collaboration {
  id: string;
  title: string;
  initiator_id: string;
  partner_id?: string;
  discipline_required: CreatorCategory;
  bounty_nki: number;
  description: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  initiator?: UserProfile;
}
