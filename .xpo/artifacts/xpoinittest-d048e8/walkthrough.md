## What was built

The core interactive game loop: keyboard input, collision detection, piece movement, gravity, locking, and respawning.

## How the pieces fit together

- **`src/game/collision.ts`** — `isValidPosition(board, shape, pos)` iterates every filled cell in the shape, checks it's within bounds (0 ≤ x < COLS, y < ROWS) and doesn't overlap a locked cell. Cells above the board (y < 0) are allowed — the I-piece spawns with empty rows above.

- **`src/game/lock.ts`** — `lockPiece(board, player)` creates a shallow copy of each row, writes the player's piece color into the corresponding cells, and returns the new board. Immutable update so React detects the change.

- **`src/hooks/useGameLoop.ts`** — the central state manager:
  - `board` and `player` in `useState`, mirrored to refs for stable closure access
  - `tryMove(dx, dy)` — attempts a move, updates player position if valid, returns success/failure
  - `moveLeft/moveRight` — call `tryMove(-1,0)` / `tryMove(1,0)`
  - `hardDrop` — loops `y+1` until invalid, then locks at the final valid position and spawns a new player
  - Gravity `setInterval` at 800ms — moves piece down one row; if blocked, calls `lock()` which locks the piece and spawns a new one

- **`src/hooks/useKeyboard.ts`** — registers a `keydown` listener on `document`, maps arrow keys to actions, calls `preventDefault()` on handled keys to stop page scrolling.

- **`src/App.tsx`** — calls `useGameLoop()` for state and actions, passes state to `GameCanvas` and actions to `useKeyboard`.

## Key decisions

- **Refs for interval closure** — the gravity interval is set once on mount. Without refs, the interval closure would capture stale `board`/`player` values. `playerRef.current` and `boardRef.current` are updated on every render, giving the interval access to fresh state.
- **Immediate lock on landing** — no lock delay timer. When gravity or hard drop can't move down, the piece locks and a new one spawns in the same tick. Simpler than a delayed lock and matches classic NES COLORBLOXX behavior.
- **Immutable board updates** — `lockPiece` returns a new array so `setBoard(newBoard)` triggers a re-render. The player is also replaced with a fresh `spawnPlayer()` call.