## What

Add 8-bit chiptune sound effects for all key game actions using the Web Audio API. No audio files — everything generated from oscillators with square and triangle waves.

## Why

Sound is the single biggest factor in making a game feel alive. Every action should have audible feedback.

## Acceptance Criteria

- All sounds generated via Web Audio API oscillators (no audio files)
- Square and triangle waves for authentic 8-bit tone
- Each action has a distinct sound:
  - **Move (left/right):** Short quiet blip
  - **Rotate:** Quick ascending two-tone
  - **Hard drop:** Low thud/impact
  - **Lock:** Click/snap
  - **Line clear (1):** Short chime
  - **Line clear (2):** Higher chime
  - **Line clear (3):** Ascending arpeggio
  - **Line clear (4 / COLORBLOXX):** Triumphant fanfare
  - **Game over:** Descending sad tone
- Sounds are short (50-300ms) and non-intrusive
- Mutable via localStorage flag `muteSound`
- AudioContext created on first user interaction (browser autoplay policy)

## Flow

1. Create `src/game/audio.ts`:
   - Lazy-init `AudioContext` on first call (handles autoplay policy)
   - Helper `playTone(freq, duration, type, volume)` for single notes
   - Export named functions: `sfxMove()`, `sfxRotate()`, `sfxHardDrop()`, `sfxLock()`, `sfxLineClear(count)`, `sfxGameOver()`
   - Check `muteSound` localStorage flag before playing
2. Call sound functions from `useGameLoop`:
   - `tryMove` success → `sfxMove()`
   - `rotate` success → `sfxRotate()`
   - `hardDrop` → `sfxHardDrop()`
   - `lock` / `lockAndScore` → `sfxLock()`, then `sfxLineClear(n)` if lines cleared
   - Game over transition → `sfxGameOver()`
3. Call `sfxMove()` from keyboard actions where applicable

## Decisions

- **Lazy AudioContext** — browsers block audio before user interaction. Create it on first sfx call (which happens on first keypress / game start).
- **No volume slider** — just a mute toggle for simplicity. Can add a slider later.
- **Sounds in game module, not a hook** — they're fire-and-forget calls, no React state needed.