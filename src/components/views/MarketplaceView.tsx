import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Plus, 
  ShieldCheck, 
  Clock, 
  Briefcase, 
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEconomy } from '../../context/EconomyContext';
import { localDb } from '../../lib/supabase';
import type { MarketplaceListing } from '../../types';
import { soundEngine } from '../../lib/sound-engine';

export const MarketplaceView: React.FC = () => {
  const { user } = useAuth();
  const { purchaseService, balance } = useEconomy();
  const [listings, setListings] = useState<MarketplaceListing[]>(localDb.getMarketplace());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Voice Acting');
  const [newPrice, setNewPrice] = useState('350');
  const [newDelivery, setNewDelivery] = useState('3');

  const categories = ['All', 'Voice Acting', 'Design & Tech', 'Writing & Transmedia', 'Music & Spatial Audio', 'Business Consulting'];

  const handlePurchase = (listing: MarketplaceListing) => {
    if (!user) return;
    if (listing.creator_id === user.id) {
      alert("You cannot purchase your own sovereign service listing!");
      return;
    }
    if (balance < listing.price_nki) {
      alert(`Insufficient $NKI balance. You have ${balance.toFixed(1)} NKI, but this listing requires ${listing.price_nki} NKI.`);
      return;
    }

    const confirmBuy = window.confirm(`Initiate sovereign escrow for "${listing.title}" for ${listing.price_nki} $NKI?`);
    if (confirmBuy) {
      const success = purchaseService(
        listing.creator_id,
        listing.creator?.full_name || 'Creator',
        listing.price_nki,
        listing.title
      );
      if (success) {
        soundEngine.playHarmonicChime(432, 0.8);
        alert(`Successfully initiated escrow! 100% of ${listing.price_nki} $NKI has been allocated for ${listing.creator?.full_name || 'the creator'}.`);
      }
    }
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle.trim() || !newDesc.trim()) return;

    const price = parseFloat(newPrice) || 200;
    const days = parseInt(newDelivery) || 3;

    localDb.addMarketplaceListing({
      creator_id: user.id,
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      price_nki: price,
      delivery_days: days,
      tags: [newCategory, 'ENKI Verified', 'Lossless Delivery'],
      creator: user
    });

    setListings(localDb.getMarketplace());
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
    soundEngine.playHarmonicChime(528, 0.7);
    alert('Sovereign service listing successfully deployed to The Nexus!');
  };

  const filteredListings = listings.filter(l => {
    const matchesQuery = l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         l.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || l.category.includes(selectedCategory) || (selectedCategory === 'Music & Spatial Audio' && l.category.includes('Music'));
    return matchesQuery && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-xs font-mono text-sky-400">
            <Globe className="w-3.5 h-3.5" />
            <span>THE NEXUS MARKETPLACE & COLLABORATION EXCHANGE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white">
            Sovereign Service Exchange
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-light max-w-2xl">
            Hire verified masters across voice acting, transmedia lore, 432Hz spatial stems, and executive strategy. Transacted entirely in sovereign $NKI currency without intermediary fees.
          </p>
        </div>

        <button
          onClick={() => {
            setShowCreateModal(true);
            soundEngine.playHarmonicChime(528, 0.4);
          }}
          className="px-6 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-black font-bold text-xs tracking-wider shadow-[0_0_25px_-5px_rgba(56,189,248,0.4)] transition-all flex items-center gap-2.5 self-start md:self-auto"
        >
          <Plus className="w-5 h-5 text-black" />
          <span>LIST YOUR SERVICE ($NKI BOUNTY)</span>
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-black font-bold shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service blueprints or stems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/15 focus:border-sky-400 text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* LISTINGS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map(listing => (
          <div
            key={listing.id}
            className="glass-panel p-6 sm:p-7 rounded-3xl glass-panel-hover flex flex-col justify-between border border-white/10 space-y-6 relative overflow-hidden group"
          >
            <div className="space-y-4 relative z-10">
              
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold">
                  {listing.category}
                </span>
                <span className="text-xl font-bold text-sky-400 flex items-center gap-1">
                  <span>{listing.price_nki}</span>
                  <span className="text-xs text-slate-400">$NKI</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                {listing.title}
              </h3>

              <p className="text-xs text-slate-300 font-light line-clamp-3 leading-relaxed">
                {listing.description}
              </p>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>{listing.delivery_days} Days Delivery</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Master</span>
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {listing.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
                    #{t}
                  </span>
                ))}
              </div>

            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <img
                  src={listing.creator?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={listing.creator?.full_name || 'Creator'}
                  className="w-8 h-8 rounded-full object-cover border border-sky-400/50"
                />
                <div className="text-xs">
                  <span className="text-slate-400 text-[10px] font-mono block">OFFERED BY</span>
                  <span className="text-white font-semibold truncate block max-w-[120px]">
                    {listing.creator?.full_name || 'Dario Rossi'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handlePurchase(listing)}
                disabled={listing.creator_id === user?.id}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs font-mono tracking-wider transition-all shadow-sm ${
                  listing.creator_id === user?.id
                    ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                    : 'bg-sky-500 hover:bg-sky-400 text-black'
                }`}
              >
                {listing.creator_id === user?.id ? 'YOUR SERVICE' : 'HIRE / ESCROW'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE LISTING MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-sky-500/40 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-5 h-5 text-sky-400" />
                <h3 className="text-lg font-bold text-white font-serif">Deploy Sovereign Service Listing</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 uppercase">Service Title</label>
                <input
                  type="text"
                  placeholder="e.g., Cinematic Sci-Fi Voice Narration (432Hz Studio)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 uppercase">Discipline Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none"
                >
                  <option value="Voice Acting">Voice Acting & Vocal Direction</option>
                  <option value="Design & Tech">Generative Design & Sacred Geometry UI</option>
                  <option value="Writing & Transmedia">Transmedia Lore & Screenwriting</option>
                  <option value="Music & Spatial Audio">Music Production & 432Hz Stems</option>
                  <option value="Business Consulting">Executive Strategy & Venture Architecture</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 uppercase">Price ($NKI Units)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                    min="10"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 uppercase">Delivery Time (Days)</label>
                  <input
                    type="number"
                    value={newDelivery}
                    onChange={(e) => setNewDelivery(e.target.value)}
                    required
                    min="1"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 uppercase">Description & Acoustic Specifications</label>
                <textarea
                  rows={4}
                  placeholder="Detail your equipment, revision policy, and how your service harmonizes with ENKI principles..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-sky-400 text-white focus:outline-none font-sans text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold shadow-sm"
                >
                  PUBLISH SERVICE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
