## What was built

Clockwise piece rotation via up arrow with wall-kick support.

## How the pieces fit together

- **`src/hooks/useGameLoop.ts`** — `rotate()` computes the next rotation index (`(current + 1) % length`), gets the rotated shape from `tetromino.rotations`, and tries placing it. A `tryPosition` helper checks validity and applies the rotation + position if valid, handling lock delay the same way `tryMove` does. If the base position fails, it tries 4 wall-kick offsets (`x ± 1`, `x ± 2`) before rejecting. The `KICK_OFFSETS` array is defined as a constant outside the callback.

- **`src/hooks/useKeyboard.ts`** — ArrowUp mapped to `rotate()` in the keydown handler. No repeat guard needed — rotating on key repeat is desirable.

- **`src/App.tsx`** — passes `rotate` through to `useKeyboard` via the actions object.

## Key decisions

- **Horizontal-only wall kicks** — no vertical offsets. With 4 pieces (no S, J, or L), horizontal shifts handle all practical edge cases. Vertical kicks could produce surprising results where pieces teleport upward.
- **O-piece natural no-op** — since it has only 1 entry in `rotations`, `(0 + 1) % 1 === 0` — the rotation index stays at 0 and the shape is unchanged. No special case needed.