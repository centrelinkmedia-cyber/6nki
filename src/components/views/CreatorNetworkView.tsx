import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { UserProfile, CreatorCategory } from '../../types';
import { soundEngine } from '../../lib/sound-engine';

interface CreatorNetworkViewProps {
  onInspectProfile: (profile: UserProfile) => void;
  onInviteCollaboration: (profile: UserProfile) => void;
}

export const CreatorNetworkView: React.FC<CreatorNetworkViewProps> = ({
  onInspectProfile,
  onInviteCollaboration
}) => {
  const { allProfiles, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');

  const categories: string[] = [
    'All', 
    'Music', 
    'Voice Acting', 
    'Writing', 
    'Film', 
    'Design', 
    'Entrepreneurship'
  ];

  const filtered = allProfiles.filter(p => {
    const matchesSearch = p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedDiscipline === 'All' || 
                            p.primary_discipline === selectedDiscipline ||
                            p.creator_categories.includes(selectedDiscipline as CreatorCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-xs font-mono text-sky-400">
            <Users className="w-3.5 h-3.5" />
            <span>SOVEREIGN CREATOR NETWORK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white">
            The Master Roster
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-light max-w-2xl">
            A verified ecosystem of multidisciplinary masters across acoustic engineering, cinematic narration, transmedia world-building, generative design, and executive ventures.
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedDiscipline(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                selectedDiscipline === cat
                  ? 'bg-sky-500 text-black font-bold shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search creator mastery..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/15 focus:border-sky-400 text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* CREATOR ROSTER GRID */}
      {filtered.length === 0 ? (
        <div className="p-16 rounded-3xl glass-panel text-center text-slate-400 border border-white/10 space-y-3">
          <Users className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-lg font-bold text-white font-serif">No Creators Found</h3>
          <p className="text-xs">Adjust your search parameters or select a different category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(profile => (
            <div
              key={profile.id}
              className="glass-panel rounded-3xl p-6 sm:p-7 glass-panel-hover border border-white/10 flex flex-col justify-between space-y-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-sky-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:from-sky-500/20 transition-all" />

              <div className="space-y-4 relative z-10">
                
                {/* Avatar & Ascension Tier Banner */}
                <div className="flex items-start justify-between gap-4">
                  <div className="relative">
                    <img
                      src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={profile.full_name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                    />
                    {profile.is_verified && (
                      <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-black text-sky-400 border border-sky-400" title="ENKI Verified Node">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="text-right font-mono">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold uppercase tracking-wider">
                      {profile.ascension_tier || 'Architect'}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Resonance: {profile.resonance_score || 432}
                    </span>
                  </div>
                </div>

                {/* Identity info */}
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors flex items-center gap-2">
                    <span>{profile.full_name}</span>
                  </h3>
                  <span className="text-xs text-sky-400 font-mono font-medium block mt-0.5">
                    {profile.primary_discipline} — {profile.location || 'Remote Node'}
                  </span>
                </div>

                {/* Headline & Bio */}
                <p className="text-xs text-slate-300 font-medium line-clamp-1">
                  {profile.headline}
                </p>
                <p className="text-xs text-slate-400 font-light line-clamp-3 leading-relaxed">
                  {profile.bio}
                </p>

                {/* Category Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {profile.creator_categories.map((cat, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                      {cat}
                    </span>
                  ))}
                </div>

              </div>

              {/* Action Footer */}
              <div className="pt-6 border-t border-white/10 flex items-center gap-3 relative z-10">
                <button
                  onClick={() => {
                    onInspectProfile(profile);
                    soundEngine.playHarmonicChime(432, 0.4);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                  <span>INSPECT PORTFOLIO</span>
                </button>

                {profile.id !== user?.id && (
                  <button
                    onClick={() => {
                      onInviteCollaboration(profile);
                      soundEngine.playHarmonicChime(528, 0.4);
                    }}
                    title="Invite to Collaboration or Propose Bounty"
                    className="p-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-black border border-sky-500/40 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
