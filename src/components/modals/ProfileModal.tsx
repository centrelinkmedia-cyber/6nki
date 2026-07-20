import React, { useState } from 'react';
import { ShieldCheck, X, Play, Send } from 'lucide-react';
import type { UserProfile } from '../../types';
import { useEconomy } from '../../context/EconomyContext';
import { useAuth } from '../../context/AuthContext';
import { soundEngine } from '../../lib/sound-engine';

interface ProfileModalProps {
  profile: UserProfile;
  initialMode?: 'view' | 'collaborate';
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ profile, initialMode = 'view', onClose }) => {
  const { user } = useAuth();
  const { sendTip, balance } = useEconomy();
  const [mode, setMode] = useState<'view' | 'collaborate'>(initialMode);

  const [collabTitle, setCollabTitle] = useState('');
  const [collabDesc, setCollabDesc] = useState('');
  const [bountyNki, setBountyNki] = useState('250');

  const handleSendCollaboration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collabTitle.trim() || !collabDesc.trim()) return;

    const bounty = parseFloat(bountyNki) || 0;
    if (bounty > 0 && balance < bounty) {
      alert(`Insufficient $NKI balance for this bounty escrow. You have ${balance.toFixed(1)} NKI.`);
      return;
    }

    if (bounty > 0) {
      sendTip(profile.id, profile.full_name, bounty, `Collaboration Escrow Bounty: ${collabTitle}`);
    }

    soundEngine.playHarmonicChime(528, 0.8);
    alert(`Collaboration proposal successfully dispatched to ${profile.full_name}! ${bounty > 0 ? `(${bounty} $NKI held in escrow)` : ''}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-sky-500/40 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 font-mono text-xs text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>SOVEREIGN CREATOR DOSSIER</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Identity Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt={profile.full_name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-400/60 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-white font-serif">{profile.full_name}</h3>
                {profile.is_verified && <ShieldCheck className="w-5 h-5 text-sky-400" />}
              </div>
              <span className="text-xs text-sky-300 font-mono block mt-0.5">
                {profile.primary_discipline} — {profile.location || 'Remote Node'}
              </span>
            </div>
          </div>

          <div className="flex gap-2 font-mono text-xs">
            <button
              onClick={() => setMode('view')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                mode === 'view' ? 'bg-sky-500 text-black' : 'bg-white/5 text-slate-300 hover:text-white'
              }`}
            >
              PORTFOLIO
            </button>
            {profile.id !== user?.id && (
              <button
                onClick={() => setMode('collaborate')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  mode === 'collaborate' ? 'bg-sky-500 text-black' : 'bg-white/5 text-slate-300 hover:text-white'
                }`}
              >
                PROPOSE BOUNTY
              </button>
            )}
          </div>
        </div>

        {/* MODE 1: VIEW PORTFOLIO & BIO */}
        {mode === 'view' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">EXECUTIVE SUMMARY</span>
              <h4 className="text-sm font-bold text-white">{profile.headline}</h4>
              <p className="text-xs text-slate-300 font-light leading-relaxed">{profile.bio}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-400 text-[10px] block">ASCENSION TIER</span>
                <span className="text-white font-bold text-sm">{profile.ascension_tier || 'Architect'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-400 text-[10px] block">RESONANCE CALIBRATION</span>
                <span className="text-sky-400 font-bold text-sm">{profile.resonance_score || 432} / 864 HZ</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono tracking-widest text-slate-300 uppercase flex items-center justify-between border-b border-white/10 pb-2">
                <span>VERIFIED PORTFOLIO WORKS ({profile.portfolio_items?.length || 0})</span>
                <span className="text-sky-400 font-normal">Lossless 432 Hz Stems & Bibles</span>
              </h4>

              {(!profile.portfolio_items || profile.portfolio_items.length === 0) ? (
                <div className="p-8 rounded-2xl border border-dashed border-white/15 text-center text-xs text-slate-400 font-mono">
                  No portfolio items uploaded to this node yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {profile.portfolio_items.map(item => (
                    <div key={item.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4 hover:border-sky-500/40 transition-all">
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase font-bold">
                            {item.type}
                          </span>
                          <h5 className="text-sm font-bold text-white truncate">{item.title}</h5>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                      </div>

                      <button
                        onClick={() => {
                          soundEngine.playHarmonicChime(432, 1.0);
                          alert(`Previewing "${item.title}" in lossless spatial audio / document viewer.`);
                        }}
                        className="px-3.5 py-2 rounded-lg bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-black font-mono text-xs font-bold shrink-0 transition-all flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>PREVIEW</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODE 2: COLLABORATION / BOUNTY PROPOSAL */}
        {mode === 'collaborate' && (
          <form onSubmit={handleSendCollaboration} className="space-y-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 space-y-1">
              <div className="font-bold">⚡ DIRECT COLLABORATION ESCROW</div>
              <div>Propose a joint cinematic score, voiceover role, or transmedia script. Any attached $NKI bounty will be locked securely in sovereign escrow until project delivery.</div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 uppercase block">Proposal Title</label>
              <input
                type="text"
                placeholder="e.g., Co-Compose 432Hz Ambient Sci-Fi Trailer Score"
                value={collabTitle}
                onChange={(e) => setCollabTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none font-sans text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 uppercase block">Attached Escrow Bounty ($NKI Units)</label>
              <input
                type="number"
                value={bountyNki}
                onChange={(e) => setBountyNki(e.target.value)}
                min="0"
                max={balance}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 uppercase block">Creative Brief & Harmonic Expectations</label>
              <textarea
                rows={4}
                placeholder="Detail the creative scope, timeline, and how this venture harmonizes with ENKI mathematical principles..."
                value={collabDesc}
                onChange={(e) => setCollabDesc(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none font-sans text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setMode('view')}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
              >
                BACK TO PORTFOLIO
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-black font-bold tracking-wider shadow-sm flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>DISPATCH COLLABORATION</span>
              </button>
            </div>
          </form>
        )}

        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
