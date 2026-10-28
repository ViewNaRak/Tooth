// Procedural Sound Effects Engine using Web Audio API (No external assets required)

class SoundFXEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private muted: boolean = false;
  private lastScrubTime: number = 0;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.8, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.8, this.ctx.currentTime);
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  /**
   * Cute bubble pop sound (when plaque or debris is cleared)
   */
  public playPopSound(pitchMultiplier: number = 1.0): void {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startTime = ctx.currentTime;
    const duration = 0.085;

    // Pitch sweep: starting high and snapping down produces a realistic "Pop!"
    const baseFreq = 720 * pitchMultiplier;
    osc.frequency.setValueAtTime(baseFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(160 * pitchMultiplier, startTime + duration);

    // Envelope
    gain.gain.setValueAtTime(0.35, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  /**
   * Soft brushing scrub / friction sound (throttled to avoid saturation)
   */
  public playScrubSound(): void {
    if (this.muted) return;
    const now = performance.now();
    if (now - this.lastScrubTime < 80) return; // limit to once per 80ms
    this.lastScrubTime = now;

    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const startTime = ctx.currentTime;
    const duration = 0.06;

    // Soft frequency modulation for organic friction feel
    osc.frequency.setValueAtTime(280 + Math.random() * 80, startTime);
    osc.frequency.linearRampToValueAtTime(180, startTime + duration);

    // Bandpass filter to soften high squeaks into a warm brush sound
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, startTime);
    filter.Q.setValueAtTime(2.5, startTime);

    // Soft volume envelope
    gain.gain.setValueAtTime(0.01, startTime);
    gain.gain.linearRampToValueAtTime(0.12, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  /**
   * Gentle magical sparkle / chime chord (when cleaning is completed or goal met)
   */
  public playSparkleChime(): void {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    // Harmonic pentatonic frequencies (G5, B5, D6, G6)
    const notes = [783.99, 987.77, 1174.66, 1567.98];
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const noteStart = startTime + idx * 0.045;
      const duration = 0.55;

      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(0.15, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(noteStart);
      osc.stop(noteStart + duration);
    });
  }
}

export const soundEffects = new SoundFXEngine();
