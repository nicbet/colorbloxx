## What

Show the next piece in a small preview canvas in the right aside, above the Score box. The next piece is pre-determined when the current piece spawns, so the player always knows what's coming.

## Why

Next piece preview is a core COLORBLOXX feature — it lets players plan ahead and make better placement decisions.

## Acceptance Criteria

- Next piece determined at spawn time and stored in game state
- Preview canvas in the right aside shows the next piece in its default rotation
- Preview uses the same beveled cell rendering as the board
- Preview updates each time a new piece spawns
- Preview is empty/hidden when game is idle

## Flow

1. Update `useGameLoop`:
   - Add `nextTetromino` state — when spawning a player, pick the next piece too
   - On lock/hard drop: current `nextTetromino` becomes the new player's piece, a fresh random becomes the new next
   - On `startGame`: pick both initial player and next
   - Return `nextTetromino` from the hook
2. Update `spawnPlayer` to accept an optional `Tetromino` parameter instead of always picking random
3. Create `src/components/NextPiece.tsx`:
   - Small canvas that renders a single tetromino shape (rotation 0) centered in a box
   - Reuses the `drawCell` logic from GameCanvas
4. Add NextPiece to the right aside in `App.tsx`, above the Score stat

## Decisions

- **Preview in a separate small canvas** — cleaner than trying to render in a div. Same `drawCell` function gives visual consistency.
- **Preview size: 4x4 cells** — large enough for any piece (I-piece is 4 wide). Piece is centered in the preview box.
- **Next piece in game state, not derived** — must be stored so it persists across renders and is consumed when the current piece locks.