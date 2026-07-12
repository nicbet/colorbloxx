## What was built

8-bit chiptune sound effects for all game actions using the Web Audio API — no audio files.

## How the pieces fit together

- **`src/game/audio.ts`** — the sound engine. `getCtx()` lazy-inits an `AudioContext` on first call (respecting browser autoplay policy) and checks the `muteSound` localStorage flag. `playTone(freq, duration, type, volume, startTime, freqEnd)` creates an oscillator with optional frequency sweep and exponential gain ramp. `noise(duration, volume, startTime)` creates a buffer of random samples through a lowpass filter for percussive hits. Each `sfx*` function composes multiple layered `playTone` and `noise` calls with staggered start times to build complex sounds.

- **`src/hooks/useGameLoop.ts`** — imports all sfx functions and calls them at the appropriate moments:
  - `tryMove` success → `sfxMove()`
  - `rotate` success (after wall kick resolution) → `sfxRotate()`
  - `hardDrop` → `sfxHardDrop()`, passes `isHardDrop=true` to `lockAndScore` to suppress the lock sound (drop sound is enough)
  - `lockAndScore` → `sfxLineClear(count)` if lines cleared, otherwise `sfxLock()` (unless hard drop)
  - Game over detection → `sfxGameOver()`

## Key decisions

- **Fire-and-forget module, not a React hook** — sounds have no state to manage. Plain exported functions are simpler and avoid re-render concerns.
- **Layered sounds** — each effect is multiple oscillators and noise sources with staggered timing. A single oscillator sounds thin; layering gives depth and character.
- **Hard drop suppresses lock sound** — the WHOMP is satisfying on its own; adding a lock click on top muddies it.
- **Frequency sweeps for impact** — `sfxHardDrop` sweeps from 200Hz→25Hz for a bass drop feel. `sfxRotate` sweeps up for a zippy feel.
- **Escalating line clear celebrations** — each tier adds more notes, higher pitches, and noise bursts. The 4-line COLORBLOXX fanfare has two ascending runs and a soaring finish.