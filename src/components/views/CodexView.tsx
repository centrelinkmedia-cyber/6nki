import React, { useState } from 'react';
import { 
  Volume2, 
  ChevronRight, 
  Play, 
  ArrowLeft
} from 'lucide-react';
import { ENKI_CODEX_NODES, PHI, HARMONIC_BASE_HZ, getGoldenSpiralPoints, getFlowerOfLifePoints } from '../../lib/sacred-geometry';
import { soundEngine } from '../../lib/sound-engine';

interface CodexViewProps {
  onBackToHome: () => void;
  showSacredGrid: boolean;
  setShowSacredGrid: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const CodexView: React.FC<CodexViewProps> = ({
  onBackToHome,
  showSacredGrid,
  setShowSacredGrid
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-1');
  const [visualizerMode, setVisualizerMode] = useState<'spiral' | 'flower' | 'grid'>('spiral');

  const activeNode = ENKI_CODEX_NODES.find(n => n.id === selectedNodeId) || ENKI_CODEX_NODES[0];

  const spiralPoints = getGoldenSpiralPoints(150, 150, 3, 24);
  const flowerPoints = getFlowerOfLifePoints(150, 150, 70);

  const triggerNodeHarmonic = (freq: number) => {
    soundEngine.playHarmonicChime(freq, 1.5);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in">
      
      {/* HEADER / NAVIGATION BACK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-3">
          <button
            onClick={onBackToHome}
            className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO INSTITUTE OVERVIEW</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-900 via-slate-900 to-black border border-indigo-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <span className="text-indigo-300 font-mono text-sm font-bold">Φ</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight">
                The Architecture of ENKI
              </h1>
              <span className="text-xs font-mono text-slate-400">
                Philosophical Substructure • Fundamental Frequency {HARMONIC_BASE_HZ}.00 HZ • Golden Ratio {PHI.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowSacredGrid(prev => !prev);
              soundEngine.playHarmonicChime(618, 0.4);
            }}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs transition-all border ${
              showSacredGrid
                ? 'bg-indigo-500 text-black font-bold border-indigo-400 shadow-sm'
                : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/25'
            }`}
          >
            {showSacredGrid ? 'GRID OVERLAY: ACTIVE' : 'GRID OVERLAY: OFF'}
          </button>

          <button
            onClick={() => soundEngine.playCodexResonance()}
            className="px-4 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-black border border-sky-500/40 font-mono text-xs font-bold transition-all flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            <span>TEST 108HZ HARMONIC CHORD</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: THE SUMERIAN NAMESAKE & THE MASTER ARCHITECT OF CRAFTS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-500/15 border border-indigo-500/30 text-xs font-mono text-indigo-300">
            <span>THE ORIGIN OF ENKI</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white leading-snug">
            Why We Do Not Build &quot;Normal&quot; Media Platforms.
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
            <p>
              In ancient Sumerian history, <strong className="text-white font-medium">Enki</strong> was the deity of wisdom, crafts, water, and creation. He gifted humanity the <em className="text-sky-300">Me</em> (pronounced *may*)—the fundamental blueprints, institutions, and artistic disciplines required to build high civilization.
            </p>
            <p>
              Today’s modern digital platforms treat musicians, filmmakers, voice actors, and writers as disposable, algorithmic *content generators* forced into predatory revenue shares and compressed audio channels.
            </p>
            <p>
              <strong className="text-white font-medium">ENKI is built as a private innovation institute.</strong> We treat creators as sovereign masters. By uniting uncompressed audio (432 Hz), mathematical visual balance (1:1.618), and sovereign value exchange ($NKI$), we provide the structural foundation for the next era of human artistry.
            </p>
          </div>
        </div>

        {/* HARMONIC VISUALIZER CANVAS (Spiral / Flower / Grid) */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-mono text-indigo-300 uppercase font-bold">SACRED MATHEMATICAL CANVAS</span>
            <div className="flex gap-1.5 font-mono text-[10px]">
              {(['spiral', 'flower', 'grid'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => {
                    setVisualizerMode(mode);
                    soundEngine.playHarmonicChime(528, 0.3);
                  }}
                  className={`px-2.5 py-1 rounded uppercase ${
                    visualizerMode === mode ? 'bg-indigo-500 text-black font-bold' : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Geometric Renderer */}
          <div className="relative h-64 w-full flex items-center justify-center bg-[#0a0a0c]/80 rounded-2xl border border-white/10 overflow-hidden">
            <svg viewBox="0 0 300 300" className="w-full h-full max-w-[280px] max-h-[280px]">
              
              {/* Center fundamental glow */}
              <circle cx="150" cy="150" r="4" fill="#38bdf8" className="animate-ping" />
              <circle cx="150" cy="150" r="3" fill="#6366f1" />

              {visualizerMode === 'spiral' && (
                <g stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.8">
                  {/* Golden Spiral interpolation */}
                  <path
                    d={spiralPoints.reduce((acc, pt, idx) => {
                      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
                    }, '')}
                    className="animate-subtle-pulse"
                  />
                  {spiralPoints.map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r={1 + (i / spiralPoints.length) * 2.5} fill="#6366f1" />
                  ))}
                  <circle cx="150" cy="150" r="40" strokeDasharray="3 3" stroke="#38bdf8" opacity="0.3" />
                  <circle cx="150" cy="150" r="64.7" strokeDasharray="3 3" stroke="#38bdf8" opacity="0.3" />
                  <circle cx="150" cy="150" r="104.7" strokeDasharray="3 3" stroke="#38bdf8" opacity="0.3" />
                </g>
              )}

              {visualizerMode === 'flower' && (
                <g stroke="#6366f1" strokeWidth="0.8" fill="none" opacity="0.75">
                  <circle cx="150" cy="150" r="70" stroke="#38bdf8" strokeWidth="1.2" />
                  {flowerPoints.map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r="70" className="animate-subtle-pulse" />
                  ))}
                  {flowerPoints.map((pt, i) => (
                    <circle key={`dot-${i}`} cx={pt.x} cy={pt.y} r="2" fill="#38bdf8" />
                  ))}
                </g>
              )}

              {visualizerMode === 'grid' && (
                <g stroke="#38bdf8" strokeWidth="0.8" opacity="0.6">
                  <line x1="0" y1="114.6" x2="300" y2="114.6" strokeDasharray="4 4" />
                  <line x1="0" y1="185.4" x2="300" y2="185.4" strokeDasharray="4 4" />
                  <line x1="114.6" y1="0" x2="114.6" y2="300" strokeDasharray="4 4" />
                  <line x1="185.4" y1="0" x2="185.4" y2="300" strokeDasharray="4 4" />
                  <rect x="114.6" y="114.6" width="70.8" height="70.8" fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth="1.5" />
                  <circle cx="150" cy="150" r="35.4" fill="none" stroke="#38bdf8" strokeWidth="1" />
                </g>
              )}

            </svg>
          </div>

          <div className="text-center font-mono text-[11px] text-slate-400">
            <span>Harmonic Proportions Governed by Φ = 1.6180339887</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE CODEX PILLARS (THE 5 ARCHITECTURAL NODES) */}
      <section className="space-y-6 pt-6 border-t border-white/10">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white font-serif">The Five Pillars of the Codex</h2>
          <p className="text-xs text-slate-400">Select any node below to inspect its mathematical calibration and hear its harmonic resonance tone.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Node List */}
          <div className="space-y-3">
            {ENKI_CODEX_NODES.map(node => {
              const isSelected = node.id === selectedNodeId;
              return (
                <button
                  key={node.id}
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    triggerNodeHarmonic(node.frequency);
                  }}
                  className={`w-full p-4 rounded-2xl text-left transition-all border flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-500/20 to-indigo-500/20 border-sky-400 shadow-[0_0_20px_-5px_rgba(56,189,248,0.3)]'
                      : 'glass-panel border-white/10 hover:border-white/25 text-slate-400'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest">{node.discipline}</span>
                    <h3 className="text-sm font-bold text-white leading-snug">{node.label}</h3>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-indigo-300">
                    <span>{node.frequency} Hz</span>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-sky-400 translate-x-1' : 'text-slate-500'} transition-transform`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Node Deep Inspection Panel */}
          <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-sky-500/40 space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-sky-400 uppercase tracking-widest">{activeNode.discipline}</span>
                  <h3 className="text-2xl font-bold text-white font-serif">{activeNode.label}</h3>
                </div>
                <button
                  onClick={() => triggerNodeHarmonic(activeNode.frequency)}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-mono text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>PLAY {activeNode.frequency} HZ TONE</span>
                </button>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed font-light">
                {activeNode.description}
              </p>

              <div className="bg-black/40 p-5 rounded-2xl border border-white/10 font-mono text-xs space-y-3">
                <div className="text-sky-400 font-bold flex items-center justify-between">
                  <span>QUANTUM DIGITAL IMPLEMENTATION</span>
                  <span className="text-emerald-400 text-[10px]">● CODE SPECIFICATION</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Every live LiveKit WebRTC audio room inside ENKI avoids artificial dynamic range compression below 32kHz. This ensures that the delicate vocal micro-expressions of our voice actors and the spatial panning of our music producers arrive with absolute harmonic integrity.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400 relative z-10">
              <span>Node Coordinates: ({activeNode.coordinates.x}, {activeNode.coordinates.y})</span>
              <span>Substructure Version: 2.6.18</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: THE 432 HZ ACOUSTIC SPECIFICATION EXPLANATION */}
      <section className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-2 space-y-4">
          <span className="text-xs font-mono text-sky-400 uppercase tracking-widest">
            THE ACOUSTIC STANDARD
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            432 Hz vs 440 Hz: Mathematical Resonance
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
            While standard modern commercial tuning centers on 440 Hz, 432 Hz connects mathematically to the golden ratio (Φ) and natural organic frequencies (8 Hz Schumann resonance × 54 = 432 Hz). By structuring ENKI&apos;s audio pipeline and ambient UI feedback around 432 Hz, we create digital environments that foster deep creative focus without cognitive strain.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-4 font-mono text-xs">
          <Volume2 className="w-8 h-8 text-sky-400 mx-auto animate-pulse" />
          <div className="space-y-1">
            <span className="text-white font-bold block text-sm">432.000 HZ MASTER</span>
            <span className="text-[10px] text-slate-400 block">System Frequency Calibrated</span>
          </div>
          <button
            onClick={() => soundEngine.playHarmonicChime(432, 2.0)}
            className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold tracking-wider transition-all shadow-sm"
          >
            HEAR 432 HZ CHIME
          </button>
        </div>
      </section>

    </div>
  );
};
