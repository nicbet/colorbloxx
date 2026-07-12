## What was built

Line clearing: full rows are removed after a piece locks, rows above shift down.

## How the pieces fit together

- **`src/game/board.ts`** — `clearLines(board)` filters out rows where every cell is filled (`row.some(cell => !cell)` keeps rows with at least one empty cell). Counts removed rows, prepends that many empty rows to maintain the 20-row grid. Returns `{ board, linesCleared }` — the count is unused now but ready for the scoring story.

- **`src/hooks/useGameLoop.ts`** — both `lock()` (gravity/lock-delay path) and `hardDrop()` now pipe through `lockPiece` → `clearLines` → `setBoard`. The `linesCleared` return value is destructured but not yet consumed.

## Key decisions

- **Filter-based clearing** — `board.filter(row => row.some(cell => !cell))` is simpler and less error-prone than scanning for full rows by index and splicing. The prepend-empty-rows step restores the grid height.
- **No clear animation** — rows vanish instantly. A flash effect could be added later without changing the data flow.