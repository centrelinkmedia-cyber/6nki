import React, { useState } from 'react';
import { Radio, X, Check } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { soundEngine } from '../../lib/sound-engine';

interface CreateStudioModalProps {
  onClose: () => void;
}

export const CreateStudioModal: React.FC<CreateStudioModalProps> = ({ onClose }) => {
  const { createAndJoinStudio } = useStudio();

  const [title, setTitle] = useState('');
  const [discipline, setDiscipline] = useState('Music Production');
  const [preset, setPreset] = useState('Lossless 48kHz / 432Hz Master');
  const [mode, setMode] = useState<'Open' | 'Audition' | 'Masterclass' | 'Private Strategy'>('Open');

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundEngine.playHarmonicChime(432, 0.8);
    await createAndJoinStudio(title.trim(), discipline, preset, mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-sky-500/40 space-y-6 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-sky-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white font-serif">Launch ENKI Studio Room</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleLaunch} className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 uppercase">Studio Room Title</label>
            <input
              type="text"
              placeholder="e.g., Cinematic Sound Design & Frequency Tuning Room"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none font-sans text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 uppercase">Primary Room Discipline</label>
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none"
            >
              <option value="Music Production">Music Production & Spatial Acoustics</option>
              <option value="Voice Acting Auditions">Cinematic Voice Acting Auditions</option>
              <option value="Writer Room">Transmedia Writer Roundtable</option>
              <option value="Creative Strategy">Executive Strategy & IP Consulting</option>
              <option value="Listening Parties">432Hz Ambient Stem Listening Party</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 uppercase">Audio Fidelity & Acoustic Preset</label>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none"
            >
              <option value="Lossless 48kHz / 432Hz Master">Lossless 48kHz / 432Hz Master (Uncompressed)</option>
              <option value="Studio Condenser / Low-Latency">Studio Condenser Vocal Priority (&lt; 15ms)</option>
              <option value="Spatial Surround 5.1 Preview">Spatial Surround 5.1 Preview</option>
              <option value="Voice Optimized 32kHz">Voice Optimized 32kHz (Roundtable Discussion)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 uppercase">Conference Room Protocol</label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {(['Open', 'Audition', 'Masterclass', 'Private Strategy'] as const).map(rm => (
                <button
                  key={rm}
                  type="button"
                  onClick={() => setMode(rm)}
                  className={`py-2 px-3 rounded-xl border transition-all text-left flex items-center justify-between ${
                    mode === rm ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <span>{rm}</span>
                  {mode === rm && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 text-[11px] text-sky-300 space-y-1">
            <div className="font-bold">⚡ ENKI HOST VERIFICATION BOUNTY</div>
            <div>Launching a live collaborative room automatically rewards your wallet with +100.00 $NKI units!</div>
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-black font-bold tracking-wider shadow-sm"
            >
              DEPLOY LIVE ROOM & ENTER
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
