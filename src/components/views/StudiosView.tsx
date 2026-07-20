import React, { useState } from 'react';
import { 
  Radio, 
  Plus, 
  Volume2, 
  Search, 
  Headphones
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ActiveStudioRoom } from './ActiveStudioRoom';
import { soundEngine } from '../../lib/sound-engine';

export const StudiosView: React.FC<{ onOpenCreateModal: () => void }> = ({ onOpenCreateModal }) => {
  const { activeStudio, allStudios, joinStudio } = useStudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');

  if (activeStudio) {
    return <ActiveStudioRoom />;
  }

  const disciplines = ['All', 'Music Production', 'Voice Acting Auditions', 'Writer Room', 'Creative Strategy', 'Listening Parties'];

  const filteredStudios = allStudios.filter(studio => {
    const matchesQuery = studio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         studio.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         studio.discipline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDisc = selectedDiscipline === 'All' || studio.discipline === selectedDiscipline;
    return matchesQuery && matchesDisc;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-xs font-mono text-sky-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>REAL-TIME COLLABORATIVE ROOMS (LIVEKIT ENGINE)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white">
            ENKI Studios
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-light max-w-2xl">
            Live creative rooms designed for professional feedback, voice auditions, transmedia writer roundtables, and executive strategy sessions. Calibrated for lossless acoustic clarity (432 Hz).
          </p>
        </div>

        <button
          onClick={() => {
            onOpenCreateModal();
            soundEngine.playHarmonicChime(528, 0.4);
          }}
          className="px-6 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-black font-bold text-xs tracking-wider shadow-[0_0_25px_-5px_rgba(56,189,248,0.4)] transition-all flex items-center gap-2.5 self-start md:self-auto"
        >
          <Plus className="w-5 h-5 text-black" />
          <span>CREATE A LIVE STUDIO ROOM</span>
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {disciplines.map(disc => (
            <button
              key={disc}
              onClick={() => setSelectedDiscipline(disc)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                selectedDiscipline === disc
                  ? 'bg-sky-500 text-black font-bold shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {disc}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search live studio rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/15 focus:border-sky-400 text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* STUDIOS DIRECTORY GRID */}
      {filteredStudios.length === 0 ? (
        <div className="p-16 rounded-3xl glass-panel text-center space-y-4 max-w-xl mx-auto border border-white/10">
          <Headphones className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white font-serif">No Studio Rooms Match Criteria</h3>
          <p className="text-xs text-slate-400 font-light">
            Try resetting your discipline filter or launch your own live acoustic studio right now.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="px-6 py-2.5 rounded-xl bg-sky-500 text-black font-bold text-xs font-mono hover:bg-sky-400 transition-all shadow-sm mt-2"
          >
            LAUNCH NEW ROOM
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudios.map(studio => (
            <div
              key={studio.id}
              className="glass-panel p-6 sm:p-7 rounded-3xl glass-panel-hover flex flex-col justify-between border border-white/10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-sky-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:from-sky-500/20 transition-all" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold">
                    {studio.discipline}
                  </span>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{studio.listener_count} LISTENERS</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                  {studio.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-light">
                  {studio.description}
                </p>

                {studio.active_asset_title && (
                  <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-sky-300 truncate flex items-center gap-2">
                    <span>📄</span>
                    <span className="truncate">Spotlight: {studio.active_asset_title}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={studio.host?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                      alt={studio.host?.full_name || 'Host'}
                      className="w-8 h-8 rounded-full object-cover border border-sky-400/50"
                    />
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">HOST</span>
                      <span className="text-white font-semibold truncate block max-w-[140px]">
                        {studio.host?.full_name || 'Elena Vance'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-2 py-1 rounded border border-white/5">
                    {studio.room_mode}
                  </span>
                </div>
              </div>

              <div className="pt-6 relative z-10">
                <button
                  onClick={() => joinStudio(studio)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500/20 to-indigo-500/20 hover:from-sky-500 hover:to-indigo-500 text-sky-300 hover:text-black font-bold text-xs font-mono tracking-wider border border-sky-500/40 hover:border-transparent transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Radio className="w-4 h-4" />
                  <span>ENTER LIVE ROOM</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AUDIO SPECIFICATION NOTICE BOX */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 font-mono text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-sky-400" />
          <div>
            <span className="text-white font-bold">ENKI Studio Acoustic Standard: </span>
            <span>All rooms process audio via low-latency WebRTC streams calibrated to mathematical harmonic balance (432 Hz).</span>
          </div>
        </div>
        <span className="text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded">
          LIVEKIT ARCHITECTURE ACTIVE
        </span>
      </div>

    </div>
  );
};
