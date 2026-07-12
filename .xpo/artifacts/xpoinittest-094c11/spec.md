## What

Detect game over when a newly spawned piece immediately collides with the board. Show a game-over overlay with final score, initials input, and a Play Again button. High score persistence is a separate story — this story handles the game-over flow and initials capture.

## Why

Without game-over detection the game runs forever (pieces stack above the visible board). The initials prompt and Play Again flow complete the core game loop.

## Acceptance Criteria

- Game over triggers when `spawnPlayer()` produces a piece whose initial position overlaps locked cells
- Gravity stops, keyboard input is disabled
- Game-over overlay shows over the board with:
  - "GAME OVER" text
  - Final score display
  - 3-character initials input (uppercase, auto-focused)
  - Play Again button
- Play Again resets everything and returns to the idle/start screen
- Game state is `"idle" | "playing" | "gameover"`

## Flow

1. Update `GameState` type to include `"gameover"`
2. In `lockAndScore`, after `spawnPlayer()`, check if the new piece's initial position is valid. If not, transition to `"gameover"`.
3. Create `src/components/GameOver.tsx`:
   - Overlay component showing GAME OVER, final score, initials input, Play Again button
   - Initials input: 3 chars max, uppercase, auto-focused
   - On Play Again: calls a callback (for now just resets to idle; high score saving is next story)
4. Update `App.tsx`:
   - Show `GameOver` overlay when `gameState === "gameover"`
   - Pass score and onPlayAgain callback
5. Update `useGameLoop`:
   - Gravity effect skips when gameover
   - Keyboard disabled when gameover (already handled by null actions pattern)
   - `playAgain()` action resets to idle state

## Decisions

- **Gameover is a third state, not reusing idle** — idle is the fresh start screen, gameover shows the score and initials. Different UI.
- **Initials captured here, saved in the high scores story** — this story provides the `onSubmit(initials)` callback plumbing. The next story hooks it up to localStorage.
- **Play Again returns to idle, not directly to playing** — the player should see the start screen and choose when to begin again.