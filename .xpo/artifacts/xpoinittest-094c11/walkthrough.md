## What was built

Game-over detection, overlay UI with initials capture, and play-again flow.

## How the pieces fit together

- **`src/hooks/useGameLoop.ts`** — `GameState` now includes `"gameover"`. In `lockAndScore`, after spawning a new piece, `isValidPosition` checks if it fits. If not: player is set to null, state transitions to gameover. Gravity effect already skips non-playing states. `playAgain()` resets all state to idle. The `onSubmit` callback plumbing is in place for the high scores story.

- **`src/components/GameOver.tsx`** — renders over the board (absolute positioned). Shows "GAME OVER" in red neon, final score in green, a 3-char alphanumeric input (auto-focused, uppercase, yellow neon), and a Play Again button. The input filters to `[A-Z0-9]` via regex on change. Defaults to "AAA" if submitted empty.

- **`src/App.css`** — `.gameover-overlay` matches `.start-overlay` pattern (absolute, centered, dark backdrop). `.gameover-title` uses red with matching glow. `.gameover-input` is 120px wide with yellow color and focus glow.

- **`src/App.tsx`** — conditionally renders `GameOver` when `gameState === "gameover"`, passing score and a callback that calls `playAgain()`.

## Key decisions

- **Three-state machine** — idle/playing/gameover. Gameover has its own UI (score + initials), distinct from idle (start button). Play Again returns to idle rather than auto-starting.
- **Alphanumeric initials** — initially letter-only, expanded to include numbers per user request.