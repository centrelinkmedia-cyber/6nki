import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Hand, 
  LogOut, 
  Volume2, 
  Users, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  Crown, 
  Send, 
  DollarSign, 
  Share2, 
  X,
  UserPlus
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { useAuth } from '../../context/AuthContext';
import { useEconomy } from '../../context/EconomyContext';
import { soundEngine } from '../../lib/sound-engine';

export const ActiveStudioRoom: React.FC = () => {
  const { 
    activeStudio, 
    participants, 
    messages, 
    isMicOn, 
    activeTab, 
    setActiveTab, 
    leaveStudio, 
    toggleMic, 
    requestMic, 
    promoteSpeaker, 
    demoteSpeaker, 
    sendMessage 
  } = useStudio();
  const { user } = useAuth();
  const { sendTip } = useEconomy();

  const [chatInput, setChatInput] = useState('');
  const [tipAmount, setTipAmount] = useState('50');
  const [showTipModal, setShowTipModal] = useState(false);
  const [sharedAssetUrl, setSharedAssetUrl] = useState('');
  const [sharedAssetTitle, setSharedAssetTitle] = useState('');

  if (!activeStudio) return null;

  const isHost = activeStudio.host_id === user?.id || activeStudio.host?.username === user?.username;
  const localParticipant = participants.find(p => p.name === user?.full_name || p.identity === user?.username);
  const isOnStage = isHost || localParticipant?.role === 'speaker' || localParticipant?.role === 'host';

  const hostParticipant = participants.find(p => p.role === 'host') || {
    identity: activeStudio.host?.username || 'host',
    name: activeStudio.host?.full_name || 'Elena Vance',
    role: 'host' as const,
    isSpeaking: true,
    isMuted: false,
    audioLevel: 0.65,
    avatarUrl: activeStudio.host?.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    discipline: activeStudio.discipline
  };

  const speakers = participants.filter(p => p.role === 'speaker' || (p.role === 'host' && p.identity !== hostParticipant.identity));
  const listeners = participants.filter(p => p.role === 'listener');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage(chatInput.trim());
    setChatInput('');
    soundEngine.playHarmonicChime(528, 0.3);
  };

  const handleShareAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sharedAssetTitle.trim()) return;
    sendMessage(
      `Shared asset: ${sharedAssetTitle.trim()}`,
      'asset',
      sharedAssetTitle.trim(),
      sharedAssetUrl.trim() || '#document'
    );
    setSharedAssetTitle('');
    setSharedAssetUrl('');
    setActiveTab('assets');
    soundEngine.playHarmonicChime(618, 0.4);
  };

  const handleSendTip = () => {
    const amt = parseFloat(tipAmount);
    if (isNaN(amt) || amt <= 0) return;
    const success = sendTip(
      activeStudio.host_id,
      activeStudio.host?.full_name || 'Host',
      amt,
      `Tip during Live Studio: ${activeStudio.title}`
    );
    if (success) {
      sendMessage(`Tipped the Host ${amt} $NKI for exceptional acoustic leadership! ⚡`, 'tip');
      setShowTipModal(false);
    } else {
      alert('Insufficient $NKI balance.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      
      {/* STUDIO HEADER / TELEMETRY BANNER */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/30 shadow-[0_0_40px_-10px_rgba(56,189,248,0.25)] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 font-bold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>ENKI STUDIOS</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
              {activeStudio.discipline}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-sky-400" />
              <span>{activeStudio.audio_preset}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-white tracking-tight">
            {activeStudio.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-light max-w-3xl">
            {activeStudio.description}
          </p>
        </div>

        {/* Right side navigation tabs & leave button */}
        <div className="flex flex-wrap items-center gap-3 relative z-10 w-full md:w-auto justify-end">
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('stage')}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-2 ${
                activeTab === 'stage' ? 'bg-sky-500 text-black font-bold shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>STAGE</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-2 ${
                activeTab === 'chat' ? 'bg-sky-500 text-black font-bold shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>CHAT ({messages.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-2 ${
                activeTab === 'assets' ? 'bg-sky-500 text-black font-bold shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>ASSETS</span>
            </button>
          </div>

          <button
            onClick={leaveStudio}
            className="px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>LEAVE STUDIO</span>
          </button>
        </div>
      </div>

      {/* MAIN CONFERENCE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* COL 1-3: THE STAGE & AUDIENCE (OR CHAT / ASSET PANEL) */}
        <div className="lg:col-span-3 space-y-6">
          
          {activeTab === 'stage' && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-8">
              
              {/* EXACT PROMPT REQUIRED SPECIFICATION BOX FOR "ENKI STUDIOS" */}
              <div className="bg-[#0e0f14] p-5 sm:p-6 rounded-2xl border border-sky-500/20 font-mono space-y-4">
                <div className="flex items-center justify-between text-xs text-sky-400 border-b border-white/10 pb-3">
                  <span className="font-bold tracking-widest">ENKI STUDIOS — CONFERENCE ROOM ARCHITECTURE</span>
                  <span className="text-emerald-400">● LIVE CONNECTION</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Host Box */}
                  <div className="bg-white/[0.03] p-4 rounded-xl border border-white/10 space-y-2">
                    <div className="text-[10px] text-slate-400 tracking-wider">HOST:</div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={hostParticipant.avatarUrl}
                          alt={hostParticipant.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/80"
                        />
                        <Crown className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 fill-amber-400" />
                        {hostParticipant.isSpeaking && !hostParticipant.isMuted && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded bg-sky-500 text-black text-[8px] font-bold">
                            TALKING
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                          <span>{hostParticipant.name}</span>
                          <ShieldCheck className="w-4 h-4 text-sky-400" />
                        </div>
                        <span className="text-xs text-sky-300 block">{hostParticipant.discipline || 'Host'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stage Speakers Box */}
                  <div className="bg-white/[0.03] p-4 rounded-xl border border-white/10 space-y-2">
                    <div className="text-[10px] text-slate-400 tracking-wider">ON STAGE:</div>
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                      {/* Host is always on stage + active speakers */}
                      <div className="flex items-center justify-between text-xs py-1 px-2 rounded bg-white/5 border border-white/10">
                        <span className="flex items-center gap-2 text-white font-medium">
                          <span>🎙️</span>
                          <span>{hostParticipant.name}</span>
                          <span className="text-[10px] text-amber-400/80">(Host)</span>
                        </span>
                        {hostParticipant.isSpeaking && !hostParticipant.isMuted ? (
                          <div className="flex items-center gap-0.5 h-3">
                            <span className="w-1 bg-sky-400 vu-bar" />
                            <span className="w-1 bg-sky-400 vu-bar" />
                            <span className="w-1 bg-sky-400 vu-bar" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400">Silent</span>
                        )}
                      </div>

                      {speakers.map(sp => (
                        <div key={sp.identity} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-white/5 border border-white/10">
                          <span className="flex items-center gap-2 text-white font-medium">
                            <span>🎙️</span>
                            <span>{sp.name}</span>
                            <span className="text-[10px] text-sky-300">({sp.discipline || 'Speaker'})</span>
                          </span>
                          <div className="flex items-center gap-2">
                            {sp.isSpeaking && !sp.isMuted ? (
                              <div className="flex items-center gap-0.5 h-3">
                                <span className="w-1 bg-emerald-400 vu-bar" />
                                <span className="w-1 bg-emerald-400 vu-bar" />
                                <span className="w-1 bg-emerald-400 vu-bar" />
                              </div>
                            ) : sp.isMuted ? (
                              <MicOff className="w-3.5 h-3.5 text-slate-500" />
                            ) : (
                              <span className="text-[10px] text-slate-400">Ready</span>
                            )}
                            {isHost && (
                              <button
                                onClick={() => demoteSpeaker(sp.identity)}
                                title="Move back to audience"
                                className="text-[10px] text-red-400 hover:text-red-300 pl-1"
                              >
                                [Demote]
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* If user is local speaker and not yet in speakers array */}
                      {isOnStage && !isHost && !speakers.some(s => s.identity === localParticipant?.identity) && (
                        <div className="flex items-center justify-between text-xs py-1 px-2 rounded bg-sky-500/20 border border-sky-500/40">
                          <span className="flex items-center gap-2 text-white font-medium">
                            <span>🎙️</span>
                            <span>{user?.full_name || 'You'} (You)</span>
                          </span>
                          <div className="flex items-center gap-1">
                            {isMicOn ? (
                              <div className="flex items-center gap-0.5 h-3">
                                <span className="w-1 bg-sky-400 vu-bar" />
                                <span className="w-1 bg-sky-400 vu-bar" />
                                <span className="w-1 bg-sky-400 vu-bar" />
                              </div>
                            ) : (
                              <MicOff className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Listeners Count & Action Bar specification */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs font-mono text-slate-300">
                    <span>LISTENERS: </span>
                    <span className="text-white font-bold">{activeStudio.listener_count} people</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {!isOnStage && (
                      <button
                        onClick={requestMic}
                        className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs transition-all flex items-center gap-1.5"
                      >
                        <Hand className="w-3.5 h-3.5" />
                        <span>[Request Mic]</span>
                      </button>
                    )}

                    {isOnStage && (
                      <button
                        onClick={toggleMic}
                        className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
                          isMicOn ? 'bg-sky-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                        <span>{isMicOn ? '[Mute]' : '[Unmute]'}</span>
                      </button>
                    )}

                    <button
                      onClick={leaveStudio}
                      className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 font-bold text-xs transition-all"
                    >
                      [Leave Studio]
                    </button>
                  </div>
                </div>
              </div>

              {/* VISUAL ROOM STAGE LAYOUT: High-End Conference Presentation */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-mono tracking-widest uppercase text-slate-300 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>ON STAGE (SPEAKERS & MODERATORS)</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Lossless 48kHz / 432Hz Master Audio</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  
                  {/* Host Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/40 text-center space-y-3 relative group">
                    <div className="relative mx-auto w-16 h-16">
                      <img
                        src={hostParticipant.avatarUrl}
                        alt={hostParticipant.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                      />
                      <Crown className="w-4 h-4 text-amber-400 absolute -top-1 right-0 fill-amber-400" />
                      {hostParticipant.isSpeaking && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-bold animate-pulse">
                          SPEAKING
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white truncate">{hostParticipant.name}</h4>
                      <span className="text-[10px] text-amber-300 font-mono">👑 Host</span>
                    </div>
                  </div>

                  {/* Stage Speakers Cards */}
                  {speakers.map(sp => (
                    <div key={sp.identity} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-3 relative group hover:border-sky-500/40 transition-all">
                      <div className="relative mx-auto w-16 h-16">
                        <img
                          src={sp.avatarUrl}
                          alt={sp.name}
                          className="w-16 h-16 rounded-full object-cover border border-sky-400/50"
                        />
                        {sp.isSpeaking && !sp.isMuted && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-sky-500 text-black text-[9px] font-bold animate-pulse">
                            SPEAKING
                          </span>
                        )}
                        {sp.isMuted && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[8px] font-mono border border-white/10">
                            MUTED
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white truncate">{sp.name}</h4>
                        <span className="text-[10px] text-sky-300 font-mono truncate block">{sp.discipline || 'Speaker'}</span>
                      </div>
                      {isHost && (
                        <button
                          onClick={() => demoteSpeaker(sp.identity)}
                          className="text-[10px] text-red-400 hover:underline pt-1 block mx-auto"
                        >
                          Demote to Listener
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Local User Card if on stage */}
                  {isOnStage && !isHost && !speakers.some(s => s.identity === localParticipant?.identity) && (
                    <div className="p-4 rounded-2xl bg-sky-500/15 border-2 border-sky-400 text-center space-y-3 relative shadow-[0_0_20px_-5px_rgba(56,189,248,0.3)]">
                      <div className="relative mx-auto w-16 h-16">
                        <img
                          src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                          alt={user?.full_name || 'You'}
                          className="w-16 h-16 rounded-full object-cover border-2 border-sky-400"
                        />
                        {isMicOn ? (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-sky-400 text-black text-[9px] font-bold animate-pulse">
                            LIVE MIC
                          </span>
                        ) : (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[9px] font-mono border border-white/10">
                            MUTED
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white truncate">{user?.full_name || 'You'} (You)</h4>
                        <span className="text-[10px] text-sky-300 font-mono">Speaker</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* AUDIENCE / LISTENERS SECTION */}
              <div className="space-y-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono tracking-widest uppercase text-slate-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-400" />
                    <span>AUDIENCE LISTENERS ({activeStudio.listener_count} PEOPLE)</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">High-capacity peer synchrony</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-60 overflow-y-auto pr-2">
                  {listeners.map(lis => (
                    <div key={lis.identity} className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center gap-2.5 hover:bg-white/5 transition-all">
                      <img
                        src={lis.avatarUrl}
                        alt={lis.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/20"
                      />
                      <div className="overflow-hidden">
                        <span className="text-xs font-medium text-white truncate block">{lis.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono truncate block">{lis.discipline || 'Creator'}</span>
                        {isHost && (
                          <button
                            onClick={() => promoteSpeaker(lis.identity)}
                            title="Promote to Stage Speaker"
                            className="text-[9px] text-sky-400 hover:text-sky-300 font-mono flex items-center gap-0.5 pt-0.5"
                          >
                            <UserPlus className="w-2.5 h-2.5" />
                            <span>Stage</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: LIVE ROOM CHAT & DISCUSSION */}
          {activeTab === 'chat' && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">Studio Chat & Acoustic Notes</h3>
                  <p className="text-xs text-slate-400">Real-time collaboration across all 247 room participants.</p>
                </div>
                <span className="px-3 py-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono">
                  Lossless Sync
                </span>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 font-sans">
                {messages.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs font-mono">No messages yet. Be the first to start the discussion!</div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={msg.sender?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                            alt={msg.sender?.full_name || 'Creator'}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-white">{msg.sender?.full_name || 'Elena Vance'}</span>
                          {msg.message_type === 'tip' && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono border border-amber-500/40">
                              ⚡ $NKI TIP
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pl-8">
                        {msg.content}
                      </p>
                      {msg.asset_title && (
                        <div className="ml-8 mt-2 p-2.5 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-between text-xs text-sky-300 font-mono">
                          <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-sky-400" />
                            <span>{msg.asset_title}</span>
                          </span>
                          <a href={msg.asset_url || '#'} target="_blank" rel="noreferrer" className="underline font-bold hover:text-white">
                            Inspect
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-3 pt-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Share feedback, timestamp notes, or harmonic insights..."
                  className="flex-1 px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-sm text-white focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs font-mono transition-all flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>SEND</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: SHARED ROOM ASSETS (PDF / STEMS / SCRIPTS) */}
          {activeTab === 'assets' && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">Room Shared Assets & PDFs</h3>
                  <p className="text-xs text-slate-400">Real-time reference files for all room speakers and listeners.</p>
                </div>
              </div>

              {/* Active Studio Asset */}
              {activeStudio.active_asset_title ? (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-sky-400" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-sky-400 block">ACTIVE STAGE DOCUMENT</span>
                      <h4 className="text-base font-bold text-white">{activeStudio.active_asset_title}</h4>
                      <span className="text-xs text-slate-400">Available for synchronized room viewing</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Previewing ${activeStudio.active_asset_title} in high-fidelity sandbox view.`)}
                    className="px-5 py-2.5 rounded-xl bg-sky-500 text-black font-bold text-xs font-mono hover:bg-sky-400 transition-all shadow-sm"
                  >
                    OPEN VIEWER
                  </button>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs font-mono border border-dashed border-white/15 rounded-2xl">
                  No stage document spotlighted. Share a script excerpt or stem sheet below.
                </div>
              )}

              {/* Share Asset Form */}
              <form onSubmit={handleShareAsset} className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-xs font-mono text-slate-300 uppercase tracking-wider">Share New Asset to Conference Room</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Document Title (e.g., Script_Excerpts_v2.pdf)"
                    value={sharedAssetTitle}
                    onChange={(e) => setSharedAssetTitle(e.target.value)}
                    required
                    className="px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-xs text-white focus:outline-none font-mono"
                  />
                  <input
                    type="text"
                    placeholder="File URL or Link (optional)"
                    value={sharedAssetUrl}
                    onChange={(e) => setSharedAssetUrl(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs font-mono transition-all flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>BROADCAST ASSET TO ROOM</span>
                </button>
              </form>
            </div>
          )}

        </div>

        {/* COL 4: SIDEBAR COMMAND CONSOLE & $NKI TIPPING */}
        <div className="space-y-6">
          
          {/* Room Controls Box */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
            <h3 className="text-xs font-mono tracking-widest text-slate-300 uppercase border-b border-white/10 pb-3">
              YOUR ROOM CONTROLS
            </h3>

            <div className="space-y-3">
              {isOnStage ? (
                <button
                  onClick={toggleMic}
                  className={`w-full py-3 rounded-xl font-bold text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm ${
                    isMicOn ? 'bg-emerald-400 text-black' : 'bg-red-500/20 border border-red-500/40 text-red-300'
                  }`}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  <span>{isMicOn ? 'MICROPHONE: LIVE' : 'MICROPHONE: MUTED'}</span>
                </button>
              ) : (
                <button
                  onClick={requestMic}
                  className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Hand className="w-4 h-4" />
                  <span>REQUEST SPEAKING MIC</span>
                </button>
              )}

              <button
                onClick={() => setShowTipModal(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-bold text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>TIP HOST WITH $NKI</span>
              </button>

              <button
                onClick={leaveStudio}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>EXIT CONFERENCE</span>
              </button>
            </div>
          </div>

          {/* Acoustic Telemetry Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 font-mono text-xs">
            <h4 className="text-slate-300 uppercase font-semibold text-[11px] tracking-widest">
              AUDIO PIPELINE TELEMETRY
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex justify-between">
                <span>Sample Rate:</span>
                <span className="text-white">48,000 Hz</span>
              </div>
              <div className="flex justify-between">
                <span>Bit Depth:</span>
                <span className="text-white">24-bit PCM</span>
              </div>
              <div className="flex justify-between">
                <span>Harmonic Center:</span>
                <span className="text-sky-400">432.0 Hz Master</span>
              </div>
              <div className="flex justify-between">
                <span>Latency:</span>
                <span className="text-emerald-400">&lt; 18ms WebRTC</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* TIP HOST MODAL */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-md w-full border border-amber-500/40 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white font-serif">Send $NKI Tip to Host</h3>
              </div>
              <button onClick={() => setShowTipModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Reward <strong className="text-white">{activeStudio.host?.full_name || 'Elena Vance'}</strong> for hosting this live acoustic room. 100% of tipped $NKI transfers instantaneously via the sovereign ledger.
            </p>

            <div className="space-y-3">
              <label className="text-xs font-mono text-slate-400 block">Select Tip Amount ($NKI):</label>
              <div className="grid grid-cols-4 gap-2">
                {['25', '50', '100', '250'].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTipAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      tipAmount === amt ? 'bg-amber-500 text-black border-amber-400' : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30'
                    }`}
                  >
                    {amt} NKI
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                placeholder="Custom amount..."
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-amber-400 text-xs text-white font-mono focus:outline-none mt-2"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowTipModal(false)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs"
              >
                CANCEL
              </button>
              <button
                onClick={handleSendTip}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs shadow-sm"
              >
                CONFIRM TIP
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
