## What

Animate random tetrominoes falling and stacking on the board during idle state. This runs behind the start overlay as a visual attract screen, like classic arcade cabinets.

## Why

An empty dark grid is boring while waiting to start. Falling pieces make the start screen feel alive and immediately communicate "this is COLORBLOXX."

## Acceptance Criteria

- Random pieces fall at a steady pace during idle state
- Pieces land and lock into the board, stacking up
- When a piece can't spawn (board full), the board clears and the animation restarts
- The animation is visible behind the semi-transparent start overlay
- Animation stops immediately when the player clicks START
- Animation resumes when returning to idle (after Play Again → game over → submit)

## Flow

1. Create `src/hooks/useAttractMode.ts`:
   - Manages its own internal board and player state (separate from the game)
   - Runs a `setInterval` that moves the piece down each tick (~300ms, moderate pace)
   - When a piece lands, lock it into the board and spawn a new random piece
   - When spawn fails (board full), reset the board
   - Returns `{ board, player }` for rendering
   - Only active when called with `active: true`
2. Update `App.tsx`:
   - When `gameState === "idle"`, use attract mode's board/player for the canvas
   - When `gameState === "playing"` or `"gameover"`, use the real game board/player

## Decisions

- **Separate hook, not part of useGameLoop** — attract mode has its own board/player state and simpler logic (no scoring, no input, no line clearing). Keeping it separate avoids polluting the game loop.
- **No line clearing in attract mode** — pieces just stack. Makes the board fill up and reset, which looks more dynamic than a perfectly playing bot.
- **300ms tick** — fast enough to be visually interesting, slow enough to read.
- **Random column placement** — each piece spawns at a random X position (within bounds) for variety.