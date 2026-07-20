import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { CreatorCategory } from '../../types';
import { soundEngine } from '../../lib/sound-engine';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { user, allProfiles, loginAs, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'switch' | 'edit'>('switch');

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [primaryDisc, setPrimaryDisc] = useState<CreatorCategory>(user?.primary_discipline || 'Design');

  const disciplines: CreatorCategory[] = [
    'Music', 'Voice Acting', 'Film', 'Writing', 'Design', 'Entrepreneurship'
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName,
      headline,
      bio,
      primary_discipline: primaryDisc
    });
    soundEngine.playHarmonicChime(528, 0.5);
    alert('Sovereign creator profile successfully updated and synchronized across all nodes!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-sky-500/40 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold text-white font-serif">Sovereign Creator Identity</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10 font-mono text-xs">
          <button
            onClick={() => setActiveTab('switch')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'switch' ? 'bg-sky-500 text-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            SWITCH DEMO ACCOUNT ({allProfiles.length})
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'edit' ? 'bg-sky-500 text-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            CUSTOMIZE PROFILE
          </button>
        </div>

        {/* TAB 1: SWITCH ACTIVE CREATOR PROFILE */}
        {activeTab === 'switch' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              ENKI provides multi-tier verified demo accounts across all disciplines. Switch instantly to experience the platform as a Chief Sound Architect, Voice Director, or Speculative Fiction Writer.
            </p>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {allProfiles.map(p => {
                const isCurrent = p.id === user?.id || p.id === 'user-current';
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      loginAs(p.id);
                      onClose();
                    }}
                    className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between gap-4 ${
                      isCurrent
                        ? 'bg-gradient-to-r from-sky-500/20 to-indigo-500/20 border-sky-400 shadow-[0_0_15px_-3px_rgba(56,189,248,0.3)]'
                        : 'glass-panel border-white/10 hover:border-white/30 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                        alt={p.full_name}
                        className="w-10 h-10 rounded-full object-cover border border-sky-400/40 shrink-0"
                      />
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-white truncate">
                          <span>{p.full_name}</span>
                          {isCurrent && <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500 text-black font-mono font-bold">ACTIVE</span>}
                        </div>
                        <span className="text-xs text-sky-400 font-mono truncate block">{p.primary_discipline} — {p.ascension_tier}</span>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs shrink-0">
                      <span className="text-white font-bold block">${p.nki_balance} NKI</span>
                      <span className="text-[10px] text-slate-400 block">{p.resonance_score} Hz</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: EDIT / CUSTOMIZE PROFILE */}
        {activeTab === 'edit' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 uppercase">Creator Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 uppercase">Primary Discipline Mastery</label>
              <select
                value={primaryDisc}
                onChange={(e) => setPrimaryDisc(e.target.value as CreatorCategory)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none"
              >
                {disciplines.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 uppercase">Professional Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 uppercase">Executive Biography & Vision</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none font-sans text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold shadow-sm"
              >
                SAVE CREATOR IDENTITY
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
