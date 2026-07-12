## What was built

Four tetromino definitions with all rotation states, a player/spawn system, and active piece rendering on the canvas.

## How the pieces fit together

- **`src/game/pieces.ts`** — each `Tetromino` has a `color` string and a `rotations` array of 2D boolean matrices. The O-piece has 1 rotation (all identical), the I-piece has 4 (in a 4x4 matrix), and Z/T have 4 each (in 3x3 matrices). `randomTetromino()` picks one at random.
- **`src/game/player.ts`** — `Player` tracks the current tetromino, rotation index, and board position `{x, y}`. `spawnPlayer()` picks a random tetromino, sets rotation to 0, and centers it horizontally: `x = floor((COLS - pieceWidth) / 2)`, `y = 0`. `getShape()` returns the current rotation's boolean matrix.
- **`src/components/GameCanvas.tsx`** — now accepts a `player` prop. After drawing the board, `drawPlayer()` iterates the piece's shape matrix and calls the existing `drawCell()` for each `true` cell, offset by the player's position. The piece renders with the same beveled 3D style as locked board cells.
- **`src/App.tsx`** — holds `player` state via `useState(spawnPlayer)`. On mount, a random piece appears at the top of the board.

## Key decisions

- **Explicit rotation matrices** — the I-piece in a 4x4 matrix has subtle offset behavior when rotated programmatically. Hardcoded states eliminate that class of bugs entirely and are easy to verify by inspection.
- **Player position = top-left of matrix** — consistent convention: `pos.x + c` and `pos.y + r` give the board coordinates. Simple and used uniformly by rendering, collision, and locking.