## What was built

A brief white flash on a piece's cells when it locks into the board.

## How the pieces fit together

- **`src/game/effects.ts`** — `Effect` is now a discriminated union: `LineClearEffect | LockFlashEffect`. `LockFlashEffect` stores the piece's board cell positions and a 150ms duration. `createLockFlashEffect(player, timestamp)` reads the player's shape and position to capture the cells. In `drawEffect`, the `"lockFlash"` branch draws a white `fillRect` overlay on each cell with alpha fading from 0.6 to 0 over the duration. The existing line clear effects are typed as `LineClearEffect` for proper narrowing in their helper functions.

- **`src/hooks/useGameLoop.ts`** — `lockAndScore` pushes a lock flash effect before locking the piece and checking for line clears. This means the flash shows on the piece's final position regardless of whether lines are cleared.

## Key decisions

- **Flash before line clear** — the lock flash is created before `lockPiece`/`clearLines` so it captures the piece's position on the pre-clear board. Line clear effects layer on top if applicable.
- **150ms, 60% max alpha** — fast and subtle. Registers visually without competing with the line clear animations that may follow immediately.