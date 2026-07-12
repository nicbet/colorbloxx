## What was built

Tiered line clear animations rendered as canvas overlays in the rAF loop.

## How the pieces fit together

- **`src/game/board.ts`** — `clearLines` now returns `clearedRows: number[]` alongside `board` and `linesCleared`. Uses `every` to detect full rows and collects their indices before filtering.

- **`src/game/effects.ts`** — the visual effects engine:
  - `Effect` type holds start time, duration, cleared row indices, line count, particle array, and captured row colors
  - `createLineClearEffect` is a factory that builds the effect and pre-generates particles for 3+ line clears (3 particles per cell, random velocity vectors)
  - `drawEffect` dispatches to tier-specific renderers and advances particle physics (velocity + gravity + life decay), returns false when expired
  - `drawFlash` — fading white overlay on rows (1 line)
  - `drawColorBrighten` — white overlay per-cell that ramps up then fades, creating a glow-hot effect (2 lines)
  - `drawCOLORBLOXXFlash` — yellow flash + jagged lightning bolt strokes across rows + "COLORBLOXX!" text with shadow glow that fades in/out (4 lines)
  - Particles render as small colored squares with alpha tied to remaining life

- **`src/hooks/useGameLoop.ts`** — `effectsRef` is a mutable ref holding active effects. In `lockAndScore`, after `clearLines`, the locked (pre-clear) board is sampled for row colors, and a new effect is pushed. The ref is returned and passed through to GameCanvas.

- **`src/components/GameCanvas.tsx`** — accepts optional `effectsRef` prop. In the rAF loop, after drawing board and player, iterates `effectsRef.current` calling `drawEffect` for each, filtering out expired ones.

## Key decisions

- **Effects as overlays, not blocking** — board state updates immediately. The animation draws on top for its duration. No gameplay delay.
- **Mutable ref, not React state** — effects are frame-by-frame canvas mutations. A mutable array avoids re-render churn.
- **Row colors captured from locked board** — the pre-clear board has the filled cells' colors. After clearing, those rows are gone, so colors must be captured first.
- **Color brighten over sweep for 2-line** — the horizontal sweep bar was distracting. The color brighten effect is subtler and more satisfying.