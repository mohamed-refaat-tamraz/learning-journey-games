import { getSoundEnabled, setSoundEnabled } from '../../../shared/soundPreference';
// Audio utility using Web Audio API and Web Speech API
class SoundManager {
  private audioCtx: AudioContext | null = null;
  private get isMuted(): boolean { return !getSoundEnabled(); }

  public stop() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const context = this.audioCtx;
    this.audioCtx = null;
    if (context && context.state !== 'closed') void context.close().catch(() => {});
  }

  public dispose() { this.stop(); }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public toggleMute(): boolean {
    setSoundEnabled(this.isMuted);
    if (this.isMuted) this.stop();
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    setSoundEnabled(!muted);
    if (muted) this.stop();
  }

  // Play gentle positive ding/chime
  public playSuccess() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Major arpeggio)
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        
        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Play victory celebration fanfare
  public playVictory() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const melody = [
        { f: 523.25, d: 0.12, t: 0 },
        { f: 659.25, d: 0.12, t: 0.12 },
        { f: 783.99, d: 0.12, t: 0.24 },
        { f: 1046.5, d: 0.35, t: 0.36 },
        { f: 880.0, d: 0.15, t: 0.72 },
        { f: 1046.5, d: 0.5, t: 0.88 },
      ];

      melody.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now + note.t);
        
        gain.gain.setValueAtTime(0.25, now + note.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + note.t);
        osc.stop(now + note.t + note.d + 0.05);
      });
    } catch (e) {
      console.warn('Victory audio error:', e);
    }
  }

  // Soft click / flip sound
  public playCardFlip() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // ignore
    }
  }

  // Soft error tone
  public playWrong() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // ignore
    }
  }

  // Speak Arabic word or text
  public speakArabic(text: string) {
    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // stop previous
      // Strip some decorative Quran characters if needed for clean speech
      const cleaned = text.replace(/[ۖ-۩]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85; // Slightly slower for clear beginner pronunciation
      utterance.pitch = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }
}

export const soundManager = new SoundManager();

