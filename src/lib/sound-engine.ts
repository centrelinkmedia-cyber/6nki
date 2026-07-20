// Web Audio API Sound Generator for ENKI Platform
// Tuned to 432Hz Harmonic Standard & Corporate Tactile Feedback

class EnkiSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(muted?: boolean): boolean {
    if (muted !== undefined) {
      this.isMuted = muted;
    } else {
      this.isMuted = !this.isMuted;
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Plays a 432Hz harmonic chime (used for NKI earnings, studio connection, or sacred geometry activation)
   */
  public playHarmonicChime(freq: number = 432, duration: number = 1.2): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Primary oscillator (Sine wave)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Fifth harmonic (Golden ratio feel)
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 1.5, now);

      // Gain node with soft envelope
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch (e) {
      console.warn('Audio playback restricted or failed:', e);
    }
  }

  /**
   * Studio mic toggle click / subtle tactile blip
   */
  public playMicClick(isOn: boolean = true): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isOn ? 680 : 340, now);
      osc.frequency.exponentialRampToValueAtTime(isOn ? 880 : 220, now + 0.05);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      // Ignore
    }
  }

  /**
   * NKI Currency Transaction resonant shimmer
   */
  public playNkiTransaction(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const chords = [432, 540, 648]; // Harmonic triad
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.9);
      });
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Deep harmonic meditation chord for Codex / Esoteric visualization
   */
  public playCodexResonance(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const base = 108; // 1/4 of 432Hz
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(base, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(600, now + 1.5);
      filter.frequency.exponentialRampToValueAtTime(150, now + 3.0);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 3.0);
    } catch (e) {
      // Ignore
    }
  }
}

export const soundEngine = new EnkiSoundEngine();
