## What

After locking a piece, detect fully filled rows, remove them, shift everything above down, and pad the top with empty rows. Return the number of lines cleared so the scoring story can use it.

## Why

Line clearing is the core objective of COLORBLOXX. Without it the board fills up in seconds.

## Acceptance Criteria

- After a piece locks, any fully filled rows are detected and removed
- Rows above the cleared rows shift down
- Empty rows are added at the top to maintain the 20-row grid
- Clearing 1, 2, 3, or 4 lines simultaneously all work correctly
- The lock function returns the number of lines cleared

## Flow

1. Create `clearLines(board)` in `src/game/board.ts`:
   - Filter out rows where every cell is filled (non-zero)
   - Count removed rows
   - Prepend that many empty rows at the top
   - Return `{ board: Board, linesCleared: number }`
2. Update `lock()` in `useGameLoop.ts`:
   - After `lockPiece`, call `clearLines` on the result
   - Use the returned board as the new state

## Decisions

- **clearLines in board.ts, not a separate file** — it's a board transformation, belongs with the board module.
- **No animation on line clear** — rows disappear instantly. A flash or fade animation is polish for later.
- **Return lines cleared** — the scoring story needs this value. For now it's unused but the plumbing is in place.