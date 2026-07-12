## What

Define the four tetromino piece types with their rotation matrices and implement spawning logic that places a random piece at the top-center of the board. The active piece renders as an overlay on the board canvas.

## Why

This introduces the piece data structures and spawn mechanics that movement, rotation, locking, and all downstream stories build on.

## Acceptance Criteria

- All four shapes defined with distinct colors and all rotation states
- Random piece selection on spawn
- Piece spawns centered horizontally at the top of the board
- Active piece renders on the canvas overlaid on the board
- Piece is visually distinct (uses the beveled cell renderer from story #2)

## Piece Definitions

Each piece is an array of 4 rotation states. Each rotation state is a 2D boolean matrix.

| Piece | Color   | Matrix Size |
|-------|---------|-------------|
| O     | #f0f000 (yellow) | 2x2 (all rotations identical) |
| I     | #00f0f0 (cyan)   | 4x4 (2 unique states, mirrored) |
| Z     | #f00000 (red)    | 3x3 |
| T     | #a000f0 (purple) | 3x3 |

## Flow

1. Create `src/game/pieces.ts`:
   - Define `Piece` type: `{ shape: boolean[][], color: string }`
   - Define `Tetromino` type: `{ rotations: boolean[][], color: string }`
   - Export `TETROMINOES` array with all 4 piece definitions and their rotation states
   - Export `randomTetromino()` that picks a random piece and returns a `Piece` with rotation index 0
2. Create `src/game/player.ts`:
   - Define `Player` type: `{ piece: Piece, pos: { x: number, y: number }, rotationIndex: number, tetromino: Tetromino }`
   - Export `spawnPlayer()` that picks a random tetromino and positions it at top-center
3. Update `GameCanvas.tsx`:
   - Accept optional `player` prop
   - Draw the active piece cells on top of the board using `drawCell()`
4. Update `App.tsx`:
   - Add player state, spawn a player on mount to verify rendering

## Decisions

- **Rotation stored as explicit matrices, not computed** — rotating a matrix programmatically is error-prone with non-square pieces (the I-piece). Explicit states are easy to verify visually and avoid off-by-one bugs.
- **Player position is top-left of the piece matrix** — `pos.x` and `pos.y` are the board column/row of the matrix origin. Individual cells offset from there.
- **Spawn X = center of board minus half the piece width** — `Math.floor((COLS - pieceWidth) / 2)`

## Assumptions

- No collision detection yet — piece just renders at spawn position. Collision is story #4.