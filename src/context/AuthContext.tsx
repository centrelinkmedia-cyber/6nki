import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, CreatorCategory } from '../types';
import { localDb } from '../lib/supabase';
import { soundEngine } from '../lib/sound-engine';

interface AuthContextType {
  user: UserProfile | null;
  allProfiles: UserProfile[];
  loginAs: (profileId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addPortfolioItem: (item: { title: string; type: 'audio' | 'video' | 'script' | 'design' | 'article'; url: string; description: string; discipline: CreatorCategory }) => void;
  isCustomizing: boolean;
  setIsCustomizing: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>([]);
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);

  const reloadProfiles = () => {
    const list = localDb.getProfiles();
    setAllProfiles(list);
    const current = localDb.getCurrentProfile();
    setUser(current);
  };

  useEffect(() => {
    reloadProfiles();

    const handleSync = () => {
      reloadProfiles();
    };

    window.addEventListener('enki_sync_event', handleSync);
    return () => window.removeEventListener('enki_sync_event', handleSync);
  }, []);

  const loginAs = (profileId: string) => {
    const profiles = localDb.getProfiles();
    const target = profiles.find(p => p.id === profileId);
    if (target) {
      // Set current user as target
      const updatedList = profiles.map(p => {
        if (p.id === profileId) return { ...p, id: 'user-current' };
        if (p.id === 'user-current') return { ...p, id: `user-prev-${Date.now()}` };
        return p;
      });
      localStorage.setItem('enki_profiles', JSON.stringify(updatedList));
      soundEngine.playHarmonicChime(528, 0.8);
      reloadProfiles();
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updated = localDb.updateCurrentProfile(updates);
    setUser(updated);
    setAllProfiles(localDb.getProfiles());
    soundEngine.playHarmonicChime(432, 0.6);
  };

  const addPortfolioItem = (item: { title: string; type: 'audio' | 'video' | 'script' | 'design' | 'article'; url: string; description: string; discipline: CreatorCategory }) => {
    if (!user) return;
    const newItem = {
      ...item,
      id: `port-${Date.now()}`,
      resonanceScore: 432,
      created_at: new Date().toISOString()
    };
    const updatedItems = [newItem, ...(user.portfolio_items || [])];
    updateProfile({ portfolio_items: updatedItems });

    // Grant NKI bounty reward for portfolio contribution
    localDb.addTransaction({
      sender_id: 'system',
      receiver_id: 'user-current',
      amount: 75.00,
      transaction_type: 'bounty',
      memo: `ENKI Portfolio Contribution Verification: ${item.title}`
    });
  };

  return (
    <AuthContext.Provider value={{ user, allProfiles, loginAs, updateProfile, addPortfolioItem, isCustomizing, setIsCustomizing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
