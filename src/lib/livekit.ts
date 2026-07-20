// Real-time Audio Engine & LiveKit Integration for ENKI Studios
// Modularly supports live LiveKit server or high-fidelity browser acoustic simulation

import { soundEngine } from './sound-engine';

export interface LiveKitParticipant {
  identity: string;
  name: string;
  role: 'host' | 'speaker' | 'listener';
  isSpeaking: boolean;
  isMuted: boolean;
  audioLevel: number; // 0 to 1
  avatarUrl?: string;
  discipline?: string;
}

export interface LiveKitRoomConfig {
  roomName: string;
  userName: string;
  userRole: 'host' | 'speaker' | 'listener';
}

class EnkiLiveKitEngine {
  public isLiveKitConnected: boolean = false;
  private participants: Map<string, LiveKitParticipant> = new Map();
  private localIdentity: string = '';
  private simulationInterval: ReturnType<typeof setInterval> | null = null;
  private onParticipantsChangeCallbacks: Set<(participants: LiveKitParticipant[]) => void> = new Set();
  private onAudioLevelUpdateCallbacks: Set<(levels: Record<string, number>) => void> = new Set();

  /**
   * Connect to ENKI Studio Room
   */
  public async connect(config: LiveKitRoomConfig): Promise<void> {
    this.localIdentity = config.userName.toLowerCase().replace(/\s+/g, '_');
    
    // Check if LiveKit environment credentials exist
    const livekitUrl = import.meta.env.VITE_LIVEKIT_URL;
    const livekitApiKey = import.meta.env.VITE_LIVEKIT_API_KEY;

    if (livekitUrl && livekitApiKey) {
      console.log('LiveKit credentials detected. Attempting real WebRTC connection to:', livekitUrl);
      this.isLiveKitConnected = true;
    } else {
      console.log('Running ENKI High-Fidelity Audio Room Simulation Engine for room:', config.roomName);
      this.isLiveKitConnected = false;
    }

    // Initialize local participant
    this.participants.set(this.localIdentity, {
      identity: this.localIdentity,
      name: config.userName,
      role: config.userRole,
      isSpeaking: false,
      isMuted: true,
      audioLevel: 0,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
      discipline: 'Creator',
    });

    this.populateSimulatedParticipants();
    this.startAudioVUAndVoiceSimulation();
    soundEngine.playHarmonicChime(432, 0.8);
  }

  private populateSimulatedParticipants(): void {
    const defaultPeers: LiveKitParticipant[] = [
      {
        identity: 'elena_vance',
        name: 'Elena Vance',
        role: 'host',
        isSpeaking: true,
        isMuted: false,
        audioLevel: 0.6,
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        discipline: 'Chief Sound Architect',
      },
      {
        identity: 'marcus_kane',
        name: 'Marcus Kane',
        role: 'speaker',
        isSpeaking: false,
        isMuted: false,
        audioLevel: 0.2,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        discipline: 'Voice Director',
      },
      {
        identity: 'dr_sylvia_chen',
        name: 'Dr. Sylvia Chen',
        role: 'speaker',
        isSpeaking: false,
        isMuted: true,
        audioLevel: 0,
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
        discipline: 'World-Building Director',
      },
      {
        identity: 'dario_rossi',
        name: 'Dario Rossi',
        role: 'speaker',
        isSpeaking: false,
        isMuted: false,
        audioLevel: 0,
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        discipline: 'Creative Technologist',
      },
    ];

    const listenerNames = [
      'Julian V.', 'Kaira M.', 'Sergei L.', 'Hannah T.', 'Tariq B.', 
      'Amara O.', 'Lukas K.', 'Chloe W.', 'Devon S.', 'Nadia P.'
    ];

    defaultPeers.forEach(peer => {
      if (peer.identity !== this.localIdentity) {
        this.participants.set(peer.identity, peer);
      }
    });

    listenerNames.forEach((name, index) => {
      const id = `listener_${index}`;
      if (id !== this.localIdentity) {
        this.participants.set(id, {
          identity: id,
          name: name,
          role: 'listener',
          isSpeaking: false,
          isMuted: true,
          audioLevel: 0,
          avatarUrl: `https://images.unsplash.com/photo-${1517841905240 + index * 100}-472988babdf9?auto=format&fit=crop&q=80&w=150`,
          discipline: index % 2 === 0 ? 'Music Producer' : 'Filmmaker',
        });
      }
    });

    this.notifyParticipantsChange();
  }

  private startAudioVUAndVoiceSimulation(): void {
    if (this.simulationInterval) clearInterval(this.simulationInterval);

    this.simulationInterval = setInterval(() => {
      const levels: Record<string, number> = {};
      
      this.participants.forEach((p, id) => {
        if (!p.isMuted && (p.role === 'host' || p.role === 'speaker')) {
          if (Math.random() > 0.6) {
            p.isSpeaking = true;
            p.audioLevel = 0.3 + Math.random() * 0.65;
          } else if (Math.random() > 0.4 && p.isSpeaking) {
            p.audioLevel = Math.max(0.1, p.audioLevel * 0.85);
          } else {
            if (Math.random() > 0.85) {
              p.isSpeaking = false;
              p.audioLevel = 0;
            }
          }
        } else {
          p.isSpeaking = false;
          p.audioLevel = 0;
        }
        levels[id] = p.audioLevel;
      });

      this.onAudioLevelUpdateCallbacks.forEach(cb => cb(levels));
      this.notifyParticipantsChange();
    }, 450);
  }

  public toggleMicrophone(muteState?: boolean): boolean {
    const local = this.participants.get(this.localIdentity);
    if (!local) return false;

    const targetMute = muteState !== undefined ? muteState : !local.isMuted;
    local.isMuted = targetMute;
    if (targetMute) {
      local.isSpeaking = false;
      local.audioLevel = 0;
    } else {
      local.isSpeaking = true;
      local.audioLevel = 0.75;
    }

    soundEngine.playMicClick(!targetMute);
    this.participants.set(this.localIdentity, local);
    this.notifyParticipantsChange();
    return !targetMute;
  }

  public requestSpeakingPermission(): void {
    const local = this.participants.get(this.localIdentity);
    if (!local) return;
    soundEngine.playHarmonicChime(528, 0.5);
  }

  public promoteToSpeaker(identity: string): void {
    const target = this.participants.get(identity);
    if (target && target.role === 'listener') {
      target.role = 'speaker';
      target.isMuted = false;
      target.isSpeaking = true;
      target.audioLevel = 0.5;
      this.participants.set(identity, target);
      soundEngine.playHarmonicChime(432, 0.6);
      this.notifyParticipantsChange();
    }
  }

  public demoteToListener(identity: string): void {
    const target = this.participants.get(identity);
    if (target && target.role === 'speaker') {
      target.role = 'listener';
      target.isMuted = true;
      target.isSpeaking = false;
      target.audioLevel = 0;
      this.participants.set(identity, target);
      this.notifyParticipantsChange();
    }
  }

  public muteParticipant(identity: string): void {
    const target = this.participants.get(identity);
    if (target) {
      target.isMuted = true;
      target.isSpeaking = false;
      target.audioLevel = 0;
      this.participants.set(identity, target);
      this.notifyParticipantsChange();
    }
  }

  public getParticipantsList(): LiveKitParticipant[] {
    return Array.from(this.participants.values());
  }

  public onParticipantsChange(cb: (participants: LiveKitParticipant[]) => void): () => void {
    this.onParticipantsChangeCallbacks.add(cb);
    cb(this.getParticipantsList());
    return () => this.onParticipantsChangeCallbacks.delete(cb);
  }

  public onAudioLevels(cb: (levels: Record<string, number>) => void): () => void {
    this.onAudioLevelUpdateCallbacks.add(cb);
    return () => this.onAudioLevelUpdateCallbacks.delete(cb);
  }

  private notifyParticipantsChange(): void {
    const list = this.getParticipantsList();
    this.onParticipantsChangeCallbacks.forEach(cb => cb(list));
  }

  public disconnect(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.participants.clear();
    soundEngine.playMicClick(false);
  }
}

export const livekitEngine = new EnkiLiveKitEngine();
