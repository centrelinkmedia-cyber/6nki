import React from 'react';
import { 
  Radio, 
  Sparkles, 
  Terminal, 
  ArrowRight, 
  Music, 
  Film, 
  Mic, 
  BookOpen, 
  Palette, 
  TrendingUp, 
  Database
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { soundEngine } from '../../lib/sound-engine';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  onOpenCodex: () => void;
  onOpenSupabaseModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setCurrentTab,
  onOpenCodex,
  onOpenSupabaseModal
}) => {
  const { allStudios, joinStudio } = useStudio();

  const disciplines = [
    { title: 'Music & Spatial Acoustics', count: '1,420 Creators', icon: Music, desc: 'Harmonic frequency engineering & uncompressed 432Hz audio masters.' },
    { title: 'Cinematic Voice Acting', count: '890 Actors', icon: Mic, desc: 'Franchise vocal direction, character dialectics & sub-vocal clarity.' },
    { title: 'Transmedia World-Building', count: '640 Writers', icon: BookOpen, desc: 'Speculative lore bibles, mythological narrative structures & screenplays.' },
    { title: 'Film & Visual Futures', count: '780 Directors', icon: Film, desc: 'Cinematic pre-visualization, spatial rendering & transmedia directing.' },
    { title: 'Generative Design & Tech', count: '1,120 Designers', icon: Palette, desc: 'Fibonacci-proportion interface architecture & quantum visual systems.' },
    { title: 'Executive Business Strategy', count: '450 Advisors', icon: TrendingUp, desc: 'Sovereign creative ventures, IP licensing & sovereign token economics.' },
  ];

  const liveStudios = allStudios.filter(s => s.status === 'live');

  return (
    <div className="space-y-24 pb-16">
      
      {/* HERO SECTION: Apple-level corporate simplicity + private innovation institute */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-white/10">
        
        {/* Background Subtle Gradient & Harmonic Radial */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-sky-600/10 via-indigo-600/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          
          {/* Institute Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-pill border border-sky-500/30 text-xs font-mono text-sky-300 animate-fade-in shadow-[0_0_20px_-5px_rgba(56,189,248,0.2)]">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>PRIVATE CREATIVE TECHNOLOGY INSTITUTE — RELEASE 2.6.18</span>
          </div>

          {/* Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-serif text-white leading-[1.1]">
              Where Modern Technology Meets the <span className="text-gradient-cyan">Architecture of Human Creativity</span>.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
              ENKI is an elite creator operating system uniting music, film, voice acting, transmedia writing, and executive business strategy into a singular, uncompressed collaborative ecosystem.
            </p>
          </div>

          {/* Primary Call to Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setCurrentTab('studios');
                soundEngine.playHarmonicChime(432, 0.5);
              }}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-black font-bold text-sm tracking-wider shadow-[0_0_30px_-5px_rgba(56,189,248,0.5)] transition-all flex items-center gap-3 group"
            >
              <Radio className="w-5 h-5 group-hover:scale-110 transition-transform text-black" />
              <span>ENTER ENKI STUDIOS (LIVE ROOMS)</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('ascension');
                soundEngine.playHarmonicChime(528, 0.4);
              }}
              className="px-8 py-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-white/30 text-white font-semibold text-sm tracking-wider transition-all flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5 text-sky-400" />
              <span>THE ASCENSION SYSTEM</span>
            </button>
          </div>

          {/* Subtext philosophical hint */}
          <div className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span>[FREQUENCY: 432 HZ]</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            <span>[GOLDEN RATIO: 1:1.618]</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            <button 
              onClick={onOpenCodex} 
              className="text-sky-400/90 hover:text-sky-300 underline underline-offset-4 transition-colors"
            >
              [DISCOVER THE CODEX UNDERNEATH]
            </button>
          </div>

        </div>
      </section>

      {/* LIVE ENKI STUDIOS CAROUSEL / SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase tracking-widest mb-1">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>REAL-TIME COLLABORATIVE ROOMS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Active ENKI Studios
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('studios')}
            className="text-xs font-mono text-slate-300 hover:text-sky-400 flex items-center gap-1.5 transition-colors"
          >
            <span>VIEW ALL ({allStudios.length} ROOMS)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {liveStudios.length === 0 ? (
          <div className="p-12 rounded-2xl glass-panel text-center text-slate-400 space-y-3">
            <Radio className="w-10 h-10 mx-auto text-slate-600" />
            <p>No live studios active right now.</p>
            <button 
              onClick={() => setCurrentTab('studios')}
              className="px-6 py-2 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-mono hover:bg-sky-500/30 transition-all"
            >
              CREATE A NEW STUDIO ROOM
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveStudios.slice(0, 3).map((studio) => (
              <div 
                key={studio.id}
                className="glass-panel rounded-2xl p-6 glass-panel-hover flex flex-col justify-between border border-white/10 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-bl-full pointer-events-none group-hover:bg-sky-500/15 transition-all" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold">
                      {studio.discipline}
                    </span>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>{studio.listener_count} LISTENERS</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2">
                    {studio.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {studio.description}
                  </p>

                  <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                    <img
                      src={studio.host?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                      alt={studio.host?.full_name || 'Host'}
                      className="w-8 h-8 rounded-full object-cover border border-sky-400/40"
                    />
                    <div className="text-xs">
                      <span className="text-slate-400 text-[10px] block font-mono">HOSTED BY</span>
                      <span className="text-white font-semibold truncate block max-w-[150px]">
                        {studio.host?.full_name || 'Elena Vance'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 relative z-10">
                  <button
                    onClick={() => joinStudio(studio)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500/20 to-indigo-500/20 hover:from-sky-500 hover:to-indigo-500 text-sky-300 hover:text-black font-bold text-xs tracking-wider border border-sky-500/40 hover:border-transparent transition-all flex items-center justify-center gap-2"
                  >
                    <Radio className="w-4 h-4" />
                    <span>ENTER LIVE ROOM</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MULTIDISCIPLINARY CREATOR OPERATING SYSTEM MATRIX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono text-sky-400 uppercase tracking-widest">
            THE CREATOR OPERATING SYSTEM
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white">
            Six Disciplines. One Unbroken Harmonic Pipeline.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-light">
            Do not simplify ENKI into a normal music website. We provide professional studio infrastructure, IP governance, and multi-disciplinary synergy for the modern master.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disciplines.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => setCurrentTab('network')}
                className="glass-panel p-6 rounded-2xl glass-panel-hover cursor-pointer border border-white/10 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center group-hover:border-sky-400/50 group-hover:bg-sky-500/10 transition-all">
                    <Icon className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-xs font-mono text-slate-400 block mt-1">
                      {item.count} Active Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-sky-400 group-hover:translate-x-1 transition-transform">
                  <span>EXPLORE NETWORK</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* THE CODEX & ESOTERIC LAYER TEASER (Rewarding curiosity without clutter) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#121318] via-[#161822] to-[#0a0a0c] border border-sky-500/30 p-8 sm:p-12 relative overflow-hidden shadow-[0_0_50px_-15px_rgba(56,189,248,0.25)]">
          
          {/* Background sacred geometry watermark */}
          <div className="absolute -right-16 -bottom-16 w-96 h-96 rounded-full border border-sky-500/15 pointer-events-none opacity-40 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full border border-indigo-500/15" />
            <div className="w-32 h-32 rounded-full border border-sky-400/20" />
          </div>

          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>THE PHILOSOPHICAL ARCHITECTURE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white leading-tight">
              A professional technology company on the surface. <span className="text-gradient-cyan">A deeper philosophy underneath.</span>
            </h2>

            <p className="text-sm text-slate-300 font-light leading-relaxed">
              Named after Enki, the ancient Sumerian architect of wisdom, crafts, and creation, our systems harmonize quantum digital workflows with sacred geometry (1:1.618) and fundamental acoustic frequencies (432 Hz).
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onOpenCodex}
                className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs font-mono tracking-wider transition-all flex items-center gap-2 shadow-[0_0_20px_-5px_#38bdf8]"
              >
                <Terminal className="w-4 h-4" />
                <span>INSPECT THE CODEX & SACRED CANVAS</span>
              </button>

              <button
                onClick={onOpenSupabaseModal}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 font-mono text-xs transition-all flex items-center gap-2"
              >
                <Database className="w-4 h-4 text-sky-400" />
                <span>VIEW SUPABASE BACKEND ARCHITECTURE</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
