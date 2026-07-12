type NoteEntry = [number, number]; // [frequency (0=rest), duration in beats]

const NOTE: Record<string, number> = {
  C3: 131, D3: 147, Eb3: 156, E3: 165, F3: 175, G3: 196, Ab3: 208, A3: 220, Bb3: 233, B3: 247,
  C4: 262, D4: 294, Eb4: 311, E4: 330, F4: 349, Gb4: 370, G4: 392, Ab4: 415, A4: 440, Bb4: 466, B4: 494,
  C5: 523, D5: 587, Eb5: 622, E5: 659, F5: 698, G5: 784, Ab5: 831, A5: 880, Bb5: 932, B5: 988,
  C6: 1047,
  R: 0,
};

// Attract: bright, upbeat C major — inviting and energetic
const ATTRACT_MELODY: NoteEntry[] = [
  [NOTE.C5, 0.5], [NOTE.E5, 0.5], [NOTE.G5, 0.5], [NOTE.E5, 0.5],
  [NOTE.C5, 0.5], [NOTE.G4, 0.5], [NOTE.C5, 0.5], [NOTE.R, 0.5],
  [NOTE.D5, 0.5], [NOTE.F5, 0.5], [NOTE.A5, 0.5], [NOTE.F5, 0.5],
  [NOTE.D5, 0.5], [NOTE.A4, 0.5], [NOTE.D5, 0.5], [NOTE.R, 0.5],
  [NOTE.E5, 0.5], [NOTE.G5, 0.5], [NOTE.C6, 0.5], [NOTE.G5, 0.5],
  [NOTE.E5, 0.5], [NOTE.C5, 0.5], [NOTE.E5, 0.5], [NOTE.G5, 0.5],
  [NOTE.F5, 0.5], [NOTE.D5, 0.5], [NOTE.B4, 0.5], [NOTE.D5, 0.5],
  [NOTE.C5, 1], [NOTE.R, 1],
];

const ATTRACT_BASS: NoteEntry[] = [
  [NOTE.C3, 0.5], [NOTE.G3, 0.5], [NOTE.C3, 0.5], [NOTE.G3, 0.5],
  [NOTE.C3, 0.5], [NOTE.G3, 0.5], [NOTE.C3, 0.5], [NOTE.G3, 0.5],
  [NOTE.D3, 0.5], [NOTE.A3, 0.5], [NOTE.D3, 0.5], [NOTE.A3, 0.5],
  [NOTE.D3, 0.5], [NOTE.A3, 0.5], [NOTE.D3, 0.5], [NOTE.A3, 0.5],
  [NOTE.E3, 0.5], [NOTE.B3, 0.5], [NOTE.E3, 0.5], [NOTE.B3, 0.5],
  [NOTE.E3, 0.5], [NOTE.G3, 0.5], [NOTE.E3, 0.5], [NOTE.G3, 0.5],
  [NOTE.F3, 0.5], [NOTE.G3, 0.5], [NOTE.F3, 0.5], [NOTE.G3, 0.5],
  [NOTE.C3, 1], [NOTE.R, 1],
];

// Grieg — "In the Hall of the Mountain King" (1875, public domain)
// 8-bit arrangement of the main theme
const GAME_MELODY: NoteEntry[] = [
  // du de da do — dedoda — dedoda — dedoda
  [NOTE.A4, 0.5], [NOTE.B4, 0.5], [NOTE.C5, 0.5], [NOTE.D5, 0.5],
  [NOTE.E5, 0.5], [NOTE.C5, 0.5], [NOTE.E5, 1],
  [NOTE.Eb5, 0.5], [NOTE.C5, 0.5], [NOTE.Eb5, 1],
  [NOTE.D5, 0.5], [NOTE.B4, 0.5], [NOTE.D5, 1],
  // du de da do — dedoda — di de do da do — duuu (resolves up)
  [NOTE.A4, 0.5], [NOTE.B4, 0.5], [NOTE.C5, 0.5], [NOTE.D5, 0.5],
  [NOTE.E5, 0.5], [NOTE.C5, 0.5], [NOTE.E5, 0.5], [NOTE.A5, 0.5],
  [NOTE.Ab5, 0.5], [NOTE.E5, 0.5], [NOTE.Ab5, 0.5], [NOTE.E5, 0.5],
  [NOTE.A5, 2],
  // repeat: du de da do — dedoda — dedoda — dedoda
  [NOTE.A4, 0.5], [NOTE.B4, 0.5], [NOTE.C5, 0.5], [NOTE.D5, 0.5],
  [NOTE.E5, 0.5], [NOTE.C5, 0.5], [NOTE.E5, 1],
  [NOTE.Eb5, 0.5], [NOTE.C5, 0.5], [NOTE.Eb5, 1],
  [NOTE.D5, 0.5], [NOTE.B4, 0.5], [NOTE.D5, 1],
  // du de da do — dedoda — di de do da do — duuu (resolves down)
  [NOTE.A4, 0.5], [NOTE.B4, 0.5], [NOTE.C5, 0.5], [NOTE.D5, 0.5],
  [NOTE.E5, 0.5], [NOTE.C5, 0.5], [NOTE.E5, 0.5], [NOTE.A5, 0.5],
  [NOTE.Ab5, 0.5], [NOTE.E5, 0.5], [NOTE.Ab5, 0.5], [NOTE.E5, 0.5],
  [NOTE.A4, 2],
];

const GAME_BASS: NoteEntry[] = [
  // A section bass
  [NOTE.A3, 1], [NOTE.R, 1], [NOTE.A3, 1], [NOTE.R, 1],
  [NOTE.Ab3, 1], [NOTE.R, 1],
  [NOTE.G3, 1], [NOTE.R, 1],
  [NOTE.A3, 1], [NOTE.R, 1], [NOTE.A3, 1], [NOTE.R, 1],
  [NOTE.E3, 1], [NOTE.R, 1],
  [NOTE.A3, 2],
  // Repeat
  [NOTE.A3, 1], [NOTE.R, 1], [NOTE.A3, 1], [NOTE.R, 1],
  [NOTE.Ab3, 1], [NOTE.R, 1],
  [NOTE.G3, 1], [NOTE.R, 1],
  [NOTE.A3, 1], [NOTE.R, 1], [NOTE.A3, 1], [NOTE.R, 1],
  [NOTE.E3, 1], [NOTE.R, 1],
  [NOTE.A3, 2],
];

function isMuted(): boolean {
  try { return localStorage.getItem("muteMusic") === "true"; }
  catch { return false; }
}

class MusicEngine {
  private ctx: AudioContext | null = null;
  private schedulerId: ReturnType<typeof setTimeout> | null = null;
  private melodyPos = 0;
  private bassPos = 0;
  private nextMelodyTime = 0;
  private nextBassTime = 0;
  private melody: NoteEntry[] = [];
  private bass: NoteEntry[] = [];
  private bpm = 140;
  private playing = false;
  private pendingTrack: "attract" | "game" | null = null;
  private pendingLevel = 1;
  private masterGain: GainNode | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.04;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  init() {
    const ctx = this.getCtx();
    ctx.resume().then(() => {
      if (this.playing && this.pendingTrack) {
        this.beginScheduling();
      }
    });
  }

  private scheduleNote(
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType,
    volume: number,
  ) {
    const ctx = this.getCtx();
    if (!this.masterGain) return;
    if (freq === 0) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;

    const noteEnd = startTime + duration * 0.9;
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.setValueAtTime(volume, noteEnd);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  private beatDuration(): number {
    return 60 / this.bpm;
  }

  private scheduler = () => {
    if (!this.playing) return;

    const ctx = this.getCtx();
    const lookAhead = 0.2;
    const now = ctx.currentTime;

    while (this.nextMelodyTime < now + lookAhead) {
      const [freq, beats] = this.melody[this.melodyPos];
      const dur = beats * this.beatDuration();
      this.scheduleNote(freq, this.nextMelodyTime, dur, "square", 0.6);
      this.nextMelodyTime += dur;
      this.melodyPos = (this.melodyPos + 1) % this.melody.length;
    }

    while (this.nextBassTime < now + lookAhead) {
      const [freq, beats] = this.bass[this.bassPos];
      const dur = beats * this.beatDuration();
      this.scheduleNote(freq, this.nextBassTime, dur, "triangle", 0.8);
      this.nextBassTime += dur;
      this.bassPos = (this.bassPos + 1) % this.bass.length;
    }

    this.schedulerId = setTimeout(this.scheduler, 50);
  };

  private startLoop(melody: NoteEntry[], bass: NoteEntry[], bpm: number) {
    this.stop();
    if (isMuted()) return;

    this.melody = melody;
    this.bass = bass;
    this.bpm = bpm;
    this.melodyPos = 0;
    this.bassPos = 0;
    this.playing = true;
    this.pendingTrack = melody === ATTRACT_MELODY ? "attract" : "game";

    const ctx = this.getCtx();
    if (ctx.state !== "suspended") {
      this.beginScheduling();
    }
  }

  private beginScheduling() {
    this.pendingTrack = null;
    const ctx = this.getCtx();
    this.nextMelodyTime = ctx.currentTime + 0.1;
    this.nextBassTime = ctx.currentTime + 0.1;
    this.scheduler();
  }

  playAttract() {
    this.startLoop(ATTRACT_MELODY, ATTRACT_BASS, 150);
  }

  playGame(level = 1) {
    this.pendingLevel = level;
    const bpm = Math.min(220, 130 + (level - 1) * 8);
    this.startLoop(GAME_MELODY, GAME_BASS, bpm);
  }

  setTempo(level: number) {
    this.bpm = Math.min(220, 130 + (level - 1) * 8);
  }

  stop() {
    this.playing = false;
    this.pendingTrack = null;
    if (this.schedulerId !== null) {
      clearTimeout(this.schedulerId);
      this.schedulerId = null;
    }
  }
}

export const music = new MusicEngine();
