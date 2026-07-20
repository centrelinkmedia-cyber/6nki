import React, { useState } from 'react';
import { Database, CheckCircle2, Copy, X, Server } from 'lucide-react';
import { isLiveSupabase } from '../../lib/supabase';
import { soundEngine } from '../../lib/sound-engine';

interface SupabaseConfigModalProps {
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'sql'>('status');
  const [copied, setCopied] = useState(false);

  const sqlSchemaExcerpt = `-- ==============================================================================
-- ENKI CREATOR OPERATING SYSTEM - SUPABASE SCHEMA (v2.6.18)
-- Corporate Architecture / Esoteric Substructure
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  headline TEXT,
  bio TEXT,
  creator_categories TEXT[] DEFAULT '{}',
  primary_discipline TEXT NOT NULL DEFAULT 'Music',
  nki_balance NUMERIC(12, 2) DEFAULT 500.00,
  ascension_tier TEXT DEFAULT 'Apprentice',
  resonance_score INTEGER DEFAULT 432,
  portfolio_items JSONB DEFAULT '[]'::jsonb,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.studios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  discipline TEXT NOT NULL DEFAULT 'Music Production',
  audio_preset TEXT DEFAULT 'Lossless 48kHz / 432Hz Master',
  room_mode TEXT DEFAULT 'Open',
  status TEXT DEFAULT 'live',
  listener_count INTEGER DEFAULT 1,
  livekit_room_name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: Complete production file stored in workspace: /supabase/schema.sql`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchemaExcerpt);
    setCopied(true);
    soundEngine.playHarmonicChime(528, 0.4);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-sky-500/40 space-y-6 max-h-[90vh] overflow-y-auto font-mono">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold text-white font-serif">Supabase Backend Architecture</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'status' ? 'bg-sky-500 text-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            CONNECTION & STATE ENGINE
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'sql' ? 'bg-sky-500 text-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            SUPABASE SQL SCHEMA CODE
          </button>
        </div>

        {/* TAB 1: STATUS */}
        {activeTab === 'status' && (
          <div className="space-y-6 text-xs">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-500/10 to-transparent border border-sky-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isLiveSupabase ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-sky-500/20 border border-sky-500/40 text-sky-400'
                }`}>
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">CURRENT DATABASE ENGINE</span>
                  <h4 className="text-base font-bold text-white">
                    {isLiveSupabase ? 'Supabase Live Cloud Instance Connected' : 'ENKI High-Fidelity Local Persistence Engine'}
                  </h4>
                  <span className="text-slate-400 font-sans">
                    {isLiveSupabase
                      ? 'Row Level Security (RLS) & Realtime Websockets active.'
                      : 'Simulating full relational persistence across localStorage & BroadcastChannel.'}
                  </span>
                </div>
              </div>

              <span className={`px-3 py-1.5 rounded-full font-bold text-[10px] ${
                isLiveSupabase ? 'bg-emerald-500 text-black' : 'bg-sky-500 text-black animate-pulse'
              }`}>
                {isLiveSupabase ? 'LIVE' : 'ACTIVE SIMULATION'}
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="text-slate-300 uppercase tracking-widest font-semibold text-[11px]">
                ARCHITECTURE CAPABILITIES
              </h4>
              <ul className="space-y-2.5 text-slate-300 font-sans">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white font-mono">Row Level Security (RLS):</strong> Profiles, studios, and NKI transactions strictly enforce sovereign creator permissions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white font-mono">Realtime LiveKit Audio Synchronization:</strong> Low-latency studio conference rooms with speaker promotion and VU meter simulation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white font-mono">Cross-Tab Realtime Bus:</strong> Open multiple browser tabs right now to see instant synchronization of room chat, NKI tipping, and profile updates!</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div className="text-[11px]">
                <span className="text-slate-400">Production SQL File Location: </span>
                <span className="text-sky-300 font-bold">/supabase/schema.sql</span>
              </div>
              <button
                onClick={() => setActiveTab('sql')}
                className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/15 text-white text-[10px] transition-all"
              >
                VIEW CODE
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SQL SCHEMA CODE */}
        {activeTab === 'sql' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Complete Production Schema Excerpt:</span>
              <button
                onClick={copySql}
                className="px-3 py-1.5 rounded bg-sky-500/20 border border-sky-500/40 text-sky-300 hover:bg-sky-500 hover:text-black transition-all flex items-center gap-1.5 font-bold text-[11px]"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY SQL SCHEMA'}</span>
              </button>
            </div>

            <div className="bg-[#0b0c10] p-4 rounded-xl border border-white/15 max-h-80 overflow-y-auto pr-2 text-slate-300 text-[11px] leading-relaxed">
              <pre className="whitespace-pre-wrap">{sqlSchemaExcerpt}</pre>
            </div>

            <div className="text-[11px] text-slate-400 font-sans italic">
              * The full 170-line production script including seed data, RLS security policies, and indexes is written to your workspace file at <code className="text-sky-400 not-italic">supabase/schema.sql</code>.
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
          >
            CLOSE INSPECTOR
          </button>
        </div>

      </div>
    </div>
  );
};
