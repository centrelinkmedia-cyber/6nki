import React, { createContext, useContext, useState, useEffect } from 'react';
import type { NkiTransaction } from '../types';
import { localDb } from '../lib/supabase';
import { soundEngine } from '../lib/sound-engine';
import { useAuth } from './AuthContext';

interface EconomyContextType {
  balance: number;
  transactions: NkiTransaction[];
  sendTip: (recipientId: string, recipientName: string, amount: number, memo: string) => boolean;
  purchaseService: (creatorId: string, creatorName: string, amount: number, serviceTitle: string) => boolean;
  claimDailyNodeReward: () => void;
  canClaimDaily: boolean;
}

const EconomyContext = createContext<EconomyContextType | undefined>(undefined);

export const EconomyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(user?.nki_balance || 1420.50);
  const [transactions, setTransactions] = useState<NkiTransaction[]>([]);
  const [canClaimDaily, setCanClaimDaily] = useState<boolean>(true);

  const loadEconomy = () => {
    if (user) {
      setBalance(user.nki_balance);
    }
    const txs = localDb.getTransactions();
    setTransactions(txs);
  };

  useEffect(() => {
    loadEconomy();
    const handleSync = () => loadEconomy();
    window.addEventListener('enki_sync_event', handleSync);
    return () => window.removeEventListener('enki_sync_event', handleSync);
  }, [user]);

  const sendTip = (recipientId: string, recipientName: string, amount: number, memo: string): boolean => {
    if (!user || balance < amount || amount <= 0) return false;

    localDb.addTransaction({
      sender_id: user.id,
      receiver_id: recipientId,
      amount,
      transaction_type: 'tip',
      memo: memo || `Peer verification tip from ${user.full_name}`,
      sender_name: user.full_name,
      receiver_name: recipientName
    });

    soundEngine.playNkiTransaction();
    loadEconomy();
    return true;
  };

  const purchaseService = (creatorId: string, creatorName: string, amount: number, serviceTitle: string): boolean => {
    if (!user || balance < amount) return false;

    localDb.addTransaction({
      sender_id: user.id,
      receiver_id: creatorId,
      amount,
      transaction_type: 'purchase',
      memo: `Nexus Exchange License & Escrow: ${serviceTitle}`,
      sender_name: user.full_name,
      receiver_name: creatorName
    });

    soundEngine.playNkiTransaction();
    loadEconomy();
    return true;
  };

  const claimDailyNodeReward = () => {
    if (!canClaimDaily || !user) return;
    
    localDb.addTransaction({
      sender_id: 'system',
      receiver_id: user.id,
      amount: 108.00, // 108 is a sacred harmonic number
      transaction_type: 'reward',
      memo: 'ENKI Daily 432Hz Node Synchrony Grant'
    });

    setCanClaimDaily(false);
    soundEngine.playNkiTransaction();
    loadEconomy();
  };

  return (
    <EconomyContext.Provider value={{ balance, transactions, sendTip, purchaseService, claimDailyNodeReward, canClaimDaily }}>
      {children}
    </EconomyContext.Provider>
  );
};

export const useEconomy = () => {
  const context = useContext(EconomyContext);
  if (!context) throw new Error('useEconomy must be used within an EconomyProvider');
  return context;
};
