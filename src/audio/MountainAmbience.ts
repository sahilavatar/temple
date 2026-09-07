/**
 * Mountain Ambience Audio Engine
 * Procedural synthesis of light Himalayan mountain wind and singing alpine birds.
 * Zero external asset dependencies, zero network latency, pristine looping audio.
 */

class MountainAmbienceEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;

  private isRunning: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.55; // default comfortable subtle level
  private birdTimer: ReturnType<typeof setTimeout> | null = null;
  private windGustTimer: ReturnType<typeof setInterval> | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;

  private listenersAttached: boolean = false;

  constructor() {
    this.attachAutoStartListeners();
  }

  /**
   * Automatically prepares/starts audio on user's first physical interaction
   * to satisfy modern browser autoplay policies.
   */
  private attachAutoStartListeners() {
    if (typeof window === 'undefined' || this.listenersAttached) return;
    this.listenersAttached = true;

    const handleFirstGesture = () => {
      if (!this.isRunning && !this.isMuted) {
        this.start();
      } else if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
  }

  private initAudioContext(): boolean {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (!this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Create gentle mountain echo/delay for bird calls
      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.26, this.ctx.currentTime);

      this.delayGain = this.ctx.createGain();
      this.delayGain.gain.setValueAtTime(0.22, this.ctx.currentTime);

      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(2800, this.ctx.currentTime);

      this.delayNode.connect(delayFilter);
      delayFilter.connect(this.delayGain);
      this.delayGain.connect(this.delayNode); // feedback loop
      this.delayGain.connect(this.masterGain);
    }

    return true;
  }

  /**
   * Start the ambient mountain soundscape
   */
  public start() {
    if (this.isRunning) return;
    if (!this.initAudioContext() || !this.ctx || !this.masterGain) return;

    this.isRunning = true;

    // Smoothly fade in master gain
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0.001, now);
    this.masterGain.gain.exponentialRampToValueAtTime(this.isMuted ? 0.0001 : Math.max(0.001, this.volume), now + 1.8);

    this.startWind();
    this.scheduleNextBirdCall();
  }

  /**
   * Stop ambient mountain soundscape
   */
  public stop() {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.birdTimer) {
      clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }

    if (this.windGustTimer) {
      clearInterval(this.windGustTimer);
      this.windGustTimer = null;
    }

    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      setTimeout(() => {
        if (this.noiseSource) {
          try {
            this.noiseSource.stop();
            this.noiseSource.disconnect();
          } catch (_) {}
          this.noiseSource = null;
        }
      }, 900);
    }
  }

  /**
   * Toggle mute/unmute
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      if (this.isMuted) {
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      } else {
        if (!this.isRunning) {
          this.start();
        } else {
          this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, this.volume), now + 0.4);
        }
      }
    } else if (!this.isMuted && !this.isRunning) {
      this.start();
    }
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (!this.isMuted && this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, this.volume), now + 0.1);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getVolume(): number {
    return this.volume;
  }

  // =========================================================
  // 1. PROCEDURAL MOUNTAIN WIND GENERATOR
  // =========================================================
  private startWind() {
    if (!this.ctx || !this.masterGain) return;

    const sampleRate = this.ctx.sampleRate;
    const bufferDuration = 5.0; // 5-second seamless noise buffer
    const bufferSize = Math.floor(sampleRate * bufferDuration);
    const noiseBuffer = this.ctx.createBuffer(2, bufferSize, sampleRate);
    const left = noiseBuffer.getChannelData(0);
    const right = noiseBuffer.getChannelData(1);

    // Filtered pink noise algorithm for warm natural air texture
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;
      left[i] = pink * 0.04;
      right[i] = (pink + (Math.random() * 2 - 1) * 0.03) * 0.04;
    }

    // Smooth boundary overlap to eliminate any loop clicking
    const fadeLen = 2048;
    for (let i = 0; i < fadeLen; i++) {
      const ratio = i / fadeLen;
      left[i] = left[i] * ratio + left[bufferSize - fadeLen + i] * (1 - ratio);
      right[i] = right[i] * ratio + right[bufferSize - fadeLen + i] * (1 - ratio);
    }

    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    // Dual filtering: warm valley rumble + high-altitude whistling breeze
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(420, this.ctx.currentTime);
    lowpass.Q.setValueAtTime(1.0, this.ctx.currentTime);

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(820, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(1.8, this.ctx.currentTime);
    this.windFilter = bandpass;

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.24, this.ctx.currentTime);

    // Parallel connect lowpass and bandpass
    this.noiseSource.connect(lowpass);
    this.noiseSource.connect(bandpass);

    lowpass.connect(this.windGain);
    bandpass.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    this.noiseSource.start();

    // Subtle gentle gusts every 7 to 12 seconds
    this.windGustTimer = setInterval(() => {
      if (!this.ctx || !this.windGain || !this.windFilter) return;
      const now = this.ctx.currentTime;
      // Gentle wind variation
      const targetGain = 0.16 + Math.random() * 0.14;
      const targetFreq = 650 + Math.random() * 450;
      const duration = 4.0 + Math.random() * 3.5;

      this.windGain.gain.cancelScheduledValues(now);
      this.windGain.gain.linearRampToValueAtTime(targetGain, now + duration * 0.45);
      this.windGain.gain.linearRampToValueAtTime(0.18, now + duration);

      this.windFilter.frequency.cancelScheduledValues(now);
      this.windFilter.frequency.linearRampToValueAtTime(targetFreq, now + duration * 0.4);
      this.windFilter.frequency.linearRampToValueAtTime(800, now + duration);
    }, 8500);
  }

  // =========================================================
  // 2. PROCEDURAL HIMALAYAN MOUNTAIN BIRDS
  // Realistic high-altitude songbirds: pipits, warblers, and thrushes
  // =========================================================
  private scheduleNextBirdCall() {
    if (!this.isRunning) return;

    // Schedule next song between 4.0 and 8.5 seconds
    const delayMs = 4000 + Math.random() * 4500;
    this.birdTimer = setTimeout(() => {
      this.playRandomBirdCall();
      this.scheduleNextBirdCall();
    }, delayMs);
  }

  private playRandomBirdCall() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    // Pick one of 4 realistic mountain bird motifs
    const motifIndex = Math.floor(Math.random() * 4);
    const panValue = (Math.random() - 0.5) * 1.6; // random position in stereo landscape

    switch (motifIndex) {
      case 0:
        this.playPipitChirp(panValue);
        break;
      case 1:
        this.playThrushWarble(panValue);
        break;
      case 2:
        this.playMountainCall(panValue);
        break;
      case 3:
      default:
        this.playAccentorTrill(panValue);
        break;
    }
  }

  /**
   * Motif 1: High Alpine Pipit - two crisp, sweet ascending chirps
   */
  private playPipitChirp(pan: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime + 0.05;

    // Note 1: 2800 -> 3600 Hz
    this.synthesizeChirp(now, 2800, 3650, 0.075, 0.16, pan);
    // Note 2: 3200 -> 4200 Hz
    this.synthesizeChirp(now + 0.12, 3200, 4250, 0.085, 0.18, pan);
  }

  /**
   * Motif 2: Himalayan Blue Whistling Thrush - musical cascading phrase
   */
  private playThrushWarble(pan: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime + 0.05;

    const notes = [
      { startFreq: 3700, endFreq: 3200, duration: 0.09, delay: 0.0 },
      { startFreq: 3300, endFreq: 3900, duration: 0.08, delay: 0.11 },
      { startFreq: 4000, endFreq: 3100, duration: 0.11, delay: 0.22 },
      { startFreq: 3400, endFreq: 2900, duration: 0.14, delay: 0.36 },
    ];

    notes.forEach((n) => {
      this.synthesizeChirp(now + n.delay, n.startFreq, n.endFreq, n.duration, 0.15, pan);
    });
  }

  /**
   * Motif 3: Distant Mountain Call - serene slow descending whistle
   */
  private playMountainCall(pan: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime + 0.05;

    // Soft, distant high melody (like a Himalayan cuckoo / dove)
    this.synthesizeChirp(now, 2200, 2050, 0.24, 0.12, pan, true);
    this.synthesizeChirp(now + 0.32, 1850, 1600, 0.32, 0.11, pan, true);
  }

  /**
   * Motif 4: Alpine Accentor - cheerful micro-trill
   */
  private playAccentorTrill(pan: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime + 0.05;

    const pitches = [3400, 3850, 3500, 4100];
    pitches.forEach((freq, idx) => {
      this.synthesizeChirp(now + idx * 0.07, freq, freq + 150, 0.055, 0.14, pan);
    });
  }

  /**
   * Core bird chirp oscillator synthesis with exponential frequency sweep,
   * smooth attack/decay envelope, stereo positioning, and subtle mountain reverb.
   */
  private synthesizeChirp(
    startTime: number,
    startFreq: number,
    endFreq: number,
    duration: number,
    peakGain: number,
    pan: number,
    hasVibrato: boolean = false
  ) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';

    // Pitch envelope
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

    // Optional subtle natural vibrato
    if (hasVibrato) {
      const vibOsc = this.ctx.createOscillator();
      const vibGain = this.ctx.createGain();
      vibOsc.frequency.setValueAtTime(8, startTime); // 8 Hz flutter
      vibGain.gain.setValueAtTime(45, startTime);
      vibOsc.connect(osc.frequency);
      vibOsc.start(startTime);
      vibOsc.stop(startTime + duration);
    }

    // Amplitude envelope (sweet attack, smooth decay, zero click)
    const gain = this.ctx.createGain();
    const attack = 0.015;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    // Stereo panning
    let pannerNode: StereoPannerNode | null = null;
    if (this.ctx.createStereoPanner) {
      pannerNode = this.ctx.createStereoPanner();
      pannerNode.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), startTime);
    }

    // Connect audio graph
    osc.connect(gain);

    if (pannerNode) {
      gain.connect(pannerNode);
      pannerNode.connect(this.masterGain);
      if (this.delayNode) {
        pannerNode.connect(this.delayNode); // route into mountain echo
      }
    } else {
      gain.connect(this.masterGain);
      if (this.delayNode) {
        gain.connect(this.delayNode);
      }
    }

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);

    // Clean up
    setTimeout(() => {
      try {
        osc.disconnect();
        gain.disconnect();
        pannerNode?.disconnect();
      } catch (_) {}
    }, (duration + 0.5) * 1000);
  }
}

export const mountainAmbience = new MountainAmbienceEngine();
