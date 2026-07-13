## What

When a piece locks into the board, briefly flash its cells white then fade back. A subtle visual cue that reinforces the "click" of locking.

## Why

Without a flash, the piece silently transitions from active to locked. The flash gives instant visual confirmation that the piece is placed.

## Flow

1. Add a new effect type to `src/game/effects.ts` — `lockFlash` with the piece's cell positions and a short duration (~150ms)
2. `createLockFlashEffect(player, timestamp)` — captures the piece's board positions
3. `drawEffect` handles the new type — draws white overlay on those cells, fading out
4. Trigger in `lockAndScore` before clearing lines (so the flash shows on the locked cells)

## Decisions

- **Reuse the existing effects system** — same ref, same rAF draw loop, just a new effect type.
- **150ms duration** — fast enough to not interfere, slow enough to register visually.
- **White overlay only, no bevel** — simple semi-transparent white rect fading out. Subtle.