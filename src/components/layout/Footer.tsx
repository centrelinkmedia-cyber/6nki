import React from 'react';
import { Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenCodex: () => void;
  onOpenSupabaseModal: () => void;
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCodex, onOpenSupabaseModal, setCurrentTab }) => {
  return (
    <footer className="w-full bg-[#0a0a0c] border-t border-white/10 mt-24 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Subtle harmonic radial glow in footer */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-sky-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        
        {/* Col 1: Brand & Philosophy summary */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-slate-800 to-black border border-sky-500/40 flex items-center justify-center">
              <span className="text-sky-400 font-mono text-xs font-bold">Φ</span>
            </div>
            <span className="text-lg font-bold tracking-[0.2em] text-white font-serif">ENKI</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            An elite creative technology platform where modern innovation meets ancient principles of human creativity. Combining music, film, voice acting, writing, design, and executive strategy.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onOpenCodex}
              className="text-[11px] font-mono text-sky-400/90 hover:text-sky-300 flex items-center gap-1.5 border border-sky-500/30 px-3 py-1.5 rounded bg-sky-500/5 hover:bg-sky-500/10 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>[CODEX ACCESS: ACTIVE]</span>
            </button>
          </div>
        </div>

        {/* Col 2: Creator Network Disciplines */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono tracking-widest text-slate-300 uppercase">Disciplines</h4>
          <ul className="space-y-2 text-xs text-slate-400 font-light">
            <li><button onClick={() => setCurrentTab('network')} className="hover:text-sky-400 transition-colors">Music Production & Spatial Acoustics</button></li>
            <li><button onClick={() => setCurrentTab('network')} className="hover:text-sky-400 transition-colors">Cinematic Voice Acting & Direction</button></li>
            <li><button onClick={() => setCurrentTab('network')} className="hover:text-sky-400 transition-colors">Transmedia World-Building & Writing</button></li>
            <li><button onClick={() => setCurrentTab('network')} className="hover:text-sky-400 transition-colors">Film Architecture & Visual Futures</button></li>
            <li><button onClick={() => setCurrentTab('network')} className="hover:text-sky-400 transition-colors">Executive Business Strategy & Consulting</button></li>
          </ul>
        </div>

        {/* Col 3: Core Platform Features */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono tracking-widest text-slate-300 uppercase">Architecture</h4>
          <ul className="space-y-2 text-xs text-slate-400 font-light">
            <li><button onClick={() => setCurrentTab('studios')} className="hover:text-sky-400 transition-colors">ENKI Studios (Live Audio Rooms)</button></li>
            <li><button onClick={() => setCurrentTab('ascension')} className="hover:text-sky-400 transition-colors">The Ascension (Creator Transformation)</button></li>
            <li><button onClick={() => setCurrentTab('nexus')} className="hover:text-sky-400 transition-colors">The Nexus (Marketplace & Collaborations)</button></li>
            <li><button onClick={() => setCurrentTab('treasury')} className="hover:text-sky-400 transition-colors">The Treasury ($NKI Internal Economy)</button></li>
            <li><button onClick={onOpenSupabaseModal} className="hover:text-sky-400 transition-colors">Supabase Backend & SQL Schema</button></li>
          </ul>
        </div>

        {/* Col 4: Esoteric System Telemetry */}
        <div className="space-y-3 bg-white/[0.02] p-4 rounded-xl border border-white/10 font-mono text-[11px]">
          <h4 className="text-xs tracking-widest text-sky-400 uppercase font-semibold flex items-center justify-between">
            <span>SYSTEM METRICS</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </h4>
          <div className="space-y-1.5 text-slate-400">
            <div className="flex justify-between">
              <span>FUNDAMENTAL FREQ:</span>
              <span className="text-white">432.000 HZ</span>
            </div>
            <div className="flex justify-between">
              <span>GOLDEN RATIO (Φ):</span>
              <span className="text-white">1.6180339887</span>
            </div>
            <div className="flex justify-between">
              <span>REALTIME PROTOCOL:</span>
              <span className="text-white">LiveKit / WebRTC</span>
            </div>
            <div className="flex justify-between">
              <span>DATABASE CORE:</span>
              <span className="text-white">Supabase / RLS</span>
            </div>
          </div>
          <div className="pt-2 border-t border-white/10 text-[10px] text-slate-500">
            Node: Erie, PA (42.1292° N, 80.0851° W)
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-light gap-4">
        <div>
          © 2026 ENKI Creative Systems Inc. All Rights Reserved. Private Innovation Institute.
        </div>
        <div className="flex items-center gap-6 font-mono text-[11px]">
          <button onClick={onOpenCodex} className="hover:text-slate-300 transition-colors">[ESOTERIC ARCHITECTURE]</button>
          <button onClick={onOpenSupabaseModal} className="hover:text-slate-300 transition-colors">[SQL SCHEMA]</button>
        </div>
      </div>
    </footer>
  );
};
