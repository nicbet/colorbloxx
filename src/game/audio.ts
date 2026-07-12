let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (localStorage.getItem("muteSound") === "true") return null;
  } catch { /* */ }

  if (!ctx) {
    ctx = new AudioContext();
  }
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "square",
  volume = 0.1,
  startTime = 0,
  freqEnd?: number,
) {
  const c = getCtx();
  if (!c) return;

  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + startTime);
  if (freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(freqEnd, c.currentTime + startTime + duration);
  }
  gain.gain.setValueAtTime(volume, c.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + startTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(c.currentTime + startTime);
  osc.stop(c.currentTime + startTime + duration);
}

function noise(duration: number, volume: number, startTime = 0) {
  const c = getCtx();
  if (!c) return;

  const bufferSize = Math.floor(c.sampleRate * duration);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const gain = c.createGain();
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;
  gain.gain.setValueAtTime(volume, c.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + startTime + duration);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  src.start(c.currentTime + startTime);
  src.stop(c.currentTime + startTime + duration);
}

export function sfxMove() {
  playTone(440, 0.04, "square", 0.05);
  playTone(330, 0.03, "square", 0.03, 0.02);
}

export function sfxRotate() {
  playTone(260, 0.05, "square", 0.07, 0, 520);
  playTone(520, 0.06, "triangle", 0.05, 0.03);
}

export function sfxHardDrop() {
  playTone(200, 0.25, "triangle", 0.3, 0, 25);
  playTone(100, 0.2, "square", 0.15, 0, 20);
  noise(0.15, 0.2);
  noise(0.1, 0.1, 0.05);
}

export function sfxLock() {
  playTone(300, 0.06, "square", 0.07);
  playTone(150, 0.04, "square", 0.05, 0.03);
}

export function sfxLineClear(count: number) {
  if (count === 1) {
    // Cheerful major triad arpeggio
    playTone(523, 0.08, "square", 0.1);
    playTone(659, 0.08, "square", 0.1, 0.05);
    playTone(784, 0.08, "square", 0.1, 0.1);
    playTone(1047, 0.2, "triangle", 0.1, 0.15);
    playTone(784, 0.15, "square", 0.06, 0.25);
    playTone(1047, 0.25, "triangle", 0.06, 0.3);
  } else if (count === 2) {
    // Brighter, faster arpeggio with a sparkle
    playTone(523, 0.06, "square", 0.1);
    playTone(659, 0.06, "square", 0.1, 0.04);
    playTone(784, 0.06, "square", 0.1, 0.08);
    playTone(1047, 0.06, "square", 0.12, 0.12);
    playTone(1319, 0.2, "triangle", 0.1, 0.16);
    playTone(1047, 0.08, "square", 0.07, 0.26);
    playTone(1319, 0.08, "square", 0.07, 0.3);
    playTone(1568, 0.3, "triangle", 0.08, 0.34);
    noise(0.05, 0.04, 0.16);
  } else if (count === 3) {
    // Triumphant run with a held high note
    playTone(523, 0.05, "square", 0.12);
    playTone(659, 0.05, "square", 0.12, 0.03);
    playTone(784, 0.05, "square", 0.12, 0.06);
    playTone(1047, 0.05, "square", 0.12, 0.09);
    playTone(1319, 0.05, "square", 0.14, 0.12);
    playTone(1568, 0.3, "triangle", 0.14, 0.15);
    playTone(1047, 0.06, "square", 0.08, 0.3);
    playTone(1319, 0.06, "square", 0.08, 0.34);
    playTone(1568, 0.06, "square", 0.08, 0.38);
    playTone(2093, 0.4, "triangle", 0.1, 0.42);
    noise(0.06, 0.05, 0.15);
    noise(0.06, 0.04, 0.42);
  } else if (count >= 4) {
    // COLORBLOXX! Victory fanfare — two ascending runs, big finish
    playTone(392, 0.05, "square", 0.12);
    playTone(523, 0.05, "square", 0.12, 0.03);
    playTone(659, 0.05, "square", 0.12, 0.06);
    playTone(784, 0.05, "square", 0.14, 0.09);
    playTone(1047, 0.05, "square", 0.14, 0.12);
    playTone(1319, 0.05, "square", 0.14, 0.15);
    playTone(1568, 0.3, "triangle", 0.16, 0.18);
    noise(0.1, 0.08, 0.18);
    // Second run, higher
    playTone(1047, 0.05, "square", 0.12, 0.4);
    playTone(1319, 0.05, "square", 0.12, 0.43);
    playTone(1568, 0.05, "square", 0.14, 0.46);
    playTone(2093, 0.05, "square", 0.14, 0.49);
    playTone(2637, 0.5, "triangle", 0.15, 0.52);
    playTone(2093, 0.4, "triangle", 0.08, 0.65);
    playTone(2637, 0.5, "triangle", 0.1, 0.8);
    noise(0.1, 0.06, 0.52);
    noise(0.08, 0.05, 0.8);
  }
}

export function sfxGameOver() {
  playTone(440, 0.2, "square", 0.1);
  playTone(415, 0.2, "square", 0.1, 0.18);
  playTone(392, 0.2, "square", 0.1, 0.36);
  playTone(370, 0.25, "square", 0.09, 0.54);
  playTone(330, 0.3, "triangle", 0.1, 0.76);
  playTone(262, 0.5, "triangle", 0.12, 1.0);
  playTone(196, 0.8, "triangle", 0.1, 1.3);
}
