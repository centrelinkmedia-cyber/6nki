import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Play, 
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { localDb } from '../../lib/supabase';
import type { AscensionModule } from '../../types';
import { soundEngine } from '../../lib/sound-engine';

export const AscensionView: React.FC = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState<AscensionModule[]>(localDb.getAscensionModules());
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');

  const handleCompleteModule = (id: string, reward: number) => {
    localDb.completeAscensionModule(id);
    setModules(localDb.getAscensionModules());
    soundEngine.playHarmonicChime(528, 0.8);
    alert(`Congratulations! You have completed this masterclass module and earned +${reward} $NKI units to your sovereign wallet.`);
  };

  const disciplines = ['All', 'Music', 'Voice Acting', 'Writing', 'Design', 'Business Strategy'];

  const filteredModules = modules.filter(m => {
    if (selectedDiscipline === 'All') return true;
    if (selectedDiscipline === 'Business Strategy') return m.discipline === 'Entrepreneurship' || m.title.toLowerCase().includes('strategy');
    return m.discipline === selectedDiscipline;
  });

  const tiers = [
    { title: 'Apprentice', desc: 'Mastering the fundamental harmonic structures of sound, grammar, and proportion.', req: '0 - 1,000 $NKI Earned' },
    { title: 'Artisan', desc: 'Crafting commercial fidelity works, acoustic stems, and transmedia lore blueprints.', req: '1,000 - 5,000 $NKI Earned' },
    { title: 'Luminary', desc: 'Hosting live ENKI Studios, directing talent, and publishing sovereign templates.', req: '5,000 - 15,000 $NKI Earned' },
    { title: 'Architect', desc: 'Shaping the foundational physics and IP governance of new creative civilizations.', req: '15,000+ $NKI Earned' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs font-mono text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSFORMATION & CAREER ARCHITECTURE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white">
            The Ascension
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-light max-w-2xl leading-relaxed">
            Helping creators transform conceptual ideas into sovereign, highly-lucrative professional careers. Guided by mathematical balance and executive business strategy.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-indigo-500/30 text-right font-mono text-xs">
          <span className="text-slate-400 block">CURRENT CREATOR TIER</span>
          <span className="text-xl font-bold text-gradient-cyan">{user?.ascension_tier || 'Architect'}</span>
          <span className="text-[10px] text-indigo-300 block mt-0.5">Resonance: {user?.resonance_score || 432} / 864 HZ</span>
        </div>
      </div>

      {/* CAREER PATHS & SOVEREIGN TIER ADVANCEMENT */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white font-serif">Sovereign Career Paths</h2>
          <p className="text-xs text-slate-400">The four tiers of advancement inside the ENKI Institute.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((t, idx) => {
            const isCurrent = user?.ascension_tier === t.title;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  isCurrent 
                    ? 'bg-gradient-to-b from-indigo-500/15 to-transparent border-indigo-400 shadow-[0_0_25px_-5px_rgba(99,102,241,0.3)]' 
                    : 'glass-panel border-white/10 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={`px-2.5 py-0.5 rounded ${isCurrent ? 'bg-indigo-500 text-black font-bold' : 'bg-white/5 text-slate-400'}`}>
                      Tier 0{idx + 1}
                    </span>
                    {isCurrent && <span className="text-indigo-300 font-bold">CURRENT</span>}
                  </div>
                  <h3 className="text-lg font-bold text-white font-serif">{t.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">{t.desc}</p>
                </div>
                <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400">
                  {t.req}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MASTERCLASSES, EDUCATION & TUTORIAL MODULES */}
      <section className="space-y-6 pt-6 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white font-serif">Curated Masterclasses & Tutorials</h2>
            <p className="text-xs text-slate-400">Earn $NKI units upon completion of each educational module.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {disciplines.map(disc => (
              <button
                key={disc}
                onClick={() => setSelectedDiscipline(disc)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  selectedDiscipline === disc ? 'bg-indigo-500 text-black font-bold shadow-sm' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {disc}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredModules.map(mod => (
            <div
              key={mod.id}
              className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-indigo-500/40 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                    {mod.discipline}
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>+{mod.nki_reward} $NKI REWARD</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                  {mod.title}
                </h3>

                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {mod.description}
                </p>

                {/* Philosophical Note Specification (Esoteric Inspiration) */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-indigo-500/20 font-mono text-[11px] text-indigo-300/90 space-y-1">
                  <div className="text-[9px] text-slate-400 uppercase tracking-widest">Esoteric Architectural Principle:</div>
                  <div className="italic font-sans text-slate-300">"{mod.philosophical_note}"</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4 text-xs font-mono">
                <div className="text-slate-400">
                  <span>Instructor: </span>
                  <span className="text-white font-semibold">{mod.instructor_name}</span>
                </div>

                {mod.completed ? (
                  <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>COMPLETED</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleCompleteModule(mod.id, mod.nki_reward)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>COMPLETE MODULE & CLAIM</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BUSINESS STRATEGY & CORPORATE TEMPLATES DOWNLOAd */}
      <section className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono text-sky-400 uppercase tracking-widest">
            EXECUTIVE RESOURCES & BUSINESS STRATEGY
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            Sovereign Creator Business Blueprint Pack
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
            Download our verified legal contracts, stem pack licensing agreements, transmedia IP structure blueprints, and financial models calibrated for professional creators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {[
            { title: 'Sovereign IP Licensing Contract (432Hz Audio / Stems)', type: 'PDF / DOCX' },
            { title: 'Transmedia World-Building Agreement & Royalty Matrix', type: 'PDF / XLSX' },
            { title: 'Executive Studio Host Pitch Deck Template', type: 'PPTX / PDF' },
          ].map((doc, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between space-y-3 hover:border-sky-500/40 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-sky-400">{doc.type}</span>
                <h4 className="text-xs font-bold text-white leading-snug">{doc.title}</h4>
              </div>
              <button
                onClick={() => {
                  soundEngine.playHarmonicChime(432, 0.4);
                  alert(`Downloading ${doc.title}... High-fidelity verified blueprint saved to workspace.`);
                }}
                className="w-full py-2 rounded-lg bg-white/5 hover:bg-sky-500 hover:text-black text-slate-300 text-xs font-mono transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD BLUEPRINT</span>
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
