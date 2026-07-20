import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Studio, StudioMessage } from '../types';
import { livekitEngine, type LiveKitParticipant } from '../lib/livekit';
import { localDb } from '../lib/supabase';
import { soundEngine } from '../lib/sound-engine';
import { useAuth } from './AuthContext';

interface StudioContextType {
  activeStudio: Studio | null;
  allStudios: Studio[];
  participants: LiveKitParticipant[];
  messages: StudioMessage[];
  isMicOn: boolean;
  activeTab: 'stage' | 'chat' | 'assets' | 'settings';
  setActiveTab: (tab: 'stage' | 'chat' | 'assets' | 'settings') => void;
  joinStudio: (studio: Studio, role?: 'host' | 'speaker' | 'listener') => Promise<void>;
  leaveStudio: () => void;
  toggleMic: () => void;
  requestMic: () => void;
  promoteSpeaker: (identity: string) => void;
  demoteSpeaker: (identity: string) => void;
  muteUser: (identity: string) => void;
  sendMessage: (content: string, type?: 'text' | 'asset' | 'system' | 'tip', assetTitle?: string, assetUrl?: string) => void;
  createAndJoinStudio: (title: string, discipline: string, audioPreset: string, roomMode: any) => Promise<void>;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activeStudio, setActiveStudio] = useState<Studio | null>(null);
  const [allStudios, setAllStudios] = useState<Studio[]>([]);
  const [participants, setParticipants] = useState<LiveKitParticipant[]>([]);
  const [messages, setMessages] = useState<StudioMessage[]>([]);
  const [isMicOn, setIsMicOn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'stage' | 'chat' | 'assets' | 'settings'>('stage');

  const refreshStudios = () => {
    setAllStudios(localDb.getStudios());
  };

  useEffect(() => {
    refreshStudios();

    const handleSync = () => {
      refreshStudios();
      if (activeStudio) {
        setMessages(localDb.getMessages(activeStudio.id));
      }
    };

    window.addEventListener('enki_sync_event', handleSync);
    return () => window.removeEventListener('enki_sync_event', handleSync);
  }, [activeStudio]);

  useEffect(() => {
    const unsubParticipants = livekitEngine.onParticipantsChange((list) => {
      setParticipants([...list]);
    });
    return () => {
      unsubParticipants();
    };
  }, []);

  const joinStudio = async (studio: Studio, role: 'host' | 'speaker' | 'listener' = 'listener') => {
    if (!user) return;
    
    if (activeStudio) {
      livekitEngine.disconnect();
    }

    const actualRole = studio.host_id === user.id || studio.host?.username === user.username ? 'host' : role;

    await livekitEngine.connect({
      roomName: studio.livekit_room_name || `room_${studio.id}`,
      userName: user.full_name,
      userRole: actualRole
    });

    setActiveStudio(studio);
    setMessages(localDb.getMessages(studio.id));
    setIsMicOn(false);
    setActiveTab('stage');

    localDb.updateStudio(studio.id, { listener_count: studio.listener_count + 1 });
    refreshStudios();
  };

  const leaveStudio = () => {
    if (activeStudio) {
      localDb.updateStudio(activeStudio.id, { listener_count: Math.max(1, activeStudio.listener_count - 1) });
    }
    livekitEngine.disconnect();
    setActiveStudio(null);
    setIsMicOn(false);
    refreshStudios();
    soundEngine.playMicClick(false);
  };

  const toggleMic = () => {
    const newState = livekitEngine.toggleMicrophone();
    setIsMicOn(newState);
  };

  const requestMic = () => {
    livekitEngine.requestSpeakingPermission();
    sendMessage('🎙️ Requested speaking permission on Stage from the Host.', 'system');
  };

  const promoteSpeaker = (identity: string) => {
    livekitEngine.promoteToSpeaker(identity);
    sendMessage(`Promoted ${identity} to On Stage Speaker.`, 'system');
  };

  const demoteSpeaker = (identity: string) => {
    livekitEngine.demoteToListener(identity);
  };

  const muteUser = (identity: string) => {
    livekitEngine.muteParticipant(identity);
  };

  const sendMessage = (content: string, type: 'text' | 'asset' | 'system' | 'tip' = 'text', assetTitle?: string, assetUrl?: string) => {
    if (!activeStudio || !user) return;
    const newMsg = localDb.addMessage(activeStudio.id, {
      studio_id: activeStudio.id,
      sender_id: user.id,
      content,
      message_type: type,
      asset_title: assetTitle,
      asset_url: assetUrl,
      sender: user
    });
    setMessages(prev => [...prev, newMsg]);
  };

  const createAndJoinStudio = async (title: string, discipline: string, audioPreset: string, roomMode: any) => {
    if (!user) return;
    const created = localDb.createStudio({
      title,
      description: `Live ${discipline} room hosted by ${user.full_name}. Calibrated to ${audioPreset}.`,
      host_id: user.id,
      discipline,
      audio_preset: audioPreset,
      room_mode: roomMode,
      recording_enabled: true,
      livekit_room_name: `enki_${Date.now()}`,
      host: user
    });

    localDb.addTransaction({
      sender_id: 'system',
      receiver_id: 'user-current',
      amount: 100.00,
      transaction_type: 'bounty',
      memo: `ENKI Live Studio Host Verification: ${title}`
    });

    await joinStudio(created, 'host');
  };

  return (
    <StudioContext.Provider value={{
      activeStudio,
      allStudios,
      participants,
      messages,
      isMicOn,
      activeTab,
      setActiveTab,
      joinStudio,
      leaveStudio,
      toggleMic,
      requestMic,
      promoteSpeaker,
      demoteSpeaker,
      muteUser,
      sendMessage,
      createAndJoinStudio
    }}>
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) throw new Error('useStudio must be used within a StudioProvider');
  return context;
};
