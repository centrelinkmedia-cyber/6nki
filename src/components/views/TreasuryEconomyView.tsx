import React, { useState } from 'react';
import { 
  Zap, 
  Send, 
  ArrowUpRight, 
  ArrowDownLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEconomy } from '../../context/EconomyContext';
import { soundEngine } from '../../lib/sound-engine';

export const TreasuryEconomyView: React.FC = () => {
  const { user, allProfiles } = useAuth();
  const { balance, transactions, sendTip, claimDailyNodeReward, canClaimDaily } = useEconomy();

  const [transferRecipient, setTransferRecipient] = useState(allProfiles.find(p => p.id !== user?.id)?.id || '');
  const [transferAmount, setTransferAmount] = useState('100');
  const [transferMemo, setTransferMemo] = useState('');

  const handleSendTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferRecipient) return;
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid transfer amount.');
      return;
    }

    const recipient = allProfiles.find(p => p.id === transferRecipient);
    if (!recipient) return;

    const success = sendTip(recipient.id, recipient.full_name, amt, transferMemo || `Sovereign peer grant from ${user?.full_name || 'Verified Creator'}`);
    if (success) {
      soundEngine.playNkiTransaction();
      alert(`Transfer complete! Sent ${amt} $NKI units to ${recipient.full_name}.`);
      setTransferAmount('100');
      setTransferMemo('');
    } else {
      alert(`Transfer failed. Ensure you have at least ${amt} $NKI in your wallet.`);
    }
  };

  const earnAvenues = [
    { title: 'Upload Creative Work to Portfolio', reward: '+75 NKI', desc: 'Share 432Hz stems, transmedia scripts, or generative design assets.' },
    { title: 'Host an ENKI Live Studio Room', reward: '+100 NKI', desc: 'Conduct a voice acting audition, writer roundtable, or acoustic masterclass.' },
    { title: 'Complete Ascension Masterclass Modules', reward: '+150 - 300 NKI', desc: 'Advance through sovereign educational pathways and earn verification rewards.' },
    { title: 'Daily Node Synchrony Check-In', reward: '+108 NKI', desc: 'Synchronize your local workspace node with the 432Hz fundamental clock.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-mono text-amber-300">
            <Zap className="w-3.5 h-3.5" />
            <span>SOVEREIGN CREATOR CURRENCY ($NKI)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white">
            The Treasury & Exchange
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-light max-w-2xl">
            Sovereign value circulation without predatory platform tax. Earn $NKI units by contributing creative work, hosting studios, and mentoring peers.
          </p>
        </div>

        {/* DAILY REWARD CLAIM CARD */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/40 flex items-center justify-between gap-6 bg-gradient-to-r from-amber-500/10 to-transparent">
          <div>
            <span className="text-[10px] font-mono text-amber-300 block">432HZ NODE CHECK-IN</span>
            <h4 className="text-base font-bold text-white font-serif">+108.00 $NKI Grant</h4>
            <span className="text-xs text-slate-400 font-light">Harmonic synchrony reward</span>
          </div>
          <button
            onClick={claimDailyNodeReward}
            disabled={!canClaimDaily}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs font-mono tracking-wider transition-all shadow-sm ${
              canClaimDaily
                ? 'bg-amber-500 hover:bg-amber-400 text-black animate-pulse'
                : 'bg-white/10 text-slate-500 cursor-not-allowed'
            }`}
          >
            {canClaimDaily ? 'CLAIM DAILY GRANT' : 'CLAIMED FOR TODAY'}
          </button>
        </div>
      </div>

      {/* WALLET OVERVIEW & QUICK TRANSFER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COL 1: Sovereign Wallet Balance Card */}
        <div className="glass-panel p-8 rounded-3xl border border-sky-500/30 flex flex-col justify-between space-y-6 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-bl-full pointer-events-none blur-2xl" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase tracking-widest">VERIFIED TREASURY WALLET</span>
              <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                ACTIVE NODE
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-6xl font-extrabold font-serif text-white tracking-tight flex items-baseline gap-2">
                <span>{balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="text-2xl font-mono text-sky-400 font-bold">$NKI</span>
              </div>
              <span className="text-xs text-slate-400 font-mono block">
                Estimated Sovereign Value: ${(balance * 1.618).toFixed(2)} USD Equivalent (Φ Ratio)
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3 relative z-10 font-mono text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Owner Identity:</span>
              <span className="text-white font-bold">{user?.full_name || 'Elena Vance'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Resonance Tier:</span>
              <span className="text-indigo-400 font-bold">{user?.ascension_tier || 'Architect'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Circulation Velocity:</span>
              <span className="text-emerald-400 font-bold">100% Peer-to-Peer</span>
            </div>
          </div>
        </div>

        {/* COL 2: Peer-to-Peer Instant Transfer */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2">
              <Send className="w-5 h-5 text-sky-400" />
              <span>Sovereign Peer-to-Peer Transfer</span>
            </h3>
            <p className="text-xs text-slate-400 font-light">
              Send $NKI directly to any verified musician, voice actor, filmmaker, writer, or designer on the network.
            </p>
          </div>

          <form onSubmit={handleSendTransfer} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 uppercase block">Recipient Creator</label>
                <select
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none"
                >
                  {allProfiles.filter(p => p.id !== user?.id).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.full_name} ({p.primary_discipline} — {p.ascension_tier})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 uppercase block">Amount ($NKI Units)</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  required
                  min="1"
                  max={balance}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none font-bold text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 uppercase block">Harmonic Memo / Note</label>
              <input
                type="text"
                value={transferMemo}
                onChange={(e) => setTransferMemo(e.target.value)}
                placeholder="e.g., Honorarium for vocal direction feedback or stem pack license..."
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-black font-bold text-xs tracking-wider transition-all shadow-sm flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>SEND SOVEREIGN TRANSFER</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* HOW TO EARN & SPEND $NKI GRID */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white font-serif">Sovereign Currency Circulation</h2>
          <p className="text-xs text-slate-400">How value flows within the ENKI Creator Operating System.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {earnAvenues.map((av, idx) => (
            <div key={idx} className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between space-y-4 hover:border-sky-500/40 transition-all">
              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30 font-mono text-xs font-bold inline-block">
                  {av.reward}
                </span>
                <h3 className="text-base font-bold text-white font-serif leading-snug">{av.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">{av.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRANSACTION LEDGER */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white font-serif">Sovereign Transaction Ledger</h3>
            <p className="text-xs text-slate-400">Immutable record of all verification rewards, tips, bounties, and escrow settlements.</p>
          </div>
          <span className="px-3 py-1 rounded bg-white/5 border border-white/10 text-slate-300 text-xs font-mono">
            {transactions.length} Records
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {transactions.map(tx => {
            const isIncoming = tx.receiver_id === user?.id || tx.receiver_id === 'user-current';
            return (
              <div key={tx.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/5 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isIncoming ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/15 border border-red-500/30 text-red-400'
                  }`}>
                    {isIncoming ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-white font-bold block">{tx.memo || `${tx.transaction_type.toUpperCase()} Settlement`}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(tx.created_at).toLocaleString()} • Type: <span className="uppercase text-sky-400">{tx.transaction_type}</span>
                    </span>
                  </div>
                </div>

                <div className={`text-base font-bold ${isIncoming ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {isIncoming ? '+' : '-'}{tx.amount.toFixed(2)} $NKI
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
