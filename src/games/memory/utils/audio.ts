import { getSoundEnabled, setSoundEnabled } from '../../../shared/soundPreference';

// Sound Synthesizer for Children's Arabic Memory Card Game

class SoundManager {
  private audioCtx: AudioContext | null = null;

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public isSoundEnabled(): boolean {
    return getSoundEnabled();
  }

  public toggleSound(): boolean {
    const next = !getSoundEnabled();
    setSoundEnabled(next);
    return next;
  }

  public stop() {
    void this.audioCtx?.close().catch(() => {});
    this.audioCtx = null;
  }

  // Play a gentle card flip sound
  public playFlip() {
    if (!getSoundEnabled()) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      const now = this.audioCtx.currentTime;
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.09);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio context error fallback
    }
  }

  // Play a happy celebratory match sound (Major Triad Chord Arpeggio)
  public playMatch() {
    if (!getSoundEnabled()) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.audioCtx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        const startTime = now + idx * 0.07;
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.28);
      });
    } catch {
      // Audio error ignore
    }
  }

  // Play a gentle subtle mismatch sound
  public playMismatch() {
    if (!getSoundEnabled()) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      const now = this.audioCtx.currentTime;
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.18);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Audio error ignore
    }
  }

  // Play star sound
  public playStar(starIndex: number = 0) {
    if (!getSoundEnabled()) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const freqs = [587.33, 739.99, 880.0];
      const freq = freqs[starIndex % freqs.length];

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      const now = this.audioCtx.currentTime;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.25);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio error ignore
    }
  }

  // Play victory fanfare
  public playVictory() {
    if (!getSoundEnabled()) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      // Happy fanfare melody: C5 -> E5 -> G5 -> C6 -> Pause -> G5 -> C6
      const melody = [
        { freq: 523.25, time: 0.0, dur: 0.12 },
        { freq: 659.25, time: 0.12, dur: 0.12 },
        { freq: 783.99, time: 0.24, dur: 0.12 },
        { freq: 1046.5, time: 0.36, dur: 0.28 },
        { freq: 783.99, time: 0.68, dur: 0.14 },
        { freq: 1046.5, time: 0.84, dur: 0.55 },
      ];

      const now = this.audioCtx.currentTime;

      melody.forEach(note => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        const startTime = now + note.time;
        osc.frequency.setValueAtTime(note.freq, startTime);

        gain.gain.setValueAtTime(0.28, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.dur);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + note.dur);
      });
    } catch {
      // Audio error ignore
    }
  }
}

export const sounds = new SoundManager();
