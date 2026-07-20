import React from 'react';
import { 
  Terminal, 
  Radio, 
  Users, 
  Sparkles, 
  Globe, 
  Database, 
  Volume2, 
  VolumeX, 
  ShieldCheck,
  Zap,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStudio } from '../../context/StudioContext';
import { useEconomy } from '../../context/EconomyContext';
import { soundEngine } from '../../lib/sound-engine';
import { isLiveSupabase } from '../../lib/supabase';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuthModal: () => void;
  onOpenSupabaseModal: () => void;
  onOpenCodex: () => void;
  showSacredGrid: boolean;
  setShowSacredGrid: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAuthModal,
  onOpenSupabaseModal,
  onOpenCodex,
  showSacredGrid,
  setShowSacredGrid
}) => {
  const { user } = useAuth();
  const { activeStudio } = useStudio();
  const { balance } = useEconomy();
  const [isMuted, setIsMuted] = React.useState(soundEngine.getIsMuted());

  const toggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEngine.playHarmonicChime(432, 0.4);
    }
  };

  const navItems = [
    { id: 'home', label: 'THE INSTITUTE', icon: Terminal },
    { id: 'network', label: 'NETWORK', icon: Users },
    { id: 'studios', label: 'ENKI STUDIOS', icon: Radio, badge: activeStudio ? 'LIVE' : undefined },
    { id: 'ascension', label: 'THE ASCENSION', icon: Sparkles },
    { id: 'nexus', label: 'THE NEXUS', icon: Globe },
    { id: 'treasury', label: 'THE TREASURY', icon: Zap },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0a0c]/85 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo - Apple-level corporate simplicity + subtle sacred institute subtext */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => {
              setCurrentTab('home');
              soundEngine.playHarmonicChime(432, 0.5);
            }}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-black border border-sky-500/40 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(56,189,248,0.3)] group-hover:border-sky-400 transition-all">
              {/* Sacred Golden Ratio Point symbol */}
              <div className="absolute inset-1 border border-sky-400/20 rounded-md rotate-45 group-hover:rotate-90 transition-transform duration-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8] group-hover:scale-125 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-[0.2em] text-white font-serif">ENKI</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono tracking-wider">
                  432Hz
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide block">
                Institute of Creative Technology
              </span>
            </div>
          </button>

          {/* Active Studio Quick Indicator if Inside a Room */}
          {activeStudio && (
            <button
              onClick={() => setCurrentTab('studios')}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/15 border border-sky-500/40 text-sky-300 text-xs font-mono animate-pulse hover:bg-sky-500/25 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span>ON AIR: {activeStudio.title.slice(0, 24)}...</span>
            </button>
          )}
        </div>

        {/* Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-xl border border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  soundEngine.playHarmonicChime(528, 0.3);
                }}
                className={`relative px-4 py-2 rounded-lg text-xs font-medium tracking-wider transition-all flex items-center gap-2 ${
                  isActive 
                    ? 'bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-white border border-sky-400/30 shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] font-mono bg-sky-500 text-black font-bold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Hub: NKI Wallet, Sound & Codex Toggles, User Account */}
        <div className="flex items-center gap-3">
          
          {/* Supabase Status Toggle / Indicator */}
          <button
            onClick={onOpenSupabaseModal}
            title="Inspect Supabase Architecture & SQL Schema"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 hover:border-sky-500/40 text-[11px] font-mono text-slate-300 transition-all"
          >
            <Database className={`w-3.5 h-3.5 ${isLiveSupabase ? 'text-emerald-400' : 'text-sky-400'}`} />
            <span>{isLiveSupabase ? 'SUPABASE: LIVE' : 'SUPABASE: ENGINE'}</span>
          </button>

          {/* Sound Mute/Unmute UI Audio */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute 432Hz Harmonic Sound Engine' : 'Mute Sound Engine'}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
          </button>

          {/* Sacred Geometry / Codex Access Overlay Button */}
          <button
            onClick={() => {
              setShowSacredGrid(prev => !prev);
              onOpenCodex();
              soundEngine.playHarmonicChime(618, 0.4);
            }}
            title="Toggle Golden Ratio Grid / Open Architectural Codex"
            className={`p-2 rounded-lg border transition-all ${
              showSacredGrid 
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <span className="font-mono text-xs font-bold leading-none">Φ</span>
          </button>

          {/* NKI Wallet Pill */}
          <button
            onClick={() => setCurrentTab('treasury')}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/30 hover:border-sky-400 transition-all text-xs font-mono"
          >
            <span className="text-sky-400 font-bold">$NKI</span>
            <span className="text-white font-semibold">{balance.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
          </button>

          {/* User Account / Creator Identity Button */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/25 transition-all text-left"
          >
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt={user?.full_name || 'Creator'}
              className="w-7 h-7 rounded-full object-cover border border-sky-400/40"
            />
            <div className="hidden xl:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-white truncate max-w-[100px]">
                  {user?.full_name || 'Elena Vance'}
                </span>
                {user?.is_verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400 inline" />
                )}
              </div>
              <span className="text-[10px] text-sky-300/80 font-mono block">
                Tier: {user?.ascension_tier || 'Architect'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

        </div>
      </div>
    </header>
  );
};
