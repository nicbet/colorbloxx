## What

Implement keyboard-driven piece movement (left, right, hard drop), collision detection against walls and locked board cells, and a gravity timer that moves the piece down automatically. This is the first story that makes the game interactive.

## Why

Without movement and collision, the game is static. This story provides the core game loop: keyboard input → attempt move → collision check → update state → re-render.

## Acceptance Criteria

- Left/right arrow keys move the piece one column in that direction
- Movement is blocked if it would collide with a wall or locked piece
- Down arrow instantly drops the piece to the lowest valid row (hard drop)
- Gravity timer moves the piece down one row at a fixed interval
- When gravity or hard drop causes a piece to land (can't move down), the piece locks into the board and a new piece spawns
- Keyboard events are prevented from scrolling the page

## Flow

1. Create `src/game/collision.ts`:
   - `isValidPosition(board, shape, pos)` — returns true if every filled cell of the shape at `pos` is within bounds and not overlapping a locked cell
2. Create `src/hooks/useGameLoop.ts`:
   - Manages `board` and `player` state
   - Exposes `moveLeft()`, `moveRight()`, `hardDrop()` actions
   - Runs a gravity interval that moves the piece down; if blocked, locks the piece and spawns a new one
   - Returns `{ board, player }` for rendering
3. Create `src/hooks/useKeyboard.ts`:
   - Listens for `keydown` events on the document
   - Maps ArrowLeft → moveLeft, ArrowRight → moveRight, ArrowDown → hardDrop
   - Calls `preventDefault()` on handled keys
4. Create `src/game/lock.ts`:
   - `lockPiece(board, player)` — writes the player's piece cells into the board array, returns new board
5. Update `App.tsx`:
   - Replace direct `useState` calls with `useGameLoop` hook
   - Wire `useKeyboard` to game loop actions

## Decisions

- **Hard drop, not soft drop for down arrow** — per the original requirements. Down arrow instantly drops to the lowest valid row.
- **Gravity starts at 800ms** — fast enough to feel like a game, slow enough for a beginner. Speed changes are story #7.
- **Lock on landing** — when gravity tick finds the piece can't move down, lock immediately (no lock delay). Keeps the implementation simple; lock delay is a polish item.
- **New board array on lock** — `lockPiece` returns a new array (immutable update) so React detects the state change.

## Edge Cases

- **MEDIUM:** Piece spawns partially off-screen (I-piece row 0 has empty top row in its matrix) — handled naturally since collision checks the shape's filled cells, not the matrix bounds.
- **LOW:** Rapid key presses — each key event calls move independently; no debounce needed since each move is a single-cell shift.