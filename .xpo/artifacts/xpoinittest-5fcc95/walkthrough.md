## What was built

Next piece preview in the right aside and a lines counter in the left aside for symmetric layout.

## How the pieces fit together

- **`src/game/player.ts`** — `spawnPlayer(tetromino?)` now accepts an optional tetromino. If provided, uses it instead of picking random. This lets the game loop feed the pre-determined next piece.

- **`src/hooks/useGameLoop.ts`** — `nextTetromino` state holds the upcoming piece. `startGame` picks both an initial player (random) and a next piece. `lockAndScore` spawns the player from `nextTetrominoRef.current` and picks a fresh random for the new next. `lines` state tracks total lines cleared, incremented in `lockAndScore` alongside score. Both reset on `startGame` and `playAgain`.

- **`src/components/NextPiece.tsx`** — a self-contained canvas component. Uses 16px cells (vs 30px board cells) with a 2px bevel for the smaller scale. The piece is centered in a 4x4 cell grid (64x64px) using offset math based on the shape's dimensions. Has its own `drawCell` function scaled to the preview cell size.

- **`src/App.tsx`** — left aside: Level + Lines. Right aside: Score + Next preview. All stat boxes are 88x88px with centered content for a uniform look.

## Key decisions

- **Separate cell size for preview** — 16px vs 30px. Sharing the board's `drawCell` would require parameterizing the cell size, so the preview has its own lightweight copy scaled down.
- **Lines counter added** — user requested for symmetry. Natural pair with Level on the left side.