## What

Animate line clears with tiered visual effects rendered in the rAF canvas loop. The animation plays over the cleared rows before they disappear.

## Why

Silent row removal feels flat. Visual feedback for the core objective (clearing lines) makes the game more satisfying and communicates the tier of the clear.

## Acceptance Criteria

- 1 line: white flash that fades
- 2 lines: brighter flash with a horizontal sweep (white bar moving across)
- 3 lines: flash + particles scattering from the rows
- 4 lines (COLORBLOXX!): intense flash + particles + "COLORBLOXX!" text briefly displayed
- Animation duration ~300-500ms, does not block gameplay
- New piece spawns immediately; animation plays as an overlay
- Works in the existing rAF render loop

## Flow

1. Create `src/game/effects.ts`:
   - `Effect` type: describes an active animation with start time, type, cleared row indices, and particle state
   - `createLineClearEffect(rows, count, timestamp)` — factory for the effect
   - `drawEffect(ctx, effect, now)` — renders the current frame of the effect, returns false when done
   - Particle system for 3+ lines: array of `{x, y, vx, vy, color, life}` updated each frame

2. Add effects state to the rendering pipeline:
   - `GameCanvas` gets an `effects` ref (array of active effects)
   - `useGameLoop` exposes a way to trigger effects (callback or ref)
   - `lockAndScore` passes cleared row indices to the effect system before clearing

3. The rAF loop calls `drawEffect` for each active effect after drawing the board/player, removes finished ones.

## Decisions

- **Effects as an overlay, not blocking** — the board state updates immediately (rows clear, new piece spawns). The animation draws on top for its duration. This avoids delaying gameplay.
- **Effect state in a ref, not React state** — effects are frame-by-frame canvas animations. React state would cause unnecessary re-renders. A mutable ref array updated in rAF is cleaner.
- **Particles only for 3+ lines** — keeps 1-2 line clears snappy and reserves the spectacle for bigger achievements.
- **Row indices captured before clearing** — `clearLines` needs to report which rows were full so the effect knows where to animate.